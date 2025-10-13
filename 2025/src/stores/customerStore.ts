import { defineStore } from 'pinia';
import type { Customer, Vehicle, ServiceInterval } from '../types';

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [] as Customer[],
    selectedCustomer: null as Customer | null,
  }),

  getters: {
    allCustomers: (state) => state.customers,
    
    customerById: (state) => (id: string) => {
      return state.customers.find(c => c.id === id);
    },

    customersWithOverdueService: (state) => {
      return state.customers.filter(customer =>
        customer.vehicles.some(vehicle =>
          vehicle.serviceIntervals.some(interval => interval.isOverdue)
        )
      );
    },

    totalCustomers: (state) => state.customers.length,

    totalVehicles: (state) => {
      return state.customers.reduce((total, customer) => total + customer.vehicles.length, 0);
    },
  },

  actions: {
    addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>) {
      const newCustomer: Customer = {
        ...customer,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      this.customers.push(newCustomer);
      return newCustomer;
    },

    updateCustomer(id: string, updates: Partial<Omit<Customer, 'id' | 'createdAt'>>) {
      const index = this.customers.findIndex(c => c.id === id);
      if (index !== -1) {
        this.customers[index] = { ...this.customers[index], ...updates } as Customer;
      }
    },

    deleteCustomer(id: string) {
      this.customers = this.customers.filter(c => c.id !== id);
    },

    addVehicleToCustomer(customerId: string, vehicle: Omit<Vehicle, 'id' | 'serviceIntervals'>) {
      const customer = this.customers.find(c => c.id === customerId);
      if (customer) {
        const newVehicle: Vehicle = {
          ...vehicle,
          id: crypto.randomUUID(),
          serviceIntervals: this.getDefaultServiceIntervals(),
        };
        customer.vehicles.push(newVehicle);
      }
    },

    updateVehicle(customerId: string, vehicleId: string, updates: Partial<Omit<Vehicle, 'id'>>) {
      const customer = this.customers.find(c => c.id === customerId);
      if (customer) {
        const vehicleIndex = customer.vehicles.findIndex(v => v.id === vehicleId);
        if (vehicleIndex !== -1) {
          customer.vehicles[vehicleIndex] = {
            ...customer.vehicles[vehicleIndex],
            ...updates,
          } as Vehicle;
        }
      }
    },

    updateServiceInterval(customerId: string, vehicleId: string, intervalId: string, updates: Partial<Omit<ServiceInterval, 'id'>>) {
      const customer = this.customers.find(c => c.id === customerId);
      if (customer) {
        const vehicle = customer.vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
          const intervalIndex = vehicle.serviceIntervals.findIndex(i => i.id === intervalId);
          if (intervalIndex !== -1) {
            vehicle.serviceIntervals[intervalIndex] = {
              ...vehicle.serviceIntervals[intervalIndex],
              ...updates,
            } as ServiceInterval;
          }
        }
      }
    },

    getDefaultServiceIntervals(): ServiceInterval[] {
      return [
        {
          id: crypto.randomUUID(),
          name: 'Oil Change',
          description: 'Regular oil and filter change',
          intervalMiles: 5000,
          intervalMonths: 6,
          isOverdue: false,
          hasScheduledAppointment: false,
        },
        {
          id: crypto.randomUUID(),
          name: 'Tire Rotation',
          description: 'Rotate tires for even wear',
          intervalMiles: 7500,
          intervalMonths: 6,
          isOverdue: false,
          hasScheduledAppointment: false,
        },
        {
          id: crypto.randomUUID(),
          name: 'Air Filter',
          description: 'Replace engine air filter',
          intervalMiles: 15000,
          intervalMonths: 12,
          isOverdue: false,
          hasScheduledAppointment: false,
        },
        {
          id: crypto.randomUUID(),
          name: 'Brake Inspection',
          description: 'Inspect brake pads and rotors',
          intervalMiles: 12000,
          intervalMonths: 12,
          isOverdue: false,
          hasScheduledAppointment: false,
        },
      ];
    },

    selectCustomer(id: string | null) {
      this.selectedCustomer = id ? this.customerById(id) || null : null;
    },

    // Initialize with sample data for development
    initSampleData() {
      this.customers = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          address: '123 Main St, Anytown, USA',
          createdAt: new Date('2024-01-15'),
          vehicles: [
            {
              id: 'v1',
              make: 'Toyota',
              model: 'Camry',
              year: 2020,
              vin: '1HGBH41JXMN109186',
              licensePlate: 'ABC123',
              mileage: 45000,
              lastServiceDate: new Date('2024-08-15'),
              lastServiceMileage: 43000,
              serviceIntervals: [
                {
                  id: 'si1',
                  name: 'Oil Change',
                  description: 'Regular oil and filter change',
                  intervalMiles: 5000,
                  intervalMonths: 6,
                  lastPerformedDate: new Date('2024-08-15'),
                  lastPerformedMileage: 43000,
                  nextDueDate: new Date('2025-02-15'),
                  nextDueMileage: 48000,
                  isOverdue: true,
                  hasScheduledAppointment: false,
                },
              ],
            },
          ],
        },
      ];
    },
  },
});
