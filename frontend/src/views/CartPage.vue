<template>
  <div id="page-wrap" class="container mt-2 bg-light p-4 rounded">
    <div class="card shadow-sm">
      <!-- Card Body for Product List and Total -->
      <div class="card-body pt-2">
        <ProductsList :products="cartItems" @updateQuantity="updateQuantity" @removeProduct="removeFromCart"></ProductsList>

        <!-- Total Price -->
        <h3 id="total-price" class="text-end mt-4">Total: RM {{ totalPrice }}</h3>

        <!-- Checkout Button -->
        <router-link to="/checkout" id="checkout-link">
          <button id="checkout-button" class="btn btn-dark w-100 mt-3" @click="saveCartForCheckout">Proceed to Checkout</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ProductsList from "../components/ProductsList.vue";
import axios from 'axios';

export default {
  name: 'CartPage',
  components: {
    ProductsList,
  },
  data() {
    return {
      cartItems: [] // Start with an empty cart
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce(
        (sum, item) => sum + (parseFloat(item.productPrice) || 0) * (item.quantity || 1),
        0,
      );
    }
  },
  methods: {
    async fetchCartItems() {
      try {
        const token = localStorage.getItem('authToken'); // Get token from localStorage
        const response = await axios.get('http://localhost:5500/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.cartItems = response.data.map(item => ({
          ...item,
          productPrice: parseFloat(item.productPrice) || 0, // Ensure productPrice is a number
          quantity: parseInt(item.quantity, 10) || 1 // Default quantity to 1 if not set
        }));
      } catch (error) {
        console.log("Cart is empty...");
      }
    },

    async removeFromCart(productName) {
      const product = this.cartItems.find(item => item.productName === productName);

      if (!product) return;

      try {
        const token = localStorage.getItem('authToken');
        // Send DELETE request to remove the product by productName
        await axios.delete('http://localhost:5500/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: { productName: product.productName } // Send productName in the request body
        });

        // Remove the item from cartItems after successful deletion
        this.cartItems = this.cartItems.filter(item => item.productName !== productName);
      } catch (error) {
        console.error('Failed to remove product from cart:', error);
        alert('Failed to remove product from cart. Please try again.');
      }
    },

    async updateQuantity(productName, newQuantity) {
      const product = this.cartItems.find(item => item.productName === productName);
      if (product) {
        try {
          const token = localStorage.getItem('authToken');
          await axios.patch('http://localhost:5500/cart', {
            productName,
            quantity: newQuantity
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          product.quantity = newQuantity;
        } catch (error) {
          console.error('Failed to update quantity:', error);
        }
      }
    },

    saveCartForCheckout() {
      // Save cart items to localStorage before navigating to checkout
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  },

  async mounted() {
    await this.fetchCartItems(); // Fetch cart items when the page loads
  }
};
</script>

<style scoped>
#total-price {
  padding: 16px 0;
  text-align: right;
}

#checkout-button {
  width: 100%;
  transition: background-color 0.3s, color 0.3s;
}

.product-container {
  align-content: center;
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

.remove-button {
  flex: 1;
  margin: auto;
}
</style>
