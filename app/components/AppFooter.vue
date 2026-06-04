<template>
  <footer class="mt-auto border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-6">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm font-black text-slate-950">{{ $t('footer.copyright') }}</p>
          <p class="mt-1 max-w-3xl text-xs leading-relaxed text-slate-500">
            {{ $t('footer.unofficial') }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-sm font-bold">
          <a
            href="https://www.pikminwiki.com/Decor_Pikmin"
            target="_blank"
            rel="noopener noreferrer"
            class="text-slate-600 transition hover:text-rose-700"
          >
            Pikipedia
          </a>
          <a
            href="https://github.com/scott0127/pik_tool"
            target="_blank"
            rel="noopener noreferrer"
            class="text-slate-600 transition hover:text-rose-700"
          >
            原始專案
          </a>
          <a
            href="https://github.com/ZT0121/pikmin-collection-tracker"
            target="_blank"
            rel="noopener noreferrer"
            class="text-slate-600 transition hover:text-rose-700"
          >
            我的版本
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
