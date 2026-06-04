<template>
  <section class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
    <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div>
        <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700">
          <Icon name="lucide:check-check" class="h-3.5 w-3.5" />
          {{ $t('hero.badge') }}
        </div>

        <h1 class="max-w-3xl text-3xl font-black tracking-normal text-slate-950 sm:text-4xl md:text-5xl">
          {{ $t('hero.title.prefix') }}
          <span class="block text-rose-600">{{ $t('hero.title.suffix') }}</span>
        </h1>

        <p class="mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
          {{ $t('hero.subtitle.line1') }}
          <br />
          {{ $t('hero.subtitle.line2') }}
        </p>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <NuxtLink
            to="/collection"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            <Icon name="lucide:list-checks" class="h-4 w-4" />
            {{ $t('home.actions.browse_collection') }}
          </NuxtLink>
          <NuxtLink
            to="/collection?status=uncollected"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-black text-slate-800 transition hover:bg-white"
          >
            <Icon name="lucide:search" class="h-4 w-4" />
            {{ $t('home.actions.review_missing') }}
          </NuxtLink>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-black uppercase tracking-wider text-slate-500">Progress</p>
            <p class="mt-2 text-5xl font-black tabular-nums text-slate-950">{{ stats.percentage }}%</p>
          </div>
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
            <Icon name="lucide:sprout" class="h-8 w-8" />
          </div>
        </div>

        <div class="mt-5 h-3 overflow-hidden rounded-full bg-white">
          <div class="h-full rounded-full bg-rose-500 transition-all duration-700" :style="{ width: `${stats.percentage}%` }"></div>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-white p-4">
            <p class="text-xs font-bold text-slate-500">{{ $t('collection.stats.collected') }}</p>
            <p class="mt-1 text-2xl font-black tabular-nums text-slate-950">{{ stats.collected }}</p>
          </div>
          <div class="rounded-xl bg-white p-4">
            <p class="text-xs font-bold text-slate-500">{{ $t('home.missing.title') }}</p>
            <p class="mt-1 text-2xl font-black tabular-nums text-slate-950">{{ missingCount }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { getStats } = useCollection();
const stats = computed(() => getStats());
const missingCount = computed(() => Math.max(0, stats.value.total - stats.value.collected));
</script>
