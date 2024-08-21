<script setup lang="ts">
import BudgetTable from './components/BudgetTable.vue'
import BudgetForm from './components/BudgetForm.vue'
</script>

<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
   <menu>
      <button>Add Line Item</button>
      <button>Import ...</button>
      <button>Export ...</button>
   </menu>
   <BudgetForm />
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
