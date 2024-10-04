<template>
  <div class="row mb-4">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-header category bg-dark text-white d-flex justify-content-between align-items-center">
          <!-- Header Title -->
          <h5 class="m-0">Category Management</h5>

          <div>
            <!-- Generate Report Dropdown -->
            <div class="dropdown d-inline me-2">
              <ul class="dropdown-menu" aria-labelledby="generateReportDropdown">
                <li><a class="dropdown-item" href="#" @click="generateReport('Excel/CSV')">Excel/CSV</a></li>
                <li><a class="dropdown-item" href="#" @click="generateReport('PDF')">PDF</a></li>
              </ul>
              <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="generateReportDropdown"
                data-bs-toggle="dropdown" aria-expanded="false">
                Generate Report
              </button>
            </div>

            <!-- Add New Category Button -->
            <button class="btn btn-sm btn-success mr-0" @click="showAddCategory">Add New Category</button>
          </div>
        </div>
        <div class="card-body">
          <div v-if="!showAddCategoryComponent">
            <!-- Search and Filter Controls -->
            <div class="row mb-3">
              <div class="col-md-9">
                <input type="text" v-model="searchQuery" class="form-control" placeholder="Search by Category Name">
              </div>
              <div class="col-md-3">
                <!-- Button to toggle Filter Categories row -->
                <button class="btn btn-secondary w-100" @click="toggleFilters">Filter Categories</button>
              </div>
            </div>

            <!-- Filter Row (Visible based on filterVisibility) -->
            <div v-if="filterVisibility" class="row mb-3">
              <div class="col-md-2">
                <label for="operator">Filter by:</label>
                <select v-model="filterOperator" class="form-control">
                  <option value="all">All</option>
                  <option value="less">Less than</option>
                  <option value="more">More than</option>
                  <option value="equal">Equal to</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="numProducts">Number of Products:</label>
                <input type="number" v-model="filterValue" class="form-control">
              </div>
              <div class="col-md-4">
                <label for="updatedTime">Updated Time:</label>
                <input type="date" v-model="filterDate" class="form-control">
              </div>
              <div class="col-md-2 d-flex align-items-end"> <!-- Modified class to align button -->
                <button class="btn btn-secondary w-100" @click="resetFilters">Reset Filters</button>
              </div>
            </div>

            <!-- Table -->
            <table class="table table-striped table-bordered w-100">
              <thead class="thead-dark">
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Number of Products</th>
                  <th>Updated Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in filteredCategories" :key="category.categoryID">
                  <td>{{ category.categoryID }}</td> <!-- Use 'categoryID' instead of 'id' -->
                  <td v-if="editCategoryId !== category.categoryID">{{ category.categoryName }}</td>

                  <td v-else>
                    <input type="text" v-model="editCategoryData.categoryName" class="form-control form-control-sm">
                  </td>
                  <td v-if="editCategoryId !== category.categoryID">{{ category.noOfProducts }}</td>

                  <td v-else>
                    <input type="number" v-model="editCategoryData.noOfProducts" class="form-control form-control-sm">
                  </td>
                  <td>{{ category.updatedTime || 'N/A' }}</td>
                  <!-- Add default value for 'updatedTime' if not available -->
                  <td>
                    <div v-if="editCategoryId !== category.categoryID">
                      <button class="btn btn-sm btn-primary me-2" @click="editCategory(category)">Edit</button>
                      <!--<button class="btn btn-sm btn-danger" @click="deleteCategory(category.categoryID)">Delete</button>-->
                      <!-- Use 'categoryID' for actions -->
                    </div>
                    <div v-else>
                      <button class="btn btn-sm btn-success me-2"
                        @click="saveCategory(category.categoryID)">Save</button>
                      <button class="btn btn-sm btn-secondary" @click="cancelEdit">Cancel</button>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          <!-- Add New Category Component -->
          <div v-if="showAddCategoryComponent">
            <AddNewCategory @save-category="addCategory" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import AddNewCategory from './AddNewCategory.vue'; // Import the AddNewCategory component
import jsPDF from "jspdf"; // Import jsPDF for generating PDF files
import "jspdf-autotable"; // Import AutoTable plugin for jsPDF
import axios from 'axios'; // Import Axios

export default {
  name: "CategoriesTable",
  components: {
    AddNewCategory, // Register the AddNewCategory component
  },
  data() {
    return {
      showAddCategoryComponent: false, // State to control the visibility of AddNewCategory component
      filterVisibility: false, // State to control the visibility of the filter row
      editCategoryId: null, // ID of the category being edited
      editCategoryData: {}, // Temporary data for the category being edited
      searchQuery: "", // Search query for filtering categories by name
      filterOperator: "all", // Filter operator for number of products
      filterValue: "", // Value for filtering by number of products
      filterDate: "", // Date for filtering by updated time
      categories: [], // Empty array to be populated with categories from backend
    };
  },
  computed: {
    filteredCategories() {
      let filtered = this.categories;

      // Apply search filter by categoryName
      if (this.searchQuery) {
        filtered = filtered.filter(category => category.categoryName.toLowerCase().includes(this.searchQuery.toLowerCase()));
      }

      // Apply filter by number of products
      if (this.filterOperator !== "all" && this.filterValue) {
        const filterValueParsed = parseInt(this.filterValue);
        if (this.filterOperator === "less") {
          filtered = filtered.filter(category => category.noOfProducts < filterValueParsed);
        } else if (this.filterOperator === "more") {
          filtered = filtered.filter(category => category.noOfProducts > filterValueParsed);
        } else if (this.filterOperator === "equal") {
          filtered = filtered.filter(category => category.noOfProducts === filterValueParsed);
        }
      }

      // Apply filter by updated time
      if (this.filterDate) {
        filtered = filtered.filter(category => new Date(category.updatedTime).toLocaleDateString() === new Date(this.filterDate).toLocaleDateString());
      }

      return filtered;
    }
  },
  methods: {
    async fetchCategories() {
      try {
        // Get the token from localStorage (you can also use sessionStorage if preferred)
        const token = localStorage.getItem('authToken');
        console.log(token);

        // Set the Authorization header with the Bearer token
        const response = await axios.get('http://localhost:5500/admin/categories', {
          headers: {
            'Authorization': `Bearer ${token}` // Include the Bearer token
          }
        });

        this.categories = response.data; // Populate categories with data from backend
        console.log(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    showAddCategory() {
      this.showAddCategoryComponent = true; // Show the AddNewCategory component
    },
    toggleFilters() {
      this.filterVisibility = !this.filterVisibility; // Toggle filter row visibility
    },
    addCategory(newCategory) {
      this.categories.push({
        id: this.categories.length + 1,
        ...newCategory,
        updatedTime: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
      });
      this.showAddCategoryComponent = false; // Hide the AddNewCategory component
    },
    async deleteCategory(categoryID) {
      try {
        // Get the token from localStorage (or sessionStorage)
        const token = localStorage.getItem('authToken');

        // Make DELETE request to backend to delete the category
        await axios.delete(`http://localhost:5500/admin/categories/${categoryID}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Pass the token in the Authorization header
          }
        });

        // If successful, remove the category from the local state
        this.categories = this.categories.filter(category => category.categoryID !== categoryID);
        console.log('Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    },
    editCategory(category) {
      this.editCategoryId = category.categoryID; // Set the correct ID
      this.editCategoryData = {
        categoryName: category.categoryName,
        noOfProducts: category.noOfProducts
      }; // Create a copy of the category data for editing
    },
    async saveCategory(categoryId) {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('authToken');

        // Prepare the updated category data
        const updatedCategory = {
          categoryName: this.editCategoryData.categoryName,
          noOfProducts: this.editCategoryData.noOfProducts
        };

        // Send a PATCH request to update the category
        const response = await axios.patch(`http://localhost:5500/admin/categories/${categoryId}`,
          updatedCategory,
          {
            headers: {
              'Authorization': `Bearer ${token}` // Include the Bearer token in the request header
            }
          }
        );

        // If the update is successful, update the frontend category data
        if (response.status === 200) {
          const index = this.categories.findIndex(category => category.categoryID === categoryId);
          if (index !== -1) {
            this.categories[index].categoryName = this.editCategoryData.categoryName;
            this.categories[index].noOfProducts = this.editCategoryData.noOfProducts;
            this.categories[index].updatedTime = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
          }

          // Reset the edit state
          this.editCategoryId = null;
          this.editCategoryData = {};
          console.log('Category updated successfully:', response.data);
        }
      } catch (error) {
        console.error('Error updating category:', error);
      }
    },
    cancelEdit() {
      this.editCategoryId = null; // Reset the edit state
      this.editCategoryData = {}; // Reset the temporary data
    },
    generateReport(type) {
      const dataToExport = this.filteredCategories; // Use filtered data for export
      if (type === "Excel/CSV") {
        this.exportToCSV(dataToExport);
      } else if (type === "PDF") {
        this.exportToPDF(dataToExport);
      }
    },
    exportToCSV(filteredData) {
      const headers = ["ID", "Name", "Number of Products", "Updated Time"];
      const rows = filteredData.map(category => [
        category.categoryID,
        category.categoryName,
        category.noOfProducts,
        category.updatedTime
      ]);

      let csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "categories_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportToPDF(filteredData) {
      const doc = new jsPDF();
      doc.text("Categories Report", 20, 10);
      doc.autoTable({
        head: [["ID", "Name", "Number of Products", "Updated Time"]],
        body: filteredData.map(category => [
          category.categoryID,
          category.categoryName,
          category.noOfProducts,
          category.updatedTime
        ])
      });
      doc.save("categories_report.pdf");
    },
    resetFilters() {
      this.searchQuery = "";
      this.filterOperator = "all";
      this.filterValue = "";
      this.filterDate = "";
    }
  },
  mounted() {
    this.fetchCategories(); // Fetch categories when component is mounted
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

.text-center {
  text-align: center;
}

.card-body {
  padding: 1rem;
  /* Adjusted padding */
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
