<template>
  <div
    @click="handleClick"
    class="relative group h-full cursor-pointer pop-in"
    :class="{
      'decor-unlocked-now': isUnlocking,
      'decor-removing': isRemoving,
      'decor-rare-unlock': isUnlocking && isRareVariant,
    }"
    :style="{ animationDelay: `${animationDelay}ms` }"
  >
    <div
      class="decor-card-shell liquid-glass-soft liquid-glass-dynamic relative z-10 flex h-[244px] flex-col overflow-hidden rounded-2xl border transition-all duration-300"
      :class="[
        isRareVariant
          ? (isDecorCompleted
              ? 'border-yellow-300/90 shadow-[0_14px_34px_rgba(146,64,14,0.28)] rare-golden-glow'
              : hasProgress
                ? 'border-amber-300/80 shadow-[0_10px_24px_rgba(245,158,11,0.18)]'
                : 'border-slate-300/50 shadow-[0_6px_16px_rgba(15,23,42,0.1)]')
          : (isDecorCompleted
              ? 'border-rose-300/90 shadow-[0_12px_30px_rgba(225,29,72,0.22)]'
              : hasProgress
                ? 'border-amber-300/80 shadow-[0_10px_24px_rgba(245,158,11,0.18)]'
                : 'border-slate-300/50 shadow-[0_6px_16px_rgba(15,23,42,0.1)]')
      ]"
    >
      <!-- Image Container -->
      <div
        class="decor-image-stage relative h-[118px] w-full shrink-0 overflow-hidden border-b border-white/70 p-3"
        :class="isRareVariant
          ? (isDecorCompleted
              ? 'bg-gradient-to-br from-amber-50/92 via-yellow-50/86 to-orange-50/84'
              : hasProgress
                ? 'bg-gradient-to-br from-amber-50/90 via-orange-50/82 to-yellow-50/78'
              : 'bg-gradient-to-br from-slate-100/88 via-gray-50/82 to-slate-50/78')
          : (isDecorCompleted
              ? 'bg-gradient-to-br from-white/92 via-rose-50/84 to-cyan-50/80'
              : hasProgress
                ? 'bg-gradient-to-br from-white/92 via-amber-50/84 to-sky-50/78'
              : 'bg-gradient-to-br from-slate-100/88 via-gray-50/82 to-slate-50/78')"
      >
        <!-- Background pattern -->
        <div class="absolute inset-0" :class="isRareVariant ? (isDecorCompleted ? 'opacity-10' : 'opacity-[0.04]') : (isDecorCompleted ? 'opacity-5' : 'opacity-[0.03]')">
          <div
            class="absolute inset-0"
            :style="isDecorCompleted
              ? (isRareVariant
                  ? 'background-image: radial-gradient(circle, #fbbf24 1px, transparent 1px); background-size: 16px 16px;'
                  : 'background-image: radial-gradient(circle, #e11d48 1px, transparent 1px); background-size: 20px 20px;')
              : hasProgress
                ? 'background-image: radial-gradient(circle, #f59e0b 1px, transparent 1px); background-size: 18px 18px;'
              : 'background-image: radial-gradient(circle, #94a3b8 1px, transparent 1px); background-size: 20px 20px;'"
          ></div>
        </div>

        <!-- Unlock-only effects -->
        <div v-if="isUnlocking" class="unlock-ring pointer-events-none" />
        <div v-if="isUnlocking && isRareVariant" class="rare-sweep pointer-events-none" />
        <div v-if="isUnlocking" class="unlock-particles pointer-events-none" aria-hidden="true">
          <span
            v-for="particle in unlockParticles"
            :key="particle.id"
            class="unlock-particle"
            :class="isRareVariant ? 'unlock-particle-gold' : 'unlock-particle-rose'"
            :style="{
              '--particle-x': particle.x,
              '--particle-y': particle.y,
              '--particle-delay': particle.delay,
            }"
          />
        </div>

        <!-- Image -->
        <img
          v-if="imageUrl && !hasError"
          :src="imageUrl"
          :alt="`${locale === 'en' ? variant?.nameEn : variant?.name} ${t('pikmin_types.' + pikminType)}`"
          class="decor-image relative mx-auto h-full max-h-[92px] w-full max-w-[82px] object-contain transform transition-all duration-300 group-hover:scale-[1.04]"
          :class="isDecorCompleted ? 'opacity-100 saturate-[1.02]' : hasProgress ? 'opacity-[0.72] grayscale-[24%] saturate-[0.72]' : 'opacity-[0.45] grayscale-[70%] saturate-[0.3]'"
          loading="lazy"
          referrerpolicy="no-referrer"
          @error="handleImageError"
        >
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-5xl"
        >
          <Icon :name="category?.icon || 'line-md:question-circle'" class="text-4xl" />
        </div>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="lock-release-transition"
          leave-from-class="opacity-100 scale-100 rotate-0"
          leave-to-class="opacity-0 scale-0 rotate-12"
        >
          <div
            v-if="!hasProgress"
            class="absolute inset-0 bg-slate-400/18 backdrop-blur-[1px] pointer-events-none flex items-center justify-center"
          >
            <!-- Lock Icon (SVG) -->
            <div class="w-9 h-9 rounded-full bg-slate-500/28 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 text-slate-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>
        </Transition>

        <!-- Pikmin Type Badge -->
        <div
          class="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-lg ring-1 ring-white/70 transform group-hover:scale-110 transition-transform"
          :class="[pikminBadgeClass, !hasProgress && 'opacity-50 saturate-50']"
        >
          {{ pikminTypeShort }}
        </div>

        <!-- Rare Badge -->
        <div
          v-if="variant?.isRare"
          class="rare-sparkle absolute top-2 left-2 inline-flex items-center gap-1 rounded-lg bg-amber-400 px-2 py-1 text-[11px] font-extrabold text-amber-950 shadow-lg ring-1 ring-white/80 sparkle"
        >
          <Icon name="lucide:sparkles" class="h-3.5 w-3.5 drop-shadow-sm" />
          <span>{{ t('collection.card_status.rare') }}</span>
        </div>

        <!-- Decor Completed Checkmark -->
        <Transition
          enter-active-class="checkmark-pop-transition"
          enter-from-class="scale-0 rotate-180 opacity-0"
          enter-to-class="scale-100 rotate-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="scale-100 rotate-0 opacity-100"
          leave-to-class="scale-0 rotate-180 opacity-0"
        >
          <div
            v-if="isDecorCompleted"
            class="absolute bottom-2 right-2 w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </Transition>

        <!-- Hover overlay -->
        <div
          class="absolute inset-0 transition-colors duration-300 rounded-lg pointer-events-none"
          :class="isDecorCompleted ? 'bg-rose-500/0 group-hover:bg-rose-500/8' : hasProgress ? 'bg-amber-500/0 group-hover:bg-amber-500/8' : 'bg-slate-900/0 group-hover:bg-slate-900/6'"
        ></div>
      </div>

      <!-- Info Section -->
      <div
        class="flex min-h-0 flex-1 flex-col p-3 text-center backdrop-blur-sm"
        :class="isDecorCompleted
          ? 'bg-white/93 border-white/70'
          : hasProgress
            ? 'bg-amber-50/90 border-amber-100/70'
          : 'bg-slate-50/90 border-slate-200/50'"
      >
        <p
          class="line-clamp-1 text-sm font-extrabold leading-snug"
          :class="isDecorCompleted ? 'text-slate-900' : hasProgress ? 'text-slate-700' : 'text-slate-400'"
          :style="{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }"
          :title="locale === 'en' ? variant?.nameEn : variant?.name"
        >
          {{ (locale === 'en' ? variant?.nameEn : variant?.name) || 'Unknown' }}
        </p>
        <p
          class="mt-1 line-clamp-1 text-xs font-semibold"
          :class="isDecorCompleted ? 'text-slate-700' : hasProgress ? 'text-amber-700' : 'text-slate-400'"
          :style="{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }"
          :title="locale === 'en' ? variant?.name : variant?.nameEn"
        >
          {{ (locale === 'en' ? variant?.name : variant?.nameEn) || '' }}
        </p>
        <div
          class="mt-2 rounded-xl bg-white/86 p-2 text-left shadow-inner ring-1"
          :class="statusMeta.panelClass"
        >
          <div class="flex items-center justify-between gap-1.5">
            <span class="shrink-0 text-[10px] font-bold text-slate-500">{{ t('collection.card_status.current_label') }}</span>
            <span
              class="inline-flex min-w-0 items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-extrabold"
              :class="statusMeta.softClass"
            >
              <Icon :name="statusMeta.icon" class="h-3.5 w-3.5 shrink-0" />
              <span class="truncate">{{ statusMeta.label }}</span>
            </span>
          </div>
          <div
            class="mt-1.5 grid grid-cols-4 gap-1"
            :aria-label="statusMeta.label"
          >
            <span
              v-for="step in statusSteps"
              :key="step.value"
              class="flex h-6 items-center justify-center rounded-md ring-1 transition-colors"
              :class="step.isActive
                ? statusMeta.stepActiveClass
                : step.isPassed
                  ? 'bg-slate-100 text-slate-500 ring-slate-200'
                  : 'bg-white text-slate-300 ring-slate-200/70'"
              :title="step.label"
            >
              <Icon :name="step.icon" class="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
        <div
          class="mt-1.5 inline-flex max-w-full items-center gap-1 self-center rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200/80"
          :title="t('collection.card_status.next_title', { status: nextStatusMeta.label })"
        >
          <Icon name="lucide:mouse-pointer-click" class="h-3 w-3 shrink-0" />
          <span class="truncate">{{ t('collection.card_status.next_label') }}: {{ nextStatusMeta.label }}</span>
        </div>
      </div>
    </div>

    <!-- Click ripple effect -->
    <Transition
      enter-active-class="transition duration-500"
      enter-from-class="scale-0 opacity-100"
      enter-to-class="scale-150 opacity-0"
      leave-active-class="transition duration-0"
    >
      <div
        v-if="showRipple"
        class="absolute inset-0 rounded-2xl pointer-events-none"
        :class="isRemoving ? 'bg-slate-400/24' : isDecorCompleted ? 'bg-rose-400/30' : 'bg-amber-400/28'"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { CollectionItemStatus, PikminType } from '~/types/decor';
import { PIKMIN_TYPE_COLORS } from '~/types/decor';

const props = withDefaults(defineProps<{
  itemId: string;
  categoryId: string;
  variantId: string;
  pikminType: PikminType;
  animationDelay?: number;
}>(), {
  animationDelay: 0
});

const emit = defineEmits<{
  toggle: [itemId: string];
}>();

const { getItemStatus, cycleItemStatus } = useCollection();
const { getVariant, getCategory, getImageUrl } = useDecorData();
const toast = useToast();
const { t, locale } = useI18n();

const variant = computed(() => getVariant(props.categoryId, props.variantId));
const category = computed(() => getCategory(props.categoryId));
const itemStatus = computed(() => getItemStatus(props.itemId));
const isDecorCompleted = computed(() => itemStatus.value === 'decor');
const hasProgress = computed(() => itemStatus.value !== 'none');
const imageUrl = computed(() => getImageUrl(props.categoryId, props.variantId, props.pikminType));
const isRareVariant = computed(() => props.variantId.toLowerCase().includes('rare'));
const hasError = ref(false);
const showRipple = ref(false);
const isUnlocking = ref(false);
const isRemoving = ref(false);
let feedbackTimer: ReturnType<typeof setTimeout> | null = null;
let unlockTimer: ReturnType<typeof setTimeout> | null = null;
let removingTimer: ReturnType<typeof setTimeout> | null = null;

const unlockParticles = [
  { id: 1, x: '-2.35rem', y: '-1.55rem', delay: '0ms' },
  { id: 2, x: '-1.15rem', y: '-2.55rem', delay: '40ms' },
  { id: 3, x: '1.25rem', y: '-2.4rem', delay: '70ms' },
  { id: 4, x: '2.35rem', y: '-0.95rem', delay: '20ms' },
  { id: 5, x: '-2rem', y: '1.3rem', delay: '95ms' },
  { id: 6, x: '2rem', y: '1.45rem', delay: '115ms' },
  { id: 7, x: '0.15rem', y: '-3rem', delay: '130ms' },
  { id: 8, x: '0.3rem', y: '2.55rem', delay: '150ms' },
];

const pikminTypeShort = computed(() => {
  return t(`pikmin_types_short.${props.pikminType}`);
});

const pikminBadgeClass = computed(() => {
  const baseClass = PIKMIN_TYPE_COLORS[props.pikminType];
  const textClass = props.pikminType === 'white' || props.pikminType === 'yellow' ? 'text-gray-800' : 'text-white';
  return `${baseClass} ${textClass}`;
});

const statusOrder: CollectionItemStatus[] = ['none', 'seedling', 'plucked', 'decor'];

const statusMeta = computed(() => {
  const meta: Record<CollectionItemStatus, { label: string; short: string; icon: string; panelClass: string; softClass: string; stepActiveClass: string }> = {
    none: {
      label: t('collection.status.none'),
      short: t('collection.status_short.none'),
      icon: 'lucide:minus',
      panelClass: 'ring-slate-200',
      softClass: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
      stepActiveClass: 'bg-slate-600 text-white ring-slate-600',
    },
    seedling: {
      label: t('collection.status.seedling'),
      short: t('collection.status_short.seedling'),
      icon: 'lucide:sprout',
      panelClass: 'ring-sky-200',
      softClass: 'bg-sky-100 text-sky-800 ring-1 ring-sky-200',
      stepActiveClass: 'bg-sky-500 text-white ring-sky-500',
    },
    plucked: {
      label: t('collection.status.plucked'),
      short: t('collection.status_short.plucked'),
      icon: 'lucide:leaf',
      panelClass: 'ring-amber-200',
      softClass: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
      stepActiveClass: 'bg-amber-500 text-white ring-amber-500',
    },
    decor: {
      label: t('collection.status.decor'),
      short: t('collection.status_short.decor'),
      icon: 'lucide:check',
      panelClass: 'ring-rose-200',
      softClass: 'bg-rose-100 text-rose-800 ring-1 ring-rose-200',
      stepActiveClass: 'bg-rose-500 text-white ring-rose-500',
    },
  };

  return meta[itemStatus.value];
});

const nextStatus = computed<CollectionItemStatus>(() => {
  const nextIndex = (statusOrder.indexOf(itemStatus.value) + 1) % statusOrder.length;
  return statusOrder[nextIndex] ?? 'none';
});

const nextStatusMeta = computed(() => {
  const meta: Record<CollectionItemStatus, { label: string; short: string; icon: string }> = {
    none: {
      label: t('collection.status.none'),
      short: t('collection.status_short.none'),
      icon: 'lucide:minus',
    },
    seedling: {
      label: t('collection.status.seedling'),
      short: t('collection.status_short.seedling'),
      icon: 'lucide:sprout',
    },
    plucked: {
      label: t('collection.status.plucked'),
      short: t('collection.status_short.plucked'),
      icon: 'lucide:leaf',
    },
    decor: {
      label: t('collection.status.decor'),
      short: t('collection.status_short.decor'),
      icon: 'lucide:check',
    },
  };

  return meta[nextStatus.value];
});

const statusSteps = computed(() => {
  const currentIndex = statusOrder.indexOf(itemStatus.value);
  const meta: Record<CollectionItemStatus, { label: string; icon: string; value: CollectionItemStatus }> = {
    none: { value: 'none', label: t('collection.status.none'), icon: 'lucide:minus' },
    seedling: { value: 'seedling', label: t('collection.status.seedling'), icon: 'lucide:sprout' },
    plucked: { value: 'plucked', label: t('collection.status.plucked'), icon: 'lucide:leaf' },
    decor: { value: 'decor', label: t('collection.status.decor'), icon: 'lucide:check' },
  };

  return statusOrder.map((value, index) => ({
    ...meta[value],
    isActive: value === itemStatus.value,
    isPassed: index < currentIndex,
  }));
});

const clearFeedbackTimers = () => {
  if (feedbackTimer) clearTimeout(feedbackTimer);
  if (unlockTimer) clearTimeout(unlockTimer);
  if (removingTimer) clearTimeout(removingTimer);
};

const triggerUnlockMoment = () => {
  isRemoving.value = false;
  isUnlocking.value = false;
  requestAnimationFrame(() => {
    isUnlocking.value = true;
    unlockTimer = setTimeout(() => {
      isUnlocking.value = false;
    }, 920);
  });
};

const triggerRemoveMoment = () => {
  isUnlocking.value = false;
  isRemoving.value = true;
  removingTimer = setTimeout(() => {
    isRemoving.value = false;
  }, 360);
};

const handleClick = () => {
  clearFeedbackTimers();

  showRipple.value = true;
  feedbackTimer = setTimeout(() => {
    showRipple.value = false;
  }, 500);

  const previousStatus = itemStatus.value;
  const nextStatus = cycleItemStatus(props.itemId);

  if (previousStatus !== 'decor' && nextStatus === 'decor') {
    triggerUnlockMoment();
    toast.success(t('components.toast.saved'), 1200);
  } else if (nextStatus === 'none') {
    triggerRemoveMoment();
    toast.info(t('components.toast.removed'), 1200);
  }

  emit('toggle', props.itemId);
};

const handleImageError = () => {
  hasError.value = true;
};

onBeforeUnmount(() => {
  clearFeedbackTimers();
});
</script>

<style scoped>
.decor-card-shell {
  will-change: transform;
}

.decor-image-stage {
  isolation: isolate;
}

.decor-unlocked-now .decor-card-shell {
  animation: decor-unlock-pop 720ms cubic-bezier(0.2, 0.92, 0.28, 1.18);
}

.decor-unlocked-now .decor-image {
  animation: decor-unlock-reveal 680ms ease-out;
}

.decor-removing .decor-card-shell {
  animation: decor-remove-press 320ms ease-out;
}

.unlock-ring {
  position: absolute;
  inset: 50% auto auto 50%;
  z-index: 2;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  border: 2px solid rgb(225 29 72 / 0.44);
  background: radial-gradient(circle, rgb(255 228 230 / 0.58), rgb(225 29 72 / 0.14) 50%, transparent 72%);
  box-shadow:
    0 0 18px rgb(225 29 72 / 0.26),
    0 0 42px rgb(14 165 233 / 0.18);
  transform: translate(-50%, -50%) scale(0.24);
  animation: decor-unlock-ring 680ms ease-out forwards;
}

.decor-rare-unlock .unlock-ring {
  border-color: rgb(251 191 36 / 0.58);
  background: radial-gradient(circle, rgb(255 251 235 / 0.68), rgb(251 191 36 / 0.2) 52%, transparent 74%);
  box-shadow:
    0 0 20px rgb(251 191 36 / 0.38),
    0 0 48px rgb(245 158 11 / 0.26);
}

.rare-sweep {
  position: absolute;
  inset: -20% -70%;
  z-index: 3;
  background: linear-gradient(110deg, transparent 36%, rgb(255 255 255 / 0.2) 44%, rgb(253 230 138 / 0.62) 50%, rgb(255 255 255 / 0.24) 56%, transparent 66%);
  transform: translateX(-52%) rotate(8deg);
  animation: decor-rare-sweep 760ms ease-out forwards;
  mix-blend-mode: screen;
}

.unlock-particles {
  position: absolute;
  inset: 0;
  z-index: 4;
}

.unlock-particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 999px;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.2);
  animation: decor-unlock-particle 720ms cubic-bezier(0.16, 0.84, 0.44, 1) forwards;
  animation-delay: var(--particle-delay);
}

.unlock-particle::after {
  position: absolute;
  inset: -0.12rem;
  content: '';
  border-radius: 999px;
  background: inherit;
  filter: blur(5px);
  opacity: 0.58;
}

.unlock-particle-rose {
  background: radial-gradient(circle, #ffffff 0 22%, #fda4af 34%, #e11d48 68%, transparent 70%);
  box-shadow: 0 0 12px rgb(225 29 72 / 0.38);
}

.unlock-particle-gold {
  background: radial-gradient(circle, #ffffff 0 20%, #fde68a 36%, #f59e0b 68%, transparent 70%);
  box-shadow: 0 0 14px rgb(245 158 11 / 0.44);
}

.checkmark-pop-transition {
  animation: checkmark-unlock-pop 420ms cubic-bezier(0.18, 0.92, 0.26, 1.22);
}

.lock-release-transition {
  transition: opacity 220ms ease, transform 280ms cubic-bezier(0.2, 0.88, 0.28, 1.18), backdrop-filter 220ms ease;
}

.decor-rare-unlock .rare-sparkle {
  animation: rare-sparkle-unlock 850ms ease-out;
}

@keyframes decor-unlock-pop {
  0% {
    transform: scale(0.98);
  }
  32% {
    transform: scale(1.045) translateY(-2px);
  }
  62% {
    transform: scale(0.992) translateY(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes decor-remove-press {
  0% {
    transform: scale(1);
  }
  42% {
    transform: scale(0.975);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes decor-unlock-reveal {
  0% {
    filter: grayscale(0.7) saturate(0.45) brightness(0.96);
    transform: scale(0.96);
  }
  44% {
    filter: grayscale(0) saturate(1.22) brightness(1.1);
    transform: scale(1.08);
  }
  100% {
    filter: grayscale(0) saturate(1.02) brightness(1);
    transform: scale(1);
  }
}

@keyframes decor-unlock-ring {
  0% {
    opacity: 0.92;
    transform: translate(-50%, -50%) scale(0.18);
  }
  72% {
    opacity: 0.34;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(5.2);
  }
}

@keyframes decor-unlock-particle {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }
  24% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--particle-x)), calc(-50% + var(--particle-y))) scale(1.08);
  }
}

@keyframes decor-rare-sweep {
  0% {
    opacity: 0;
    transform: translateX(-58%) rotate(8deg);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(58%) rotate(8deg);
  }
}

@keyframes checkmark-unlock-pop {
  0% {
    opacity: 0;
    transform: scale(0) rotate(180deg);
  }
  58% {
    opacity: 1;
    transform: scale(1.18) rotate(-8deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes rare-sparkle-unlock {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 0 rgb(251 191 36 / 0));
  }
  42% {
    transform: scale(1.28) rotate(14deg);
    filter: drop-shadow(0 0 12px rgb(251 191 36 / 0.72));
  }
}

@media (prefers-reduced-motion: reduce) {
  .decor-unlocked-now .decor-card-shell,
  .decor-unlocked-now .decor-image,
  .decor-removing .decor-card-shell,
  .rare-sweep,
  .unlock-ring,
  .unlock-particle,
  .decor-rare-unlock .rare-sparkle,
  .checkmark-pop-transition {
    animation: none;
  }
}
</style>
