<template>
  <div>
    <div v-for="product in products" :key="product.productID" class="product-container">
      <img :src="product.imageURL" alt="Product Image" class="product-image">
      <div class="details-wrap">
        <h3>{{ product.productName }}</h3>
        <p>Unit Price: RM {{ product.productPrice }}</p>
        <p>Total: RM {{ (product.productPrice * product.quantity).toFixed(2) }}</p>
        <!-- Quantity Controls -->
        <div class="quantity-controls">
          <button @click="changeQuantity(product, -1)" :disabled="product.quantity <= 1"
            class="quantity-button">-</button>
          <span class="quantity-display">{{ product.quantity }}</span>
          <button @click="changeQuantity(product, 1)" class="quantity-button">+</button>
        </div>
      </div>
      <button class="remove-button btn btn-dark" @click="emitRemoveProduct(product.productID)">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductsList',
  props: ['products'],
  methods: {
    changeQuantity(product, change) {
      const newQuantity = product.quantity + change;

      if (newQuantity >= 1) {
        this.$emit('updateQuantity', product.productID, newQuantity);
      }
    },
    emitRemoveProduct(productID) {
      this.$emit('removeProduct', productID); // Emit the product ID to the parent component
    }
  }
};
</script>

<style scoped>
.product-container {
  align-content: 'center';
  border-bottom: 1px solid #ddd;
  display: flex;
  padding: 16px;
  width: 100%;
}

.product-image {
  flex: 1;
  height: 100px;
  max-width: 100px;
}

.details-wrap {
  padding: 0 16px;
  flex: 3;
}

.quantity-controls {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.quantity-button {
  background-color: #343a40;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  font-size: 16px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.quantity-button:hover {
  background-color: #495057;
}

.remove-button {
  flex: 1;
  margin: auto;
}
</style>