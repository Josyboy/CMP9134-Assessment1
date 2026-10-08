import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The Base44 preview reaches this dev server through a proxy whose Host header
// carries a rotating sandbox id, so allow the whole sandbox domain while running
// in the sandbox (BASE44_PREVIEW_MODE=1). Unset/any other value: no change.
const sandboxAllowedHost =
  process.env.BASE44_PREVIEW_MODE === "1" &&
  process.env.BASE44_SANDBOX_HOST_DOMAIN
    ? [`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`]
    : undefined;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    port: 2500,
    ...(sandboxAllowedHost ? { allowedHosts: sandboxAllowedHost } : {}),
  },
});
