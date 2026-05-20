/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  bootstrap: typeof import("@types/bootstrap/index");
  bootstrapReady?: () => void;
}