<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="fixed inset-0 pointer-events-none -z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-cyan-50"></div>
      <div class="absolute top-20 left-10 text-8xl opacity-10 animate-float">🌸</div>
      <div class="absolute bottom-20 right-10 text-7xl opacity-10 animate-float" style="animation-delay: 1s;">🍃</div>
      <div class="absolute top-1/2 left-1/4 text-6xl opacity-5 animate-float" style="animation-delay: 2s;">🌱</div>
      
      <!-- Gradient Orbs -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30"></div>
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-30"></div>
    </div>

    <div class="w-full max-w-md animate-slide-up">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-24 h-24 mx-auto bg-gradient-to-br from-rose-400 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-200 mb-6 animate-float">
          <span class="text-5xl">🔑</span>
        </div>
        <h1 class="text-3xl font-extrabold gradient-text mb-2">更改密碼</h1>
        <p class="text-gray-500">請輸入您的現有密碼與新密碼</p>
      </div>

      <!-- Change Password Card -->
      <div class="glass rounded-3xl p-8 shadow-2xl">
        <!-- Error Message -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-start gap-3">
            <span class="text-lg">⚠️</span>
            <span>{{ error }}</span>
          </div>
        </Transition>

        <!-- Success Message -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="success" class="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm flex items-start gap-3">
            <span class="text-lg">✅</span>
            <span>{{ success }}</span>
          </div>
        </Transition>

        <!-- Form -->
        <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Current Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="flex items-center gap-2">
                <span>🔒</span>
                現有密碼
              </span>
            </label>
            <PasswordInput
              v-model="currentPassword"
              :required="true"
              placeholder="請輸入現有密碼"
            />
          </div>

          <!-- New Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="flex items-center gap-2">
                <span>🔑</span>
                新密碼
              </span>
            </label>
            <PasswordInput
              v-model="newPassword"
              :required="true"
              :minlength="6"
              placeholder="請輸入至少 6 個字元"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="flex items-center gap-2">
                <span>🔐</span>
                確認新密碼
              </span>
            </label>
            <PasswordInput
              v-model="confirmPassword"
              :required="true"
              :minlength="6"
              placeholder="再次輸入新密碼"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{{ loading ? '更新中...' : '更改密碼' }}</span>
          </button>
        </form>

        <!-- Success Actions -->
        <div v-if="success" class="text-center">
          <NuxtLink
            to="/"
            class="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            <span>返回首頁</span>
          </NuxtLink>
        </div>

        <!-- Back Link -->
        <div v-if="!success" class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-gray-500 hover:text-rose-600 transition-colors">
            ← 返回首頁
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const supabase = useSupabaseClient();
const authStore = useAuthStore();

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleSubmit = async () => {
  // 驗證密碼
  if (newPassword.value !== confirmPassword.value) {
    error.value = '兩次輸入的新密碼不一致';
    return;
  }

  if (newPassword.value.length < 6) {
    error.value = '新密碼至少需要 6 個字元';
    return;
  }

  if (currentPassword.value === newPassword.value) {
    error.value = '新密碼不能與現有密碼相同';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // 先用現有密碼重新登入驗證身份
    const userEmail = authStore.user.value?.email;
    if (!userEmail) {
      throw new Error('無法取得用戶資訊');
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: currentPassword.value,
    });

    if (signInError) {
      throw new Error('現有密碼不正確');
    }

    // 更新密碼
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value,
    });
    
    if (updateError) throw updateError;
    
    success.value = '密碼已成功更新！';
  } catch (e: any) {
    error.value = e.message || '更新密碼時發生錯誤，請稍後再試';
  } finally {
    loading.value = false;
  }
};

// 確保使用者已登入
onMounted(async () => {
  await authStore.waitForInit();
  
  if (!authStore.isAuthenticated.value) {
    console.log('[ChangePassword] Not authenticated, redirecting to auth');
    router.push('/auth');
  }
});
</script>
