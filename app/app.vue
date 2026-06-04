<template>
  <div class="min-h-screen relative">
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-500"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isInitializing && !isStandalonePage" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-50">
        <div class="text-center">
          <div class="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 shadow-xl">
            <Icon name="lucide:sprout" class="h-9 w-9 text-white" />
          </div>
          <div class="mb-2 flex items-center justify-center gap-2">
            <div class="h-2 w-2 animate-bounce rounded-full bg-rose-500" style="animation-delay: 0ms"></div>
            <div class="h-2 w-2 animate-bounce rounded-full bg-rose-500" style="animation-delay: 150ms"></div>
            <div class="h-2 w-2 animate-bounce rounded-full bg-rose-500" style="animation-delay: 300ms"></div>
          </div>
          <p class="font-semibold text-slate-700">正在載入收藏資料...</p>
        </div>
      </div>
    </Transition>

    <div v-show="!isInitializing || isStandalonePage" class="relative z-10">
      <AppHeader v-if="!isStandalonePage" />

      <main :class="mainClass">
        <NuxtPage />
      </main>

      <AppFooter v-if="!isStandalonePage" />
    </div>

    <GlobalAnnouncement v-if="!isStandalonePage" />
    <PwaInstallPrompt v-if="!isStandalonePage" />
    <Toast
      v-if="currentToast && isShowingToast"
      :message="currentToast.message"
      :type="currentToast.type"
      :duration="currentToast.duration"
    />

    <div id="toast-container" class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"></div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { loadCollection, loadFromCloud } = useCollection();
const isInitializing = ref(true);
const route = useRoute();
const isStandalonePage = computed(() => route.meta.standalone === true);
let appInitStarted = false;

const mainClass = computed(() => {
  if (isStandalonePage.value) return 'w-full px-0 py-0';
  return 'max-w-7xl mx-auto px-4 py-6';
});

const { t, locale } = useI18n();
const { currentToast, isShowing: isShowingToast } = useToast();

useHead(() => ({
  titleTemplate: (titleChunk) => {
    if (isStandalonePage.value) return titleChunk || 'Forza Music Overlay';
    return titleChunk ? `${titleChunk} - ${t('app.title')}` : t('app.title');
  },
  htmlAttrs: {
    lang: locale.value === 'en' ? 'en' : 'zh-TW',
  },
  meta: [
    { name: 'keywords', content: t('app.keywords') },
  ],
}));

useSeoMeta({
  title: () => t('app.title'),
  ogTitle: () => t('app.og_title'),
  description: () => t('app.description'),
  ogDescription: () => t('app.og_desc'),
  twitterTitle: () => t('app.og_title'),
  twitterDescription: () => t('app.og_desc'),
  ogSiteName: () => t('app.title'),
});

const initializeAppShell = async () => {
  if (appInitStarted) return;
  appInitStarted = true;
  isInitializing.value = true;

  try {
    loadCollection();
    await authStore.initialize();

    if (authStore.isAuthenticated.value) {
      try {
        await loadFromCloud();
      } catch (e) {
        console.warn('[App] Cloud sync failed:', e);
      }
    }
  } catch (e) {
    console.error('[App] Initialization error:', e);
  } finally {
    setTimeout(() => {
      isInitializing.value = false;
    }, 300);
  }
};

onMounted(async () => {
  if (isStandalonePage.value) {
    isInitializing.value = false;
    return;
  }

  await initializeAppShell();
});

watch(isStandalonePage, async (standalone) => {
  if (!standalone) {
    await initializeAppShell();
  } else {
    isInitializing.value = false;
  }
});

watch(() => authStore.isAuthenticated.value, async (isAuth, wasAuth) => {
  if (isAuth && !wasAuth) {
    try {
      await loadFromCloud();
    } catch (e) {
      console.warn('[App] Cloud sync on login failed:', e);
    }
  }
});
</script>
