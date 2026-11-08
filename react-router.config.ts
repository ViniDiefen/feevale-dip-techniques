import type { Config } from "@react-router/dev/config";

export default {
  // Everything runs in the browser (canvas), so no server rendering.
  ssr: false,
} satisfies Config;
