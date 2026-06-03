// https://nuxt.com/docs/api/configuration/nuxt-config
const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'content-security-policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://pikmin.wiki.gallery https://*.tile.openstreetmap.org",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com https://nominatim.openstreetmap.org https://overpass-api.de https://overpass.kumi.systems https://maps.mail.ru",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    'upgrade-insecure-requests',
  ].join('; '),
};

const withSecurityHeaders = (headers: Record<string, string>) => ({
  headers: {
    ...securityHeaders,
    ...headers,
  },
});

const appBaseURL = process.env.NUXT_APP_BASE_URL || '/';
const supabaseURL = process.env.NUXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_KEY?.trim();
const withBase = (path: string) => {
  const base = appBaseURL.endsWith('/') ? appBaseURL.slice(0, -1) : appBaseURL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}` || cleanPath;
};
const siteURL = process.env.NUXT_PUBLIC_SITE_URL || 'https://zt0121.github.io/pikmin-collection-tracker/';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  sourcemap: false,
  runtimeConfig: {
    public: {
      supabase: {
        url: supabaseURL,
        key: supabaseKey,
      },
    },
  },
  
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxt/icon', '@nuxtjs/i18n'],
  
  // Icon 配置：全部使用 Iconify API（避免掃描本地套件）
  icon: {
    serverBundle: 'remote', // 強制使用遠端 API，不掃描本地檔案
  },
  
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  },

  vite: {
    build: {
      modulePreload: {
        polyfill: false,
      },
      // Nuxt/Vue plus the map/auth runtime sits a little above Vite's generic
      // 500 kB browser-app default. Keep this explicit so real growth still
      // shows up without forcing circular manual chunks.
      chunkSizeWarningLimit: 1400,
    },
  },

  supabase: {
    url: supabaseURL,
    key: supabaseKey,
    redirect: false, // Auth is managed by AuthStore
    // This app handles auth in the browser. Keeping SSR cookies enabled makes
    // Render refresh Supabase sessions during SSR and can race the browser,
    // causing repeated `refresh_token_already_used` AuthApiError logs.
    useSsrCookies: false,
    redirectOptions: {
      login: '/auth',
      callback: '/auth/callback',
      exclude: ['/', '/collection', '/progress', '/friends', '/map', '/auth', '/auth/callback', '/auth/reset-password', '/auth/update-password'],
    },
    // 使用 implicit flow 避免 PKCE code_verifier 問題
    clientOptions: {
      auth: {
        flowType: 'implicit',
        detectSessionInUrl: true,
        persistSession: true,
      },
    },
  },

  i18n: {
    locales: [
      { code: 'zh', language: 'zh-TW', file: 'zh.json', name: '繁體中文' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' }
    ],
    defaultLocale: 'zh',
    strategy: 'no_prefix', // 不改變 URL 結構
    langDir: 'locales',
    detectBrowserLanguage: false
  },

  routeRules: {
    // Version manifest must always be fresh so open tabs can detect deployments.
    '/version.json': withSecurityHeaders({ 'cache-control': 'no-cache, no-store, must-revalidate' }),
    // Keep HTML and route responses revalidated to pick up new app shell quickly.
    '/**': withSecurityHeaders({ 'cache-control': 'no-cache' }),
    // HTML should revalidate frequently so users pick up new hashed bundles.
    '/': withSecurityHeaders({ 'cache-control': 'no-cache' }),
    '/map': {
      ...withSecurityHeaders({ 'cache-control': 'no-cache' }),
      redirect: withBase('/collection'),
    },
    '/friends': {
      ...withSecurityHeaders({ 'cache-control': 'no-cache' }),
      redirect: withBase('/collection'),
    },
    '/feedback': {
      ...withSecurityHeaders({ 'cache-control': 'no-cache' }),
      redirect: withBase('/collection'),
    },
    '/forza-music-overlay': {
      ...withSecurityHeaders({ 'cache-control': 'no-cache' }),
      redirect: withBase('/collection'),
    },
    '/collection': withSecurityHeaders({ 'cache-control': 'no-cache' }),
    // Large static data files are content-like assets. Avoid revalidating the
    // multi-MB map JSON on every map visit.
    '/data/**': withSecurityHeaders({ 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' }),
    '/img/**': withSecurityHeaders({ 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000' }),
    '/icon.png': withSecurityHeaders({ 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000' }),
    '/favicon.ico': withSecurityHeaders({ 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000' }),
    '/manifest.webmanifest': withSecurityHeaders({ 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' }),
    // Cache images for 1 day
    '/og-image.png': withSecurityHeaders({ 'cache-control': 'public, max-age=86400' }),
    // Cache other static assets
    '/_nuxt/**': withSecurityHeaders({ 'cache-control': 'public, max-age=31536000, immutable' }),
  },
  
  app: {
    baseURL: appBaseURL,
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#059669' },
        
        // Open Graph Image is static so keeping it here as fallback, though dynamic also handles it
        { property: 'og:image', content: withBase('/og-image.png') },
        { name: 'twitter:image', content: withBase('/og-image.png') },
        { name: 'twitter:card', content: 'summary_large_image' },

        // PWA iOS Support
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Pikmin Collection Tracker' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: withBase('/favicon.ico') },
        { rel: 'manifest', href: withBase('/manifest.webmanifest') },
        { rel: 'apple-touch-icon', href: withBase('/icon.png') },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap' },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Pikmin Collection Tracker',
            alternateName: 'Pikmin Bloom Collection Tracker',
            url: siteURL,
          }),
        }
      ],
    },
  },

  // Nitro 配置
  nitro: {
    // public/data is hundreds of MB; build-time Brotli/Gzip compression stalls
    // deployment builds and duplicates large JSON assets.
    compressPublicAssets: false,
  },
})
