import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export interface Module {
  id: string
  name: string
  url: string
  active: boolean
  description: string
  defaultPort: number
}

const DEFAULT_MODULES: Module[] = [
  { id: 'homeassistant',name: 'Home Assistant',url: 'http://localhost:8123', active: true,  description: 'Home automation platform', defaultPort: 8123 },
  { id: 'jellyfin',     name: 'Jellyfin',     url: 'http://localhost:8096', active: true,  description: 'Media server & streaming', defaultPort: 8096 },
  { id: 'radarr',      name: 'Radarr',       url: 'http://localhost:7878', active: true,  description: 'Movie collection manager', defaultPort: 7878 },
  { id: 'sonarr',      name: 'Sonarr',       url: 'http://localhost:8989', active: true,  description: 'TV series manager', defaultPort: 8989 },
  { id: 'prowlarr',    name: 'Prowlarr',     url: 'http://localhost:9696', active: true,  description: 'Indexer manager', defaultPort: 9696 },
  { id: 'transmission',name: 'Transmission', url: 'http://localhost:9091', active: true,  description: 'BitTorrent client', defaultPort: 9091 },
  { id: 'jellystat',   name: 'Jellystat',    url: 'http://localhost:3001', active: false, description: 'Jellyfin statistics & analytics', defaultPort: 3001 },
  { id: 'seerr',       name: 'Overseerr',    url: 'http://localhost:5055', active: false, description: 'Media request management', defaultPort: 5055 }
]

export const useModules = () => {
  const modules = useStorage<Module[]>('casa-modules', DEFAULT_MODULES)
  const serverAddress = useStorage<string>('casa-server-address', 'http://localhost')

  const activeModules = computed(() => modules.value.filter(m => m.active))

  const updateServerAddress = (address: string) => {
    const base = address.replace(/\/$/, '')
    serverAddress.value = base
    
    // Prefill all module URLs with the new server address
    modules.value = modules.value.map(m => ({
      ...m,
      url: `${base}:${m.defaultPort}`
    }))
  }

  const updateModule = (id: string, updates: Partial<Module>) => {
    const index = modules.value.findIndex(m => m.id === id)
    if (index !== -1) {
      modules.value[index] = { ...modules.value[index], ...updates }
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
