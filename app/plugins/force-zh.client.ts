export default defineNuxtPlugin(async () => {
  const { locale, setLocale } = useI18n();

  if (locale.value !== 'zh') {
    await setLocale('zh');
  }
});
