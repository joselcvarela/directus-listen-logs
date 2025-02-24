import { defineConfig } from "tsup";

export default defineConfig({
  bundle: true,
  clean: true,
  entry: ["index.ts", "listen-logs.ts"],
  format: ["cjs"],
  sourcemap: true,
  target: "esnext",
  outDir: "dist",
  dts: true,
});
