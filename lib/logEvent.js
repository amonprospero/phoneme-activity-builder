export async function logEvent(payload) {
  try {
    await fetch('/api/metrics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // never block the teacher UI if metrics fail
  }
}
