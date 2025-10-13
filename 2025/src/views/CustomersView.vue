<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCustomerStore } from '../stores/customerStore';
import { exportCustomers, type ExportFormat } from '../utils/exportUtils';
import { importCustomers } from '../utils/importUtils';

const customerStore = useCustomerStore();
const searchTerm = ref('');
const showAddModal = ref(false);
const selectedCustomer = ref(null as any);
const fileInput = ref<HTMLInputElement | null>(null);

const filteredCustomers = computed(() => {
  if (!searchTerm.value) return customerStore.allCustomers;
  const term = searchTerm.value.toLowerCase();
  return customerStore.allCustomers.filter(customer =>
    customer.firstName.toLowerCase().includes(term) ||
    customer.lastName.toLowerCase().includes(term) ||
    customer.email.toLowerCase().includes(term) ||
    customer.phone.includes(term)
  );
});

const newCustomer = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  vehicles: []
});

function openAddModal() {
  showAddModal.value = true;
  newCustomer.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    vehicles: []
  };
}

function addCustomer() {
  customerStore.addCustomer(newCustomer.value);
  showAddModal.value = false;
}

function viewCustomer(customer: any) {
  selectedCustomer.value = customer;
}

function closeDetails() {
  selectedCustomer.value = null;
}

function handleExport(format: ExportFormat) {
  exportCustomers(customerStore.allCustomers, format);
}

function triggerFileInput() {
  fileInput.value?.click();
}

async function handleImport(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  try {
    const importedCustomers = await importCustomers(file);
    let addedCount = 0;
    let updatedCount = 0;
    
    // Add or update imported customers in store
    importedCustomers.forEach(customer => {
      const existingCustomer = customerStore.allCustomers.find(c => c.id === customer.id);
      
      if (existingCustomer) {
        // Update existing customer
        customerStore.updateCustomer(customer.id, {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          vehicles: customer.vehicles
        });
        updatedCount++;
      } else {
        // Add new customer
        customerStore.addCustomer({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          vehicles: customer.vehicles
        });
        addedCount++;
      }
    });

    alert(`Successfully imported ${importedCustomers.length} customers!\n${addedCount} added, ${updatedCount} updated.`);
  } catch (error) {
    alert('Failed to import customers. Please check the file format.');
    console.error(error);
  }

  // Reset input
  if (target) target.value = '';
}
</script>

<template>
  <div class="customers-view">
    <div class="header">
      <h1 class="page-title">Customer Management</h1>
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
          ➕ Add Customer
        </button>
      </div>
    </div>

    <div class="search-bar">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="🔍 Search customers by name, email, or phone..."
        class="search-input"
      />
    </div>

    <div class="customers-grid">
      <div
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="customer-card"
        @click="viewCustomer(customer)"
      >
        <div class="customer-header">
          <div class="customer-icon">👤</div>
          <div class="customer-info">
            <h3>{{ customer.firstName }} {{ customer.lastName }}</h3>
            <p class="customer-email">{{ customer.email }}</p>
          </div>
        </div>
        <div class="customer-details">
          <p><strong>Phone:</strong> {{ customer.phone }}</p>
          <p><strong>Vehicles:</strong> {{ customer.vehicles.length }}</p>
          <p class="customer-address">{{ customer.address }}</p>
        </div>
      </div>
    </div>

    <div v-if="filteredCustomers.length === 0" class="empty-state">
      <p>No customers found</p>
    </div>

    <!-- Add Customer Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Add New Customer</h2>
          <button class="close-btn" @click="showAddModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="newCustomer.firstName" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="newCustomer.lastName" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="newCustomer.email" type="email" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input v-model="newCustomer.phone" type="tel" class="form-input" required />
          </div>
          <div class="form-group">
            <label>Address</label>
            <textarea v-model="newCustomer.address" class="form-input" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showAddModal = false">Cancel</button>
          <button class="btn btn-primary" @click="addCustomer">Add Customer</button>
        </div>
      </div>
    </div>

    <!-- Customer Details Modal -->
    <div v-if="selectedCustomer" class="modal-overlay" @click.self="closeDetails">
      <div class="modal large">
        <div class="modal-header">
          <h2>{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</h2>
          <button class="close-btn" @click="closeDetails">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> {{ selectedCustomer.email }}</p>
            <p><strong>Phone:</strong> {{ selectedCustomer.phone }}</p>
            <p><strong>Address:</strong> {{ selectedCustomer.address }}</p>
          </div>
          <div class="detail-section">
            <h3>Vehicles ({{ selectedCustomer.vehicles.length }})</h3>
            <div v-if="selectedCustomer.vehicles.length === 0" class="empty-state-small">
              No vehicles registered
            </div>
            <div v-else class="vehicles-list">
              <div v-for="vehicle in selectedCustomer.vehicles" :key="vehicle.id" class="vehicle-item">
                <div class="vehicle-icon">🚗</div>
                <div class="vehicle-info">
                  <h4>{{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}</h4>
                  <p><strong>VIN:</strong> {{ vehicle.vin }}</p>
                  <p><strong>License:</strong> {{ vehicle.licensePlate }}</p>
                  <p><strong>Mileage:</strong> {{ vehicle.mileage.toLocaleString() }} miles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDetails">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customers-view {
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

.search-bar {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg-card);
  color: var(--text-primary);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}

.customers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.customer-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s;
}

.customer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  border-color: var(--primary-color);
}

.customer-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.customer-icon {
  font-size: 3rem;
}

.customer-info h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.customer-email {
  color: var(--primary-color);
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.customer-details {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.customer-details p {
  margin: 0.5rem 0;
}

.customer-address {
  color: var(--text-muted);
  margin-top: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
  font-size: 1.125rem;
}

.empty-state-small {
  padding: 1rem;
  text-align: center;
  color: var(--text-muted);
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
  background: var(--bg-card);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  border: 1px solid var(--border-color);
}

.modal.large {
  max-width: 800px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-darker);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
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
  background: var(--bg-hover);
  color: var(--primary-color);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: var(--bg-darker);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg-darker);
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
}

.detail-section p {
  margin: 0.5rem 0;
  color: var(--text-secondary);
}

.vehicles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vehicle-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-hover);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.vehicle-icon {
  font-size: 2rem;
}

.vehicle-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.vehicle-info p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .customers-grid {
    grid-template-columns: 1fr;
  }
}
</style>
