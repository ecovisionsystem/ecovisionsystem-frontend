# EcoVision frontend agent guide

Read `../AGENTS.md` before making changes. This file adds frontend-specific context and guardrails.

## Role

This Next.js repository is the browser client. It owns interaction design, Cognito client integration, backend API calls, upload progress, explicit inference-start actions, polling, and result presentation.

## Hard boundaries

- Treat the FastAPI backend as the source of truth for projects, uploads, jobs, and results.
- Preserve the three-step upload contract: presign, raw S3 PUT, complete.
- Do not include `inferenceType` in upload registration unless the backend contract explicitly adds it again.
- Do not start inference implicitly when an upload completes. Use the explicit jobs endpoint.
- Send the application bearer token to the backend only. Never send it to a presigned S3 URL.
- Never call SQS, use AWS credentials, load model code, or infer job state locally.
- Do not fabricate completed results or silently fall back to demo data in production paths.

## Contract discipline

- API JSON is camel case and is rooted at `/api/v1`.
- Use backend-returned `uploadUrl` exactly as issued and upload the raw file body.
- Refresh project upload state from `GET /projects/{projectId}/uploads`.
- Start inference with `POST /jobs` using `{ uploadId, inferenceType }` only after the upload is `uploaded`.
- Poll `GET /jobs/{jobId}` and fetch `GET /results/{jobId}` only after completion.
- Keep API types and query cache keys aligned with the inspected backend schemas.

## Agent skill guardrails

- Inspect `src/lib/api-client.ts`, `src/lib/uploads.ts`, relevant hooks, and backend route schemas before changing API wiring.
- Prefer existing React Query, store, component, and design-system patterns.
- Keep upload transport errors distinct from backend, authentication, inference, and result errors.
- Preserve accessible loading, retry, cancellation, and empty states.
- Never log tokens, presigned URLs, file contents, or user information.

## Verification

```bash
npm run lint
npm run build
```

For contract changes, also verify the exact browser request in local runtime tooling without exposing credentials.
