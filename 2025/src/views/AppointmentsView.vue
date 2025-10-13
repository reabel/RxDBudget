<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppointmentStore } from '../stores/appointmentStore';
import { exportAppointments, type ExportFormat } from '../utils/exportUtils';
import { importAppointments } from '../utils/importUtils';

const appointmentStore = useAppointmentStore();
const showAddModal = ref(false);
const selectedStatus = ref('all');
const fileInput = ref<HTMLInputElement | null>(null);

const statusOptions = ['all', 'scheduled', 'in-progress', 'completed', 'cancelled'];

const filteredAppointments = computed(() => {
  if (selectedStatus.value === 'all') {
    return appointmentStore.allAppointments;
  }
  return appointmentStore.allAppointments.filter(a => a.status === selectedStatus.value);
});

const newAppointment = ref({
  customerId: '1',
  customerName: '',
  vehicleId: '',
  vehicleInfo: '',
  appointmentDate: new Date(),
  estimatedDuration: 60,
  status: 'scheduled' as const,
  serviceType: '',
  description: '',
  estimatedCost: 0,
  parts: [],
  labor: [],
  notes: ''
});

function openAddModal() {
  showAddModal.value = true;
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  
  newAppointment.value = {
    customerId: '1',
    customerName: '',
    vehicleId: '',
    vehicleInfo: '',
    appointmentDate: tomorrow,
    estimatedDuration: 60,
    status: 'scheduled',
    serviceType: '',
    description: '',
    estimatedCost: 0,
    parts: [],
    labor: [],
    notes: ''
  };
}

function addAppointment() {
  appointmentStore.addAppointment(newAppointment.value);
  showAddModal.value = false;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStatusClass(status: string) {
  return status.toLowerCase().replace('-', '');
}

function handleExport(format: ExportFormat) {
  exportAppointments(appointmentStore.allAppointments, format);
}

function triggerFileInput() {
  fileInput.value?.click();
}

async function handleImport(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  try {
    const importedAppointments = await importAppointments(file);
    let addedCount = 0;
    let updatedCount = 0;
    
    // Add or update imported appointments in store
    importedAppointments.forEach(appointment => {
      const existingAppointment = appointmentStore.allAppointments.find(a => a.id === appointment.id);
      
      if (existingAppointment) {
        // Update existing appointment
        appointmentStore.updateAppointment(appointment.id, {
          customerId: appointment.customerId,
          customerName: appointment.customerName,
          vehicleId: appointment.vehicleId,
          vehicleInfo: appointment.vehicleInfo,
          appointmentDate: appointment.appointmentDate,
          estimatedDuration: appointment.estimatedDuration,
          status: appointment.status,
          serviceType: appointment.serviceType,
          description: appointment.description,
          estimatedCost: appointment.estimatedCost,
          actualCost: appointment.actualCost,
          assignedTechnician: appointment.assignedTechnician,
          parts: appointment.parts,
          labor: appointment.labor,
          notes: appointment.notes
        });
        updatedCount++;
      } else {
        // Add new appointment
        appointmentStore.addAppointment({
          customerId: appointment.customerId,
          customerName: appointment.customerName,
          vehicleId: appointment.vehicleId,
          vehicleInfo: appointment.vehicleInfo,
          appointmentDate: appointment.appointmentDate,
          estimatedDuration: appointment.estimatedDuration,
          status: appointment.status,
          serviceType: appointment.serviceType,
          description: appointment.description,
          estimatedCost: appointment.estimatedCost,
          parts: appointment.parts,
          labor: appointment.labor,
          notes: appointment.notes
        });
        addedCount++;
      }
    });

    alert(`Successfully imported ${importedAppointments.length} appointments!\n${addedCount} added, ${updatedCount} updated.`);
  } catch (error) {
    alert('Failed to import appointments. Please check the file format.');
    console.error(error);
  }

  // Reset input
  if (target) target.value = '';
}
</script>

<template>
  <div class="appointments-view">
    <div class="header">
      <h1 class="page-title">Service Appointments</h1>
      <div class="header-actions">
        <div class="export-buttons">
          <button class="btn btn-secondary" @click="handleExport('xlsx')">
            📊 Export XLSX
          </button>
          <button class="btn btn-secondary" @click="handleExport('csv')">
            📄 Export CSV
          </button>
        </div>
        <button class="btn btn-secondary" @click="triggerFileInput">
          📥 Import
        </button>
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx,.xls,.csv"
          style="display: none"
          @change="handleImport"
        />
        <button class="btn btn-primary" @click="openAddModal">
          ➕ Schedule Appointment
        </button>
      </div>
    </div>

    <div class="filters">
      <select v-model="selectedStatus" class="status-select">
        <option v-for="status in statusOptions" :key="status" :value="status">
          {{ status === 'all' ? 'All Status' : status.replace('-', ' ').toUpperCase() }}
        </option>
      </select>
    </div>

    <div class="appointments-list">
      <div
        v-for="appt in filteredAppointments"
        :key="appt.id"
        class="appointment-card"
      >
        <div class="appointment-header">
          <div class="appointment-date-block">
            <div class="date">{{ formatDate(appt.appointmentDate) }}</div>
            <div class="time">{{ formatTime(appt.appointmentDate) }}</div>
          </div>
          <div class="appointment-status" :class="getStatusClass(appt.status)">
            {{ appt.status.replace('-', ' ') }}
          </div>
        </div>
        <div class="appointment-body">
          <h3>{{ appt.serviceType }}</h3>
          <div class="appointment-info">
            <p><strong>Customer:</strong> {{ appt.customerName }}</p>
            <p><strong>Vehicle:</strong> {{ appt.vehicleInfo }}</p>
            <p><strong>Duration:</strong> {{ appt.estimatedDuration }} minutes</p>
            <p><strong>Estimated Cost:</strong> ${{ appt.estimatedCost.toFixed(2) }}</p>
            <p v-if="appt.actualCost"><strong>Actual Cost:</strong> ${{ appt.actualCost.toFixed(2) }}</p>
          </div>
          <p v-if="appt.description" class="appointment-description">{{ appt.description }}</p>
          <p v-if="appt.notes" class="appointment-notes">📝 {{ appt.notes }}</p>
        </div>
      </div>
    </div>

    <div v-if="filteredAppointments.length === 0" class="empty-state">
      <p>No appointments found</p>
    </div>

    <!-- Add Appointment Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Schedule New Appointment</h2>
          <button class="close-btn" @click="showAddModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Customer Name</label>
            <input v-model="newAppointment.customerName" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Vehicle Info</label>
            <input v-model="newAppointment.vehicleInfo" type="text" class="form-input" placeholder="e.g., 2020 Toyota Camry" required />
          </div>
          <div class="form-group">
            <label>Service Type</label>
            <input v-model="newAppointment.serviceType" type="text" class="form-input" placeholder="e.g., Oil Change" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newAppointment.description" class="form-input" rows="3"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Appointment Date & Time</label>
              <input v-model="newAppointment.appointmentDate" type="datetime-local" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Duration (minutes)</label>
              <input v-model.number="newAppointment.estimatedDuration" type="number" class="form-input" required />
            </div>
          </div>
          <div class="form-group">
            <label>Estimated Cost ($)</label>
            <input v-model.number="newAppointment.estimatedCost" type="number" step="0.01" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Notes</label>
            <textarea v-model="newAppointment.notes" class="form-input" rows="2"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showAddModal = false">Cancel</button>
          <button class="btn btn-primary" @click="addAppointment">Schedule</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appointments-view {
  padding: 1rem 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.export-buttons {
  display: flex;
  gap: 0.5rem;
}

.page-title {
  font-size: 2rem;
  margin: 0;
  color: var(--text-primary);
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.filters {
  margin-bottom: 1.5rem;
}

.status-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  min-width: 200px;
  transition: all 0.2s;
}

.status-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}

.appointments-list {
  display: grid;
  gap: 1.5rem;
}

.appointment-card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.2s;
}

.appointment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  border-color: var(--primary-color);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-darker);
  border-bottom: 1px solid var(--border-color);
}

.appointment-date-block {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.appointment-date-block .date {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.appointment-date-block .time {
  font-size: 1rem;
  color: var(--primary-color);
  font-weight: 500;
}

.appointment-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.appointment-status.scheduled {
  background: #e3f2fd;
  color: #1976d2;
}

.appointment-status.inprogress {
  background: #fff3e0;
  color: #f57c00;
}

.appointment-status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.appointment-status.cancelled {
  background: #ffebee;
  color: #c62828;
}

.appointment-status.noshow {
  background: #f3e5f5;
  color: #7b1fa2;
}

.appointment-body {
  padding: 1.5rem;
}

.appointment-body h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.appointment-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.appointment-info p {
  margin: 0.25rem 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.appointment-description {
  color: var(--text-secondary);
  margin: 1rem 0 0 0;
  padding: 1rem;
  background: var(--bg-hover);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.appointment-notes {
  color: var(--text-muted);
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
  font-size: 1.125rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .appointment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .appointment-info {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
