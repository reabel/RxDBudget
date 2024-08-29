<script setup lang="ts">
import { useBudgetStore } from '../stores/budgetstore';
import { ref } from 'vue';
const store = useBudgetStore();
const category = ref('');
const submit = () => {
  console.log('submitting');
  store.addLineItem({
    name: 'test',
    type: category.value,
    price: 100,
    recurring: false,
    date: new Date(),
  });
};
</script>

<template>
  <h1>Budget Form</h1>
  <div style="display: flex">
    <div>
      <label for="category">Category</label>
      <input type="select" id="category" :value="category" name="category" />
    </div>

    <div>
      <label for="amount">Amount</label>
      <input type="currency" id="amount" name="amount" />
    </div>

    <div>
      <label for="recurring">Recurring?</label>
      <input type="checkbox" id="recurring" name="recurring" />
    </div>

    <div>
      <label for="date">Date</label>
      <input type="date" id="date" name="date" />
    </div>
  </div>
  <button @click="submit">Submit</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
