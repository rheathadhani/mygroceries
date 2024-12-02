<template>
  <div id="page-wrap-container" class="container-fluid">
    <div class="row">
      <!-- Sidebar with Filter and Categories List -->
      <div class="col-md-3 bg-light p-3">
        <CategoriesList @categorySelected="filterProductsByCategory" />
      </div>
      <!-- Products Grid -->
      <div id="product-wrap" class="col-md-9 p-3 bg-light">
        <ProductsGrid :products="filteredProducts" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ProductsGrid from "../components/ProductsGrid.vue";
import CategoriesList from '../components/CategoriesList.vue';

export default {
  name: "ProductsPage",
  components: {
    ProductsGrid,
    CategoriesList,
  },
  data() {
    return {
      filteredProducts: [],
      allProducts: [], // Store all products initially
      cartItems: [], // Store cart items here
    };
  },
  watch: {
    // Watch for changes in the route query (search term)
    '$route.query.search'(newSearchTerm) {
      this.filterProductsBySearch(newSearchTerm);
    }
  },
  computed: {
    cartQuantity() {
      if (!this.cartItems || !Array.isArray(this.cartItems)) {
        return 0;
      }
      const cartItem = this.cartItems.find(item => item.productID === this.product.productID);
      return cartItem ? cartItem.quantity : 0;
    }
  },
  methods: {
    async fetchProducts() {
      // Fetch all products
      try {
        const response = await axios.get('http://localhost:5500/products');
        this.allProducts = response.data;
        this.filteredProducts = this.allProducts;
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    },
    async fetchCartItems() {
      try {
        const token = localStorage.getItem('authToken'); // Get token from localStorage
        const response = await axios.get('http://localhost:5500/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        this.cartItems = response.data; // Store cart items
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    },

    filterProductsBySearch(searchTerm) {
      if (searchTerm) {
        // Filter products based on the search term
        this.filteredProducts = this.allProducts.filter(product =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        // Show all products if no search term
        this.filteredProducts = this.allProducts;
      }
    },
    // Method to filter products by selected category
    filterProductsByCategory(categoryID) {
      this.filteredProducts = this.allProducts.filter(product => product.category === categoryID);
      console.log(this.filteredProducts); // Check if the filtered products are correct
    }

  },
  async mounted() {
    await this.fetchProducts(); // Fetch products when the page loads
    await this.fetchCartItems(); // Fetch cart items when the page loads

    // Apply search filtering if there's a query in the URL
    if (this.$route.query.search) {
      this.filterProductsBySearch(this.$route.query.search);
    }
  }
};
</script>
