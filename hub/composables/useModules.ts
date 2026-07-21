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
  { id: 'homeassistant',name: 'Home Assistant',url: 'http://192.168.1.34:8123', active: true,  description: 'Home automation platform', defaultPort: 8123, port: 8123, useCustomUrl: true, customUrl: 'http://192.168.1.34:8123' },
  { id: 'jellyfin',     name: 'Jellyfin',     url: '/jellyfin',     active: true,  description: 'Media server & streaming', defaultPort: 8096, port: 8096, useCustomUrl: false, customUrl: '' },
  { id: 'radarr',      name: 'Radarr',       url: '/radarr',       active: true,  description: 'Movie collection manager', defaultPort: 7878, port: 7878, useCustomUrl: false, customUrl: '' },
  { id: 'sonarr',      name: 'Sonarr',       url: '/sonarr',       active: true,  description: 'TV series manager', defaultPort: 8989, port: 8989, useCustomUrl: false, customUrl: '' },
  { id: 'prowlarr',    name: 'Prowlarr',     url: '/prowlarr',     active: true,  description: 'Indexer manager', defaultPort: 9696, port: 9696, useCustomUrl: false, customUrl: '' },
  { id: 'transmission',name: 'Transmission', url: '/transmission', active: true,  description: 'BitTorrent client', defaultPort: 9091, port: 9091, useCustomUrl: false, customUrl: '' },
  { id: 'jellystat',   name: 'Jellystat',    url: '/jellystat',    active: false, description: 'Jellyfin statistics & analytics', defaultPort: 3001, port: 3001, useCustomUrl: false, customUrl: '' },
  { id: 'seerr',       name: 'Overseerr',    url: '/seerr',        active: false, description: 'Media request management', defaultPort: 5055, port: 5055, useCustomUrl: false, customUrl: '' },
  { id: 'bazarr',      name: 'Bazarr',       url: '/bazarr',       active: false, description: 'Subtitle manager', defaultPort: 6767, port: 6767, useCustomUrl: false, customUrl: '' }
]

export const useModules = () => {
  const serverAddress = useStorage<string>('casa-server-address', '')
  const modules = useStorage<Module[]>('casa-modules', DEFAULT_MODULES)

  // Auto-migration: ensure existing modules rely on relative paths if custom is not set
  modules.value = modules.value.map(m => {
    if (!m.useCustomUrl) {
      const expectedUrl = m.id === 'homeassistant' ? m.customUrl : `/${m.id}`
      if (m.url !== expectedUrl) {
        return {
          ...m,
          url: expectedUrl
        }
      }
    }
    return m
  })

  // Initialization: ensure all DEFAULT_MODULES exist in current storage
  const missingModules = DEFAULT_MODULES.filter(d => !modules.value.find(m => m.id === d.id))
  if (missingModules.length > 0) {
    const toAdd = missingModules.map(m => ({
      ...m,
      url: m.useCustomUrl ? m.customUrl : `/${m.id}`
    }))
    modules.value = [...modules.value, ...toAdd]
  }

  const activeModules = computed(() => modules.value.filter(m => m.active))

  const updateServerAddress = (address: string) => {
    const base = address.replace(/\/$/, '')
    serverAddress.value = base
    
    modules.value = modules.value.map(m => {
      if (m.useCustomUrl) return m
      const pathPrefix = base && base !== '/' ? base : ''
      return {
        ...m,
        url: `${pathPrefix}/${m.id}`
      }
    })
  }

  const updateModule = (id: string, updates: Partial<Module>) => {
    const index = modules.value.findIndex(m => m.id === id)
    if (index !== -1) {
      const updatedModule = { ...modules.value[index], ...updates }
      
      if (updatedModule.useCustomUrl) {
        if (updatedModule.customUrl) {
          updatedModule.url = updatedModule.customUrl
        }
      } else {
        const base = serverAddress.value && serverAddress.value !== '/' ? serverAddress.value : ''
        updatedModule.url = `${base}/${updatedModule.id}`
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
