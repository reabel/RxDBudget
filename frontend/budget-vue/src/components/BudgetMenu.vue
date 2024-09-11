<script setup lang="ts">
import { useBudgetStore } from '../stores/budgetstore';
import { storeToRefs } from 'pinia';
const store = useBudgetStore();
const { displayForm } = storeToRefs(store);
const downloadItem = (item?: any) => {
  console.log('Download item', item);

    // const blob = new Blob([lineItems.value],  { type: 'application/pdf' })
        // const link = document.createElement('a')
        // link.href = URL.createObjectURL(blob)
        // link.download = label
        // link.click()
        // URL.revokeObjectURL(link.href)

  let text = store.formatAsCSV()
  let filename = 'budgets.csv';
  let element = document.createElement('a');
  element.setAttribute('href', 'data:application/csv;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);  
}
</script>
<template>
    <h3>RxD Budget</h3>
    <menu>
      <button v-if="!displayForm" @click="store.toggleDisplayForm();">Add Line ...</button>
      <button v-else @click="store.toggleDisplayForm()">Close Form</button>
      <button>Import ...</button>
      <button @click.prevent="downloadItem()">Export ...</button>
   </menu>
</template>

<style scoped>

/* Top menu, header text, aligned with top-left of screen */
h3 {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0.5em;
}
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