<template>
  <div class="row mb-4">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-header category bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 class="m-0">Edit Product Details</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="save">
            <div class="mb-3">
              <label for="productName" class="form-label">Name</label>
              <input type="text" id="productName" v-model="editableProduct.productName" class="form-control">
            </div>
            <div class="mb-3">
              <label for="productPrice" class="form-label">Price</label>
              <input type="number" id="productPrice" v-model="editableProduct.price" class="form-control">
            </div>
            <div class="mb-3">
              <label for="productCategory" class="form-label">Category</label>
              <select id="productCategory" v-model="editableProduct.categoryID" class="form-control">
                <option value="" disabled>Select Category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="productDescription" class="form-label">Description</label>
              <textarea id="productDescription" v-model="editableProduct.description" class="form-control"></textarea>
            </div>
            <div class="mb-3">
              <label for="productImage" class="form-label">Image URL</label>
              <input type="text" id="productImage" v-model="editableProduct.imageURL" class="form-control">
            </div>
            <button type="submit" class="btn btn-success me-2">Save</button>
            <button type="button" class="btn btn-secondary" @click="cancelEdit">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';  // Import Axios for making HTTP requests

export default {
  name: "ProductEdit",
  props: {
    product: Object,
    categories: Array,
  },
  data() {
    return {
      editableProduct: {
        productID: this.product.productID,
        productName: this.product.productName,
        price: this.product.price,
        categoryID: this.product.categoryID ? String(this.product.categoryID) : "", // Ensure correct categoryID
        description: this.product.description,
        imageURL: this.product.imageURL,
      },
    };
  },
  watch: {
    product: {
      immediate: true,
      handler(newProduct) {
        this.editableProduct = {
          productID: newProduct.productID,
          productName: newProduct.productName,
          price: newProduct.price,
          categoryID: newProduct.categoryID ? String(newProduct.categoryID) : "",
          description: newProduct.description,
          imageURL: newProduct.imageURL,
        };
      },
    },
  },
  methods: {
    async save() {
      this.editableProduct.updatedDate = new Date().toISOString();

      // Get the token from localStorage
      const token = localStorage.getItem('authToken');

      try {
        // Perform an Axios PATCH request to update the product
        const response = await axios.patch(`http://localhost:5500/admin/products/${this.editableProduct.productID}`, {
          productName: this.editableProduct.productName,
          price: this.editableProduct.price,
          categoryID: this.editableProduct.categoryID,
          description: this.editableProduct.description,
          imageURL: this.editableProduct.imageURL,
          updatedDate: this.editableProduct.updatedDate,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Add Authorization header
            'Content-Type': 'application/json',
          },
        });

        console.log(response.data.message);

        // Emit the updated product to the parent component
        this.$emit("save-product", this.editableProduct);

        // Go back to the product table view after successful save
        this.cancelEdit();  // Call the cancelEdit method to return to the table view
      } catch (error) {
        console.error('Failed to update product:', error);
        alert('Failed to update product. Please try again.');
      }
    },
    cancelEdit() {
      this.$emit("back-to-table");
    },
  },
};
</script>
