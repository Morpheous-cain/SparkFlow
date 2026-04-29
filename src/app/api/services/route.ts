import { NextResponse } from 'next/server'

/**
 * GET /api/services
 * Returns the service catalogue.
 * Public route — no auth required (customers and staff both need this).
 *
 * In a future phase this can be moved to a Supabase `services` table.
 * For now it returns the same data that was in mock-data.ts so all
 * pages can remove their mock-data imports.
 */
export async function GET() {
  const services = [
    {
      id: 'svc-1',
      name: 'Basic Wash',
      category: 'Wash',
      price: 500,
      duration: 20,
      usp: 'Exterior rinse, hand dry',
    },
    {
      id: 'svc-2',
      name: 'Full Wash',
      category: 'Wash',
      price: 800,
      duration: 30,
      usp: 'Exterior + interior vacuum',
    },
    {
      id: 'svc-3',
      name: 'Premium Detail',
      category: 'Wash',
      price: 1500,
      duration: 60,
      usp: 'Full detail, wax, tire shine',
    },
    {
      id: 'svc-4',
      name: 'Tinting',
      category: 'Wash',
      price: 3500,
      duration: 120,
      usp: 'Professional window tint',
    },
    {
      id: 'svc-5',
      name: 'Carpet Pickup',
      category: 'Home',
      price: 1200,
      duration: 45,
      usp: 'Pickup, clean & deliver',
    },
    {
      id: 'svc-6',
      name: 'Air Freshener',
      category: 'Wash',
      price: 200,
      duration: 5,
      usp: 'Long-lasting scent treatment',
    },
    {
      id: 'svc-7',
      name: 'Ceramic Coating',
      category: 'Merchandise',
      price: 8000,
      duration: 180,
      usp: '5-year paint protection',
    },
    {
      id: 'svc-8',
      name: 'Microfibre Cloth Set',
      category: 'Merchandise',
      price: 600,
      duration: 0,
      usp: 'Pack of 6 professional cloths',
    },
  ]

  return NextResponse.json(services)
}
