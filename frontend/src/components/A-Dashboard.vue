<template>
  <div class="dashboard-container container">
    <!-- Top Row: Welcome Admin Card, Notifications Button, Profile Dropdown, Date & Time -->
    <div class="row mb-4 align-items-center">
      <!-- Welcome Admin Card -->
      <div class="col-md-9">
        <div class="card shadow-sm greeting-card">
          <div class="card-header bg-dark"></div>
          <div class="card-body">
            <h4 class="card-title">Welcome, <strong>Admin</strong></h4>
            <p class="card-text">Manage your dashboard effectively.</p>
          </div>
        </div>
      </div>

      <!-- Notifications Button, Profile Dropdown, and Date & Time -->
      <div class="col-md-3">
        <div class="d-flex flex-column align-items-end profile-datetime">
          <!-- Profile Dropdown -->
          <div class="d-flex justify-content-end mb-2">
            <div class="dropdown">
              <button class="btn btn-dark dropdown-toggle d-flex align-items-center profile" type="button"
                id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="me-2"></i> Profile
              </button>
              
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
              </ul>
            </div>
          </div>

          <!-- Date and Time -->
          <div class="current-time text-center mt-2 p-2 border rounded shadow-sm" style="background-color: white;">
            
            <div class="pb-2">{{ currentDate }}</div>
            <div>{{ currentTime }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Line Chart for Sales Over Time -->
    <div class="row mb-3">
      <div class="col-12">
        <SalesOverTimeChart />
      </div>
    </div>

    <!-- Cards Row -->
    <div class="row mb-4">
      <div class="col-md-3">
        <DashboardCard title="Total Customers" :value="totalStats.totalCustomers" />
      </div>
      <div class="col-md-3">
        <DashboardCard title="Total Items Available" :value="totalStats.totalProducts" />
      </div>
      <div class="col-md-3">
        <DashboardCard title="Total Revenue" :value="totalStats.totalRevenue" />
      </div>
      <div class="col-md-3">
        <DashboardCard title="Total Orders" :value="totalStats.totalOrders" />
      </div>
    </div>

    <!-- Product Performance Card -->
    <ProductPerformanceChart />

    <!-- Two Tables Row -->
    <div class="row mb-4">
      <div class="col-md-6">
        <LargestOrdersTable />
      </div>
      <div class="col-md-6">
        <ActiveCustomersTable />
      </div>
    </div>
  </div>
</template>



<script>
import DashboardCard from '../components/DashboardCard.vue';
import SalesOverTimeChart from '../components/SalesOverTimeChart.vue';
import ProductPerformanceChart from '../components/ProductPerformanceChart.vue';
import LargestOrdersTable from '../components/LargestOrdersTable.vue';
import ActiveCustomersTable from '../components/ActiveCustomersTable.vue';
import axios from 'axios';

export default {
  name: 'A_Dashboard',
  components: {
    DashboardCard,
    SalesOverTimeChart,
    ProductPerformanceChart,
    ActiveCustomersTable,
    LargestOrdersTable
  },
  methods: {
    async fetchTotalStats() {
      try {
        const token = localStorage.getItem('authToken'); // Get auth token from local storage
        const response = await axios.get('http://localhost:5500/admin/total-stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.totalStats = response.data;
      } catch (error) {
        console.error('Error fetching total stats:', error);
      }
    },
    logout() {
      // Clear token from localStorage
      localStorage.removeItem('authToken');
      // Redirect to /welcome route
      this.$router.push('/welcome');
    }
  },
  data() {
    return {
      totalStats: {
        totalCustomers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalOrders: 0,
      },
      currentDate: new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }),
      currentTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  },
  mounted() {
    this.fetchTotalStats(); // Fetch total stats when component mounts
  },
};
</script>


<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.greeting-card .card-body {
  text-align: left; /* Left align the text in the greeting card */
}

.card-header {
  height: 4px;
}

.profile-datetime {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Ensures both elements take the same width */
  width: 100%;
}

.profile-datetime .dropdown,
.profile-datetime .current-time {
  flex: 1; /* Ensure equal width for both sections */
  width: 100%;
}

.profile-datetime .dropdown .btn-dark {
  width: 100%; /* Make the profile dropdown button full width */
  text-align: center; /* Center the text in the profile dropdown */
}


</style>
