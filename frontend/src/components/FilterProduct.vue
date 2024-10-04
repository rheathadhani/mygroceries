<template>
    <div class="filter-bar mb-3">
      <!-- Toggle Button for Collapse/Expand -->
      <button class="btn btn-dark w-100" @click="toggleFilter">
        {{ isExpanded ? 'Hide Filters' : 'Show Filters' }}
      </button>
  
      <!-- Filter Section -->
      <div v-if="isExpanded" class="mt-3 p-3 border rounded shadow-sm bg-dark text-light">
        <!-- Price Filter -->
        <div class="filter-section mb-3">
            <p>Filter By Price</p>
          <div class="d-flex justify-content-between mb-1">
            <span>RM {{ priceRange[0] }}</span>
            <span>RM {{ priceRange[1] }}</span>
          </div>
          <input type="range" class="form-range" id="priceRange" min="0" max="500" v-model="priceRange[0]" step="10" @input="updatePriceFilter">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FilterProduct',
    data() {
      return {
        isExpanded: false,
        priceRange: [2, 50], // Initial price range
      };
    },
    methods: {
      toggleFilter() {
        this.isExpanded = !this.isExpanded;
      },
      updatePriceFilter() {
        // Ensure priceRange[0] is less than priceRange[1]
        if (this.priceRange[0] > this.priceRange[1]) {
          this.priceRange[0] = this.priceRange[1];
        }
        this.$emit('filterChanged', { priceRange: this.priceRange });
        console.log(`Filtering products with price range: $${this.priceRange[0]} - $${this.priceRange[1]}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .filter-bar {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
  }
  
  .filter-section {
    margin-bottom: 1rem;
  }
  
  .btn-dark {
    background-color: #343a40;
    border-color: #343a40;
  }
  
  .bg-light {
    background-color: #fff;
  }
  
  .shadow-sm {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }
  
  .d-flex {
    display: flex;
    justify-content: space-between;
  }
  
  .form-range {
    width: 100%;
  }
  </style>
  