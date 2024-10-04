<template>
    <div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in orderDetails" :key="index">
            <td>{{ item.productName }}</td>
            <td>{{ item.quantity }}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-secondary" @click="$emit('goBack')">Back to Table</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ViewOrder',
    props: {
      orderDetails: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  