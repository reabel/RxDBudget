<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCustomerStore } from '../stores/customerStore';

const customerStore = useCustomerStore();
const searchTerm = ref('');
const showAddModal = ref(false);
const selectedCustomer = ref(null as any);

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
</script>

<template>
  <div class="customers-view">
    <div class="header">
      <h1 class="page-title">Customer Management</h1>
      <button class="btn btn-primary" @click="openAddModal">
        ➕ Add Customer
      </button>
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
}

.page-title {
  font-size: 2rem;
  margin: 0;
  color: #333;
}

.search-bar {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.customers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.customer-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.customer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
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
  color: #333;
}

.customer-email {
  color: #667eea;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.customer-details {
  font-size: 0.875rem;
  color: #666;
}

.customer-details p {
  margin: 0.5rem 0;
}

.customer-address {
  color: #999;
  margin-top: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
  font-size: 1.125rem;
}

.empty-state-small {
  padding: 1rem;
  text-align: center;
  color: #999;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal.large {
  max-width: 800px;
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

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  font-size: 1.125rem;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #667eea;
}

.detail-section p {
  margin: 0.5rem 0;
  color: #666;
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
  background: #f8f9fa;
  border-radius: 8px;
}

.vehicle-icon {
  font-size: 2rem;
}

.vehicle-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.vehicle-info p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #666;
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
