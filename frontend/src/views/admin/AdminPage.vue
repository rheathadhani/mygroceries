<template>
  <div class="sidebar-container">
    <!-- Sidebar Menu -->
    <ul class="sidebar-menu bg-dark text-light">
      <h3 class="pt-4 pb-1 pl-3 mb-0">MyGroceries</h3>
      <p class="pl-3 mb-4 font-italic">Admin's Space</p>
      <li class="sidebar-item" @click="showContent('dashboard')">
        <font-awesome-icon :icon="['fas', 'chart-line']" size="xs" style="color: #ffffff; margin-right: 10px;" /> Dashboard
      </li>
      <li class="sidebar-item" @click="showContent('customers')">
        <font-awesome-icon :icon="['fas', 'users']" size="xs" style="color: #ffffff; margin-right: 10px;" /> Customers
      </li>
      <li class="sidebar-item" @click="showContent('categories')">
        <font-awesome-icon :icon="['fas', 'list']" size="xs" style="color: #ffffff;margin-right: 10px;" /> Categories
      </li>
      <li class="sidebar-item" @click="showContent('products')">
        <font-awesome-icon :icon="['fas', 'box-open']" size="xs" style="color: #ffffff; margin-right: 10px;" /> Products
      </li>
      <li class="sidebar-item" @click="showContent('orders')">
        <font-awesome-icon :icon="['fas', 'cart-shopping']" size="xs" style="color: #ffffff;margin-right: 10px" />Orders
      </li>
    </ul>

    <!-- Dynamic content based on the selected item -->
    <div class="content-container">
      <!-- Render the component dynamically based on selectedContent -->
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script>
import A_Dashboard from '../../components/A-Dashboard.vue';
import A_CustomerManagement from '../../components/A-CustomerManagement.vue';
import A_CategoriesManagement from '../../components/A-CategoriesManagement.vue';
import A_ProductManagement from '../../components/A-ProductManagement.vue';
import A_OrderManagement from '../../components/A-OrderManagement.vue';



export default {
  name: 'AdminSidebar',
  data() {
    return {
      selectedContent: 'dashboard', // Default content to display
    };
  },
  computed: {
    currentComponent() {
      // Return the appropriate component based on selectedContent
      switch (this.selectedContent) {
        case 'dashboard':
          return A_Dashboard;
        case 'customers':
          return A_CustomerManagement;
        case 'categories':
          return A_CategoriesManagement;
        case 'products':
          return A_ProductManagement;
        case 'orders':
          return A_OrderManagement;
        default:
          return A_Dashboard; // Fallback to Dashboard if nothing matches
      }
    }
  },
  methods: {
    showContent(content) {
      this.selectedContent = content;
    }
  }
};
</script>

<style scoped>
.sidebar-container {
  display: flex;
  width: 100%;
}

.sidebar-menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 250px; /* Set the width for the sidebar */
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
  min-height: 100vh;
}

.sidebar-item {
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s;
}

.sidebar-item i {
  margin-right: 10px;
}

.content-container {
  flex-grow: 1;
  padding: 20px;
}
</style>
