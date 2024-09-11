<script setup lang="ts">
import BudgetTable from './components/BudgetTable.vue'
import BudgetForm from './components/BudgetForm.vue'
import BudgetMenu from './components/BudgetMenu.vue';
import { useBudgetStore } from './stores/budgetstore';
import { storeToRefs } from 'pinia';
const store = useBudgetStore();
const { displayForm } = storeToRefs(store);
</script>

<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
   <BudgetMenu />
   <BudgetForm v-if="!!displayForm" />
   <BudgetTable />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
