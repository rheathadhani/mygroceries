<template>
  <div class="personal-details card shadow-sm mx-auto">
    <!-- Card Header for Personal Details -->
    <div class="card-header bg-dark text-white text-center mb-2 py-2">
      Personal Details
    </div>

    <!-- Form Section -->
    <div class="card-body">
      <form @submit.prevent="submitForm" method="post">

        <!-- Full Name Field -->
        <div class="form-group mb-3">
          <label for="fullName" class="form-label">Full Name</label>
          <select id="fullName" v-model="selectedAddress" class="form-control" @change="populateDetails">
            <option value="" disabled>Select a name</option>
            <option v-for="(address, index) in addresses" :key="index" :value="address">
              {{ address.Name }} <!-- Using 'Name' with uppercase N -->
            </option>
          </select>
        </div>

        <!-- Phone Number Field -->
        <div class="form-group mb-3">
          <label for="phoneNumber" class="form-label">Phone Number</label>
          <input type="tel" id="phoneNumber" v-model="selectedAddress.phoneNumber" class="form-control" readonly />
        </div>

        <!-- Address Field -->
        <div class="form-group mb-4">
          <label for="address" class="form-label">Address</label>
          <input type="text" id="address" v-model="selectedAddress.address" class="form-control" readonly />
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-dark w-100">Save</button>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PersonalDetailsCheckout',
  props: ['addresses'], // Receive addresses as props
  data() {
    return {
      selectedAddress: {
        Name: '',  // Capital "N" to match the address object structure
        phoneNumber: '',
        address: ''
      },
    };
  },
  methods: {
    populateDetails() {
      console.log('Selected Address:', this.selectedAddress);
    },
    submitForm() {
      // Check individual fields for completion instead of checking the entire object
      const { Name, phoneNumber, address } = this.selectedAddress; // Keep 'Name' with uppercase N

      if (Name && phoneNumber && address) {
        console.log('Personal Details Completed: true');
        this.$emit('personalDetailsCompleted', true);
        this.$emit('personalDetailsCompleted', true, this.selectedAddress);
      } else {
        console.log('Personal Details Completed: false');
        this.$emit('personalDetailsCompleted', false);
      }
    },
  }
};
</script>


<style scoped>
.personal-details {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 8px;
  background-color: #ffffff;
}

.card-header {
  font-size: 16px;
}

.form-label {
  color: #000;
  margin-bottom: 5px;
}

.btn {
  transition: background-color 0.3s, color 0.3s;
}
</style>
