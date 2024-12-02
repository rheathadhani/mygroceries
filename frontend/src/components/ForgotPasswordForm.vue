<template>
  <div class="container d-flex flex-column align-items-center vh-100 bg-light">
    <div class="card text-dark p-4 shadow-sm w-75 form-container">
      <h3 class="mb-4 text-center">Reset Your Password</h3>
      <div class="mb-4 text-muted small pl-2">
        <p class="mb-1" style="text-align: left;"><strong>Passwords must be:</strong></p>
        <ul class="pl-3 mb-0">
          <li :class="{ 'font-weight-bold': passwordLengthValid }">Min 6 characters</li>
          <li :class="{ 'font-weight-bold': passwordUpperCaseValid }">At least one uppercase letter</li>
          <li :class="{ 'font-weight-bold': passwordSpecialCharValid }">At least one special character (!@#$)</li>
        </ul>
      </div>
      <form @submit.prevent="resetPassword">
        <div class="mb-3">
          <input type="email" v-model="email" class="form-control" placeholder="Enter your email" required />
        </div>
        <div class="mb-3">
          <input type="password" v-model="password" @input="validatePassword" class="form-control"
            placeholder="Enter your new password" required />
        </div>
        <button class="btn btn-dark w-100" :disabled="!isFormValid">Reset</button>
        <p v-if="successMessage" class="text-success mt-4 text-center">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-danger mt-4 text-center">{{ errorMessage }}</p>
      </form>
      <div class="text-center mt-4">
        <a href="#" @click.prevent="emitLoginForm" class="text-dark">Back to Login</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Import Axios for making API calls

export default {
  name: 'ForgotPasswordForm',
  data() {
    return {
      email: '',
      password: '',
      passwordLengthValid: false,
      passwordUpperCaseValid: false,
      passwordSpecialCharValid: false,
      successMessage: null,
      errorMessage: null,
    };
  },
  computed: {
    isFormValid() {
      return this.passwordLengthValid && this.passwordUpperCaseValid && this.passwordSpecialCharValid;
    },
  },
  methods: {
    validatePassword() {
      this.passwordLengthValid = this.password.length >= 6;
      this.passwordUpperCaseValid = /[A-Z]/.test(this.password);
      this.passwordSpecialCharValid = /[!@#$]/.test(this.password);
    },
    async resetPassword() {
      try {
        const response = await axios.post('https://mygroceries-backend.vercel.app/reset-password', {
          email: this.email,
          newPassword: this.password,
        });
        this.successMessage = response.data.message;
        this.errorMessage = null;
        console.log(response);
      } catch (error) {
        this.successMessage = null;
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    },
    emitLoginForm() {
      this.$emit('showLoginForm');
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  padding-top: 20px;
  /* Adjust this padding as needed to push down the content */
}

.card {
  border-radius: 1rem;
  width: 100%;
  /* Full width for smaller screens */
  max-width: 400px;
  /* Max width for larger screens */
  margin: 0 auto;
  /* Center card */
  padding: 20px;
  /* Adjust padding for better spacing */
  overflow-y: auto;
  /* Enable vertical scroll */
}

.form-container {
  max-height: 80vh;
  /* Adjust to prevent cutting off content */
}

.form-control {
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.text-muted ul {
  padding-left: 1rem;
  margin-bottom: 0;
  text-align: left;
}

.text-muted ul li {
  list-style-type: square;
  padding-left: 0.5rem;
}

.font-weight-bold {
  font-weight: bold;
}

@media (max-width: 600px) {
  .card {
    width: 100%;
    max-width: 100%;
    padding: 15px;
    /* Adjust padding for smaller screens */
  }

  .container {
    justify-content: flex-start;
    /* Align items to the top */
  }
}
</style>
