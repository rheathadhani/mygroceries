<template>
  <div v-if="!showDetails" class="row mb-4">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-header category bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 class="m-0">Customer Management</h5>
          <div>
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
          <!-- Search and Filters -->
          <div class="row mb-3">
            <div class="col-md-9">
              <input type="text" v-model="searchQuery" class="form-control"
                placeholder="Search by ID, Username or Shipping Addresses">
            </div>
            <div class="col-md-3">
              <button class="btn btn-secondary w-100" @click="toggleFilters">Filter Customers</button>
            </div>
          </div>
          <div v-if="filterVisibility" class="row mb-3">
            <div class="col-md-4">
              <label for="filterGender">Filter by Gender:</label>
              <select v-model="filterGender" class="form-control">
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="filterDOB">Filter by Date of Birth:</label>
              <div class="input-group">
                <input type="date" v-model="filterDOB" class="form-control">
              </div>
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button class="btn btn-secondary w-100" @click="resetFilters">Reset Filters</button>
            </div>
          </div>

          <!-- Table to display limited fields -->
          <table class="table table-striped table-bordered w-100">
            <thead class="thead-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Shipping Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in filteredCustomers" :key="customer.id">
                <td>{{ customer.id }}</td>
                <td>{{ customer.username }}</td>
                <td>{{ customer.email }}</td>
                <td>
                  <ul style="list-style-type: square; padding-left: 1rem; margin-bottom: 0;">
                    <li v-for="address in (customer.shippingAddresses ? customer.shippingAddresses.split(' | ') : [])"
                      :key="address">
                      {{ address }}
                    </li>
                  </ul>
                </td>
                <td>
                  <button class="btn btn-sm btn-warning me-2" @click="viewDetails(customer.id)">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Customer Details Section -->
  <CustomersDetails v-if="showDetails" :customer-id="selectedCustomerId" @back-to-table="backToTable" />
</template>

<script>
import CustomersDetails from './CustomersDetails.vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

export default {
  name: 'CustomersTable',
  components: {
    CustomersDetails,
  },
  data() {
    return {
      searchQuery: '',
      filterGender: '',
      filterDOB: '',
      filterVisibility: false,
      showDetails: false,
      selectedCustomerId: null,
      customers: [],
    };
  },
  computed: {
    filteredCustomers() {
      let filtered = this.customers;

      if (this.searchQuery) {
        filtered = filtered.filter((customer) => {
          const usernameMatch = customer.username
            ? customer.username.toLowerCase().includes(this.searchQuery.toLowerCase())
            : false;
          const phoneNumberMatch = customer.phoneNumber
            ? customer.phoneNumber.includes(this.searchQuery)
            : false;
          const shippingAddressMatch = customer.shippingAddresses
            ? customer.shippingAddresses.toLowerCase().includes(this.searchQuery.toLowerCase())
            : false;

          return customer.id.toString().includes(this.searchQuery) || usernameMatch || phoneNumberMatch || shippingAddressMatch;
        });
      }

      if (this.filterGender) {
        filtered = filtered.filter((customer) => customer.gender === this.filterGender);
      }

      if (this.filterDOB) {
        const filterDOB = new Date(this.filterDOB).toISOString().slice(0, 10); // Format filter date as 'YYYY-MM-DD'

        filtered = filtered.filter((customer) => {
          if (!customer.dateOfBirth) return false; // Skip customers with no DOB

          const customerDOB = new Date(customer.dateOfBirth).toISOString().slice(0, 10); // Format customer DOB
          console.log(`Comparing: ${customerDOB} with ${filterDOB}`);
          return customerDOB === filterDOB; // Compare both formatted dates
        });
      }

      return filtered;
    },
  },
  methods: {
    async fetchCustomers() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://mygroceries-backend.vercel.app/admin/customers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.customers = response.data.map((customer) => ({
          id: customer.id,
          username: customer.username,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          gender: customer.gender,
          dateOfBirth: customer.dateOfBirth
            ? new Date(customer.dateOfBirth).toISOString().slice(0, 10) // Ensure consistent date format
            : null,
          shippingAddresses: customer.shippingAddresses,
        }));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    toggleFilters() {
      this.filterVisibility = !this.filterVisibility;
    },
    viewDetails(customerId) {
      this.selectedCustomerId = customerId;
      this.showDetails = true;
    },
    backToTable() {
      this.showDetails = false;
    },
    resetFilters() {
      this.searchQuery = '';
      this.filterGender = '';
      this.filterDOB = '';
      this.fetchCustomers();
    },
    deleteCustomer(customerId) {
      const token = localStorage.getItem('authToken');
      axios
        .delete(`https://mygroceries-backend.vercel.app/admin/customers/${customerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          this.customers = this.customers.filter((customer) => customer.id !== customerId);
        })
        .catch((error) => {
          console.error('Error deleting customer:', error);
        });
    },
    generateReport(type) {
      const dataToExport = this.filteredCustomers;
      if (type === 'Excel/CSV') {
        this.exportToCSV(dataToExport);
      } else if (type === 'PDF') {
        this.exportToPDF(dataToExport);
      }
    },
    exportToCSV(filteredData) {
      const headers = ['ID', 'Username', 'Email', 'Phone Number', 'Shipping Addresses'];
      const rows = filteredData.map((customer) => [
        customer.id,
        customer.username,
        customer.email,
        customer.phoneNumber,
        Array.isArray(customer.shippingAddresses)
          ? customer.shippingAddresses.join('; ')
          : customer.shippingAddresses,
      ]);

      let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.map((e) => e.join(',')).join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'customers_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportToPDF(filteredData) {
      const doc = new jsPDF();
      doc.text('Customers Report', 20, 10);
      doc.autoTable({
        head: [['ID', 'Username', 'Email', 'Phone Number', 'Shipping Addresses']],
        body: filteredData.map((customer) => [
          customer.id,
          customer.username,
          customer.email,
          customer.phoneNumber,
          Array.isArray(customer.shippingAddresses)
            ? customer.shippingAddresses.join('; ')
            : customer.shippingAddresses,
        ]),
      });
      doc.save('customers_report.pdf');
    },
  },
  mounted() {
    this.fetchCustomers();
  },
};
</script>


<style scoped>
.category {
  height: 7vh;
}

.table {
  margin-top: 10px;
}

.card-body {
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Adjust the shipping addresses column to fit content and action buttons */
#shippingaddresses {
  max-width: 220px;
  /* Limit the width of the shipping address column */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#actions .btn {
  width: 90px;
  /* Adjust button size */
  text-align: center;
  display: inline-block;
}

/* Reduce padding in the table for better fit */
.table td {
  padding: 0.5rem;
}

.table th {
  padding: 0.5rem;
}
</style>
