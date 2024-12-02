<template>
  <div class="row mb-4">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-header category bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 class="m-0">Order Management</h5>
          <div v-if="!viewOrder">
            <div class="dropdown d-inline me-2">
              <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="generateReportDropdown"
                data-bs-toggle="dropdown" aria-expanded="false">
                Generate Report
              </button>
              <ul class="dropdown-menu" aria-labelledby="generateReportDropdown">
                <li><a class="dropdown-item" href="#" @click="generateReport('Excel/CSV')">Excel/CSV</a></li>
                <li><a class="dropdown-item" href="#" @click="generateReport('PDF')">PDF</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <!-- Check if in detailed view (show ViewOrder component) -->
          <view-order v-if="viewOrder" :orderDetails="selectedOrderDetails" @goBack="backToTable"></view-order>

          <!-- Show search, filters, and table only if not in detailed view -->
          <div v-else>
            <!-- Search and Filter Controls -->
            <div class="row mb-3">
              <div class="col-md-9">
                <input type="text" v-model="searchQuery" class="form-control"
                  placeholder="Search by ID and Customer Name">
              </div>
              <div class="col-md-3">
                <button class="btn btn-secondary w-100" @click="toggleFilters">
                  Filter Orders
                </button>
              </div>
            </div>

            <!-- Filter Row -->
            <div v-if="filterVisibility" class="row mb-3">
              <div class="col-md-4">
                <label for="filterStatus">Filter by Order Status:</label>
                <select v-model="filterStatus" class="form-control">
                  <option value="">All</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="filterScheduledDate">Scheduled Date & Time:</label>
                <input type="datetime-local" v-model="filterScheduledDate" class="form-control"
                  placeholder="Scheduled Date & Time">
              </div>
              <div class="col-md-4 d-flex align-items-end mt-2">
                <button class="btn btn-secondary w-100" @click="resetFilters">Reset Filters</button>
              </div>
            </div>

            <!-- Table -->
            <table class="table table-striped table-bordered w-100">
              <thead class="thead-dark">
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Shipping Address</th>
                  <th>Order Status</th>
                  <th>Scheduled Date & Time</th>
                  <th>Updated Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.orderID">
                  <td>{{ order.orderID }}</td>
                  <td>{{ order.customerName }}</td>
                  <td>{{ order.shippingAddress }}</td>
                  <td>
                    <select v-model="order.status" class="form-control form-control-sm"
                      @change="updateStatus(order.orderID, order.status)">
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td>{{ formatDateTime(order.scheduledDate) }}</td>
                  <td>{{ formatDateTime(order.updatedDatetime) }}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" @click="viewOrderDetails(order.orderID)">View Order</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ViewOrder from './ViewOrder.vue'; // Import ViewOrder component
import jsPDF from "jspdf"; // Import jsPDF for generating PDF files
import "jspdf-autotable"; // Import AutoTable plugin for jsPDF
import axios from 'axios';

export default {
  name: "OrdersTable",
  components: {
    ViewOrder
  },
  data() {
    return {
      searchQuery: "", // Search query for filtering orders
      filterStatus: "", // Filter for order status
      filterScheduledDate: "", // Filter for scheduled date and time
      filterVisibility: false, // Control the visibility of filters
      viewOrder: false, // State to control if the ViewOrder component is being rendered
      selectedOrderDetails: [], // The selected order details for viewing
      orders: [] // Will be fetched from the backend
    };
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders;

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(order =>
          order.orderID.toString().includes(query) ||
          order.customerName.toLowerCase().includes(query)
          //order.shippingAddress.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (this.filterStatus) {
        filtered = filtered.filter(order => order.status === this.filterStatus);
      }

      // Apply scheduled date filter
      if (this.filterScheduledDate) {
        const scheduledDateTime = new Date(this.filterScheduledDate).toISOString();
        filtered = filtered.filter(order =>
          new Date(order.scheduledDate).toISOString() === scheduledDateTime
        );
      }


      return filtered;
    }
  },
  methods: {
    toggleFilters() {
      this.filterVisibility = !this.filterVisibility;
    },
    async fetchOrders() {
      try {
        const response = await axios.get('https://mygroceries-backend.vercel.app/admin/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        this.orders = response.data.orders;
        console.log(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    async updateStatus(orderID, newStatus) {
      try {
        await axios.put(`https://mygroceries-backend.vercel.app/admin/orders/${orderID}/status`, { status: newStatus }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    },
    deleteOrder(orderID) {
      this.orders = this.orders.filter(order => order.orderID !== orderID);
    },
    async viewOrderDetails(orderID) {
      try {
        // Make API request to fetch order details by orderID
        const response = await axios.get(`https://mygroceries-backend.vercel.app/admin/orders/${orderID}/details`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.selectedOrderDetails = response.data.orderDetails; // Store the details
        this.viewOrder = true; // Show the ViewOrder component
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    },
    backToTable() {
      this.viewOrder = false;
      this.selectedOrderDetails = [];
    },
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    },
    generateReport(type) {
      const dataToExport = this.filteredOrders; // Use filtered data for export
      if (type === "Excel/CSV") {
        this.exportToCSV(dataToExport);
      } else if (type === "PDF") {
        this.exportToPDF(dataToExport);
      }
    },
    exportToCSV(filteredData) {
      const headers = ["Order ID", "Customer Name", "Shipping Address", "Order Status", "Scheduled Date & Time", "Updated Date & Time"];
      const rows = filteredData.map(order => [
        order.orderID,
        order.customerName,
        order.shippingAddress,
        order.status,
        this.formatDateTime(order.scheduledDate),
        this.formatDateTime(order.updatedDatetime)
      ]);

      let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "orders_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportToPDF(filteredData) {
      const doc = new jsPDF();
      doc.text("Orders Report", 20, 10);
      doc.autoTable({
        head: [["Order ID", "Customer Name", "Shipping Address", "Order Status", "Scheduled Date & Time", "Updated Date & Time"]],
        body: filteredData.map(order => [
          order.orderID,
          order.customerName,
          order.shippingAddress,
          order.status,
          this.formatDateTime(order.scheduledDate),
          this.formatDateTime(order.updatedDatetime)
        ])
      });
      doc.save("orders_report.pdf");
    },
    resetFilters() {
      this.searchQuery = "";
      this.filterStatus = "";
      this.filterScheduledDate = "";
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>

<style scoped>
.category {
  height: 7vh;
}

.table {
  margin-top: 10px;
}

.text-center {
  text-align: center;
}

.card-body {
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-success {
  margin-right: 10px;
}
</style>
