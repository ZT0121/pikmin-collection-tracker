<template>
  <div class="space-y-6 pb-10">
    <HomeHeroSection />

    <div class="grid gap-4 lg:grid-cols-[1fr_360px]">
      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-black text-slate-950">{{ $t('home.near_complete.title') }}</h2>
            <p class="text-sm font-medium text-slate-500">{{ $t('home.tips.subtitle') }}</p>
          </div>
          <Icon name="lucide:target" class="h-5 w-5 text-[#746450]" />
        </div>

        <HomeNearCompleteScroll
          :categories="nearCompleteCategories"
          @select-category="goToCategory"
        />
      </section>

      <aside class="space-y-4">
        <button
          @click="showMissingItems"
          class="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Icon name="lucide:search" class="h-5 w-5" />
              </div>
              <h3 class="text-lg font-black text-slate-950">{{ $t('home.missing.title') }}</h3>
              <p class="mt-1 text-sm font-medium text-slate-500">{{ $t('home.missing.desc') }}</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-black tabular-nums text-[#9d9588]">{{ uncollectedCount }}</p>
              <p class="text-xs font-bold text-slate-400">{{ $t('home.missing.count_suffix') }}</p>
            </div>
          </div>
        </button>

        <button
          @click="showUnobtainable"
          class="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Icon name="lucide:calendar-days" class="h-5 w-5" />
              </div>
              <h3 class="text-lg font-black text-slate-950">{{ $t('home.limited.title') }}</h3>
              <p class="mt-1 text-sm font-medium text-slate-500">{{ $t('home.limited.desc') }}</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-black tabular-nums text-purple-500">{{ limitedCount }}</p>
              <p class="text-xs font-bold text-slate-400">{{ $t('home.limited.count_suffix') }}</p>
            </div>
          </div>
        </button>

        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fbf6ee] text-[#746450]">
              <Icon name="lucide:clipboard-list" class="h-5 w-5" />
            </div>
            <div>
              <h3 class="font-black text-slate-950">{{ $t('home.tips.title') }}</h3>
              <p class="text-xs font-medium text-slate-500">{{ $t('home.tips.subtitle') }}</p>
            </div>
          </div>
          <ul class="space-y-3 text-sm font-medium leading-6 text-slate-600">
            <li class="flex gap-2">
              <Icon name="lucide:check" class="mt-1 h-4 w-4 shrink-0 text-[#746450]" />
              <span>{{ $t('home.tips.tip1') }}</span>
            </li>
            <li class="flex gap-2">
              <Icon name="lucide:check" class="mt-1 h-4 w-4 shrink-0 text-[#746450]" />
              <span>{{ $t('home.tips.tip2') }}</span>
            </li>
            <li class="flex gap-2">
              <Icon name="lucide:check" class="mt-1 h-4 w-4 shrink-0 text-[#746450]" />
              <span>{{ $t('home.tips.tip3') }}</span>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const router = useRouter();
const { getStats } = useCollection();
const { getDecorDefinitions } = useDecorData();

const stats = computed(() => getStats());

const uncollectedCount = computed(() => Math.max(0, stats.value.total - stats.value.collected));

const limitedCount = computed(() => {
  const regional = stats.value.byCategoryType.regional?.total || 0;
  const special = stats.value.byCategoryType.special?.total || 0;
  return regional + special;
});

const nearCompleteCategories = computed(() => {
  const definitions = getDecorDefinitions();
  const results: Array<{
    id: string;
    name: string;
    icon: string;
    collected: number;
    total: number;
    remaining: number;
    percentage: number;
  }> = [];

  definitions.forEach((def) => {
    const catStats = stats.value.byCategory[def.category.id];
    if (!catStats || catStats.total === 0) return;

    const percentage = Math.round((catStats.collected / catStats.total) * 100);
    const remaining = catStats.total - catStats.collected;
    const firstVariant = def.variants[0] as any;
    const iconUrl = firstVariant?.imageUrls?.red || firstVariant?.imageUrl || '';

    if (percentage >= 70 && percentage < 100 && remaining > 0) {
      results.push({
        id: def.category.id,
        name: locale.value === 'en' ? def.category.nameEn : def.category.name,
        icon: iconUrl || def.category.icon || 'lucide:package',
        collected: catStats.collected,
        total: catStats.total,
        remaining,
        percentage,
      });
    }
  });

  return results.sort((a, b) => b.percentage - a.percentage).slice(0, 6);
});

const showMissingItems = () => {
  router.push({ path: '/collection', query: { status: 'uncollected' } });
};

const showUnobtainable = () => {
  router.push({ path: '/collection', query: { limited: 'true' } });
};

const goToCategory = (categoryId: string) => {
  router.push({ path: '/collection', query: { category: categoryId } });
};
</script>
