import { defineStore } from 'pinia';
import type { ServiceAppointment } from '../types';

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointments: [] as ServiceAppointment[],
  }),

  getters: {
    allAppointments: (state) => state.appointments,

    appointmentById: (state) => (id: string) => {
      return state.appointments.find(a => a.id === id);
    },

    upcomingAppointments: (state) => {
      const now = new Date();
      return state.appointments
        .filter(a => a.appointmentDate >= now && a.status === 'scheduled')
        .sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime());
    },

    todayAppointments: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return state.appointments.filter(a => {
        const apptDate = new Date(a.appointmentDate);
        return apptDate >= today && apptDate < tomorrow && a.status !== 'cancelled';
      });
    },

    appointmentsByCustomer: (state) => (customerId: string) => {
      return state.appointments.filter(a => a.customerId === customerId);
    },

    appointmentsByVehicle: (state) => (vehicleId: string) => {
      return state.appointments.filter(a => a.vehicleId === vehicleId);
    },

    appointmentsByDateRange: (state) => (startDate: Date, endDate: Date) => {
      return state.appointments.filter(a => {
        const apptDate = new Date(a.appointmentDate);
        return apptDate >= startDate && apptDate <= endDate;
      });
    },

    totalRevenue: (state) => {
      return state.appointments
        .filter(a => a.status === 'completed' && a.actualCost)
        .reduce((total, a) => total + (a.actualCost || 0), 0);
    },
  },

  actions: {
    addAppointment(appointment: Omit<ServiceAppointment, 'id' | 'createdAt'>) {
      const newAppointment: ServiceAppointment = {
        ...appointment,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      this.appointments.push(newAppointment);
      return newAppointment;
    },

    updateAppointment(id: string, updates: Partial<Omit<ServiceAppointment, 'id' | 'createdAt'>>) {
      const index = this.appointments.findIndex(a => a.id === id);
      if (index !== -1) {
        this.appointments[index] = { ...this.appointments[index], ...updates } as ServiceAppointment;
      }
    },

    deleteAppointment(id: string) {
      this.appointments = this.appointments.filter(a => a.id !== id);
    },

    completeAppointment(id: string, actualCost: number) {
      const appointment = this.appointments.find(a => a.id === id);
      if (appointment) {
        appointment.status = 'completed';
        appointment.actualCost = actualCost;
        appointment.completedAt = new Date();
      }
    },

    cancelAppointment(id: string) {
      const appointment = this.appointments.find(a => a.id === id);
      if (appointment) {
        appointment.status = 'cancelled';
      }
    },

    markNoShow(id: string) {
      const appointment = this.appointments.find(a => a.id === id);
      if (appointment) {
        appointment.status = 'no-show';
      }
    },

    // Initialize with sample data
    initSampleData() {
      this.appointments = [
        {
          id: '1',
          customerId: '1',
          customerName: 'John Doe',
          vehicleId: 'v1',
          vehicleInfo: '2020 Toyota Camry',
          appointmentDate: new Date(Date.now() + 86400000), // Tomorrow
          estimatedDuration: 60,
          status: 'scheduled',
          serviceType: 'Oil Change',
          description: 'Regular oil change service',
          estimatedCost: 75.00,
          parts: [],
          labor: [
            {
              id: 'l1',
              description: 'Oil change service',
              hours: 0.5,
              ratePerHour: 100,
              totalCost: 50,
            },
          ],
          notes: 'Customer prefers synthetic oil',
          createdAt: new Date('2024-10-10'),
        },
        {
          id: '2',
          customerId: '1',
          customerName: 'John Doe',
          vehicleId: 'v1',
          vehicleInfo: '2020 Toyota Camry',
          appointmentDate: new Date(), // Today
          estimatedDuration: 120,
          status: 'in-progress',
          serviceType: 'Brake Service',
          description: 'Brake pad replacement',
          estimatedCost: 350.00,
          actualCost: 325.00,
          parts: [
            {
              partId: '3',
              partNumber: 'BRAKE-001',
              partName: 'Brake Pads',
              quantity: 1,
              unitPrice: 89.00,
              totalPrice: 89.00,
            },
          ],
          labor: [
            {
              id: 'l2',
              description: 'Brake pad replacement',
              hours: 2,
              ratePerHour: 100,
              totalCost: 200,
            },
          ],
          notes: '',
          createdAt: new Date('2024-10-11'),
        },
      ];
    },
  },
});
