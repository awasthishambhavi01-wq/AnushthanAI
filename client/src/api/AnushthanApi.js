export async function generateListing(payload) {
  const response = await fetch('/api/generate-listing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Unable to generate listing');
  }

  return response.json();
}
