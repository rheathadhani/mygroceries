<template>
  <div class="d-flex justify-content-center align-items-start w-100 h-100 bg-light">
    <div class="card p-3 shadow form-border w-100" style="max-width: 550px;">
      <h3 class="text-center mb-4 pt-2">Register Your Account</h3>
      <form @submit.prevent="register">
        <div class="row g-3 mb-2">
          <!-- First Name Field -->
          <div class="col-12 col-md-6 pr-1">
            <input type="text" class="form-control form-control-lg" v-model="firstName" placeholder="First Name"
              required>
          </div>
          <!-- Last Name Field -->
          <div class="col-12 col-md-6 pl-1">
            <input type="text" class="form-control form-control-lg" v-model="lastName" placeholder="Last Name" required>
          </div>
        </div>

        <!-- Email Address Field -->
        <div class="mb-3">
          <input type="email" class="form-control form-control-lg" v-model="email" placeholder="Email Address" required>
        </div>

        <!-- Password Field -->
        <div class="mb-3">
          <input type="password" v-model="password" class="form-control form-control-lg" placeholder="Password" required
            @input="validatePassword">
        </div>

        <!-- Password Validation Guidelines -->
        <div class="mb-4 text-muted small pl-2">
          <p class="mb-1" style="text-align: left;"><strong>Passwords must be:</strong></p>
          <ul class="pl-3 mb-0">
            <li :class="{ 'font-weight-bold': passwordLengthValid }">Min 6 characters</li>
            <li :class="{ 'font-weight-bold': passwordUpperCaseValid }">At least one uppercase letter</li>
            <li :class="{ 'font-weight-bold': passwordSpecialCharValid }">At least one special character (!@#$)</li>
          </ul>
        </div>

        <!-- Register Button -->
        <button class="btn btn-dark btn-lg w-100" :disabled="!isFormValid">Register</button>
      </form>

      <!-- Back to Login Link -->
      <div class="text-center mt-4">
        <a href="#" @click.prevent="emitLoginForm" class="text-dark">Already have an account? Login Now</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Import Axios for making HTTP requests

export default {
  name: 'RegistrationForm',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordLengthValid: false,
      passwordUpperCaseValid: false,
      passwordSpecialCharValid: false,
      registrationError: null, // Capture registration errors
    };
  },
  computed: {
    isFormValid() {
      return this.passwordLengthValid && this.passwordUpperCaseValid && this.passwordSpecialCharValid;
    }
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('https://mygroceries-backend.vercel.app/register', {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password
        });
        alert('Registration successful!');
        console.log(response);
        this.$emit('showLoginForm'); // Switch to login form after successful registration
      } catch (error) {
        if (error.response) {
          console.error("Server responded with:", error.response.data);
          alert(error.response.data.message || 'Registration failed. Please try again.');
        } else if (error.request) {
          console.error("No response received:", error.request);
          alert('No response from server. Please check your connection.');
        } else {
          console.error("Error setting up request:", error.message);
          alert('Registration failed. Please try again.');
        }
      }
    },
    emitLoginForm() {
      this.$emit('showLoginForm');
    },
    validatePassword() {
      // Validate based on the password input bound to this.password
      this.passwordLengthValid = this.password.length >= 6;
      this.passwordUpperCaseValid = /[A-Z]/.test(this.password);
      this.passwordSpecialCharValid = /[!@#$]/.test(this.password);
    }
  }
};
</script>

<style scoped>
.d-flex {
  height: 100%;
  width: 100%;
  /* Ensure it takes the full width available */
}

.card {
  border-radius: 1rem;
  max-width: 450px;
  /* Adjusted max width for better form size */
  width: 90%;
  /* Full width for smaller screens */
  margin-top: 50px;
  /* Adjusted margin for normal view to push the form down */
}

.form-control {
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  /* Consistent margin for spacing */
  font-size: 1rem;
  /* Match input font size with login form */
}

.btn {
  border-radius: 0.5rem;
  transition: background-color 0.3s, color 0.3s;
  font-size: 1rem;
  /* Match button font size with login form */
}

.text-muted {
  font-size: 0.875rem;
  /* Smaller text size for guidelines */
}

.text-muted ul {
  margin-bottom: 0;
  /* Remove bottom margin for ul */
  text-align: left;
}

.text-muted ul li {
  list-style-type: square;
  text-align: left;
  padding-left: 0.5rem;
}

/* Class to make list item bold */
.font-weight-bold {
  font-weight: bold;
}

/* No changes needed for responsive styles, keep them as they were */
@media (max-width: 600px) {
  .d-flex {
    justify-content: flex-start;
    /* Align form to the top */
    align-items: flex-start;
    /* Align items to the top */
  }

  .card {
    width: 90%;
    /* Full width on smaller screens */
    max-width: 100%;
    /* Ensures the card takes up the full width */
    margin-top: 40px;
    /* Ensures proper spacing */
    padding: 15px;
    /* Adjust padding for a consistent look */
  }
}
</style>
