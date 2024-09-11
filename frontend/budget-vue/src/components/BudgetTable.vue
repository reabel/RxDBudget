<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useBudgetStore } from '../stores/budgetstore';
// access the `store` variable anywhere in the component ✨
const store = useBudgetStore();
//comes in as a ref, but how do I define the type of the content in ref?
const { lineItems } = storeToRefs(store);
</script>

<template>
  <h1>Budget Table</h1>

  <div class="table-wrapper">
    <table class="budget-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Recurring?</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in lineItems" as={lineItem} :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.recurring }}</td>
          <td>{{ item.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Align the table to the middle of the screen */
.table-wrapper {
  margin: 0 auto;
  width: 80%;
  overflow: hidden; /* Ensures the rounded corners are visible */
  border-radius: 10px; /* Apply rounded corners to the wrapper */
  border: 1px solid #ddd; /* Optional: Add a border to the wrapper */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add drop shadow effect */
}

.budget-table {
  width: 100%;
  border-collapse: collapse;
}

.budget-table th,
.budget-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.budget-table thead th {
  background-color: #7f1818;
}
</style>
