<template>
  <div class="container bg-light">
    <div class="card text-dark p-4 shadow-sm w-75">
      <h3 class="mb-4 text-center"> Login to your account </h3>
      <form @submit.prevent="login">
        <div class="mb-3">
          <input type="email" v-model="email" class="form-control" placeholder="Enter your email address" required>
        </div>
        <div class="mb-3">
          <input type="password" v-model="password" class="form-control" placeholder="Enter your password" required>
        </div>
        <div class="d-flex justify-content-end mb-3">
          <a href="#" @click.prevent="emitForgotPassword" id="forgot-password" class="text-dark">Forgot Password?</a>
        </div>
        <button class="btn btn-dark w-100">Login</button>
      </form>

      <div class="text-center mt-4">
        <a href="#" @click.prevent="emitRegistrationForm" class="text-dark">New to MyGrocer? Register Now</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        let response;

        // Check if the email or username indicates admin
        if (this.isAdmin(this.email)) {
          response = await axios.post('http://localhost:5500/admin/login', {
            email: this.email,
            password: this.password
          });

          // Redirect to admin page on successful login
          if (response && response.status === 200) {
            console.log('Admin login successful:', response.data);
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            this.$router.push('/admin'); // Redirect to the admin page
          }
        } else {
          // Customer login
          response = await axios.post('http://localhost:5500/login', {
            email: this.email,
            password: this.password
          });

          // Redirect to products page on successful login
          if (response && response.status === 200) {
            console.log('Customer login successful:', response.data);
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            this.$router.push('/settings'); // Redirect to the settings page
          }
        }
      } catch (error) {
        console.error('Error during login:', error.response ? error.response.data : error.message);
      }
    },
    isAdmin(email) {
      // Example logic to determine if the user is an admin based on the email format
      return email.toLowerCase().includes('admin');
    },
    emitForgotPassword() {
      this.$emit('showForgotPassword');
    },
    emitRegistrationForm() {
      this.$emit('showRegistrationForm');
    }
  }
};
</script>



<style scoped>
/* Specific styling to complement Bootstrap classes */
.container {
  display: flex;           /* Enables flexbox */
  justify-content: center; /* Centers content horizontally */
  align-items: center;     /* Centers content vertically */
  height: 100vh;           /* Full height of the viewport */
}

.card {
  border-radius: 2.5vh;
  width: 50%;              /* Adjust width as needed */
}

.form-control {
  border-radius: 0.5rem;
}

@media (max-width: 600px) {
  #text-wrap {
    display: none; /* Hide the welcome text on small screens */
  }

  #page-wrap-container {
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center; 
    height: 100vh; /* Full viewport height to aid in centering */
    width: 100vw; /* Full viewport width */
  }

  .half-page {
    width: 100%; /* Adjust this to change the width of the login form container */
    max-width: 300px; /* Optionally set a max width for the form */
  }

  .half-page.right {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center; /* Ensure the form itself is centered within the 'right' container */
    align-items: center;
    height: auto; /* Allow the container to shrink to fit its contents */
  }
}
</style>
