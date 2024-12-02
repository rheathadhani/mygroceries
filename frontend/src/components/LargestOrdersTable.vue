<template>
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-dark text-white text-center">
        Top 5 Largest Orders
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Total Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.orderID">
              <td>{{ order.orderID }}</td>
              <td>{{ order.customerName }}</td>
              <td>{{ order.totalPrice }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'LargestOrdersTable',
    data() {
      return {
        orders: []
      };
    },
    mounted() {
      this.fetchLargestOrders();
    },
    methods: {
      async fetchLargestOrders() {
        try {
          const token = localStorage.getItem('authToken'); // Assuming you're using auth token
          const response = await axios.get('https://mygroceries-backend.vercel.app/admin/largest-orders', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          this.orders = response.data;
        } catch (error) {
          console.error('Error fetching largest orders:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .table {
    margin-bottom: 0;
  }
  
  .table-hover tbody tr:hover {
    background-color: #f1f1f1;
  }

  .card {
    max-width: 600px;
    margin: 0 auto;
    height: 90%;
  }
  
  th, td {
    text-align: center;
  }
  </style>
  