<script setup lang="ts">
import { computed } from 'vue';
import { useCustomerStore } from '../stores/customerStore';
import { RouterLink } from 'vue-router';

const customerStore = useCustomerStore();

interface ServiceAlert {
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleInfo: string;
  intervalId: string;
  intervalName: string;
  intervalDescription: string;
  nextDueDate?: Date;
  nextDueMileage?: number;
  currentMileage: number;
  isOverdue: boolean;
  hasScheduledAppointment: boolean;
  daysOverdue?: number;
  milesOverdue?: number;
}

const serviceAlerts = computed((): ServiceAlert[] => {
  const alerts: ServiceAlert[] = [];
  const now = new Date();

  customerStore.allCustomers.forEach(customer => {
    customer.vehicles.forEach(vehicle => {
      vehicle.serviceIntervals.forEach(interval => {
        // Check if service is overdue or due soon (within 30 days or 1000 miles)
        let isOverdue = false;
        let daysOverdue = 0;
        let milesOverdue = 0;

        if (interval.nextDueDate) {
          const daysUntilDue = Math.floor((interval.nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          isOverdue = daysUntilDue < 0;
          daysOverdue = Math.abs(daysUntilDue);
        }

        if (interval.nextDueMileage) {
          const milesUntilDue = interval.nextDueMileage - vehicle.mileage;
          if (milesUntilDue < 0) {
            isOverdue = true;
            milesOverdue = Math.abs(milesUntilDue);
          }
        }

        // Include if overdue or due within 30 days/1000 miles
        const isDueSoon = interval.nextDueDate && 
          Math.floor((interval.nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) <= 30;
        const isDueSoonMiles = interval.nextDueMileage && 
          (interval.nextDueMileage - vehicle.mileage) <= 1000;

        if (isOverdue || isDueSoon || isDueSoonMiles) {
          alerts.push({
            customerId: customer.id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            vehicleId: vehicle.id,
            vehicleInfo: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            intervalId: interval.id,
            intervalName: interval.name,
            intervalDescription: interval.description,
            nextDueDate: interval.nextDueDate,
            nextDueMileage: interval.nextDueMileage,
            currentMileage: vehicle.mileage,
            isOverdue,
            hasScheduledAppointment: interval.hasScheduledAppointment,
            daysOverdue,
            milesOverdue
          });
        }
      });
    });
  });

  // Sort by priority: overdue first, then by due date
  return alerts.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    if (a.hasScheduledAppointment && !b.hasScheduledAppointment) return 1;
    if (!a.hasScheduledAppointment && b.hasScheduledAppointment) return -1;
    if (a.nextDueDate && b.nextDueDate) {
      return a.nextDueDate.getTime() - b.nextDueDate.getTime();
    }
    return 0;
  });
});

const overdueAlerts = computed(() => serviceAlerts.value.filter(a => a.isOverdue));
const upcomingAlerts = computed(() => serviceAlerts.value.filter(a => !a.isOverdue));
const unscheduledAlerts = computed(() => serviceAlerts.value.filter(a => !a.hasScheduledAppointment));

function getDaysUntilDue(dueDate?: Date): number {
  if (!dueDate) return 999;
  const now = new Date();
  return Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getMilesUntilDue(currentMileage: number, dueMileage?: number): number {
  if (!dueMileage) return 999;
  return dueMileage - currentMileage;
}

function formatDate(date?: Date): string {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
</script>

<template>
  <div class="service-intervals-view">
    <h1 class="page-title">Service Interval Notifications</h1>

    <div class="stats-row">
      <div class="stat-card alert">
        <div class="stat-icon">🔴</div>
        <div class="stat-content">
          <div class="stat-value">{{ overdueAlerts.length }}</div>
          <div class="stat-label">Overdue Services</div>
        </div>
      </div>
      <div class="stat-card warning">
        <div class="stat-icon">🟡</div>
        <div class="stat-content">
          <div class="stat-value">{{ upcomingAlerts.length }}</div>
          <div class="stat-label">Due Soon</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-value">{{ unscheduledAlerts.length }}</div>
          <div class="stat-label">Not Scheduled</div>
        </div>
      </div>
    </div>

    <div v-if="serviceAlerts.length === 0" class="empty-state success">
      <div class="success-icon">✅</div>
      <h2>All Services Up to Date!</h2>
      <p>No service intervals are overdue or due soon.</p>
    </div>

    <div v-else class="alerts-container">
      <!-- Overdue Section -->
      <div v-if="overdueAlerts.length > 0" class="section">
        <h2 class="section-title alert">
          🔴 Overdue Services ({{ overdueAlerts.length }})
        </h2>
        <div class="alerts-list">
          <div
            v-for="alert in overdueAlerts"
            :key="`${alert.vehicleId}-${alert.intervalId}`"
            class="alert-card overdue"
          >
            <div class="alert-header">
              <div class="alert-title">
                <h3>{{ alert.intervalName }}</h3>
                <span v-if="!alert.hasScheduledAppointment" class="badge danger">Not Scheduled</span>
                <span v-else class="badge scheduled">Scheduled</span>
              </div>
              <div class="alert-overdue">
                <div v-if="alert.daysOverdue && alert.daysOverdue > 0" class="overdue-text">
                  {{ alert.daysOverdue }} days overdue
                </div>
                <div v-if="alert.milesOverdue && alert.milesOverdue > 0" class="overdue-text">
                  {{ alert.milesOverdue }} miles overdue
                </div>
              </div>
            </div>
            <div class="alert-body">
              <p class="alert-description">{{ alert.intervalDescription }}</p>
              <div class="alert-details">
                <div class="detail-row">
                  <strong>Customer:</strong> {{ alert.customerName }}
                </div>
                <div class="detail-row">
                  <strong>Vehicle:</strong> {{ alert.vehicleInfo }}
                </div>
                <div class="detail-row">
                  <strong>Current Mileage:</strong> {{ alert.currentMileage.toLocaleString() }} miles
                </div>
                <div v-if="alert.nextDueMileage" class="detail-row">
                  <strong>Due at Mileage:</strong> {{ alert.nextDueMileage.toLocaleString() }} miles
                </div>
                <div v-if="alert.nextDueDate" class="detail-row">
                  <strong>Due Date:</strong> {{ formatDate(alert.nextDueDate) }}
                </div>
              </div>
            </div>
            <div class="alert-footer">
              <RouterLink :to="`/appointments`" class="btn btn-primary">
                Schedule Appointment
              </RouterLink>
              <RouterLink :to="`/customers`" class="btn btn-secondary">
                View Customer
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Section -->
      <div v-if="upcomingAlerts.length > 0" class="section">
        <h2 class="section-title warning">
          🟡 Due Soon ({{ upcomingAlerts.length }})
        </h2>
        <div class="alerts-list">
          <div
            v-for="alert in upcomingAlerts"
            :key="`${alert.vehicleId}-${alert.intervalId}`"
            class="alert-card upcoming"
          >
            <div class="alert-header">
              <div class="alert-title">
                <h3>{{ alert.intervalName }}</h3>
                <span v-if="!alert.hasScheduledAppointment" class="badge warning">Not Scheduled</span>
                <span v-else class="badge scheduled">Scheduled</span>
              </div>
              <div class="alert-due">
                <div v-if="alert.nextDueDate" class="due-text">
                  Due in {{ getDaysUntilDue(alert.nextDueDate) }} days
                </div>
                <div v-if="alert.nextDueMileage" class="due-text">
                  {{ getMilesUntilDue(alert.currentMileage, alert.nextDueMileage) }} miles remaining
                </div>
              </div>
            </div>
            <div class="alert-body">
              <p class="alert-description">{{ alert.intervalDescription }}</p>
              <div class="alert-details">
                <div class="detail-row">
                  <strong>Customer:</strong> {{ alert.customerName }}
                </div>
                <div class="detail-row">
                  <strong>Vehicle:</strong> {{ alert.vehicleInfo }}
                </div>
                <div class="detail-row">
                  <strong>Current Mileage:</strong> {{ alert.currentMileage.toLocaleString() }} miles
                </div>
                <div v-if="alert.nextDueMileage" class="detail-row">
                  <strong>Due at Mileage:</strong> {{ alert.nextDueMileage.toLocaleString() }} miles
                </div>
                <div v-if="alert.nextDueDate" class="detail-row">
                  <strong>Due Date:</strong> {{ formatDate(alert.nextDueDate) }}
                </div>
              </div>
            </div>
            <div class="alert-footer">
              <RouterLink :to="`/appointments`" class="btn btn-primary">
                Schedule Appointment
              </RouterLink>
              <RouterLink :to="`/customers`" class="btn btn-secondary">
                View Customer
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-intervals-view {
  padding: 1rem 0;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card.alert {
  border-left: 4px solid #ff6b6b;
}

.stat-card.warning {
  border-left: 4px solid #ffa500;
}

.stat-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state.success {
  border: 3px solid #4caf50;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  color: #4caf50;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #666;
  font-size: 1.125rem;
}

.alerts-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #e0e0e0;
  color: #333;
}

.section-title.alert {
  border-bottom-color: #ff6b6b;
  color: #c62828;
}

.section-title.warning {
  border-bottom-color: #ffa500;
  color: #f57c00;
}

.alerts-list {
  display: grid;
  gap: 1.5rem;
}

.alert-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s;
}

.alert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.alert-card.overdue {
  border-left: 5px solid #ff6b6b;
}

.alert-card.upcoming {
  border-left: 5px solid #ffa500;
}

.alert-header {
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.alert-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.alert-title h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.danger {
  background: #ffebee;
  color: #c62828;
  animation: pulse 2s infinite;
}

.badge.warning {
  background: #fff3e0;
  color: #f57c00;
}

.badge.scheduled {
  background: #e3f2fd;
  color: #1976d2;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.alert-overdue,
.alert-due {
  text-align: right;
}

.overdue-text {
  color: #c62828;
  font-weight: 600;
  font-size: 0.875rem;
}

.due-text {
  color: #f57c00;
  font-weight: 600;
  font-size: 0.875rem;
}

.alert-body {
  padding: 1.5rem;
}

.alert-description {
  color: #666;
  margin: 0 0 1rem 0;
}

.alert-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
}

.detail-row {
  color: #666;
  font-size: 0.875rem;
}

.detail-row strong {
  color: #333;
}

.alert-footer {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  border: 1px solid var(--primary-color);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6);
  border-color: var(--primary-light);
}

.btn-secondary {
  background: var(--bg-hover);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.btn-secondary:hover {
  background: var(--bg-card);
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .alert-header {
    flex-direction: column;
    gap: 1rem;
  }

  .alert-overdue,
  .alert-due {
    text-align: left;
  }

  .alert-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .alert-details {
    grid-template-columns: 1fr;
  }
}
</style>
