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
//import FilterProduct from '../components/FilterProduct.vue';

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
      selectedPriceRange: [2, 50],
    };
  },
  watch: {
    // Watch for changes in the route query (search term)
    '$route.query.search'(newSearchTerm) {
      this.filterProductsBySearch(newSearchTerm);
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

    // Apply search filtering if there's a query in the URL
    if (this.$route.query.search) {
      this.filterProductsBySearch(this.$route.query.search);
    }
  }
};
</script>
