<template>
  <div class="flex flex-col">
    <!-- Empty State -->
    <div v-if="categories.length === 0" class="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e4d8c7] bg-[#fffaf3] px-4 py-6 text-center">
        <Icon name="lucide:flower-2" class="mb-2 text-3xl text-[#c8bba4]" />
        <p class="text-sm font-bold text-gray-600">{{ $t('home.near_complete.empty') }}</p>
        <p class="mt-1 text-xs font-semibold text-gray-400">{{ $t('home.near_complete.empty_hint') }}</p>
    </div>

    <!-- List: Expedition Style -->
    <div v-else class="grid gap-2 sm:grid-cols-2">
      <div
        v-for="cat in categories.slice(0, 4)"
        :key="cat.id"
        @click="$emit('select-category', cat.id)"
        class="glass-surface-readable group relative w-full rounded-xl p-3 transition-all duration-300 cursor-pointer flex items-center gap-3 hover:-translate-y-0.5"
      >
        <!-- 1. Icon (Rounded Square like game) -->
        <div class="glass-control w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
            <img v-if="isImageIcon(cat.icon)" :src="cat.icon" class="w-8 h-8 object-contain" alt="icon" />
            <Icon v-else :name="cat.icon" class="text-2xl text-gray-700" />
        </div>

        <!-- 2. Progress Info -->
        <div class="flex-1 min-w-0">
            <div class="flex justify-between items-end mb-1">
                <span class="text-on-glass font-black text-sm truncate pr-2">{{ cat.name }}</span>
                <span class="near-badge text-[10px] font-black px-1.5 py-0.5 rounded-md">
                    {{ $t('home.near_complete.remaining', { n: cat.remaining }) }}
                </span>
            </div>

            <!-- Flower Path Progress Bar -->
            <div class="near-progress-track relative h-2 w-full rounded-full overflow-hidden">
                <!-- Fill -->
                <div class="near-progress-fill absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                     :style="{ width: `${cat.percentage}%` }">
                     <!-- Flower Pattern overlay -->
                     <div class="absolute inset-0 w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=')]"></div>
                </div>
            </div>
        </div>

        <!-- 3. Goal (Gift) -->
        <div class="glass-control w-7 h-7 rounded-full flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
             <Icon name="lucide:gift" class="w-3.5 h-3.5 text-[#9d9588]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Interfaces can be moved to a shared type file later if needed
interface NearCompleteCategory {
  id: string;
  name: string;
  icon: string;
  collected: number;
  total: number;
  remaining: number;
  percentage: number;
}

defineProps<{
  categories: NearCompleteCategory[]
}>();

defineEmits(['select-category']);

const isImageIcon = (icon: string) => /^(https?:|data:|blob:|\/)/.test(icon);

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(116, 100, 80, 0.2);
  border-radius: 20px;
}

.near-badge {
  flex-shrink: 0;
  max-width: 86px;
  color: #746450;
  line-height: 1.15;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.78);
  background: rgba(245, 234, 220, 0.62);
  box-shadow:
    0 6px 16px rgba(116, 100, 80, 0.16),
    0 1px 0 rgba(255, 255, 255, 0.82) inset;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.72);
}

.near-progress-track {
  border: 1px solid rgba(255, 255, 255, 0.74);
  background: rgba(15, 23, 42, 0.18);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.64) inset,
    0 5px 12px rgba(15, 23, 42, 0.18) inset;
}

.near-progress-fill {
  background: linear-gradient(90deg, rgba(198, 184, 161, 0.95), rgba(157, 149, 136, 0.98));
  box-shadow:
    0 0 10px rgba(116, 100, 80, 0.36),
    0 1px 0 rgba(255, 255, 255, 0.58) inset;
}
</style>
