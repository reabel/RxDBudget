<script setup lang="ts">
import { useBudgetStore } from '../stores/budgetstore';
import { storeToRefs } from 'pinia';
const store = useBudgetStore();
const { displayForm, lineItems } = storeToRefs(store);
const downloadItem = (item?: any) => {
  console.log('Download item', item);

    // const blob = new Blob([lineItems.value],  { type: 'application/pdf' })
        // const link = document.createElement('a')
        // link.href = URL.createObjectURL(blob)
        // link.download = label
        // link.click()
        // URL.revokeObjectURL(link.href)

  let text = JSON.stringify(lineItems);
  let filename = 'budgets.json';
  let element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);  
}
</script>
<template>
    <menu>
      <button v-if="!displayForm" @click="store.toggleDisplayForm();">Add Line ...</button>
      <button v-else @click="store.toggleDisplayForm()">Close Form</button>
      <button>Import ...</button>
      <button @click.prevent="downloadItem()">Export ...</button>
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