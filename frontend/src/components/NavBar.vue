<template>
  <nav v-if="isLoggedIn()" id="nav-bar" class="navbar navbar-expand-lg navbar-dark bg-dark">
    <!-- Brand -->
    <router-link to="/products" class="navbar-brand">
      <h3 class="d-none d-lg-block mt-2">MyGroceries</h3>
      <h4 class="d-lg-none mt-2">MyGroceries</h4>
    </router-link>

    <!-- Toggle button for mobile view -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
      aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Collapsible content -->
    <div class="collapse navbar-collapse" id="navbarContent">
      <!-- Search bar and button (centered in the navbar) -->
      <div class="search-container d-flex justify-content-center mx-auto my-lg-0">
        <input type="text" v-model="searchTerm" class="form-control me-2" placeholder="Search for items"
          style="width: 60%;" @keyup.enter="searchProducts" />
        <button class="btn btn-light search-button border-dark" @click="searchProducts">Search</button>
      </div>

      <!-- Navbar links (aligned to the right in the navbar) -->
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link to="/settings" class="nav-link">Settings</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">Profile</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/cart" class="nav-link">My Cart</router-link>
        </li>
        <!-- Logout option -->
        <li class="nav-item">
          <a class="nav-link" href="#" @click="logout">Logout</a>
        </li>
      </ul>
    </div>
  </nav>

  <div v-else>
    <!-- When not logged in, hide the navbar and show a "Back to Login" button -->
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      searchTerm: '' // Bind the search input to this data
    };
  },
  methods: {
    isLoggedIn() {
      // Logic to check if the user is logged in (for example, based on the token)
      return !!localStorage.getItem('authToken'); // Check if a token exists in localStorage
    },
    searchProducts() {
      if (this.searchTerm.trim()) {
        // Push to the /products route with the search query as a parameter
        this.$router.push({ path: '/products', query: { search: this.searchTerm } });
      }
    },
    logout() {
      // Clear the token from localStorage
      localStorage.removeItem('authToken');
      // Redirect to the welcome page
      this.$router.push('/welcome');
    },
    goToLogin() {
      this.$router.push("/welcome"); // Redirect to the login/welcome page
    }
  }
};
</script>

<style scoped>
#nav-bar {
  width: 100%;
  height: auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.5px solid #ddd;
  box-sizing: border-box;
}

.navbar-toggler {
  padding: 0.25rem 0.5rem;
  font-size: 1.25rem;
  line-height: 1;
}

.search-container {
  width: 100%;
  max-width: 700px;
}

.navbar-nav {
  margin-left: auto;
}

@media (max-width: 992px) {
  .search-container {
    max-width: 60%;
  }

  .navbar-brand h1 {
    display: none;
  }

  .navbar-brand h4 {
    display: block;
  }
}

@media (max-width: 576px) {
  .search-container {
    max-width: 120%;
  }
}

.search-button {
  width: auto;
  height: auto;
  padding: 5px 10px;
}

@media (max-width: 992px) {
  .search-button {
    padding: 4px 8px;
  }
}
</style>
