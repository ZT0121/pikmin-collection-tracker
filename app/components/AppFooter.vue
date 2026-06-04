<template>
  <footer class="mt-auto border-t border-stone-200 bg-[#fffaf3]">
    <div class="mx-auto max-w-7xl px-4 py-6">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm font-black text-stone-950">{{ $t('footer.copyright') }}</p>
          <p class="mt-1 max-w-3xl text-xs leading-relaxed text-stone-500">
            {{ $t('footer.unofficial') }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-sm font-bold">
          <a
            href="https://www.pikminwiki.com/Decor_Pikmin"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-600 transition hover:text-amber-700"
          >
            Pikipedia
          </a>
          <a
            href="https://github.com/scott0127/pik_tool"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-600 transition hover:text-amber-700"
          >
            {{ $t('footer.original_repo') }}
          </a>
          <a
            href="https://github.com/ZT0121/pikmin-collection-tracker"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-600 transition hover:text-amber-700"
          >
            {{ $t('footer.project_repo') }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
