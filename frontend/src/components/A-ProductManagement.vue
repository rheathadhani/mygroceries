<template>
    <div>
      <!-- Render the Products Table component -->
      <ProductsTable />
    </div>
  </template>
  
  <script>
  import ProductsTable from './ProductsTable.vue'; // Correct the path to your ProductsTable component
  
  export default {
    name: "A_ProductManagement",
    components: {
      ProductsTable
    }
  };
  </script>
  
  <style scoped>
  /* Add any scoped styles here */
  </style>
  