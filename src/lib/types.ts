
export type VehicleStatus = 'Queue' | 'In-Bay' | 'Ready' | 'Completed';
export type BayStatus = 'Available' | 'Occupied' | 'Under Maintenance';
export type DeliveryStatus = 'Booking' | 'Pickup' | 'Processing' | 'Drying' | 'Delivery' | 'Completed';
export type SubscriptionTier = 'None' | 'Silver' | 'Gold' | 'Platinum';
export type SaaSPlan = 'Basic' | 'Professional' | 'Enterprise';
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'On-Leave';

export interface Tenant {
  id: string;
  name: string;
  logoUrl?: string;
  plan: SaaSPlan;
  status: 'Active' | 'Suspended' | 'Trial';
  subscriptionExpiry: string;
  ownerUid: string;
  location: string;
  revenueMTD: number;
  smsBalance: number;
  branchesCount: number;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  location: string;
  managerName: string;
  status: 'Open' | 'Closed' | 'Limited';
  activeBays: number;
  revenueMTD: number;
  phone: string;
  waterLevel: number; // Percentage 0-100 from ultrasonic sensor
  waterCapacity: number; // Liters
  pumpPressure: number; // PSI
  detergentLevel: number; // Percentage
  staffing: {
    current: number;
    required: number;
  };
  essentialMaterialsLow: number;
}

export interface Staff {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  role: 'Agent' | 'Attendant' | 'Manager' | 'Driver' | 'Technician';
  performance: number; // 0-5 scale
  rating: number; // Customer rating 0-5
  attendanceStatus: AttendanceStatus;
  lastClockIn?: string;
  points: number; // Reward SparkPoints
  earnings: {
    base: number;
    commission: number;
    tips: number;
    total: number;
  };
  isEmployeeOfMonth?: boolean;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  month: string;
  baseAmount: number;
  commission: number;
  deductions: number;
  netPay: number;
  status: 'Draft' | 'Approved' | 'Disbursed';
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  type: 'Direct' | 'Indirect' | 'Petty Cash';
  branchId: string;
}

export interface ChartOfAccount {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  price: number;
  duration: number;
  category: 'Wash' | 'Detailing' | 'Tinting' | 'Home' | 'Merchandise';
  usp?: string; 
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

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  wholesale: number;
  retail: number;
  velocity: 'Fast' | 'Normal' | 'Slow';
  margin: number;
  isEssential: boolean;
}

export interface VehicleLive {
  plate: string;
  tenantId: string;
  branchId: string;
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
  branchId: string;
  name: string;
  status: BayStatus;
  currentVehiclePlate?: string;
}

export interface LogisticsRequest {
  id: string;
  tenantId: string;
  branchId: string;
  customerName: string;
  itemType: string;
  status: DeliveryStatus;
  address: string;
  requestTime: string;
  amount: number;
  pickupWindow?: string;
  qrTag?: string;
  trackingProgress?: number;
  assignedStaffId?: string;
}

export interface Transaction {
  id: string;
  plate: string;
  amount: number;
  status: 'Paid' | 'Pending';
  receipt: string | null;
  duration: number;
  date: string;
  branchId: string;
  paymentMethod: 'M-Pesa' | 'Cash' | 'Card';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
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
  status: 'Active' | 'Expired';
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}
