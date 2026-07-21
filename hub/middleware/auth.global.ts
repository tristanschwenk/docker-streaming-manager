export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/register') {
    return;
  }

  try {
    const { hasUsers } = await $fetch('/api/auth/status');

    if (!hasUsers) {
      if (to.path !== '/register') {
        return navigateTo('/register');
      }
      return;
    }

    if (to.path === '/login') {
      return;
    }

    const headers = useRequestHeaders(['cookie']);
    const session = await $fetch('/api/auth/get-session', { headers });

    if (!session) {
      return navigateTo('/login');
    }
  } catch (err) {
    console.error("Authentication middleware error:", err);
    if (to.path !== '/login') {
      return navigateTo('/login');
    }
  }
});
