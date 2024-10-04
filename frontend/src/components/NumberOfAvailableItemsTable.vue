<template>
    <div class="available-items-table card shadow-sm">
      <!-- Table Header -->
      <div class="card-header bg-dark text-white text-center">
        Number of Available Items
      </div>
      <!-- Table Body -->
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Quantity Available</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemsData" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "NumberOfAvailableItemsTable",
    props: {
      itemsData: {
        type: Array,
        required: true,
        default: () => [
          { name: 'Lemon', quantity: 400 },
          { name: 'Apple', quantity: 350 },
          { name: 'Banana', quantity: 300 },
          { name: 'Orange', quantity: 250 },
          { name: 'Strawberry', quantity: 200 },
        ],
      },
    },
  };
  </script>
  
  <style scoped>
  .available-items-table {
    margin-bottom: 10px; /* Add some spacing below the table */
  }
  </style>
  