<template>
  <div class="card shadow-sm">
    <div class="card-header bg-dark text-white">
      <h5 class="m-0">Customer Details</h5>
    </div>
    <div class="card-body" v-if="customer">
      <table class="table table-striped table-bordered w-100">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{{ customer.id }}</td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{{ customer.username }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{{ customer.name }}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{{ customer.email }}</td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td>{{ customer.phoneNumber }}</td>
          </tr>
          <tr>
            <th>Gender</th>
            <td>{{ customer.gender }}</td>
          </tr>
          <tr>
            <th>Date of Birth</th>
            <td>{{ formatDate(customer.dateOfBirth) }}</td>
          </tr>
          <tr>
            <th>Shipping Addresses</th>
            <td>
              <ul style="list-style-type: square; padding-left: 1rem;">
                <li v-for="address in splitAddresses(customer.shippingAddresses)" :key="address">{{ address }}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-secondary mt-3" @click="$emit('back-to-table')">Back to Table</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "CustomersDetails",
  props: {
    customerId: Number,
  },
  data() {
    return {
      customer: null,
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return "Invalid Date";
      const parsedDate = new Date(date);
      return !isNaN(parsedDate)
        ? parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : "Invalid Date";
    },
    splitAddresses(addressString) {
      return addressString ? addressString.split('|') : [];
    },
    async fetchCustomerDetails() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:5500/admin/customers/${this.customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.customer = response.data[0];
        console.log(response.data[0]);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    },
  },
  mounted() {
    this.fetchCustomerDetails();
  },
};
</script>

<style scoped>
ul {
  margin-bottom: 0;
}
</style>
