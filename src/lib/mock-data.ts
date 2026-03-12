import { Service, Staff, VehicleLive, Transaction, InventoryItem } from "./types";

export const SERVICES: Service[] = [
  { id: '1', name: 'Basic Wash', price: 500, duration: 20, category: 'Wash' },
  { id: '2', name: 'Executive Wash', price: 1200, duration: 45, category: 'Wash' },
  { id: '3', name: 'Full Detailing', price: 4500, duration: 180, category: 'Detailing' },
  { id: '4', name: 'Ceramic Coating', price: 15000, duration: 360, category: 'Detailing' },
  { id: '5', name: 'Window Tinting', price: 8000, duration: 120, category: 'Tinting' },
  { id: '6', name: 'Carpet Cleaning', price: 2000, duration: 60, category: 'Wash' },
];

export const STAFF: Staff[] = [
  { id: 'S1', name: 'John Kamau', role: 'Attendant', performance: 4.8, earnings: 12500 },
  { id: 'S2', name: 'Sarah Wambui', role: 'Attendant', performance: 4.5, earnings: 10200 },
  { id: 'S3', name: 'Peter Otieno', role: 'Attendant', performance: 4.9, earnings: 15000 },
  { id: 'S4', name: 'Grace Mutua', role: 'Agent', performance: 4.7, earnings: 25000 },
];

export const INVENTORY: InventoryItem[] = [
  { id: 'I1', name: 'Car Shampoo', stock: 45, wholesale: 1200, retail: 1800 },
  { id: 'I2', name: 'Microfiber Cloths', stock: 120, wholesale: 150, retail: 350 },
  { id: 'I3', name: 'Tire Wax', stock: 12, wholesale: 800, retail: 1200 },
];

export const MOCK_VEHICLES: VehicleLive[] = [
  {
    plate: 'KDC 123A',
    status: 'In-Bay',
    arrivalTime: new Date(Date.now() - 30 * 60000).toISOString(),
    bayId: 'Bay 1',
    attendantId: 'S1',
    services: ['Executive Wash', 'Tire Wax'],
    totalAmount: 2400
  },
  {
    plate: 'KDH 456B',
    status: 'Queue',
    arrivalTime: new Date(Date.now() - 10 * 60000).toISOString(),
    bayId: null,
    attendantId: null,
    services: ['Basic Wash'],
    totalAmount: 500
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T1', plate: 'KBA 001C', amount: 1200, status: 'Paid', receipt: 'MPESA_9821X', duration: 35, date: '2024-05-20' },
  { id: 'T2', plate: 'KBB 002D', amount: 500, status: 'Paid', receipt: 'MPESA_9822Y', duration: 20, date: '2024-05-20' },
  { id: 'T3', plate: 'KBC 003E', amount: 4500, status: 'Pending', receipt: null, duration: 150, date: '2024-05-20' },
];