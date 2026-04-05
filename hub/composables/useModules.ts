import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export interface Module {
  id: string
  name: string
  url: string
  active: boolean
  description: string
  defaultPort: number
  port: number
  useCustomUrl: boolean
  customUrl: string
}

const DEFAULT_MODULES: Module[] = [
  { id: 'homeassistant',name: 'Home Assistant',url: 'http://192.168.1.34:8123', active: true,  description: 'Home automation platform', defaultPort: 8123, port: 8123, useCustomUrl: false, customUrl: '' },
  { id: 'jellyfin',     name: 'Jellyfin',     url: 'http://192.168.1.34:8096', active: true,  description: 'Media server & streaming', defaultPort: 8096, port: 8096, useCustomUrl: false, customUrl: '' },
  { id: 'radarr',      name: 'Radarr',       url: 'http://192.168.1.34:7878', active: true,  description: 'Movie collection manager', defaultPort: 7878, port: 7878, useCustomUrl: false, customUrl: '' },
  { id: 'sonarr',      name: 'Sonarr',       url: 'http://192.168.1.34:8989', active: true,  description: 'TV series manager', defaultPort: 8989, port: 8989, useCustomUrl: false, customUrl: '' },
  { id: 'prowlarr',    name: 'Prowlarr',     url: 'http://192.168.1.34:9696', active: true,  description: 'Indexer manager', defaultPort: 9696, port: 9696, useCustomUrl: false, customUrl: '' },
  { id: 'transmission',name: 'Transmission', url: 'http://192.168.1.34:9091', active: true,  description: 'BitTorrent client', defaultPort: 9091, port: 9091, useCustomUrl: false, customUrl: '' },
  { id: 'jellystat',   name: 'Jellystat',    url: 'http://192.168.1.34:3001', active: false, description: 'Jellyfin statistics & analytics', defaultPort: 3001, port: 3001, useCustomUrl: false, customUrl: '' },
  { id: 'seerr',       name: 'Overseerr',    url: 'http://192.168.1.34:5055', active: false, description: 'Media request management', defaultPort: 5055, port: 5055, useCustomUrl: false, customUrl: '' },
  { id: 'bazarr',      name: 'Bazarr',       url: 'http://192.168.1.34:6767', active: false, description: 'Subtitle manager', defaultPort: 6767, port: 6767, useCustomUrl: false, customUrl: '' }
]

export const useModules = () => {
  const serverAddress = useStorage<string>('casa-server-address', 'http://192.168.1.34')
  const modules = useStorage<Module[]>('casa-modules', DEFAULT_MODULES)

  // Initialization: ensure all DEFAULT_MODULES are present in current storage.
  // This allows new features (like Bazarr) to be automatically added to existing users.
  const missingModules = DEFAULT_MODULES.filter(d => !modules.value.find(m => m.id === d.id))
  if (missingModules.length > 0) {
    const toAdd = missingModules.map(m => ({
      ...m,
      // Ensure new modules follow the current server address immediately
      url: m.useCustomUrl ? m.url : `${serverAddress.value}:${m.port}`
    }))
    modules.value = [...modules.value, ...toAdd]
  }

  const activeModules = computed(() => modules.value.filter(m => m.active))

  const updateServerAddress = (address: string) => {
    const base = address.replace(/\/$/, '')
    serverAddress.value = base
    
    // Only update modules that follow the global configuration
    modules.value = modules.value.map(m => {
      if (m.useCustomUrl) return m
      return {
        ...m,
        url: `${base}:${m.port}`
      }
    })
  }

  const updateModule = (id: string, updates: Partial<Module>) => {
    const index = modules.value.findIndex(m => m.id === id)
    if (index !== -1) {
      const updatedModule = { ...modules.value[index], ...updates }
      
      // Handle automatic URL regeneration based on our source of truth
      if (updatedModule.useCustomUrl) {
        if (updatedModule.customUrl) {
          updatedModule.url = updatedModule.customUrl
        }
      } else {
        updatedModule.url = `${serverAddress.value}:${updatedModule.port}`
      }
      
      modules.value[index] = updatedModule
    }
  }

  const getModule = (id: string) => modules.value.find(m => m.id === id)

  return {
    modules,
    serverAddress,
    activeModules,
    updateServerAddress,
    updateModule,
    getModule
  }
}
