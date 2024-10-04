<template>
  <div class="card shadow-sm mb-4">
    <div class="card-header bg-dark text-white text-center">
      Top 5 Active Customers
    </div>
    <div class="card-body">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Total Orders</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer.customerName">
            <td>{{ customer.customerName }}</td>
            <td>{{ customer.orderCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ActiveCustomersTable',
  data() {
    return {
      customers: [],
    };
  },
  mounted() {
    this.fetchActiveCustomers();
  },
  methods: {
    async fetchActiveCustomers() {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:5500/admin/active-customers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.customers = response.data;
      } catch (error) {
        console.error('Error fetching active customers:', error);
      }
    },
  },
};
</script>

<style scoped>
.table-striped {
  margin-bottom: 0;
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
