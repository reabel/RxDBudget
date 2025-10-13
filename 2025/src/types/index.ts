// Customer and Vehicle Types
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  mileage: number;
  lastServiceDate?: Date;
  lastServiceMileage?: number;
  serviceIntervals: ServiceInterval[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  vehicles: Vehicle[];
  createdAt: Date;
}

// Service Interval Types
export interface ServiceInterval {
  id: string;
  name: string;
  description: string;
  intervalMiles: number;
  intervalMonths: number;
  lastPerformedDate?: Date;
  lastPerformedMileage?: number;
  nextDueDate?: Date;
  nextDueMileage?: number;
  isOverdue: boolean;
  hasScheduledAppointment: boolean;
}

// Parts and Inventory Types
export interface Part {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  cost: number;
  retailPrice: number;
  quantityInStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  supplier: string;
  location: string;
}

export interface PartOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  status: 'pending' | 'ordered' | 'in-transit' | 'received' | 'cancelled';
  items: PartOrderItem[];
  totalCost: number;
  notes: string;
}

export interface PartOrderItem {
  partId: string;
  partNumber: string;
  partName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

// Service Appointment Types
export interface ServiceAppointment {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleInfo: string;
  appointmentDate: Date;
  estimatedDuration: number; // in minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  serviceType: string;
  description: string;
  assignedTechnician?: string;
  estimatedCost: number;
  actualCost?: number;
  parts: AppointmentPart[];
  labor: LaborItem[];
  notes: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface AppointmentPart {
  partId: string;
  partNumber: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface LaborItem {
  id: string;
  description: string;
  hours: number;
  ratePerHour: number;
  totalCost: number;
}

// Dashboard Statistics
export interface DashboardStats {
  totalCustomers: number;
  totalVehicles: number;
  todayAppointments: number;
  weekAppointments: number;
  overdueServiceIntervals: number;
  lowStockItems: number;
  pendingOrders: number;
  monthlyRevenue: number;
}

// Filter and Search Types
export interface CustomerFilter {
  searchTerm?: string;
  hasOverdueService?: boolean;
  hasUpcomingAppointment?: boolean;
}

export interface PartFilter {
  searchTerm?: string;
  category?: string;
  lowStock?: boolean;
  supplier?: string;
}

export interface AppointmentFilter {
  startDate?: Date;
  endDate?: Date;
  status?: ServiceAppointment['status'];
  customerId?: string;
  technician?: string;
}
