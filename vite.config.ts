import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  /*
    Project page, not a user page: the site is served from
    https://ddevjourney.github.io/stremio-pw/, so every built asset URL has to
    carry that prefix. Without it the page loads and then fetches its JS and CSS
    from the domain root, where nothing exists, and renders blank.
  */
  base: '/stremio-pw/',
})
