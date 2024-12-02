<template>
  <div id="page-wrap-container" class="vh-100 vw-100 d-flex m-0 overflow-hidden">
    <!-- Default Welcome Page -->
    <div class="d-flex m-0 overflow-hidden w-100">
      <div
        class="half-page d-flex flex-column justify-content-center align-items-center p-3 bg-dark text-white text-center col-md-5">
        <h1>Welcome to MyGroceries</h1>
        <p id="intro-text">Grocery shopping made easier and accessible</p>
        <router-link to="/settings">
          <button class="btn btn-dark settings">
            Accessibility Settings
          </button>
        </router-link>
      </div>
      <div
        class="half-page d-flex flex-column justify-content-center align-items-center p-3 bg-white text-dark text-center col-md-7">
        <component :is="currentComponent" @showForgotPassword="showForgotPassword"
          @showRegistrationForm="showRegistrationForm" @showLoginForm="showLoginForm" />
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue';
import ForgotPassword from '../components/ForgotPasswordForm.vue';
import RegistrationForm from '../components/RegistrationForm.vue';

export default {
  name: 'WelcomePage',
  components: {
    LoginForm,
    ForgotPassword,
    RegistrationForm
  },
  data() {
    return {
      currentComponent: 'LoginForm',
    };
  },
  methods: {
    showForgotPassword() {
      this.currentComponent = 'ForgotPassword';
    },
    showRegistrationForm() {
      this.currentComponent = 'RegistrationForm';
    },
    showLoginForm() {
      this.currentComponent = 'LoginForm';
    },
  }
};
</script>

<style scoped>
/* Additional styles to complement Bootstrap */
.half-page {
  box-sizing: border-box;
  /* Keeps the padding inside the element dimensions */
}

h1,
h2,
p {
  margin-bottom: 20px;
}

#intro-text {
  font-size: 1.25rem;
  /* Bootstrap doesn't use vh for font-sizing by default */
}

.settings {
  border-color: white;
}



@media (max-width: 600px) {

  /* Adjust this breakpoint as needed */
  #page-wrap-container {
    justify-content: center;
    /* Center the login form */
  }

  .half-page {
    width: 100%;
    /* Make the login form take full width */
  }
}

@media (max-width: 600px) {
  #page-wrap-container {
    flex-direction: column;
    /* Stack the items vertically */
  }
}
</style>
