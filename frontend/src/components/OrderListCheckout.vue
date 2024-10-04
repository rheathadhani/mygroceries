<template>
  <div class="order-list card shadow-sm">
    <!-- Card Header for Order Details -->
    <div class="card-header bg-dark text-white text-center mb-2 py-2">
      Your Order from MyGroceries
    </div>

    <!-- Order Items List -->
    <div class="card-body">
      <ul class="list-group">
        <li v-for="(item, index) in orders" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
          <div class="item-details d-flex justify-content-between w-100">
            <!-- Display product name and quantity -->
            <span class="item-name">{{ item.productName }}</span>
            <span class="item-quantity">x{{ item.quantity }}</span>
          </div>
          <!-- Display total price per product -->
          <span class="badge bg-dark rounded-pill p-2 text-white ml-2">{{ formatPrice(item.productPrice * item.quantity) }}</span>
        </li>
      </ul>
    </div>

    <!-- Order Total -->
    <div class="card-footer d-flex justify-content-between" style="background-color:#ffffff;">
      <span>Total:</span>
      <span class="fw-bold">{{ formatPrice(totalPrice) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderListCheckout',
  props: ['orders'], // Accept the orders as props
  computed: {
    totalPrice() {
      return this.orders.reduce((total, item) => {
        return total + (item.productPrice * item.quantity);
      }, 0);
    }
  },
  methods: {
    formatPrice(value) {
      return `RM ${value.toFixed(2)}`;
    }
  }
};
</script>


<style scoped>
.order-list {
  max-width: 500px; 
  margin: 0 auto; 
  border-radius: 8px;
  background-color: #ffffff;
}

.card-header {
  font-size: 16px;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  overflow: hidden;
  white-space: nowrap;
}

.item-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  overflow: hidden;
}

.item-name {
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis; 
  white-space: nowrap;
  max-width: 70%; /* Set a max-width to ensure the ellipsis effect */
}

.item-quantity {
  font-weight: bold;
  margin-left: 10px;
}

.badge {
  flex-shrink: 0; /* Prevent the badge from shrinking */
  white-space: nowrap;
}

.card-footer {
  border-top: 1px solid #ccc; /* Consistent styling with other sections */
  font-size: 18px;
  padding-top: 10px;
}

</style>
