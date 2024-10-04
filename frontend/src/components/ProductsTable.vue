<template>
  <!-- Table View -->
  <div v-if="!showDetails && !showAllDetails && !showAddNew" class="row mb-4">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-header category bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 class="m-0">Product Management</h5>
          <div>
            <!-- Add New Product Button -->
            <button class="btn btn-sm btn-success me-2" @click="showAddNewProductForm">Add New Product</button>

            <!-- Generate Report Dropdown -->
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
          <!-- Search and Toggle Filters Controls -->
          <div class="row mb-3">
            <div class="col-md-9">
              <input type="text" v-model="searchQuery" class="form-control"
                placeholder="Search by ID, Name, Price, or Description">
            </div>
            <div class="col-md-3">
              <button class="btn btn-secondary w-100" @click="toggleFilters">
                Filter Products
              </button>
            </div>
          </div>

          <!-- Filters Row (Toggle Visibility) -->
          <div v-if="filterVisibility" class="row mb-3">
            <!-- Filter by Category -->
            <div class="col-md-4">
              <label for="filterCategory">Filter by Category:</label>
              <select id="filterCategory" v-model="filterCategory" class="form-control">
                <option value="">All</option>
                <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
              </select>
            </div>

            <!-- Filter by Price -->
            <div class="col-md-4">
              <label for="filterPrice">Filter by Price:</label>
              <div class="input-group">
                <select v-model="filterPriceCondition" class="form-select form-control">
                  <option value="lt">Less Than</option>
                  <option value="eq">Equal To</option>
                  <option value="gt">Greater Than</option>
                </select>
                <input type="number" v-model="filterPrice" class="form-control" placeholder="Price">
              </div>
            </div>

            <!-- Reset Filters Button -->
            <div class="col-md-4 d-flex align-items-end">
              <button class="btn btn-secondary w-100" @click="resetFilters">
                Reset Filters
              </button>
            </div>
          </div>

          <!-- Table -->
          <table class="table table-striped table-bordered w-100">
            <thead class="thead-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Updated Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.productID">
                <td>{{ product.productID }}</td>
                <td>{{ product.productName }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.categoryName }}</td>
                <td>{{ formatDate(product.updatedDate) }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-2" @click="viewDetails(product)">View Details</button>
                  <button class="btn btn-sm btn-primary me-2" @click="editProduct(product)">Edit</button>
                  <!-- Delete button added back -->
                  <button class="btn btn-sm btn-danger" @click="deleteProduct(product.productID)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Add New Product Form -->
  <div v-if="showAddNew" class="row mb-4">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-header category bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 class="m-0">Add New Product</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveNewProduct">
            <div class="mb-3">
              <label for="newProductName" class="form-label">Name</label>
              <input type="text" id="newProductName" v-model="newProduct.name" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="newProductPrice" class="form-label">Price</label>
              <input type="number" id="newProductPrice" v-model="newProduct.price" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="newProductCategory" class="form-label">Category</label>
              <select id="newProductCategory" v-model="newProduct.categoryID" class="form-control" required>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="newProductDescription" class="form-label">Description</label>
              <textarea id="newProductDescription" v-model="newProduct.description" class="form-control" required></textarea>
            </div>
            <div class="mb-3">
              <label for="newProductImage" class="form-label">Image URL</label>
              <input type="text" id="newProductImage" v-model="newProduct.imageURL" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-success me-2">Save</button>
            <button type="button" class="btn btn-secondary" @click="cancelAddNewProduct">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Product Edit Form -->
  <ProductEdit v-if="showDetails" :product="selectedProduct" :categories="categories" @back-to-table="backToTable"
    @save-product="saveProduct" />

  <!-- Product All Details View -->
  <ProductAllDetails v-if="showAllDetails" :product="selectedProduct" @back-to-table="backToTable" />
</template>

<script>
import axios from 'axios';
import jsPDF from "jspdf"; // Import jsPDF for generating PDF files
import "jspdf-autotable"; // Import AutoTable plugin for jsPDF
import ProductEdit from './ProductEdit.vue'; // Import ProductEdit component
import ProductAllDetails from './ProductAllDetails.vue'; // Import ProductAllDetails component

export default {
  name: "ProductsTable",
  components: {
    ProductEdit,
    ProductAllDetails,
  },
  data() {
    return {
      searchQuery: "", // Search query for filtering products
      filterCategory: "", // Filter for category
      filterPriceCondition: "eq", // Filter condition (lt, eq, gt)
      filterPrice: null, // Filter for price
      filterVisibility: false, // Control the visibility of filters
      showDetails: false, // Control the visibility of the edit view
      showAllDetails: false, // Control the visibility of the details view
      showAddNew: false, // Control the visibility of the add new product form
      selectedProduct: null, // Store selected product for details view
      newProduct: {
        name: "",
        price: null,
        categoryID: "",
        description: "",
        imageURL: null,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      }, // Store data for new product
      products: [],
      categories: [], // Categories list
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;

      // Apply search filter by ID, Name, Price, or Description
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.productID.toString().includes(query) ||
          product.productName.toLowerCase().includes(query) ||
          product.price.toString().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (this.filterCategory) {
        filtered = filtered.filter(product => product.categoryName === this.filterCategory);
      }

      // Apply price filter
      if (this.filterPrice !== null) {
        if (this.filterPriceCondition === "lt") {
          filtered = filtered.filter(product => product.price < this.filterPrice);
        } else if (this.filterPriceCondition === "eq") {
          filtered = filtered.filter(product => product.price === this.filterPrice);
        } else if (this.filterPriceCondition === "gt") {
          filtered = filtered.filter(product => product.price > this.filterPrice);
        }
      }

      return filtered;
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5500/admin/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Ensure to store both categoryID and categoryName
        this.categories = response.data.map(category => ({
          id: category.categoryID,
          name: category.categoryName
        }));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    },
    async fetchProducts() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5500/admin/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response);

        this.products = response.data;  // Update products list with the response data
      } catch (error) {
        console.error('Failed to fetch products:', error);
        alert('Failed to fetch products. Please try again.');
      }
    },
    async saveNewProduct() {
      try {
        const token = localStorage.getItem('authToken');

        // Prepare the product data as JSON
        const productData = {
          name: this.newProduct.name,
          price: this.newProduct.price,
          categoryID: this.newProduct.categoryID,
          description: this.newProduct.description,
          imageURL: this.newProduct.imageURL,  // Send image URL instead of file
        };

        // Make the POST request to your backend
        const response = await axios.post('http://localhost:5500/admin/products', productData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',  // Send JSON data
          },
        });

        // Handle the successful response
        this.products.push(response.data.product);  // Assuming backend returns the new product
        alert('Product added successfully!');

        // Reset form fields after success
        this.newProduct = {
          name: "",
          price: null,
          categoryID: "",
          description: "",
          imageURL: null,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        };

        this.showAddNew = false;  // Close the form
      } catch (error) {
        console.error('Failed to add product:', error);
        alert('Failed to add product. Please try again.');
      }
    },
    toggleFilters() {
      this.filterVisibility = !this.filterVisibility; // Toggle filter row visibility
    },
    showAddNewProductForm() {
      this.showAddNew = true; // Show the Add New Product form
      this.showDetails = false;
      this.showAllDetails = false;
    },
    cancelAddNewProduct() {
      this.showAddNew = false; // Go back to the table without adding a new product
    },
    backToTable() {
      this.showDetails = false;
      this.showAddNew = false;
      this.showAllDetails = false; // Back to table view
    },
    viewDetails(product) {
      this.selectedProduct = product;
      this.showAllDetails = true; // Show detailed view
      this.showDetails = false; // Ensure edit view is hidden
    },
    editProduct(product) {
      this.selectedProduct = { ...product, categoryID: product.categoryID }; // Copy product data for editing
      this.showDetails = true; // Show edit view
      this.showAllDetails = false; // Ensure details view is hidden
    },
    // Added back the delete product function
    async deleteProduct(productId) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`http://localhost:5500/admin/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        this.products = this.products.filter(product => product.productID !== productId);
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    },
    resetFilters() {
      this.filterCategory = "";
      this.filterPriceCondition = "eq";
      this.filterPrice = null;
    },
    generateReport(type) {
      const dataToExport = this.filteredProducts; // Use filtered data for export
      if (type === "Excel/CSV") {
        this.exportToCSV(dataToExport);
      } else if (type === "PDF") {
        this.exportToPDF(dataToExport);
      }
    },
    exportToCSV(filteredData) {
      const headers = ["ID", "Name", "Price", "Category", "Description", "Updated Date"];
      const rows = filteredData.map(product => [
        product.productID,
        product.productName,
        product.price,
        product.categoryName,
        product.description,
        this.formatDate(product.updatedDate)
      ]);

      let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "products_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportToPDF(filteredData) {
      const doc = new jsPDF();
      doc.text("Products Report", 20, 10);
      doc.autoTable({
        head: [["ID", "Name", "Price", "Category", "Description", "Updated Date"]],
        body: filteredData.map(product => [
          product.productID,
          product.productName,
          product.price,
          product.categoryName,
          product.description,
          this.formatDate(product.updatedDate)
        ])
      });
      doc.save("products_report.pdf");
    },
    formatDate(date) {
      return new Date(date).toLocaleString('en-US');
    }
  },
  mounted() {
    this.fetchProducts();
    this.fetchCategories();
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

.img-fluid {
  max-width: 100%;
  height: auto;
}

.row .col-md-3,
.row .col-md-9 {
  padding-bottom: 10px;
}
</style>
