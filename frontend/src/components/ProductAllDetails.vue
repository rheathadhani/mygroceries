<template>
    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header category bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 class="m-0">Product Details</h5>
          </div>
          <div class="card-body">
            <table class="table table-striped table-bordered w-100">
              <tbody>
                <tr>
                  <th>Image</th>
                  <td><img :src="product.imageURL" alt="Product Image" class="img-fluid"/></td>
                </tr>
                <tr>
                  <th>ID</th>
                  <td>{{ product.productID }}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{{ product.productName }}</td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>{{ product.price }}</td>
                </tr>
                <tr>
                  <th>Category</th>
                  <td>{{ product.categoryName }}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{{ product.description }}</td>
                </tr>
                <tr>
                  <th>Updated Date</th>
                  <td>{{ formatDate(product.updatedDate) }}</td>
                </tr>
              </tbody>
            </table>
            <button class="btn btn-secondary mt-3" @click="$emit('back-to-table')">Back to Table</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ProductAllDetails",
    props: {
      product: Object
    },
    methods: {
      formatDate(date) {
        return new Date(date).toLocaleDateString('en-US');
      }
    }
  };
  </script>
  
  <style scoped>
  .img-fluid {
    max-width: 200px;
    height: auto;
  }
  </style>
  