<template>
  <div class="container mt-4">
    <!-- Row for Checkout Sections -->
    <div class="row">
      <!-- First Column for Personal Details and Payment Options -->
      <div class="col-md-6 mb-3">
        <PersonalDetailsCheckout ref="personalDetails" :addresses="fetchedAddresses"
          @personalDetailsCompleted="handlePersonalDetailsCompleted" />

        <br>
        <PaymentsCheckout :bankAccounts="bankAccounts" :bankCards="bankCards"
          @paymentMethodSelected="handlePaymentMethodSelected" />
      </div>

      <!-- Second Column for Order List and Schedule -->
      <div class="col-md-6 mb-2">
        <OrderListCheckout :orders="cartItems" />
        <br>
        <ScheduleCheckout @scheduleSet="handleScheduleSet" />
      </div>
    </div>

    <!-- Row for Pay Now Button -->
    <div class="row">
      <div class="col-12 text-center">
        <button :disabled="!isPayNowEnabled" class="btn btn-dark btn-lg w-100" @click="handlePayNow">Pay Now</button>
      </div>
    </div>
  </div>
</template>

<script>
import OrderListCheckout from '../components/OrderListCheckout.vue';
import PersonalDetailsCheckout from '../components/PersonalDetailsCheckout.vue';
import PaymentsCheckout from '../components/PaymentsCheckout.vue';
import ScheduleCheckout from '../components/ScheduleCheckout.vue';
import axios from 'axios';

export default {
  name: "CheckoutPage",
  components: {
    OrderListCheckout,
    PersonalDetailsCheckout,
    ScheduleCheckout,
    PaymentsCheckout
  },
  data() {
    return {
      cartItems: [],
      bankAccounts: [],
      bankCards: [],
      fetchedAddresses: [], // Will store addresses fetched from the backend
      isPersonalDetailsCompleted: false,
      isPaymentMethodSelected: false,
      isScheduleSet: false
    };
  },
  computed: {
    isPayNowEnabled() {
      //console.log("Personal Details:", this.isPersonalDetailsCompleted);
      //console.log("Payment Method Selected:", this.isPaymentMethodSelected);
      //console.log("Schedule Set:", this.isScheduleSet);
      // Enable the button if all details are filled
      return this.isPersonalDetailsCompleted && this.isPaymentMethodSelected && this.isScheduleSet;
    }
  },
  methods: {
    handlePersonalDetailsCompleted(isCompleted) {
      this.isPersonalDetailsCompleted = isCompleted;

      // Capture the selected address from the child component (PersonalDetailsCheckout)
      this.selectedAddress = this.$refs.personalDetails.selectedAddress;
      //this.selectedAddress = selectedAddress; // Now storing the selected address
      console.log("Selected Address Captured:", this.selectedAddress);
    },

    handlePaymentMethodSelected(paymentMethod) {
      this.isPaymentMethodSelected = paymentMethod; // Store the actual payment method string
      console.log("Payment Method Selected:", paymentMethod);
    },

    handleScheduleSet(selectedDateTime) {
      if (selectedDateTime) {
        this.isScheduleSet = true; // The schedule is set
        this.selectedDateTime = selectedDateTime; // Capture the actual date value
        console.log("Schedule Set:", selectedDateTime);
      } else {
        this.isScheduleSet = false;
        this.selectedDateTime = null; // Reset if no date is selected
        console.log("Schedule cleared.");
      }
      console.log("Selected Date & Time:", this.selectedDateTime);
    },
    async fetchCartItems() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5500/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.cartItems = response.data;
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
        alert('Failed to fetch cart items.');
      }
    },
    async fetchPaymentMethods() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5500/payments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Check the structure of the data you're receiving
        console.log('Payment Methods Response:', response.data);

        this.bankAccounts = response.data.bankAccounts;
        this.bankCards = response.data.bankCards;

        // Ensure that bankAccounts and bankCards are correctly populated
        console.log('Bank Accounts:', this.bankAccounts);
        console.log('Bank Cards:', this.bankCards);
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
        alert('Failed to fetch payment methods.');
      }
    },
    async fetchAddresses() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5500/addresses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.fetchedAddresses = response.data; // Set the fetched addresses
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        alert('Failed to fetch addresses.');
      }
    },
    async handlePayNow() {
      try {
        //console.log("Selected Address in Pay Now:", this.selectedAddress);

        // Ensure the selectedAddress is properly defined and has the 'address' field
        if (!this.selectedAddress.address) {
          throw new Error('Address information is missing.');
        }

        // Before trying to format the date, log it to check the format
        console.log("Raw Selected Date & Time:", this.selectedDateTime);

        // Validate if `this.selectedDateTime` is not undefined or an empty string
        if (!this.selectedDateTime || isNaN(new Date(this.selectedDateTime))) {
          console.error("Invalid date value:", this.selectedDateTime);
          alert("Invalid date selected. Please pick a valid date and time.");
          return;
        }

        // Declare formattedDateTime outside of the try-catch block
        let formattedDateTime;

        // Convert selectedDateTime to MySQL compatible DATETIME format
        try {
          formattedDateTime = new Date(this.selectedDateTime).toISOString().slice(0, 19).replace('T', ' ');
          console.log("Formatted Date & Time:", formattedDateTime); // Log the formatted value
        } catch (error) {
          console.error("Error formatting date:", error.message);
          alert("Invalid date selected.");
          return;
        }

        // Check if payment method is selected and extract IDs properly
        const paymentType = this.isPaymentMethodSelected.startsWith('card-') ? 'card' : 'bankAccount';
        const paymentID = paymentType === 'card' ? this.isPaymentMethodSelected.split('-')[1] : null;
        const bankAccountID = paymentType === 'bankAccount' ? this.isPaymentMethodSelected.split('-')[1] : null;

        // Validate payment method
        if (!paymentID && !bankAccountID) {
          throw new Error('Payment method information is missing.');
        }

        // Create the order payload
        const orderPayload = {
          scheduledDate: formattedDateTime, // Use the formatted date and time
          shippingAddress: this.selectedAddress.address, // Only send the address
          paymentType,
          cardID: paymentID,
          bankAccountID,
          orderItems: this.cartItems,
          totalPrice: this.cartItems.reduce((total, item) => total + item.quantity * item.productPrice, 0)
        };

        const token = localStorage.getItem('authToken');
        const response = await axios.post('http://localhost:5500/checkout', orderPayload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Order placed successfully:', response.data);
        alert('Order placed successfully!');

        console.log("Clearing cart items...")
        this.clearCartItems();
        this.$router.push('/profile');
      } catch (error) {
        console.error('Failed to place the order:', error.message);
        alert('Failed to place the order.');
      }
    },

    clearCartItems() {
      const token = localStorage.getItem('authToken');
      console.log(token);
      axios.delete('http://localhost:5500/cart/clear', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(() => {
          console.log('All cart items cleared successfully');
          this.cartItems = [];
        })
        .catch(error => {
          console.error('Failed to clear cart:', error.message);
        });
    }




  },
  mounted() {
    this.fetchCartItems();
    this.fetchPaymentMethods(); // Fetch bank cards and accounts when component is mounted
    this.fetchAddresses(); // Fetch addresses when component is mounted
  }
};
</script>




<style scoped>
.container {
  max-width: 1050px;
  /* Adjust the width as needed */
  margin: 0 auto;
  /* Center the container */
}

.row {
  margin-bottom: 20px;
  /* Add spacing between rows */
}

.btn {
  margin-top: 20px;
  /* Add spacing above the button */
}

.btn[disabled] {
  background-color: #ccc;
  /* Gray out the button when disabled */
  cursor: not-allowed;
}
</style>
