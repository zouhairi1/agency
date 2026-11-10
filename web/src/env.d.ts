/// <reference types="vite-plugin-glsl/ext" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly PUBLIC_PB_URL?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly PUBLIC_WHATSAPP_NUMBER?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_BOOKING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
