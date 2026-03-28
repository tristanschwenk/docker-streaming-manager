import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export interface Module {
  id: string
  name: string
  url: string
  active: boolean
  description: string
}

const DEFAULT_MODULES: Module[] = [
  { id: 'jellyfin',     name: 'Jellyfin',     url: 'http://localhost:8096', active: true,  description: 'Media server & streaming' },
  { id: 'radarr',      name: 'Radarr',       url: 'http://localhost:7878', active: true,  description: 'Movie collection manager' },
  { id: 'sonarr',      name: 'Sonarr',       url: 'http://localhost:8989', active: true,  description: 'TV series manager' },
  { id: 'prowlarr',    name: 'Prowlarr',     url: 'http://localhost:9696', active: true,  description: 'Indexer manager' },
  { id: 'transmission',name: 'Transmission', url: 'http://localhost:9091', active: true,  description: 'BitTorrent client' },
  { id: 'jellystat',   name: 'Jellystat',    url: 'http://localhost:3001', active: false, description: 'Jellyfin statistics & analytics' },
  { id: 'seerr',       name: 'Overseerr',    url: 'http://localhost:5055', active: false, description: 'Media request management' }
]

export const useModules = () => {
  const modules = useStorage<Module[]>('casa-modules', DEFAULT_MODULES)

  const activeModules = computed(() => modules.value.filter(m => m.active))

  const updateModule = (id: string, updates: Partial<Module>) => {
    const index = modules.value.findIndex(m => m.id === id)
    if (index !== -1) {
      modules.value[index] = { ...modules.value[index], ...updates }
    }
  }

  const getModule = (id: string) => modules.value.find(m => m.id === id)

  return {
    modules,
    activeModules,
    updateModule,
    getModule
  }
}
