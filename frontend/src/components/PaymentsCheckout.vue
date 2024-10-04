<template>
  <div class="payments-checkout-container card shadow-sm mx-auto">
    <!-- Card Header for Payment Details -->
    <div class="card-header bg-dark text-white text-center mb-2 py-2">
      Payment Details
    </div>

    <!-- Bank Cards Section -->
    <div class="card-body">
      <div class="payment-method-section">
        <p class="ml-1">Bank Cards</p>
        <ul class="list-group">
          <!-- Use card.cardID instead of card.id -->
          <li v-for="card in bankCards" :key="card.cardID"
            class="list-group-item d-flex justify-content-between align-items-center">
            <div class="payment-item-details w-100">
              <!-- Format card type and show last 4 digits of card number -->
              <div class="fw-bold">{{ formatCardType(card.cardType) }}</div>
              <div>**** **** **** {{ card.cardNumber.slice(-4) }}</div>
            </div>
            <div class="radio-button">
              <input type="radio" :id="'card' + card.cardID" name="paymentMethod" :value="'card-' + card.cardID"
                v-model="selectedPaymentMethod" />
            </div>
          </li>
        </ul>
        <div v-if="bankCards.length === 0" class="text-muted fst-italic">No card details available.</div>
      </div>

      <!-- Bank Accounts Section -->
      <div class="payment-method-section mt-3">
        <p class="ml-1">Bank Accounts</p>
        <ul class="list-group">
          <!-- Use account.accountID instead of account.id -->
          <li v-for="account in bankAccounts" :key="account.accountID"
            class="list-group-item d-flex justify-content-between align-items-center">
            <div class="payment-item-details w-100">
              <div class="fw-bold">{{ account.bankName }}</div>
              <div>{{ account.bankAccountHolderName }}</div>
              <div>**** {{ account.bankAccountNumber.slice(-4) }}</div>
            </div>
            <div class="radio-button">
              <input type="radio" :id="'account' + account.accountID" name="paymentMethod" :value="'account-' + account.accountID"
                v-model="selectedPaymentMethod" />
            </div>
          </li>
        </ul>
        <div v-if="bankAccounts.length === 0" class="text-muted fst-italic">No bank account details available.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentsCheckout',
  props: {
    bankAccounts: Array,
    bankCards: Array
  },
  data() {
    return {
      selectedPaymentMethod: '' // Track selected payment method
    };
  },
  methods: {
    formatCardType(cardType) {
      // Convert the card type for display
      if (cardType === 'visa') return 'Visa';
      if (cardType === 'mastercard') return 'MasterCard';
      return cardType; // Default case, just return as is
    }
  },
  watch: {
    selectedPaymentMethod(newValue) {
      console.log("Selected Payment Method:", newValue); // Debugging
      this.$emit('paymentMethodSelected', newValue);
    }
  }
};
</script>



<style scoped>
.payments-checkout-container {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 8px;
  background-color: #ffffff;
}

.card-header {
  font-size: 16px;
}

.payment-method-section {
  margin-bottom: 10px;
}

.list-group-item {
  padding: 8px;
  border-bottom: 1px solid #e9ecef;
}

.radio-button input {
  width: 16px;
  height: 16px;
}

p {
  margin-bottom: 4px;
}
</style>
