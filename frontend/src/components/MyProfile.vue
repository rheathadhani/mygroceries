<template>
  <div class="container mt-4">
    <div class="profile-container p-4 shadow-sm">
      <form class="profile-form" @submit.prevent="saveProfile">

        <div class="form-group row mb-3">
          <label for="username" class="col-sm-3 col-form-label">Username</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="username" v-model="user.username">
          </div>
        </div>

        <div class="form-group row mb-3">
          <label for="firstName" class="col-sm-3 col-form-label">First Name</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="firstName" v-model="user.firstName">
          </div>
        </div>

        <div class="form-group row mb-3">
          <label for="lastName" class="col-sm-3 col-form-label">Last Name</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="lastName" v-model="user.lastName">
          </div>
        </div>

        <div class="form-group row mb-3">
          <label for="email" class="col-sm-3 col-form-label">Email</label>
          <div class="col-sm-9">
            <input type="email" class="form-control" id="email" v-model="user.email">
          </div>
        </div>

        <div class="form-group row mb-3">
          <label for="phone" class="col-sm-3 col-form-label">Phone Number</label>
          <div class="col-sm-9">
            <input type="tel" class="form-control" id="phone" v-model="user.phoneNumber">
          </div>
        </div>

        <div class="form-group row mb-3">
          <label class="col-sm-3 col-form-label">Gender</label>
          <div class="col-sm-9 d-flex align-items-center">
            <div class="form-check form-check-inline">
              <input type="radio" id="male" value="male" v-model="user.gender" class="form-check-input">
              <label for="male" class="form-check-label">Male</label>
            </div>
            <div class="form-check form-check-inline">
              <input type="radio" id="female" value="female" v-model="user.gender" class="form-check-input">
              <label for="female" class="form-check-label">Female</label>
            </div>
            <div class="form-check form-check-inline">
              <input type="radio" id="other" value="other" v-model="user.gender" class="form-check-input">
              <label for="other" class="form-check-label">Other</label>
            </div>

          </div>
        </div>

        <div class="form-group row mb-4">
          <label for="dob" class="col-sm-3 col-form-label">Date of Birth</label>
          <div class="col-sm-9">
            <input type="date" class="form-control" id="dob" v-model="user.dob">
          </div>
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-dark w-100">Save</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "MyProfile",
  data() {
    return {
      user: {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        dob: ''
      }
    }
  },
  methods: {
    async fetchProfile() {
      try {
        const token = localStorage.getItem('authToken'); // Get the auth token

        const response = await axios.get('http://localhost:5500/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Format the date manually to 'YYYY-MM-DD'
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero to month
          const day = date.getDate().toString().padStart(2, '0'); // Add leading zero to day
          return `${year}-${month}-${day}`;
        };

        // Populate the user fields
        const data = response.data;
        this.user = {
          username: data.username || '', // Handle cases where the field is missing
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          gender: data.gender || '',
          dob: data.dateOfBirth ? formatDate(data.dateOfBirth) : '' // Format date to 'YYYY-MM-DD'
        };

        console.log('Profile loaded:', this.user);
      } catch (error) {
        console.error('Failed to load profile:', error);
        alert('Failed to load profile. Please try again.');
      }
    },
    async saveProfile() {
      try {
        const token = localStorage.getItem('authToken'); // Get the auth token

        await axios.patch('http://localhost:5500/profile', this.user, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Failed to save profile:', error);
        alert('Failed to save profile. Please try again.');
      }
    }
  },
  mounted() {
    this.fetchProfile(); // Fetch the profile when the component is mounted
  }
}
</script>

<style scoped>
.profile-container {
  width: 100%;
  max-width: 70vw;
  height: 75vh;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  overflow-x: hidden;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.2);
  /* Increased shadow for debugging */
}

h3 {
  text-align: center;
}

button {
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 0px;
}

button:hover {
  background-color: #fff;
  color: #000;
}
</style>
