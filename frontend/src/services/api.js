/**
 * API service layer — centralizes all backend HTTP calls.
 * Every function returns a promise that resolves to JSON data.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch all assets from the backend.
 * GET /api/assets
 */
export async function fetchAssets() {
  const res = await fetch(`${BASE_URL}/assets`);
  if (!res.ok) throw new Error('Failed to fetch assets');
  return res.json();
}

/**
 * Search assets by name query.
 * GET /api/assets/search?q={query}
 */
export async function searchAssets(query) {
  const res = await fetch(
    `${BASE_URL}/assets/search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

/**
 * Fetch a single asset by ID.
 * GET /api/assets/{id}
 */
export async function fetchAssetById(id) {
  const res = await fetch(`${BASE_URL}/assets/${id}`);
  if (!res.ok) throw new Error('Asset not found');
  return res.json();
}

/**
 * Create a new requisition request.
 * POST /api/requests  body: { assetId: number, requestedBy: string }
 */
export async function createRequest(assetId, requestedBy = 'anonymous') {
  const res = await fetch(`${BASE_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetId, requestedBy }),
  });
  if (!res.ok) throw new Error('Failed to create request');
  return res.json();
}

/**
 * Fetch all requisition requests.
 * GET /api/requests
 */
export async function fetchRequests() {
  const res = await fetch(`${BASE_URL}/requests`);
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

/**
 * Approve a requisition request.
 * PUT /api/requests/{id}/approve
 */
export async function approveRequest(id) {
  const res = await fetch(`${BASE_URL}/requests/${id}/approve`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to approve request');
  return res.json();
}

/**
 * Reject a requisition request.
 * PUT /api/requests/{id}/reject
 */
export async function rejectRequest(id) {
  const res = await fetch(`${BASE_URL}/requests/${id}/reject`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to reject request');
  return res.json();
}
