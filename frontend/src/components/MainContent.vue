<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-12 col-md-3 col-lg-2 bg-dark p-4 text-white sidebar">
        <h3 class="mb-4 mt-3 ml-0">Manage <br> your account</h3>
        <ul class="list-group">
          <li class="list-group-item list-group-item-action bg-dark text-white border-light"
            @click="currentComponent = 'MyProfile'">
            My Profile
          </li>
          <li class="list-group-item list-group-item-action bg-dark text-white border-light"
            @click="currentComponent = 'MyAddresses'">
            My Addresses
          </li>
          <li class="list-group-item list-group-item-action bg-dark text-white border-light"
            @click="currentComponent = 'MyPayments'">
            My Payments
          </li>
          <li class="list-group-item list-group-item-action bg-dark text-white border-light"
            @click="currentComponent = 'MyOrders'">
            My Orders
          </li>
          <li class="list-group-item list-group-item-action bg-dark text-white border-light"
            @click="currentComponent = 'ChangePassword'">
            Change Password
          </li>
        </ul>
      </div>

      <!-- Content -->
      <div class="col-12 col-md-9 col-lg-10 p-4">
        <component :is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import MyProfile from './MyProfile.vue'
import MyPayments from './MyPayments.vue'
import MyAddresses from './MyAddresses.vue'
import ChangePassword from './ChangePassword.vue'
import MyOrders from './MyOrders.vue'

export default {
  name: 'MainContent',
  components: {
    MyProfile,
    MyPayments,
    MyAddresses,
    MyOrders,
    ChangePassword
  },
  data() {
    return {
      currentComponent: 'MyProfile'
    }
  }
}
</script>

<style scoped>
.sidebar {
  min-height: 100vh;
  height: auto;
}

.list-group-item {
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  color: #ffffff;
  border: 1px solid #495057;
  cursor: pointer;
  transition: all 0.3s ease;
}

.list-group-item:hover {
  background-color: #495057;
  transform: scale(1.05);
}

.content {
  background-color: #f8f9fa;
  color: #000;
  padding: 20px;
}
</style>
