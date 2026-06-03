export default defineNuxtPlugin(async (nuxtApp) => {
  const i18n = nuxtApp.$i18n as {
    locale?: { value?: string };
    setLocale?: (locale: string) => Promise<void>;
  } | undefined;

  if (i18n?.locale?.value !== 'zh') {
    await i18n?.setLocale?.('zh');
  }
});
