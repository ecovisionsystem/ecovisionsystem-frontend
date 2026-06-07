import { Button } from "@/components/ui/button";
import { T } from "@/styles/style";
import { AlertCircleIcon } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center space-y-3">
        <AlertCircleIcon className="h-12 w-12 text-gray-400 mx-auto" />
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-gray-600">
          The page you are looking for does not exist. Please check the URL or
          return to the dashboard.
        </p>
        <Button
          className="w-full mt-3 text-sm uppercase rounded-sm tracking-widest transition-colors"
          size="md"
          style={{
            background: T.forest,
            cursor: "pointer",
            boxShadow: `0 3px 14px ${T.forest}40`,
          }}
          onClick={() =>
            sessionStorage.getItem("authToken")
              ? (window.location.href = "/dashboard")
              : window.history.back()
          }
        >
          {sessionStorage.getItem("authToken") ? "Go to Dashboard" : "Go Back"}
        </Button>
      </div>
    </main>
  );
}
