<template>
  <div class="sidebar-container">
    <ul class="sidebar-menu bg-dark text-light">
      <h3 class="pt-4 pb-1 pl-3 mb-0">MyGroceries</h3>
      <p class="pl-3 mb-4">Admin's Space</p>
      <li class="sidebar-item" @click="showContent('dashboard')">
        <i class="fas fa-home"></i> Dashboard
      </li>
      <li class="sidebar-item" @click="showContent('customers')">
        <i class="fas fa-users"></i> Customers
      </li>
      <li class="sidebar-item" @click="showContent('categories')">
        <i class="fas fa-list"></i> Categories
      </li>
      <li class="sidebar-item" @click="showContent('products')">
        <i class="fas fa-box"></i> Products
      </li>
      <li class="sidebar-item" @click="showContent('orders')">
        <i class="fas fa-shopping-cart"></i> Orders
      </li>
    </ul>

    <!-- Dynamic content based on the selected item -->
    <div class="content-container">
      <div v-if="selectedContent === 'dashboard'">
        <h2>Dashboard</h2>
        <p>Welcome to the dashboard. Here you can see an overview of your data.</p>
      </div>
      <div v-if="selectedContent === 'customers'">
        <h2>Customers</h2>
        <p>View and manage your customers.</p>
      </div>
      <div v-if="selectedContent === 'categories'">
        <h2>Categories</h2>
        <p>Manage product categories here.</p>
      </div>
      <div v-if="selectedContent === 'products'">
        <h2>Products</h2>
        <p>View and manage your products.</p>
      </div>
      <div v-if="selectedContent === 'orders'">
        <h2>Orders</h2>
        <p>Manage customer orders here.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSidebar',
  data() {
    return {
      selectedContent: 'dashboard' // Default content to display
    };
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
