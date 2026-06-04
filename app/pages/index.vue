<template>
  <div class="space-y-6 pb-10">
    <HomeHeroSection />

    <div class="grid gap-4 lg:grid-cols-[1fr_360px]">
      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-black text-slate-950">{{ $t('home.near_complete.title') }}</h2>
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

        <section class="rounded-2xl border border-[#e4d8c7] bg-white p-5 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-black text-[#746450]">📅 {{ $t('home.monthly_event.title') }}</p>
              <h3 class="mt-2 text-lg font-black text-slate-950">{{ monthlyEventName }}</h3>
              <p class="mt-1 text-sm font-bold text-slate-500">{{ $t('home.monthly_event.days_left', { n: monthlyEventDaysLeft }) }}</p>
            </div>
            <div class="rounded-2xl bg-[#fbf6ee] px-4 py-3 text-right ring-1 ring-[#e4d8c7]">
              <p class="text-2xl font-black tabular-nums text-[#746450]">{{ monthlyEventProgress }}</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import flowerCrownEventData from '~/data/events/2026-06-flower-crown.json';

const { locale, t } = useI18n();
const router = useRouter();
const { getStats } = useCollection();
const { getDecorDefinitions } = useDecorData();

const stats = computed(() => getStats());
const now = ref(new Date());
let nowTimer: ReturnType<typeof setInterval> | null = null;

const uncollectedCount = computed(() => Math.max(0, stats.value.total - stats.value.collected));

const limitedCount = computed(() => {
  const regional = stats.value.byCategoryType.regional?.total || 0;
  const special = stats.value.byCategoryType.special?.total || 0;
  return regional + special;
});

const monthlyEventCategoryId = 'flower-crown';

const monthlyEventDefinition = computed(() =>
  getDecorDefinitions().find((def) => def.category.id === monthlyEventCategoryId)
);

const monthlyEventName = computed(() => {
  const category = monthlyEventDefinition.value?.category;
  if (!category) return t('home.monthly_event.name');
  return locale.value === 'en' ? category.nameEn : `${category.name} Decor`;
});

const monthlyEventStats = computed(() => {
  const categoryStats = stats.value.byCategory[monthlyEventCategoryId];
  const fallbackTotal = monthlyEventDefinition.value?.availablePikminTypes?.length || 0;

  return {
    collected: categoryStats?.collected || 0,
    total: categoryStats?.total || fallbackTotal,
  };
});

const monthlyEventProgress = computed(() =>
  `${monthlyEventStats.value.collected} / ${monthlyEventStats.value.total}`
);

const monthlyEventDaysLeft = computed(() => {
  const event = flowerCrownEventData.event;
  const endAt = new Date(`${event.endsAt}T23:59:59`);
  const diff = endAt.getTime() - now.value.getTime();

  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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

    const percentage = catStats.percentage;
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

onMounted(() => {
  now.value = new Date();
  nowTimer = setInterval(() => {
    now.value = new Date();
  }, 60 * 60 * 1000);
});

onUnmounted(() => {
  if (nowTimer) clearInterval(nowTimer);
});
</script>
