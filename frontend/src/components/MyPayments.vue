<template>
  <div class="my-payments-container">

    <!-- Bank Accounts Section -->
    <div class="payment-section">
      <div class="section-title">Bank Accounts</div>
      <div v-if="bankAccounts.length > 0" class="payment-method">
        <div v-for="(account, index) in bankAccounts" :key="account.accountID"
          class="d-flex align-items-center justify-content-between py-3 border-bottom">
          <!-- Display the account number with only the last four digits -->
          <div class="bank-details flex-grow-1 ml-3">
            <div class="bank-name fw-bold">{{ account.bankName }}</div>
            <div class="bank-number">{{ `**** **** **** ${account.bankAccountNumber.slice(-4)}` }}</div>
            <div class="account-holder">{{ account.bankAccountHolderName }}</div>
            <small class="text-muted">Account #{{ index + 1 }}</small>
          </div>
          <div class="actions">
            <button @click="deleteAccount(account.accountID)"
              class="btn btn-dark btn-sm btn-lg w-100 mb-2">Delete</button>
          </div>
        </div>
      </div>
      <div v-else class="text-muted fst-italic">You don't have any bank accounts yet.</div>
      <p v-if="deleteAccountError" class="text-danger">{{ deleteAccountError }}</p>

      <div class="add-button-container text-center mt-3">
        <button @click="toggleAddBankAccount" class="btn btn-dark">
          {{ isAddingBankAccount ? 'Cancel' : '+ Add New Bank Account' }}
        </button>
      </div>

      <!-- Add New Bank Account Form -->
      <div v-if="isAddingBankAccount" class="add-new-form mt-3">
        <input v-model="newBankAccount.bankAccountHolderName" placeholder="Account Holder Name"
          class="form-control mb-2" />
        <input v-model="newBankAccount.bankAccountNumber" placeholder="Account Number" class="form-control mb-2" />
        <input v-model="newBankAccount.bankName" placeholder="Bank Name" class="form-control mb-2" />

        <button @click="addNewBankAccount" class="btn btn-dark btn-sm me-2 mr-2">Save</button>
        <button @click="toggleAddBankAccount" class="btn btn-light btn-sm border-dark">Cancel</button>
      </div>
    </div>

    <!-- Bank Cards Section -->
    <div class="payment-section mt-4">
      <div class="section-title">Bank Cards</div>
      <div v-if="bankCards.length > 0" class="payment-method">
        <div v-for="(card, index) in bankCards" :key="card.cardID"
          class="d-flex align-items-center justify-content-between py-3 border-bottom">
          <!-- Format card number and display card type in proper format -->
          <div class="card-details flex-grow-1 ml-3">
            <div class="card-type fw-bold">
              {{ card.cardType === 'visa' ? 'Visa' : card.cardType === 'mastercard' ? 'MasterCard' : card.cardType }}
            </div>
            <div class="card-number">{{ card.cardNumber }}</div>
            <small class="text-muted">Card #{{ index + 1 }}</small> 
          </div>
          <div class="actions">
            <button @click="deleteCard(card.cardID)" class="btn btn-dark btn-sm">Delete</button>
          </div>
        </div>
      </div>
      <div v-else class="text-muted fst-italic">You don't have any bank cards yet.</div>
      <p v-if="deleteCardError" class="text-danger font-italic mt-2">{{ deleteCardError }}</p>

      <div class="add-button-container text-center mt-3">
        <button @click="toggleAddCard" class="btn btn-dark">
          {{ isAddingCard ? 'Cancel' : '+ Add New Card' }}
        </button>
      </div>

      <!-- Add New Card Form -->
      <div v-if="isAddingCard" class="add-new-form mt-3">
        <select v-model="newCard.cardType" class="form-control mb-2">
          <option disabled value="">Select Card Type</option>
          <option value="visa">Visa</option>
          <option value="mastercard">MasterCard</option>
        </select>
        <input v-model="newCard.cardNumber" placeholder="Card Number" class="form-control mb-2" />
        <button @click="addNewCard" class="btn btn-dark btn-sm me-2 mr-2">Save</button>
        <button @click="toggleAddCard" class="btn btn-light btn-sm border-dark">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "MyPayments",
  data() {
    return {
      bankAccounts: [],
      bankCards: [],
      isAddingBankAccount: false,
      isAddingCard: false,
      deleteAccountError: '',
      deleteCardError: '',
      newBankAccount: {
        bankAccountHolderName: '',
        bankAccountNumber: '',
        bankName: '',
      },
      newCard: {
        cardType: '',
        cardNumber: '',
      },
    };
  },
  methods: {
    async fetchPaymentDetails() {
      try {
        const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
        const response = await axios.get('https://mygroceries-backend.vercel.app/payments', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        this.bankAccounts = response.data.bankAccounts.map(account => ({
          ...account,
          bankAccountNumber: `**** **** **** ${account.bankAccountNumber.slice(-4)}`, // Mask account number
        }));
        this.bankCards = response.data.bankCards.map(card => ({
          ...card,
          cardNumber: `**** **** **** ${card.cardNumber.slice(-4)}`, // Mask card number
        }));
      } catch (error) {
        console.error('Failed to fetch payment details:', error);
        alert('Failed to fetch payment details. Please try again.');
      }
    },
    toggleAddBankAccount() {
      this.isAddingBankAccount = !this.isAddingBankAccount;
      this.resetNewBankAccount();
    },
    toggleAddCard() {
      this.isAddingCard = !this.isAddingCard;
      this.resetNewCard();
    },
    async addNewBankAccount() {
      const newBankAccount = {
        bankName: this.newBankAccount.bankName,
        bankAccountNumber: this.newBankAccount.bankAccountNumber,
        bankAccountHolderName: this.newBankAccount.bankAccountHolderName,
      };

      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post('https://mygroceries-backend.vercel.app/bank-account', newBankAccount, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Add the new account to the local state with the real accountID from the backend
        this.bankAccounts.push({
          ...newBankAccount,
          id: response.data.accountID,  // Use the real accountID returned by the backend
          bankAccountNumber: `**** **** **** ${newBankAccount.bankAccountNumber.slice(-4)}`,  // Mask the account number for display
        });

        this.toggleAddBankAccount();  // Reset the form and close it
        alert('Bank account added successfully!');
      } catch (error) {
        console.error('Failed to add bank account:', error.response ? error.response.data : error);
        alert('Failed to add bank account. Please try again.');
      }
    },

    async addNewCard() {
      const newCard = {
        cardType: this.newCard.cardType,
        cardNumber: this.newCard.cardNumber,
      };

      try {
        const token = localStorage.getItem('authToken');
        await axios.post('https://mygroceries-backend.vercel.app/bank-card', newCard, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // After the card is successfully added to the backend, add it to the UI
        this.bankCards.push({
          ...newCard,
          cardNumber: `**** **** **** ${newCard.cardNumber.slice(-4)}`,  // Mask the card number for display
        });

        this.toggleAddCard();  // Reset the form and close it
        alert('Bank card added successfully!');
      } catch (error) {
        console.error('Failed to add bank card:', error.response ? error.response.data : error);
        alert('Failed to add bank card. Please try again.');
      }
    },
    async deleteAccount(accountID) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`https://mygroceries-backend.vercel.app/bank-account/${accountID}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Remove the account locally if deleted successfully
        this.bankAccounts = this.bankAccounts.filter(account => account.accountID !== accountID);
      } catch (error) {
        this.deleteAccountError = error.response.data.message || 'Failed to delete account';
      }
    },
    async deleteCard(cardID) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`https://mygroceries-backend.vercel.app/bank-card/${cardID}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Remove the card locally if deleted successfully
        this.bankCards = this.bankCards.filter(card => card.cardID !== cardID);
      } catch (error) {
        this.deleteCardError = error.response.data.message || 'Failed to delete card';
      }
    },
    resetNewBankAccount() {
      this.newBankAccount = {
        bankAccountHolderName: '',
        bankAccountNumber: '',
        bankName: '',
      };
    },
    resetNewCard() {
      this.newCard = {
        cardType: '',
        cardNumber: '',
      };
    },
  },
  async mounted() {
    await this.fetchPaymentDetails(); // Fetch payment details when the component is mounted
  },
};
</script>

<style scoped>
.my-payments-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  position: relative;
}

h3 {
  text-align: center;
}

.payment-section {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #ffffff;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.add-new-form {
  margin-top: 20px;
}
</style>
