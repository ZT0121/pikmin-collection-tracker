<template>
  <footer class="glass-frosted-shell border-b-0 mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="text-center space-y-5">
        <div class="flex items-center justify-center gap-3">
          <span class="text-2xl">👀</span>
          <div>
            <p class="text-sm text-gray-500">{{ $t('footer.total_views') }}</p>
            <p class="text-2xl font-bold text-gradient">
              {{ formattedViews }}
            </p>
          </div>
        </div>

        <div class="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm px-2">
          <a
            href="https://www.pikminwiki.com/Decor_Pikmin"
            target="_blank"
            rel="noopener noreferrer"
            class="text-emerald-600 hover:text-emerald-700 transition-colors font-medium underline underline-offset-2 py-2 sm:py-0"
          >
            Decor Pikmin 資料來源
          </a>
          <span class="hidden sm:inline text-gray-300">•</span>
          <a
            href="https://github.com/scott0127/pik_tool"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2 sm:py-0"
          >
            基於 scott0127/pik_tool 修改
          </a>
          <span class="hidden sm:inline text-gray-300">•</span>
          <a
            href="https://www.pikminwiki.com/Pikipedia:General_disclaimer"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2 sm:py-0"
          >
            Pikipedia 免責聲明
          </a>
        </div>

        <div class="text-xs text-gray-500 max-w-3xl mx-auto leading-relaxed">
          <p>
            本網站是非官方粉絲工具，與 Nintendo 或 Niantic 無任何官方關係、授權、贊助或背書。
          </p>
          <p>
            Pikmin Bloom、Pikmin、遊戲圖片、角色名稱與相關素材版權屬於其各自權利人。
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { pageViews, incrementPageViews } = usePageViews();

const formattedViews = computed(() => {
  if (pageViews.value === null) return '---';
  return pageViews.value.toLocaleString('zh-TW');
});

onMounted(async () => {
  await incrementPageViews();
});
</script>
