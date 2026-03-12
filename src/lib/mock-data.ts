import { Service, Staff, VehicleLive, Transaction, InventoryItem, Bay, LogisticsRequest } from "./types";

export const SERVICES: Service[] = [
  { id: '1', name: 'Basic Wash', price: 500, duration: 20, category: 'Wash' },
  { id: '2', name: 'Executive Wash', price: 1200, duration: 45, category: 'Wash' },
  { id: '3', name: 'Full Detailing', price: 4500, duration: 180, category: 'Detailing' },
  { id: '4', name: 'Ceramic Coating', price: 15000, duration: 360, category: 'Detailing' },
  { id: '5', name: 'Window Tinting', price: 8000, duration: 120, category: 'Tinting' },
  { id: '6', name: 'Carpet Cleaning', price: 2000, duration: 60, category: 'Wash' },
];

export const STAFF: Staff[] = [
  { 
    id: 'S1', 
    name: 'John Kamau', 
    role: 'Attendant', 
    performance: 4.8, 
    earnings: { base: 8000, commission: 2500, tips: 2000, total: 12500 } 
  },
  { 
    id: 'S2', 
    name: 'Sarah Wambui', 
    role: 'Attendant', 
    performance: 4.5, 
    earnings: { base: 8000, commission: 1200, tips: 1000, total: 10200 } 
  },
  { 
    id: 'S3', 
    name: 'Peter Otieno', 
    role: 'Attendant', 
    performance: 4.9, 
    earnings: { base: 8000, commission: 4500, tips: 2500, total: 15000 } 
  },
  { 
    id: 'S4', 
    name: 'Grace Mutua', 
    role: 'Agent', 
    performance: 4.7, 
    earnings: { base: 20000, commission: 5000, tips: 0, total: 25000 } 
  },
  { 
    id: 'S5', 
    name: 'David Mwangi', 
    role: 'Driver', 
    performance: 4.6, 
    earnings: { base: 12000, commission: 3500, tips: 3000, total: 18500 } 
  },
  { 
    id: 'S6', 
    name: 'Alice Njeri', 
    role: 'Technician', 
    performance: 4.9, 
    earnings: { base: 15000, commission: 7000, tips: 0, total: 22000 } 
  },
];

export const INVENTORY: InventoryItem[] = [
  { id: 'I1', name: 'Car Shampoo', stock: 45, wholesale: 1200, retail: 1800 },
  { id: 'I2', name: 'Microfiber Cloths', stock: 120, wholesale: 150, retail: 350 },
  { id: 'I3', name: 'Tire Wax', stock: 12, wholesale: 800, retail: 1200 },
];

export const BAYS: Bay[] = [
  { id: 'BAY-1', name: 'Bay 1 (Standard)', status: 'Occupied', currentVehiclePlate: 'KDC 123A' },
  { id: 'BAY-2', name: 'Bay 2 (Detailing)', status: 'Occupied', currentVehiclePlate: 'KDJ 999Z' },
  { id: 'BAY-3', name: 'Bay 3 (Express)', status: 'Available' },
];

export const MOCK_VEHICLES: VehicleLive[] = [
  {
    plate: 'KDC 123A',
    status: 'In-Bay',
    arrivalTime: new Date(Date.now() - 30 * 60000).toISOString(),
    bayId: 'BAY-1',
    attendantId: 'S1',
    services: ['Executive Wash', 'Tire Wax'],
    totalAmount: 2400,
    progress: 65
  },
  {
    plate: 'KDJ 999Z',
    status: 'In-Bay',
    arrivalTime: new Date(Date.now() - 45 * 60000).toISOString(),
    bayId: 'BAY-2',
    attendantId: 'S3',
    services: ['Full Detailing'],
    totalAmount: 4500,
    progress: 30
  },
  {
    plate: 'KDH 456B',
    status: 'Queue',
    arrivalTime: new Date(Date.now() - 10 * 60000).toISOString(),
    bayId: null,
    attendantId: null,
    services: ['Basic Wash'],
    totalAmount: 500,
    progress: 0
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T1', plate: 'KBA 001C', amount: 1200, status: 'Paid', receipt: 'MPESA_9821X', duration: 35, date: '2024-05-20' },
  { id: 'T2', plate: 'KBB 002D', amount: 500, status: 'Paid', receipt: 'MPESA_9822Y', duration: 20, date: '2024-05-20' },
  { id: 'T3', plate: 'KBC 003E', amount: 4500, status: 'Pending', receipt: null, duration: 150, date: '2024-05-20' },
];

export const MOCK_LOGISTICS: LogisticsRequest[] = [
  {
    id: 'LOG-101',
    customerName: 'James Wilson',
    itemType: 'Persian Rug',
    status: 'Processing',
    address: 'Kilimani, Nairobi',
    requestTime: '2024-05-21T09:00:00Z',
    pickupWindow: '09:00 AM - 11:00 AM',
    qrTag: 'SPARK-RU-101',
    trackingProgress: 45,
    amount: 3500,
    assignedStaffId: 'S6'
  },
  {
    id: 'LOG-102',
    customerName: 'Mary Atieno',
    itemType: 'SUV Valet',
    status: 'Booking',
    address: 'Westlands, Nairobi',
    requestTime: '2024-05-21T10:30:00Z',
    pickupWindow: '02:00 PM - 04:00 PM',
    qrTag: 'SPARK-VA-102',
    trackingProgress: 0,
    amount: 2500
  },
  {
    id: 'LOG-103',
    customerName: 'Brian Kipkorir',
    itemType: 'Sofa Set',
    status: 'Pickup',
    address: 'Karen, Nairobi',
    requestTime: '2024-05-21T08:15:00Z',
    pickupWindow: '08:00 AM - 10:00 AM',
    qrTag: 'SPARK-SO-103',
    trackingProgress: 20,
    amount: 5000,
    assignedStaffId: 'S5'
  }
];
