<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useCustomerStore } from '../stores/customerStore';
import { usePartStore } from '../stores/partStore';
import { useAppointmentStore } from '../stores/appointmentStore';
import { computed } from 'vue';

const customerStore = useCustomerStore();
const partStore = usePartStore();
const appointmentStore = useAppointmentStore();

const overdueCount = computed(() => customerStore.customersWithOverdueService.length);
const lowStockCount = computed(() => partStore.lowStockParts.length);
const todayAppointmentCount = computed(() => appointmentStore.todayAppointments.length);
</script>

<template>
  <nav class="navigation">
    <div class="nav-container">
      <div class="nav-brand">
        <h1>🔧 Garage Manager</h1>
      </div>
      <ul class="nav-links">
        <li>
          <RouterLink to="/" class="nav-link">
            📊 Dashboard
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/customers" class="nav-link">
            👥 Customers
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/parts" class="nav-link">
            📦 Parts
            <span v-if="lowStockCount > 0" class="badge">{{ lowStockCount }}</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/appointments" class="nav-link">
            📅 Appointments
            <span v-if="todayAppointmentCount > 0" class="badge">{{ todayAppointmentCount }}</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/service-intervals" class="nav-link">
            🔔 Service Alerts
            <span v-if="overdueCount > 0" class="badge alert">{{ overdueCount }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navigation {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-bottom: 2px solid var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h1 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin: 0;
  padding: 1rem 0;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
  position: relative;
  border: 1px solid transparent;
}

.nav-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.nav-link.router-link-active {
  background: var(--bg-card);
  color: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
}

.badge {
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
}

.badge.alert {
  animation: pulse 2s infinite;
  background: var(--primary-dark);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    padding: 1rem;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
