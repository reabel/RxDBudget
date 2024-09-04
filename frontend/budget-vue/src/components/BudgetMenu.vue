<script setup lang="ts">
import { useBudgetStore } from '../stores/budgetstore';
import { storeToRefs } from 'pinia';
const store = useBudgetStore();
const { displayForm } = storeToRefs(store);
</script>
<template>
    <menu>
      <button v-if="!displayForm" @click="store.toggleDisplayForm();">Add Line ...</button>
      <button v-else @click="store.toggleDisplayForm()">Close Form</button>
      <button>Import ...</button>
      <button>Export ...</button>
   </menu>
</template>

<style scoped>
/* Top menu, align with top-right of screen, no background */
menu {
  position: fixed;
  top: 0;
  right: 0;
  background: none;
  padding: 0.5em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
}
</style>