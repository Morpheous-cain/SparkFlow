export type VehicleStatus = 'Queue' | 'In-Bay' | 'Ready' | 'Completed';
export type BayStatus = 'Available' | 'Occupied' | 'Under Maintenance';
export type DeliveryStatus = 'Booking' | 'Pickup' | 'Processing' | 'Drying' | 'Delivery' | 'Completed';
export type SubscriptionTier = 'None' | 'Silver' | 'Gold' | 'Platinum';

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
  role: 'Agent' | 'Attendant' | 'Manager' | 'Driver' | 'Technician';
  performance: number;
  earnings: {
    base: number;
    commission: number;
    tips: number;
    total: number;
  };
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

export interface LogisticsRequest {
  id: string;
  customerName: string;
  itemType: string;
  status: DeliveryStatus;
  address: string;
  requestTime: string;
  pickupWindow?: string;
  qrTag?: string;
  eta?: string;
  amount: number;
  assignedStaffId?: string;
  trackingProgress?: number;
}

export interface SubscriptionPlan {
  id: string;
  name: SubscriptionTier;
  price: number;
  discount: number;
  benefits: string[];
}

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  type: 'Percentage' | 'Fixed';
  expiry: string;
  status: 'Active' | 'Used' | 'Expired';
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  bannerUrl?: string;
}
