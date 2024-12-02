<template>
  <div class="product-item card">
    <div class="card-img-wrapper d-flex align-items-center justify-content-center" @click="goToProductPage">
      <img v-bind:src="product.imageURL" class="card-img-top" />
    </div>
    <div class="card-body text-center">
      <h5 class="product-name card-title">{{ product.productName }}</h5>
      <p class="product-price card-text">RM {{ product.price }}</p>

      <!-- Quantity controls (Add to cart / Increase/Decrease) -->
      <div class="quantity-controls">
        <button v-if="!showQuantityControls" id="quantity" class="btn btn-dark" @click.stop="addToCart"> + </button>
        <div v-else>
          <button id="quantity" class="btn btn-dark" @click.stop="increaseQuantity"> + </button>
          <input type="text" v-model="quantity" id="quantity-input" class="form-control d-inline-block text-center"
            disabled />
          <button id="quantity" class="btn btn-dark" @click.stop="decreaseQuantity"> - </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductsGridItem',
  props: ['product'],
  data() {
    return {
      quantity: 1, // Default quantity
      showQuantityControls: false, // Show increase/decrease buttons after the product is added to cart
    };
  },
  methods: {
    async addToCart() {
      this.showQuantityControls = true;

      try {
        const token = localStorage.getItem('authToken'); // Get token from localStorage

        const payload = {
          imageURL: this.product.imageURL,
          productName: this.product.productName,
          productPrice: this.product.price,
          quantity: this.quantity // Send the current quantity
        };

        // Send POST request to add the product to the cart
        await axios.post('https://mygroceries-backend.vercel.app/cart', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Product added to cart');
      } catch (error) {
        console.error('Failed to add product to cart:', error);
        alert('Failed to add product to cart. Please try again.');
      }
    },

    async updateQuantity() {
      try {
        const token = localStorage.getItem('authToken'); // Get token from localStorage

        const payload = {
          productName: this.product.productName,
          quantity: this.quantity // Send the updated quantity
        };

        // Send PATCH request to update the quantity in the cart
        await axios.patch('https://mygroceries-backend.vercel.app/cart', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Product quantity updated');
      } catch (error) {
        //console.error('Failed to update product quantity:', error);
        //alert('Failed to update product quantity. Please try again.');
      }
    },

    increaseQuantity() {
      this.quantity += 1;
      this.updateQuantity(); // Update quantity on the server when increased
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1;
        this.updateQuantity(); // Update quantity on the server when decreased
      }
    },

    goToProductPage() {
      this.$router.push('/products/' + this.product.productID);
    }
  }
};
</script>



<style scoped>
.product-item {
  border-radius: 8px;
  box-shadow: 0px 2px 5px #888;
  background-color: #fff;
  /* Ensure the product item has a white background */
  padding: 15px;
  /* Reduced padding */
  position: relative;
  cursor: pointer;
  width: calc(100% / 4 - 40px);
  /* Adjusted width to fit 4 items per row with some margin */
  /* Added margin to create space between cards */
}

.card-img-wrapper {
  height: 120px;
  /* Reduced height for smaller image */
  width: 120px;
  /* Reduced width for smaller image */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px auto;
  /* Adjusted margin */
}

img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  /* Ensure the image fits within the bounds */
}

.product-name {
  margin-bottom: 4px;
  /* Adjusted margin */
  font-size: 1rem;
  /* Reduced font size */
  font-weight: 500;
  /* Maintain consistent text size and weight */
}

.product-price {
  font-size: 0.9rem;
  /* Reduced font size */
  margin-bottom: 8px;
  /* Adjusted margin */
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  /* Adjusted margin */
}

#quantity {
  padding: 5px;
  /* Reduced padding for button size */
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 5px;
  transition: all ease 0.3s;
  width: 3vw;
}

#quantity:hover {
  transform: scale(1.1);
}

#quantity-input {
  width: 40px;
  /* Adjusted width for better alignment */
  height: 25px;
  /* Adjusted height */
  border: 1px solid #000000;
  background-color: #fff;
  margin: 0 4px;
  /* Adjusted margin */
}
</style>
