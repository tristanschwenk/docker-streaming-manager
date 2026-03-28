<template>
  <div id="app-container">
    <aside class="sidebar" aria-label="Main navigation">
      <!-- Brand -->
      <div class="sidebar-header">
        <div class="logo-mark" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="sidebar-brand">
          <span class="sidebar-brand-name">casaStreaming</span>
          <span class="sidebar-brand-sub">Media Hub</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="nav-links" aria-label="Services">
        <span class="nav-section-label">Services</span>
        <NuxtLink
          v-for="(module, idx) in activeModules"
          :key="module.id"
          :to="`/s/${module.id}`"
          class="nav-item"
          active-class="active"
          :style="`animation-delay: ${idx * 40}ms`"
        >
          <span class="nav-item-icon">
            <AppIcon :name="module.id" :size="18" />
          </span>
          <span class="nav-item-label">{{ module.name }}</span>
        </NuxtLink>

        <template v-if="activeModules.length === 0">
          <span class="nav-item" style="cursor: default; opacity: 0.5; font-size: 0.8125rem;">
            No services active
          </span>
        </template>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <NuxtLink to="/settings" class="nav-item" active-class="active">
          <span class="nav-item-icon">
            <AppIcon name="settings" :size="18" />
          </span>
          <span class="nav-item-label">Settings</span>
        </NuxtLink>
      </div>
    </aside>

    <main class="main-content" id="main-content">
      <NuxtPage />
    </main>

    <VitePwaManifest />
  </div>
</template>

<script setup>
const { activeModules } = useModules()
</script>
