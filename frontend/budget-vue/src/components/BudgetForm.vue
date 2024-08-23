<script setup lang="ts">

</script>

<template>
  <h1>Budget Form</h1>

  <div>
    <label for="category">Category</label>
    <input type="select" id="category" name="category">
  </div>

  <div>
    <label for="amount">Amount</label>
    <input type="currency" id="amount" name="amount">
  </div>

  
  <div>
    <label for="recurring">Recurring?</label>
    <input type="checkbox" id="recurring" name="recurring">
  </div>

  <div>
    <label for="date">Date</label>
    <input type="date" id="date" name="date">
  </div>


</template>

<style scoped>
.read-the-docs {
    color: #888;
}

</style>