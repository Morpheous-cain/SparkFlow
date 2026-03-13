
export type VehicleStatus = 'Queue' | 'In-Bay' | 'Ready' | 'Completed';
export type BayStatus = 'Available' | 'Occupied' | 'Under Maintenance';
export type DeliveryStatus = 'Booking' | 'Pickup' | 'Processing' | 'Drying' | 'Delivery' | 'Completed';
export type SubscriptionTier = 'None' | 'Silver' | 'Gold' | 'Platinum';
export type SaaSPlan = 'Basic' | 'Professional' | 'Enterprise';

export interface Tenant {
  id: string;
  name: string;
  plan: SaaSPlan;
  status: 'Active' | 'Suspended' | 'Trial';
  subscriptionExpiry: string;
  ownerUid: string;
  location: string;
  revenueMTD: number;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  price: number;
  duration: number;
  category: 'Wash' | 'Detailing' | 'Tinting';
  usp?: string; // Unique Selling Point
}

export interface ServiceBundle {
  id: string;
  name: string;
  services: string[];
  price: number;
  saving: number;
  incentive: string;
  usp: string;
}

export interface Staff {
  id: string;
  tenantId: string;
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

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  wholesale: number;
  retail: number;
  velocity: 'Fast' | 'Normal' | 'Slow';
  margin: number;
}

export interface VehicleLive {
  plate: string;
  tenantId: string;
  status: VehicleStatus;
  arrivalTime: string;
  bayId: string | null;
  attendantId: string | null;
  services: string[];
  totalAmount: number;
  progress?: number;
}

export interface Bay {
  id: string;
  tenantId: string;
  name: string;
  status: BayStatus;
  currentVehiclePlate?: string;
}

export interface LogisticsRequest {
  id: string;
  tenantId: string;
  customerName: string;
  itemType: string;
  status: DeliveryStatus;
  address: string;
  requestTime: string;
  amount: number;
}
