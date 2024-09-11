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
    recurring: recurring.value,
    date: date.value,
  });
};
</script>


<template>
  <form @submit.prevent="submit">
    <h1>Budget Form</h1>
    <div>
      <label for="name">Name</label>
      <input type="text" v-model="name" />
    </div>
    <div>
      <label for="category">Category</label>
      <input type="text" v-model="category" />
    </div>
    <div>
      <label for="amount">Amount</label>
      <input type="number" v-model="amount" />
    </div>
    <div>
      <label for="recurring">Recurring?</label>
      <input type="checkbox" v-model="recurring" />
    </div>
    <div>
      <label for="date">Date</label>
      <input type="date" v-model="date" />
    </div>
    <button type="submit">Submit</button>
  </form>
</template>

<style scoped>
form {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>
