<script setup>
const { modules, serverAddress, updateModule, updateServerAddress } = useModules()
const colorMode = useColorMode()

const serverAddressInput = ref(serverAddress.value)

const toggleTheme = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}

const handleServerAddressChange = () => {
  updateServerAddress(serverAddressInput.value)
}
</script>

<template>
  <div class="settings-page">
    <header class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-description">Configure your hub and connected services. Changes are saved automatically.</p>
    </header>

    <div role="list">
      <!-- Theme Setting -->
      <div class="module-card" role="listitem">
        <div class="module-info">
          <div class="module-icon-wrap" aria-hidden="true">
            <AppIcon :name="colorMode === 'dark' ? 'sun' : 'moon'" :size="20" />
          </div>
          <div class="module-details">
            <div class="module-name">Appearance</div>
            <div class="page-description" style="margin: 0; font-size: 0.8125rem;">
              Currently using <strong>{{ colorMode === 'dark' ? 'Dark' : 'Light' }}</strong> mode
            </div>
          </div>
        </div>
        <div class="module-actions">
          <label class="toggle-label" aria-label="Toggle theme">
            <input
              type="checkbox"
              :checked="colorMode === 'dark'"
              @change="toggleTheme"
            />
            <span class="toggle-track" aria-hidden="true"></span>
            <span class="toggle-thumb" aria-hidden="true"></span>
          </label>
        </div>
      </div>

      <!-- Server Address Setting -->
      <div class="module-card" role="listitem" style="margin-top: 1rem;">
        <div class="module-info">
          <div class="module-icon-wrap" aria-hidden="true">
            <AppIcon name="settings" :size="20" />
          </div>
          <div class="module-details" style="flex: 1;">
            <div class="module-name">Global Server Address</div>
            <div class="page-description" style="margin: 0 0 0.5rem 0; font-size: 0.75rem; opacity: 0.7;">
              Updating this will prefill all service URLs below.
            </div>
            <input
              type="text"
              v-model="serverAddressInput"
              class="url-input"
              placeholder="http://192.168.1.100"
              @change="handleServerAddressChange"
              style="width: 100%;"
            />
          </div>
        </div>
      </div>

      <div class="nav-section-label" style="padding-left: 0; margin-top: 1.5rem; margin-bottom: 0.75rem;">Connected Services</div>

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
            <div class="module-header-row">
              <div class="module-name">{{ mod.name }}</div>
              <button
                class="btn-override"
                :class="{ 'is-active': mod.useCustomUrl }"
                @click="updateModule(mod.id, { useCustomUrl: !mod.useCustomUrl })"
                :title="mod.useCustomUrl ? 'Back to global config' : 'Override with custom URL'"
              >
                <AppIcon :name="mod.useCustomUrl ? 'settings' : 'settings'" :size="14" />
                <span>{{ mod.useCustomUrl ? 'Custom' : 'Global' }}</span>
              </button>
            </div>

            <!-- Global Port Config -->
            <div v-if="!mod.useCustomUrl" class="url-input-wrapper">
              <span class="url-input-prefix">{{ serverAddress }}:</span>
              <input
                type="number"
                v-model.number="mod.port"
                class="url-input port-input"
                placeholder="PORT"
                :aria-label="`${mod.name} Port`"
                @change="updateModule(mod.id, { port: mod.port })"
              />
            </div>

            <!-- Custom URL Override -->
            <div v-else class="url-input-wrapper">
              <input
                type="url"
                v-model="mod.customUrl"
                class="url-input"
                placeholder="https://custom-address.com:port"
                @change="updateModule(mod.id, { customUrl: mod.customUrl })"
                style="padding: 0.4375rem 0.75rem;"
              />
            </div>
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
