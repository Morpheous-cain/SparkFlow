export type VehicleStatus = 'Queue' | 'In-Bay' | 'Ready' | 'Completed';
export type BayStatus = 'Available' | 'Occupied' | 'Under Maintenance';

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
  category: 'Wash' | 'Detailing' | 'Tinting';
}

export interface Staff {
  id: string;
  name: string;
  role: 'Agent' | 'Attendant' | 'Manager';
  performance: number;
  earnings: number;
}

export interface VehicleLive {
  plate: string;
  status: VehicleStatus;
  arrivalTime: string;
  exitTime?: string;
  durationMinutes?: number;
  bayId: string | null;
  attendantId: string | null;
  services: string[];
  totalAmount: number;
  progress?: number;
}

export interface Transaction {
  id: string;
  plate: string;
  amount: number;
  status: 'Pending' | 'Paid';
  receipt: string | null;
  duration: number;
  date: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  wholesale: number;
  retail: number;
}

export interface Bay {
  id: string;
  name: string;
  status: BayStatus;
  currentVehiclePlate?: string;
}
