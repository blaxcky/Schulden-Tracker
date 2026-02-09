export async function resetCache() {
  // Unregister all service workers
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const reg of registrations) {
      await reg.unregister()
    }
  }

  // Delete all caches
  if ('caches' in window) {
    const names = await caches.keys()
    for (const name of names) {
      await caches.delete(name)
    }
  }

  // Reload the page
  window.location.reload()
}
