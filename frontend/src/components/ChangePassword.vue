<template>
  <div class="container mt-4">
    <div class="change-password bg-white p-4 shadow-sm">
      <form class="form-container" @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="old-password" class="form-label">Old Password:</label>
          <input type="password" id="old-password" v-model="oldPassword" class="form-control" required>
        </div>

        <div class="mb-3">
          <label for="new-password" class="form-label">New Password:</label>
          <input type="password" id="new-password" v-model="newPassword" class="form-control" required>
        </div>

        <button type="submit" class="btn btn-dark w-100">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "ChangePassword",
  data() {
    return {
      oldPassword: '',
      newPassword: ''
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const token = localStorage.getItem('authToken'); // Assuming you are storing the JWT token in localStorage

        const payload = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        };

        // Send PUT request to the backend to change the password
        const response = await axios.put('http://localhost:5500/change-password', payload, {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token in the request headers
            'Content-Type': 'application/json'
          }
        });

        // Handle successful password change
        alert('Password changed successfully!');
        console.log('Response:', response.data);

        // Reset form fields
        this.oldPassword = '';
        this.newPassword = '';
      } catch (error) {
        console.error('Failed to change password:', error.response ? error.response.data : error);
        alert('Failed to change password. Please try again.');
      }
    }
  }
}
</script>

<style scoped>
.change-password {
  width: 100%;
  max-width: 500px;
  /* Set a maximum width for larger screens */
  margin: auto;
  padding: 20px;
  background: #fff;
}

@media (max-width: 768px) {
  .change-password {
    width: 90%;
    /* Increase width to 80% on smaller screens */
  }
}

h3 {
  text-align: center;
}

button {
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #fff;
  color: #000;
}
</style>