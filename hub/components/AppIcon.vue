<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-if="paths.length" v-for="(d, i) in paths" :key="i" :d="d" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  name: string
  size?: number
}>(), {
  size: 20
})

// Map of module id -> SVG path(s)
// All paths are on a 24x24 viewBox, stroke-based (Lucide-style)
const iconMap: Record<string, string[]> = {
  // Jellyfin — play triangle inside a circle (media player)
  jellyfin: [
    'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z',
    'M10 8l6 4-6 4V8z'
  ],
  // Radarr — film reel / movie camera
  radarr: [
    'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z',
    'M5 8h14',
    'M5 16h14',
    'M9 2v6',
    'M15 2v6',
    'M9 16v6',
    'M15 16v6'
  ],
  // Sonarr — tv / antenna
  sonarr: [
    'M2 7h20v13H2z',
    'M17 2l-5 5-5-5',
  ],
  // Prowlarr — search / radar
  prowlarr: [
    'M11 11m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0',
    'M21 21l-4.35-4.35',
    'M11 7v4h4'
  ],
  // Transmission — download / torrent
  transmission: [
    'M12 3v12',
    'M8 11l4 4 4-4',
    'M20 21H4'
  ],
  // Jellystat — bar chart / analytics
  jellystat: [
    'M18 20V10',
    'M12 20V4',
    'M6 20v-6'
  ],
  // Seerr / Overseerr — magnifying glass + star
  seerr: [
    'M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0',
    'M21 21l-4.35-4.35',
    'M11 7l1.2 2.5 2.8.4-2 1.95.47 2.75L11 13.25 8.53 14.6 9 11.85 7 9.9l2.8-.4z'
  ],
  // Home Assistant — simple house
  homeassistant: [
    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    'M9 22V12h6v10'
  ],
  // Theme Toggles
  sun: [
    'M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0',
    'M12 2v2',
    'M12 20v2',
    'M2 12h2',
    'M20 12h2',
    'M18.36 5.64l-1.42 1.42',
    'M7.06 16.94l-1.42 1.42',
    'M18.36 18.36l-1.42 -1.42',
    'M7.06 7.06l-1.42 -1.42'
  ],
  moon: [
    'M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z'
  ],
  // Home — house icon
  home: [
    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    'M9 22V12h6v10'
  ],
  // More — grid of dots
  more: [
    'M12 5v.01',
    'M12 12v.01',
    'M12 19v.01',
    'M19 5v.01',
    'M19 12v.01',
    'M19 19v.01',
    'M5 5v.01',
    'M5 12v.01',
    'M5 19v.01'
  ],
  // Settings / generic fallback — sliders
  settings: [
    'M4 6h16',
    'M4 12h16',
    'M4 18h16',
    'M8 6V4',
    'M14 12v-2',
    'M6 18v-2'
  ]
}

const paths = computed(() => iconMap[props.name] ?? [
  // Generic grid icon fallback
  'M3 3h7v7H3z',
  'M14 3h7v7h-7z',
  'M3 14h7v7H3z',
  'M14 14h7v7h-7z'
])
</script>
