<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <form @submit.prevent="addCategory">
        <div class="mb-3">
          <label for="categoryName" class="form-label">Name</label>
          <input type="text" v-model="category.categoryName" class="form-control" id="categoryName" required>
        </div>
        <div class="mb-3">
          <label for="numberOfProducts" class="form-label">Number of Products</label>
          <input type="number" v-model="category.noOfProducts" class="form-control" id="numberOfProducts" required>
        </div>
        <button type="submit" class="btn btn-success">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "AddNewCategory",
  data() {
    return {
      category: {
        categoryName: '', // Updated to match the backend field names
        noOfProducts: 0,
      }
    };
  },
  methods: {
    async addCategory() {
      try {
        // Get the token from localStorage (or sessionStorage)
        const token = localStorage.getItem('authToken');

        // Send a POST request to the backend to add a new category
        const response = await axios.post('http://localhost:5500/admin/categories', this.category, {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        // Emit the new category data to the parent component after successful addition
        this.$emit('save-category', response.data.category); // You can adjust the emitted value as needed
        console.log('Category added successfully:', response.data);
      } catch (error) {
        console.error('Error adding category:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
