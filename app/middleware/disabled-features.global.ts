export default defineNuxtRouteMiddleware((to) => {
  const disabledRoutes = ['/feedback', '/forza-music-overlay'];

  if (disabledRoutes.includes(to.path)) {
    const baseURL = useRuntimeConfig().app.baseURL || '/';
    return navigateTo(`${baseURL}collection`);
  }
});
