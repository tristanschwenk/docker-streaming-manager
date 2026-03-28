<template>
  <div class="settings-page">
    <header class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-description">Enable or disable services and configure their URLs. Changes are saved automatically.</p>
    </header>

    <div role="list">
      <div
        v-for="mod in modules"
        :key="mod.id"
        class="module-card"
        :class="{ 'is-active': mod.active }"
        role="listitem"
      >
        <div class="module-info">
          <div class="module-icon-wrap" aria-hidden="true">
            <AppIcon :name="mod.id" :size="20" />
          </div>

          <div class="module-details">
            <div class="module-name">{{ mod.name }}</div>
            <input
              type="url"
              v-model="mod.url"
              class="url-input"
              :placeholder="`http://localhost:PORT`"
              :aria-label="`${mod.name} URL`"
              @change="updateModule(mod.id, { url: mod.url })"
            />
          </div>
        </div>

        <div class="module-actions">
          <label class="toggle-label" :aria-label="`${mod.active ? 'Disable' : 'Enable'} ${mod.name}`">
            <input
              type="checkbox"
              v-model="mod.active"
              @change="updateModule(mod.id, { active: mod.active })"
            />
            <span class="toggle-track" aria-hidden="true"></span>
            <span class="toggle-thumb" aria-hidden="true"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { modules, updateModule } = useModules()
</script>
