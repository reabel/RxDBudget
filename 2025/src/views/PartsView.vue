<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePartStore } from '../stores/partStore';

const partStore = usePartStore();
const searchTerm = ref('');
const showAddModal = ref(false);
const selectedCategory = ref('all');

const categories = computed(() => {
  const cats = new Set(partStore.allParts.map(p => p.category));
  return ['all', ...Array.from(cats)];
});

const filteredParts = computed(() => {
  let parts = partStore.allParts;
  
  if (selectedCategory.value !== 'all') {
    parts = parts.filter(p => p.category === selectedCategory.value);
  }
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    parts = parts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.partNumber.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }
  
  return parts;
});

const newPart = ref({
  partNumber: '',
  name: '',
  description: '',
  category: '',
  manufacturer: '',
  cost: 0,
  retailPrice: 0,
  quantityInStock: 0,
  reorderLevel: 0,
  reorderQuantity: 0,
  supplier: '',
  location: ''
});

function openAddModal() {
  showAddModal.value = true;
  newPart.value = {
    partNumber: '',
    name: '',
    description: '',
    category: '',
    manufacturer: '',
    cost: 0,
    retailPrice: 0,
    quantityInStock: 0,
    reorderLevel: 0,
    reorderQuantity: 0,
    supplier: '',
    location: ''
  };
}

function addPart() {
  partStore.addPart(newPart.value);
  showAddModal.value = false;
}

function getStockStatus(part: any) {
  if (part.quantityInStock === 0) return 'out-of-stock';
  if (part.quantityInStock <= part.reorderLevel) return 'low-stock';
  return 'in-stock';
}

function getStockLabel(part: any) {
  if (part.quantityInStock === 0) return 'Out of Stock';
  if (part.quantityInStock <= part.reorderLevel) return 'Low Stock';
  return 'In Stock';
}
</script>

<template>
  <div class="parts-view">
    <div class="header">
      <h1 class="page-title">Parts Inventory</h1>
      <button class="btn btn-primary" @click="openAddModal">
        ➕ Add Part
      </button>
    </div>

    <div class="filters">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="🔍 Search parts..."
        class="search-input"
      />
      <select v-model="selectedCategory" class="category-select">
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat === 'all' ? 'All Categories' : cat }}
        </option>
      </select>
    </div>

    <div class="stats-row">
      <div class="stat-badge">
        Total Parts: <strong>{{ partStore.allParts.length }}</strong>
      </div>
      <div class="stat-badge warning">
        Low Stock: <strong>{{ partStore.lowStockParts.length }}</strong>
      </div>
      <div class="stat-badge">
        Total Value: <strong>${{ partStore.totalPartsValue.toFixed(2) }}</strong>
      </div>
    </div>

    <div class="parts-table-container">
      <table class="parts-table">
        <thead>
          <tr>
            <th>Part Number</th>
            <th>Name</th>
            <th>Category</th>
            <th>Manufacturer</th>
            <th>Cost</th>
            <th>Retail Price</th>
            <th>In Stock</th>
            <th>Status</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="part in filteredParts" :key="part.id" :class="getStockStatus(part)">
            <td><strong>{{ part.partNumber }}</strong></td>
            <td>{{ part.name }}</td>
            <td>{{ part.category }}</td>
            <td>{{ part.manufacturer }}</td>
            <td>${{ part.cost.toFixed(2) }}</td>
            <td>${{ part.retailPrice.toFixed(2) }}</td>
            <td>{{ part.quantityInStock }}</td>
            <td>
              <span class="stock-badge" :class="getStockStatus(part)">
                {{ getStockLabel(part) }}
              </span>
            </td>
            <td>{{ part.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredParts.length === 0" class="empty-state">
      <p>No parts found</p>
    </div>

    <!-- Add Part Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Add New Part</h2>
          <button class="close-btn" @click="showAddModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Part Number</label>
              <input v-model="newPart.partNumber" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Name</label>
              <input v-model="newPart.name" type="text" class="form-input" required />
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newPart.description" class="form-input" rows="2"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <input v-model="newPart.category" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Manufacturer</label>
              <input v-model="newPart.manufacturer" type="text" class="form-input" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Cost ($)</label>
              <input v-model.number="newPart.cost" type="number" step="0.01" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Retail Price ($)</label>
              <input v-model.number="newPart.retailPrice" type="number" step="0.01" class="form-input" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Quantity in Stock</label>
              <input v-model.number="newPart.quantityInStock" type="number" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Reorder Level</label>
              <input v-model.number="newPart.reorderLevel" type="number" class="form-input" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Reorder Quantity</label>
              <input v-model.number="newPart.reorderQuantity" type="number" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Location</label>
              <input v-model="newPart.location" type="text" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>Supplier</label>
            <input v-model="newPart.supplier" type="text" class="form-input" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showAddModal = false">Cancel</button>
          <button class="btn btn-primary" @click="addPart">Add Part</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parts-view {
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

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.category-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  min-width: 200px;
}

.category-select:focus {
  outline: none;
  border-color: #667eea;
}

.stats-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-badge {
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 0.875rem;
  color: #666;
}

.stat-badge.warning {
  border-left: 4px solid #ffa500;
}

.stat-badge strong {
  color: #333;
  font-size: 1rem;
  margin-left: 0.5rem;
}

.parts-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.parts-table {
  width: 100%;
  border-collapse: collapse;
}

.parts-table thead {
  background: #f8f9fa;
}

.parts-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

.parts-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.parts-table tr:hover {
  background: #f8f9fa;
}

.parts-table tr.low-stock {
  background: #fff3e0;
}

.parts-table tr.out-of-stock {
  background: #ffebee;
}

.stock-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.stock-badge.in-stock {
  background: #e8f5e9;
  color: #2e7d32;
}

.stock-badge.low-stock {
  background: #fff3e0;
  color: #f57c00;
}

.stock-badge.out-of-stock {
  background: #ffebee;
  color: #c62828;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
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
  max-width: 800px;
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

  .filters {
    flex-direction: column;
  }

  .stats-row {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .parts-table {
    font-size: 0.875rem;
  }

  .parts-table th,
  .parts-table td {
    padding: 0.5rem;
  }
}
</style>
