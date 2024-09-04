<script setup lang="ts">
import { useBudgetStore } from '../stores/budgetstore';
import { ref } from 'vue';
const store = useBudgetStore();
const name= ref('');
const category = ref('');
const amount = ref(0);
const recurring = ref(false);
const date = ref(new Date());

const submit = () => {
  console.log('submitting');
  store.addLineItem({
    name: name.value,
    type: category.value,
    price: amount.value,
    recurring: false,
    date: new Date(),
  });
};
</script>

<template>
  <h1>Budget Form</h1>
  <div style="display: flex">
    <div>
      <label for="name">Name</label>
      <input type="select" v-model="name" />
    </div>
    <div>
      <label for="category">Category</label>
      <input type="select" v-model="category" />
    </div>

    <div>
      <label for="amount">Amount</label>
      <input type="currency" v-model="amount" />
    </div>

    <div>
      <label for="recurring">Recurring?</label>
      <input type="checkbox" v-model="recurring" />
    </div>

    <div>
      <label for="date">Date</label>
      <input type="date" v-model="date" />
    </div>
  </div>
  <button @click="submit">Submit</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
