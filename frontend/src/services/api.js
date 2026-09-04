/**
 * API service layer — centralizes all backend HTTP calls.
 * Falls back to mock data when backend is unavailable (e.g. Vercel deploy).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const USE_MOCK = !BASE_URL;

// ── Mock Data ──────────────────────────────────────────────

const MOCK_ASSETS = [
  {
    id: 1,
    name: 'Atlas 60kVA Mobile Generator',
    assetCode: 'GEN-2214',
    category: 'generator',
    healthScore: 92,
    distanceKm: 1.4,
    locationLabel: 'Yard 3, Sector B',
    dailyRate: 150,
    etaLabel: 'Ready in 20 min',
    status: 'AVAILABLE',
  },
  {
    id: 2,
    name: 'Ridgeline 120kVA Diesel Generator',
    assetCode: 'GEN-3087',
    category: 'generator',
    healthScore: 78,
    distanceKm: 3.2,
    locationLabel: 'Depot Alpha',
    dailyRate: 220,
    etaLabel: 'Ready in 45 min',
    status: 'AVAILABLE',
  },
  {
    id: 3,
    name: 'Hercules 80kVA Towable Generator',
    assetCode: 'GEN-1156',
    category: 'generator',
    healthScore: 65,
    distanceKm: 5.8,
    locationLabel: 'Site 7, North Wing',
    dailyRate: 180,
    etaLabel: 'Ready in 1 hr',
    status: 'MAINTENANCE',
  },
  {
    id: 4,
    name: 'DJI Matrice 350 RTK Drone',
    assetCode: 'DRN-4401',
    category: 'drone',
    healthScore: 95,
    distanceKm: 0.8,
    locationLabel: 'HQ Storage',
    dailyRate: 320,
    etaLabel: 'Ready in 10 min',
    status: 'AVAILABLE',
  },
  {
    id: 5,
    name: 'Skydio X10 Inspection Drone',
    assetCode: 'DRN-2290',
    category: 'drone',
    healthScore: 88,
    distanceKm: 2.1,
    locationLabel: 'Field Office B',
    dailyRate: 275,
    etaLabel: 'Ready in 30 min',
    status: 'AVAILABLE',
  },
  {
    id: 6,
    name: 'Autel EVO Max 4T Drone',
    assetCode: 'DRN-5518',
    category: 'drone',
    healthScore: 71,
    distanceKm: 4.5,
    locationLabel: 'Remote Yard',
    dailyRate: 290,
    etaLabel: 'Ready in 50 min',
    status: 'AVAILABLE',
  },
  {
    id: 7,
    name: 'Boston Dynamics Spot Robot',
    assetCode: 'BOT-1122',
    category: 'robotics',
    healthScore: 97,
    distanceKm: 1.0,
    locationLabel: 'Innovation Lab',
    dailyRate: 500,
    etaLabel: 'Ready in 15 min',
    status: 'AVAILABLE',
  },
  {
    id: 8,
    name: 'Fetch Mobile Manipulator',
    assetCode: 'BOT-3344',
    category: 'robotics',
    assetCode: 'BOT-3344',
    category: 'robotics',
    healthScore: 82,
    distanceKm: 3.7,
    locationLabel: 'Warehouse C',
    dailyRate: 420,
    etaLabel: 'Ready in 40 min',
    status: 'AVAILABLE',
  },
  {
    id: 9,
    name: 'ANYmal X Inspection Robot',
    assetCode: 'BOT-6677',
    category: 'robotics',
    healthScore: 59,
    distanceKm: 6.2,
    locationLabel: 'Plant D',
    dailyRate: 380,
    etaLabel: 'Ready in 1.5 hr',
    status: 'MAINTENANCE',
  },
  {
    id: 10,
    name: 'CAT 320 Hydraulic Excavator',
    assetCode: 'EXC-8801',
    category: 'excavator',
    healthScore: 88,
    distanceKm: 2.5,
    locationLabel: 'Construction Yard',
    dailyRate: 350,
    etaLabel: 'Ready in 30 min',
    status: 'AVAILABLE',
  },
  {
    id: 11,
    name: 'Komatsu PC210LC Excavator',
    assetCode: 'EXC-7745',
    category: 'excavator',
    healthScore: 74,
    distanceKm: 4.1,
    locationLabel: 'Site 12, Block E',
    dailyRate: 310,
    etaLabel: 'Ready in 55 min',
    status: 'AVAILABLE',
  },
  {
    id: 12,
    name: 'Volvo EC220E Excavator',
    assetCode: 'EXC-9923',
    category: 'excavator',
    healthScore: 45,
    distanceKm: 7.8,
    locationLabel: 'Remote Site F',
    dailyRate: 280,
    etaLabel: 'Unavailable',
    status: 'MAINTENANCE',
  },
  {
    id: 13,
    name: 'DeWalt 20V Max Drill Kit',
    assetCode: 'TL-1001',
    category: 'tool',
    healthScore: 96,
    distanceKm: 0.3,
    locationLabel: 'Tool Shed A',
    dailyRate: 25,
    etaLabel: 'Ready now',
    status: 'AVAILABLE',
  },
  {
    id: 14,
    name: 'Milwaukee M18 Impact Wrench',
    assetCode: 'TL-1022',
    category: 'tool',
    healthScore: 89,
    distanceKm: 0.5,
    locationLabel: 'Tool Shed A',
    dailyRate: 20,
    etaLabel: 'Ready now',
    status: 'AVAILABLE',
  },
  {
    id: 15,
    name: 'Makita 40V Angle Grinder',
    assetCode: 'TL-1033',
    category: 'tool',
    healthScore: 72,
    distanceKm: 1.2,
    locationLabel: 'Workshop B',
    dailyRate: 18,
    etaLabel: 'Ready in 10 min',
    status: 'AVAILABLE',
  },
];

let mockRequestId = 1000;

// ── API Functions ──────────────────────────────────────────

export async function fetchAssets() {
  if (USE_MOCK) return [...MOCK_ASSETS];
  const res = await fetch(`${BASE_URL}/api/assets`);
  if (!res.ok) throw new Error('Failed to fetch assets');
  return res.json();
}

export async function searchAssets(query) {
  if (USE_MOCK) {
    const q = query.toLowerCase().trim();
    return MOCK_ASSETS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.assetCode.toLowerCase().includes(q)
    );
  }
  const res = await fetch(
    `${BASE_URL}/api/assets/search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function fetchAssetById(id) {
  if (USE_MOCK) {
    return MOCK_ASSETS.find((a) => a.id === id) || null;
  }
  const res = await fetch(`${BASE_URL}/api/assets/${id}`);
  if (!res.ok) throw new Error('Asset not found');
  return res.json();
}

export async function createRequest(assetId, requestedBy = 'anonymous') {
  if (USE_MOCK) {
    mockRequestId++;
    const asset = MOCK_ASSETS.find((a) => a.id === assetId);
    return {
      id: mockRequestId,
      asset: asset || null,
      requestedBy,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
    };
  }
  const res = await fetch(`${BASE_URL}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetId, requestedBy }),
  });
  if (!res.ok) throw new Error('Failed to create request');
  return res.json();
}

export async function fetchRequests() {
  if (USE_MOCK) return [];
  const res = await fetch(`${BASE_URL}/api/requests`);
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

export async function approveRequest(id) {
  if (USE_MOCK) return { id, status: 'APPROVED' };
  const res = await fetch(`${BASE_URL}/api/requests/${id}/approve`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to approve request');
  return res.json();
}

export async function rejectRequest(id) {
  if (USE_MOCK) return { id, status: 'REJECTED' };
  const res = await fetch(`${BASE_URL}/api/requests/${id}/reject`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to reject request');
  return res.json();
}
