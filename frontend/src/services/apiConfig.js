// Use same-origin requests in development (proxied by Vite) and allow an
// explicit API origin for deployments that serve the frontend separately.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
