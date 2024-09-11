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

  <table>
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
      <tr v-for="item in lineItems" as={lineItem}>
        <td>{{item.name}}</td>
        <td>{{item.type}}</td>
        <td>{{item.price}}</td>
        <td>{{item.recurring}}</td>
        <td>{{item.date}}</td>
      </tr>
    </tbody>
  </table>

</template>

<style scoped>
/* Align the table to the middle of the screen */
table {
  margin: 0 auto;
  border-collapse: collapse;
  width: 80%;
}
</style>
