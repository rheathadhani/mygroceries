<template>
  <div class="container mt-4">
    <!-- Tabs for Order Status -->
    <ul class="nav nav-tabs mb-4" id="orderTabs" role="tablist">
      <li class="nav-item mr-2 mb-2" role="presentation">
        <button class="nav-link bg-dark" :class="{ 'active': activeTab === 'all', 'border-dark': activeTab === 'all' }"
          id="all-tab" type="button" role="tab" @click="setActiveTab('all')">All</button>
      </li>
      <li class="nav-item mr-2 mb-2" role="presentation">
        <button class="nav-link bg-dark"
          :class="{ 'active': activeTab === 'scheduled', 'border-dark': activeTab === 'scheduled' }" id="scheduled-tab"
          type="button" role="tab" @click="setActiveTab('scheduled')">Scheduled</button>
      </li>
      <li class="nav-item mr-2 mb-2" role="presentation">
        <button class="nav-link bg-dark"
          :class="{ 'active': activeTab === 'inTransit', 'border-dark': activeTab === 'inTransit' }" id="in-transit-tab"
          type="button" role="tab" @click="setActiveTab('inTransit')">In Transit</button>
      </li>
      <li class="nav-item mr-2 mb-2" role="presentation">
        <button class="nav-link bg-dark"
          :class="{ 'active': activeTab === 'delivered', 'border-dark': activeTab === 'delivered' }" id="delivered-tab"
          type="button" role="tab" @click="setActiveTab('delivered')">Delivered</button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content">

      <!-- All Orders -->
      <div class="tab-pane fade" :class="{ 'show active': activeTab === 'all' }" id="all">
        <div v-for="order in allOrders" :key="order.orderID" class="order-box mb-4 p-3 border rounded">
          <div v-if="order.status" class="d-flex justify-content-between align-items-center bg-light p-2 rounded-top">
            <span class="text-muted">{{ order.status }}</span>
            <span class="text-end">{{ formatDate(order.scheduledDate || order.updatedDatetime) }}</span>

          </div>
          <div class="order-item d-flex justify-content-between align-items-center mt-2">
            <div>
              <p><strong>{{ order.productName }}</strong></p>
              <p>x{{ order.quantity }} | RM {{ order.productPrice }}</p>
            </div>
            
          </div>
        </div>
      </div>

      <!-- Scheduled Orders -->
      <div class="tab-pane fade" :class="{ 'show active': activeTab === 'scheduled' }" id="scheduled">
        <div v-for="order in scheduledOrders" :key="order.orderID" class="order-box mb-4 p-3 border rounded">
          <div class="d-flex justify-content-between align-items-center bg-light p-2 rounded-top">
            <span class="text-muted">{{ order.status }}</span>
            <span class="text-end">{{ formatDate(order.scheduledDate) }}</span>
          </div>
          <div class="order-item d-flex justify-content-between align-items-center mt-2">
            <div>
              <p><strong>{{ order.productName }}</strong></p>
              <p>x{{ order.quantity }} | RM {{ order.productPrice }}</p>
            </div>
            
          </div>
        </div>
      </div>

      <!-- In Transit Orders -->
      <div class="tab-pane fade" :class="{ 'show active': activeTab === 'inTransit' }" id="in-transit">
        <div v-for="order in inTransitOrders" :key="order.orderID" class="order-box mb-4 p-3 border rounded">
          <div class="d-flex justify-content-between align-items-center bg-light p-2 rounded-top">
            <span class="text-muted">{{ order.status }}</span>
            <span class="text-end">{{ formatDate(order.updatedDatetime) }}</span>
          </div>
          <div class="order-item d-flex justify-content-between align-items-center mt-2">
            <div>
              <p><strong>{{ order.productName }}</strong></p>
              <p>x{{ order.quantity }} | RM {{ order.productPrice }}</p>
            </div>
            
          </div>
        </div>
      </div>

      <!-- Delivered Orders -->
      <div class="tab-pane fade" :class="{ 'show active': activeTab === 'delivered' }" id="delivered">
        <div v-for="order in deliveredOrders" :key="order.orderID" class="order-box mb-4 p-3 border rounded">
          <div class="d-flex justify-content-between align-items-center bg-light p-2 rounded-top">
            <span class="text-muted">{{ order.status }}</span>
            <span class="text-end">{{ formatDate(order.updatedDatetime) }}</span>
          </div>
          <div class="order-item d-flex justify-content-between align-items-center mt-2">
            <div>
              <p><strong>{{ order.productName }}</strong></p>
              <p>x{{ order.quantity }} | RM {{ order.productPrice }}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "MyOrders",
  data() {
    return {
      activeTab: 'all', // Set default active tab to 'all'
      allOrders: [],
      scheduledOrders: [],
      inTransitOrders: [],
      deliveredOrders: [],
    };
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab; // Update the active tab state
    },

    // Fetch all orders
    async fetchOrders() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5500/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.allOrders = response.data.orders;
      } catch (error) {
        console.error('Error fetching all orders:', error);
      }
    },

    // Fetch orders by status
    async fetchOrdersByStatus(status) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:5500/orders?status=${status}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (status === 'Scheduled') {
          this.scheduledOrders = response.data.orders;
        } else if (status === 'In Transit') {
          this.inTransitOrders = response.data.orders;
        } else if (status === 'Delivered') {
          this.deliveredOrders = response.data.orders;
        }
      } catch (error) {
        console.error(`Error fetching ${status} orders:`, error);
      }
    },

    // Format the order response
    formatOrderResponse(orders) {
      return orders.map(order => ({
        status: order.status,
        time: order.status === 'Scheduled' ? order.scheduledDate : order.updatedDatetime,
        items: order.items.map(item => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.productPrice
        }))
      }));
    },

    // Format the date into a more readable format
    formatDate(date) {
      if (!date) return ''; // Handle null values
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(date).toLocaleString('en-US', options);
    }
  },
  mounted() {
    this.fetchOrders(); // Fetch all orders on mount
    this.fetchOrdersByStatus('Scheduled'); // Fetch scheduled orders on mount
    this.fetchOrdersByStatus('In Transit'); // Fetch in-transit orders on mount
    this.fetchOrdersByStatus('Delivered'); // Fetch delivered orders on mount
  }
}
</script>

<style scoped>
h3 {
  text-align: center;
}

.nav-tabs .nav-link {
  color: white !important;
  background-color: #343a40 !important;
  border: 2px solid #343a40;
  border-radius: 5px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.nav-tabs .nav-link.active {
  border-color: #343a40 !important;
  background-color: white !important;
  color: black !important;
  font-weight: bold;
  border: 2px solid #343a40 !important;
}

.nav-tabs .nav-link:hover {
  background-color: #3a3f44 !important;
  border-color: #3a3f44 !important;
  color: white !important;
}

.order-box {
  background-color: #ffffff;
  border: #ffffff !important;
}

.order-item {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.order-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}
</style>
