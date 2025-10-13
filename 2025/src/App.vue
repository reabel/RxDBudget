<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import Navigation from './components/Navigation.vue';
import { useCustomerStore } from './stores/customerStore';
import { usePartStore } from './stores/partStore';
import { useAppointmentStore } from './stores/appointmentStore';

const customerStore = useCustomerStore();
const partStore = usePartStore();
const appointmentStore = useAppointmentStore();

onMounted(() => {
  // Initialize sample data on first load
  customerStore.initSampleData();
  partStore.initSampleData();
  appointmentStore.initSampleData();
});
</script>

<template>
  <div class="app">
    <Navigation />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-dark);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>
