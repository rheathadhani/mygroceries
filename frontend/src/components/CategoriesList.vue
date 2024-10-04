<template>
  <div class="categories-list bg-dark mb-3">
    <h3 class="text-white mb-4"> Browse <br> Categories </h3>
    <div class="list-group">
      <CategoryItem v-for="category in categories" :key="category.categoryID" :category="category"
        @click="handleCategorySelect(category.categoryID)" class="list-group-item list-group-item-action mb-2" />
    </div>
  </div>
</template>

<script>
import CategoryItem from './CategoryItem.vue';
import axios from 'axios';

export default {
  name: "CategoriesList",
  components: {
    CategoryItem
  },
  data() {
    return {
      categories: [] // Holds the fetched categories
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:5500/categories');
        this.categories = response.data; // Populate the categories
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    },
    handleCategorySelect(categoryID) {
      // Emit the selected categoryID to the parent component
      this.$emit('categorySelected', categoryID);
    }
  },
  mounted() {
    this.fetchCategories(); // Fetch the categories when the component is mounted
  }
};
</script>


<style scoped>
.categories-list {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background-color: #343a40;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

h3 {
  color: #fff;
  margin: 0;
  padding-left: 10px;
}

.list-group-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.list-group-item:hover {
  background-color: #edf2f7;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.list-group-item:last-child {
  margin-bottom: 0;
}

.list-group-item i {
  margin-right: 15px;
  font-size: 1.2rem;
}
</style>
