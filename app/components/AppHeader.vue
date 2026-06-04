<template>
  <header class="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fffaf3]/90 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
      <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
          <Icon name="lucide:sprout" class="h-5 w-5" />
        </div>
        <div class="min-w-0">
          <h1 class="truncate text-base font-extrabold tracking-normal text-stone-950 sm:text-lg">
            {{ $t('app.title') }}
          </h1>
          <p class="hidden truncate text-xs font-medium text-stone-500 sm:block">
            {{ $t('app.subtitle') }}
          </p>
        </div>
      </NuxtLink>

      <nav class="hidden items-center rounded-xl border border-stone-200 bg-stone-50 p-1 md:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition"
          :class="$route.path === link.to ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-500 hover:text-stone-900'"
        >
          <Icon :name="link.icon" class="h-4 w-4" />
          <span>{{ link.name }}</span>
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <button
          @click="showSearch = !showSearch"
          class="hidden h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:border-stone-300 hover:text-stone-950 md:flex"
          :title="$t('header.search')"
        >
          <Icon name="lucide:search" class="h-4 w-4" />
        </button>

        <div class="hidden items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2 sm:flex">
          <div class="h-2 w-20 overflow-hidden rounded-full bg-stone-100">
            <div class="h-full rounded-full bg-[#b9aa92] transition-all" :style="{ width: `${stats.percentage}%` }"></div>
          </div>
          <span class="text-xs font-black text-stone-700">{{ stats.percentage }}%</span>
        </div>

        <LanguageSwitcher class="hidden md:flex" />

        <template v-if="user">
          <div
            class="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#9d9588] text-sm font-black text-white sm:flex"
            :title="user.email || ''"
          >
            {{ userInitial }}
          </div>
          <button
            @click="handleLogout"
            class="hidden rounded-xl px-3 py-2 text-sm font-bold text-stone-500 transition hover:text-red-600 sm:block"
          >
            {{ $t('auth.logout') }}
          </button>
        </template>
        <NuxtLink v-else to="/auth" class="hidden rounded-xl bg-stone-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-stone-800 sm:block">
          {{ $t('auth.login') }}
        </NuxtLink>

        <button
          @click="toggleMobileMenu"
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 md:hidden"
          aria-label="Toggle navigation"
        >
          <Icon :name="showMobileMenu ? 'lucide:x' : 'lucide:menu'" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showSearch" class="border-t border-slate-200 bg-white/95 px-4 py-3">
        <div class="mx-auto max-w-7xl">
          <div class="relative">
            <Icon name="lucide:search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              :placeholder="$t('header.search')"
              class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-[#b9aa92] focus:bg-white"
              autofocus
            />
          </div>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showMobileMenu" class="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
        <div class="grid grid-cols-2 gap-2">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            @click="showMobileMenu = false"
            class="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold"
            :class="$route.path === link.to ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'"
          >
            <Icon :name="link.icon" class="h-4 w-4" />
            {{ link.name }}
          </NuxtLink>
        </div>

        <div class="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div class="mb-2 flex items-center justify-between text-sm">
            <span class="font-bold text-slate-600">{{ $t('header.mobile_progress') }}</span>
            <span class="font-black text-slate-950">{{ $t('header.mobile_progress_count', { collected: stats.collected, total: stats.total }) }}</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-white">
            <div class="h-full rounded-full bg-[#b9aa92]" :style="{ width: `${stats.percentage}%` }"></div>
          </div>
        </div>

        <div class="mt-3 flex gap-2">
          <NuxtLink
            v-if="!user"
            to="/auth"
            @click="showMobileMenu = false"
            class="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white"
          >
            {{ $t('auth.login') }}
          </NuxtLink>
          <button
            v-else
            @click="handleLogout"
            class="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
          >
            {{ $t('auth.logout') }}
          </button>
          <LanguageSwitcher class="h-12 rounded-xl border border-slate-200 bg-white" />
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();
const { getStats } = useCollection();
const { t } = useI18n();

const showMobileMenu = ref(false);
const showSearch = ref(false);
const searchQuery = ref('');
const isLoggingOut = ref(false);

const stats = computed(() => getStats());
const user = computed(() => authStore.user.value);
const userInitial = computed(() => authStore.userInitial.value);

const navLinks = computed(() => [
  { to: '/', name: t('nav.home'), icon: 'lucide:layout-dashboard' },
  { to: '/collection', name: t('nav.collection'), icon: 'lucide:list-checks' },
]);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const handleLogout = async () => {
  if (isLoggingOut.value) return;
  isLoggingOut.value = true;
  showMobileMenu.value = false;
  await authStore.signOut();
  isLoggingOut.value = false;
};

const handleSearch = () => {
  showMobileMenu.value = false;
  showSearch.value = false;
  router.push({
    path: '/collection',
    query: searchQuery.value ? { search: searchQuery.value } : {},
  });
};

watch(() => router.currentRoute.value.path, () => {
  showMobileMenu.value = false;
  showSearch.value = false;
});
</script>
