<script setup lang="ts">
import { computed } from 'vue';
import { useCustomerStore } from '../stores/customerStore';
import { usePartStore } from '../stores/partStore';
import { useAppointmentStore } from '../stores/appointmentStore';
import { RouterLink } from 'vue-router';

const customerStore = useCustomerStore();
const partStore = usePartStore();
const appointmentStore = useAppointmentStore();

const stats = computed(() => ({
  totalCustomers: customerStore.totalCustomers,
  totalVehicles: customerStore.totalVehicles,
  todayAppointments: appointmentStore.todayAppointments.length,
  upcomingAppointments: appointmentStore.upcomingAppointments.length,
  overdueServices: customerStore.customersWithOverdueService.length,
  lowStockItems: partStore.lowStockParts.length,
  pendingOrders: partStore.pendingOrders.length,
  totalPartsValue: partStore.totalPartsValue,
}));

const todayAppointments = computed(() => appointmentStore.todayAppointments);
const upcomingAppointments = computed(() => appointmentStore.upcomingAppointments.slice(0, 5));
</script>

<template>
  <div class="dashboard">
    <h1 class="page-title">Dashboard</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalCustomers }}</div>
          <div class="stat-label">Total Customers</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalVehicles }}</div>
          <div class="stat-label">Vehicles</div>
        </div>
      </div>

      <div class="stat-card clickable" @click="$router.push('/appointments')">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.todayAppointments }}</div>
          <div class="stat-label">Today's Appointments</div>
        </div>
      </div>

      <div class="stat-card clickable" @click="$router.push('/appointments')">
        <div class="stat-icon">⏰</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.upcomingAppointments }}</div>
          <div class="stat-label">Upcoming Appointments</div>
        </div>
      </div>

      <div class="stat-card alert clickable" @click="$router.push('/service-intervals')">
        <div class="stat-icon">🔔</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.overdueServices }}</div>
          <div class="stat-label">Overdue Services</div>
        </div>
      </div>

      <div class="stat-card warning clickable" @click="$router.push('/parts')">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.lowStockItems }}</div>
          <div class="stat-label">Low Stock Items</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingOrders }}</div>
          <div class="stat-label">Pending Orders</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-value">${{ stats.totalPartsValue.toFixed(2) }}</div>
          <div class="stat-label">Parts Inventory Value</div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="card">
        <div class="card-header">
          <h2>Today's Appointments</h2>
          <RouterLink to="/appointments" class="view-all-link">View All →</RouterLink>
        </div>
        <div class="card-body">
          <div v-if="todayAppointments.length === 0" class="empty-state">
            No appointments scheduled for today
          </div>
          <div v-else class="appointments-list">
            <div v-for="appt in todayAppointments" :key="appt.id" class="appointment-item">
              <div class="appointment-time">
                {{ new Date(appt.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
              </div>
              <div class="appointment-details">
                <div class="appointment-customer">{{ appt.customerName }}</div>
                <div class="appointment-vehicle">{{ appt.vehicleInfo }}</div>
                <div class="appointment-service">{{ appt.serviceType }}</div>
              </div>
              <div class="appointment-status" :class="appt.status">
                {{ appt.status }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Upcoming Appointments</h2>
          <RouterLink to="/appointments" class="view-all-link">View All →</RouterLink>
        </div>
        <div class="card-body">
          <div v-if="upcomingAppointments.length === 0" class="empty-state">
            No upcoming appointments
          </div>
          <div v-else class="appointments-list">
            <div v-for="appt in upcomingAppointments" :key="appt.id" class="appointment-item">
              <div class="appointment-date">
                {{ new Date(appt.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
              </div>
              <div class="appointment-details">
                <div class="appointment-customer">{{ appt.customerName }}</div>
                <div class="appointment-vehicle">{{ appt.vehicleInfo }}</div>
                <div class="appointment-service">{{ appt.serviceType }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1rem 0;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  border-color: var(--primary-color);
}

.stat-card.alert {
  border-left: 4px solid var(--primary-color);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.stat-card.warning {
  border-left: 4px solid var(--warning-color);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
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
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-darker);
}

.card-header h2 {
  font-size: 1.25rem;
  margin: 0;
  color: var(--text-primary);
}

.view-all-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.view-all-link:hover {
  color: var(--primary-light);
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.card-body {
  padding: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-hover);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.appointment-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
}

.appointment-time,
.appointment-date {
  font-weight: 600;
  color: var(--primary-color);
  min-width: 60px;
}

.appointment-details {
  flex: 1;
}

.appointment-customer {
  font-weight: 600;
  color: var(--text-primary);
}

.appointment-vehicle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.appointment-service {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.appointment-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid transparent;
}

.appointment-status.scheduled {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-color: #3b82f6;
}

.appointment-status.in-progress {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border-color: var(--warning-color);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
