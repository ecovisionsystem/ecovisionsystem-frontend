import { create } from "zustand";
import type { AuthUser, AuthTokenClaims } from "@/types";
import { fetchAuthSession, signOut as amplifySignOut } from "aws-amplify/auth";
import type { AuthSession, AuthTokens, JWT } from "@aws-amplify/core";

interface AuthStore {
  user: AuthUser | null;
  claims: AuthTokenClaims | null;
  accessToken?: string;
  idToken?: string;
  expiresAt?: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (
    user: AuthUser,
    claims: AuthTokenClaims,
    accessToken: string,
    idToken: string,
    expiresAt?: number,
  ) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const getRoleFromClaims = (claims: AuthTokenClaims): AuthUser["role"] => {
  const groupClaim = claims["cognito:groups"];
  const customRole = claims["custom:role"];

  if (Array.isArray(groupClaim) && groupClaim.length > 0) {
    return groupClaim[0] as AuthUser["role"];
  }

  if (typeof groupClaim === "string") {
    return groupClaim as AuthUser["role"];
  }

  if (customRole) {
    return customRole as AuthUser["role"];
  }

  return "researcher";
};

const buildUserFromClaims = (claims: AuthTokenClaims): AuthUser | null => {
  if (!claims.sub || !claims.email) {
    return null;
  }

  return {
    id: claims.sub,
    email: claims.email,
    name: claims.name || claims.email,
    role: getRoleFromClaims(claims),
    institution: claims["custom:institution"],
    avatar: claims.picture,
  };
};

const getExpiresAt = (
  claims: AuthTokenClaims | undefined,
): number | undefined => {
  if (!claims?.exp) return undefined;
  return claims.exp * 1000;
};

const validateClaims = (claims: AuthTokenClaims) => {
  const expectedClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  const currentTime = Math.floor(Date.now() / 1000);

  if (claims.exp && claims.exp < currentTime) {
    throw new Error("JWT has expired");
  }

  if (expectedClientId) {
    const aud = claims.aud;
    const matchesAud =
      aud === expectedClientId ||
      (Array.isArray(aud) && aud.includes(expectedClientId));

    if (!matchesAud) {
      throw new Error("JWT audience does not match expected client id");
    }
  }

  const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
  const awsRegion = process.env.NEXT_PUBLIC_AWS_REGION;
  if (userPoolId && awsRegion) {
    const expectedIssuer = `https://cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}`;
    if (claims.iss && claims.iss !== expectedIssuer) {
      throw new Error("JWT issuer does not match expected Cognito user pool");
    }
  }

  if (claims.token_use && claims.token_use !== "id") {
    throw new Error("Unexpected token type");
  }

  if (!claims.sub || !claims.email) {
    throw new Error("JWT is missing required subject or email claims");
  }
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  claims: null,
  accessToken: undefined,
  idToken: undefined,
  expiresAt: undefined,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user, claims, accessToken, idToken, expiresAt) =>
    set({
      user,
      claims,
      accessToken,
      idToken,
      expiresAt,
      isAuthenticated: true,
      isLoading: false,
    }),
  clearUser: () =>
    set({
      user: null,
      claims: null,
      accessToken: undefined,
      idToken: undefined,
      expiresAt: undefined,
      isAuthenticated: false,
      isLoading: false,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  initializeAuth: async () => {
    set({ isLoading: true });
    await get().refreshSession();
  },
  refreshSession: async () => {
    set({ isLoading: true });

    try {
      const session: AuthSession = await fetchAuthSession({
        forceRefresh: false,
      });
      const tokens: AuthTokens | undefined = session.tokens;
      const idTokenJwt: JWT | undefined = tokens?.idToken;
      const accessTokenJwt: JWT | undefined = tokens?.accessToken;

      if (!idTokenJwt || !accessTokenJwt) {
        throw new Error("Failed to obtain auth tokens from session");
      }

      const claims = idTokenJwt.payload as AuthTokenClaims;
      validateClaims(claims);

      const user = buildUserFromClaims(claims);
      if (!user) {
        throw new Error("Unable to build AuthUser from token claims");
      }

      set({
        user,
        claims,
        accessToken: accessTokenJwt.toString(),
        idToken: idTokenJwt.toString(),
        expiresAt: getExpiresAt(claims),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Auth session refresh failed:", error);
      set({
        user: null,
        claims: null,
        accessToken: undefined,
        idToken: undefined,
        expiresAt: undefined,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
  signOut: async () => {
    set({ isLoading: true });
    try {
      await amplifySignOut();
    } catch (error) {
      console.error("Amplify sign out failed:", error);
    }
    get().clearUser();
  },
}));
