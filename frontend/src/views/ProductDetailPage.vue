<template>
  <div v-if="product" class="container-fluid bg-light vh-100">
    <!-- Container Box for Product Details -->
    <div class="row mt-3 justify-content-center">
      <div class="col-md-8">
        <div class="p-3 rounded">
          <!-- Product Name -->
          <div class="row">
            <div class="col-12 mb-3">
              <h3>{{ product.productName }}</h3>
            </div>
          </div>

          <div class="row">
            <!-- Product Image -->
            <div class="col-md-5 text-center">
              <img :src="product.imageURL" class="img-fluid" />
            </div>

            <!-- Description and Add to Cart / Quantity Controls -->
            <div class="col-md-7">
              <h4>Description</h4>
              <p>{{ product.description }}</p>

              <div class="row mt-4 mb-2">
                <div class="col-12">
                  <h4>Nutritional Information</h4>
                  <p v-if="nutritionalInfo">{{ nutritionalInfo }}</p>
                  <p v-else>Loading nutritional information...</p> <!-- Nutritional info will be populated here -->
                  <p class="font-italic text-muted" v-if="nutritionalInfo">This content is AI generated. AI may not
                    always be accurate.</p>
                </div>
              </div>

              <div v-if="!isInCart">
                <!-- Add to Cart Button -->
                <button class="btn btn-dark w-100 mt-2" @click="addToCart">
                  Add to Cart
                </button>
              </div>

              <div v-else class="quantity-controls d-flex align-items-center mt-2">
                <!-- Quantity Controls -->
                <button class="btn btn-dark" @click="changeQuantity(-1)" :disabled="quantity <= 1">-</button>
                <span class="mx-3">{{ quantity }}</span>
                <button class="btn btn-dark" @click="changeQuantity(1)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <NotFoundPage v-else />
</template>

<script>
import axios from 'axios';
import NotFoundPage from './NotFoundPage.vue';
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default {
  name: 'ProductDetailPage',
  components: {
    NotFoundPage,
  },
  data() {
    return {
      product: null, // Product details
      quantity: 1, // Initial quantity
      isInCart: false, // Check if the product is in the cart
      nutritionalInfo: '', // Nutritional information
    };
  },
  methods: {
    async fetchProduct() {
      try {
        const response = await axios.get(`http://localhost:5500/products/${this.$route.params.productID}`);
        this.product = response.data;

        // Fetch nutritional information after fetching the product
        await this.fetchNutritionalInfo(this.product.imageURL);

        // Check if product is already in the cart
        await this.checkProductInCart();
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    },

    async fetchNutritionalInfo(imageURL) {
      try {
        const genAI = new GoogleGenerativeAI("AIzaSyBYkWmK_OlRDkHmNdjItm0JB8J_KsqQlY8");
        const mimeType = this.getMimeType(imageURL); // Get MIME type

        const imagePart = await this.urlToGenerativePart(imageURL, mimeType);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          "What nutritional information can you provide based on the item not on the company or product brand. Please do not bold your responses and don't make me say it twice",
          imagePart,
        ]);

        const response = await result.response;
        this.nutritionalInfo = await response.text(); // Set the nutritional info
      } catch (error) {
        console.error('Failed to fetch nutritional information:', error);
        this.nutritionalInfo = 'Nutritional information could not be retrieved.';
      }
    },

    getMimeType(url) {
      const extension = url.split('.').pop().toLowerCase();
      const mimeTypes = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        jfif: 'image/jpeg',
        webp: 'image/webp'
      };

      return mimeTypes[extension] || 'image/jpeg';  // Default to image/jpeg if the type is unknown
    },

    // Helper function to download an image from a URL and convert it to a base64 string
    async urlToGenerativePart(url, mimeType) {
      const response = await axios.get(url, { responseType: "blob" }); // Fetch the image as a blob
      const blob = response.data;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1]; // Split to remove the data URL prefix
          resolve({
            inlineData: {
              data: base64String,
              mimeType,
            },
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob); // Read the Blob as a data URL
      });
    },
    async checkProductInCart() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:5500/cart/${this.product.productName}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data) {
          this.isInCart = true;
          this.quantity = response.data.quantity; // Set current quantity in the cart
        }
      } catch (error) {
        console.error('Failed to check if product is in cart:', error);
      }
    },

    async addToCart() {
      try {
        const token = localStorage.getItem('authToken');

        const payload = {
          imageURL: this.product.imageURL,
          productName: this.product.productName,
          productPrice: this.product.price,
          quantity: this.quantity
        };

        // Send POST request to add the product to the cart
        await axios.post('http://localhost:5500/cart', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        this.isInCart = true;
        console.log('Product added to cart');
      } catch (error) {
        console.error('Failed to add product to cart:', error);
      }
    },

    async changeQuantity(amount) {
      const newQuantity = this.quantity + amount;
      if (newQuantity >= 1) {
        this.quantity = newQuantity;
        await this.updateQuantity();
      }
    },

    async updateQuantity() {
      try {
        const token = localStorage.getItem('authToken');

        const payload = {
          productName: this.product.productName,
          quantity: this.quantity
        };

        // Send PATCH request to update the product quantity in the cart
        await axios.patch('http://localhost:5500/cart', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Product quantity updated');
      } catch (error) {
        console.error('Failed to update product quantity:', error);
      }
    },
  },
  async mounted() {
    await this.fetchProduct(); // Fetch product details when the component is mounted
  }
};
</script>

<style scoped>
.container-fluid {
  padding: 0;
}

img {
  max-width: 100%;
  height: auto;
}

p {
  text-align: justify;
}

.rounded {
  border-radius: 5px;
}

.p-3 {
  padding: 1rem;
}

.quantity-controls {
  display: flex;
  justify-content: center;
  align-items: center;
}

.quantity-controls button {
  margin: 0 10px;
}
</style>
