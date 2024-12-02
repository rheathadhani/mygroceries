<template>
  <div class="container mt-4">
    <div class="address-container bg-white p-4 shadow-sm rounded border-dark shadow-sm">
      <div class="address-list">
        <div v-for="(address, index) in addresses" :key="index" class="address-entry border-bottom pb-3 mb-3">

          <div v-if="editIndex !== index">
            <!-- Use 'Name', 'phoneNumber', and 'address' based on backend response -->
            <p><strong>{{ address.Name }}</strong> ({{ address.phoneNumber }})</p>
            <p class="display-address">{{ address.address }}</p>
            <button class="btn btn-dark btn-sm me-2 mr-2" @click="startEdit(index)">Edit</button>
            <button class="btn btn-light btn-sm border-dark" @click="deleteAddress(index)">Delete</button>
          </div>

          <div v-else>
            <!-- Input fields for editing/adding an address -->
            <input v-model="editData.Name" placeholder="Name" class="form-control mb-2">
            <input v-model="editData.phoneNumber" placeholder="Phone Number" class="form-control mb-2">
            <input v-model="editData.address" placeholder="Full Address" class="form-control mb-2">
            <button class="btn btn-dark btn-sm me-2 mr-2" @click="saveEdit()">Save</button>
            <button class="btn btn-light btn-sm border-dark" @click="cancelEdit()">Cancel</button>
          </div>
        </div>
      </div>
      <button class="btn btn-dark w-100" @click="addAddress">+ Add New Address</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "MyAddresses",
  data() {
    return {
      addresses: [], // Stores the list of addresses
      editIndex: -1, // Keeps track of which address is being edited
      editData: {} // Stores the current data for the address being edited or added
    }
  },
  methods: {
    // Fetch addresses from the backend
    async fetchAddresses() {
      try {
        const token = localStorage.getItem('authToken'); // Get the token from local storage
        const response = await axios.get('https://mygroceries-backend.vercel.app/addresses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        this.addresses = response.data; // Populate the addresses array with the response data
        this.$emit('addressesFetched', this.addresses);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        alert('Failed to fetch addresses. Please try again.');
      }
    },

    // Start editing an existing address
    startEdit(index) {
      this.editIndex = index; // Set the current editing index
      this.editData = JSON.parse(JSON.stringify(this.addresses[index])); // Copy the selected address data into editData
    },

    // Add a new address
    addAddress() {
      // Create a blank placeholder for the new address
      this.editData = { Name: '', phoneNumber: '', address: '' };
      this.editIndex = this.addresses.length; // Set the edit index to the new item
      this.addresses.push(this.editData); // Temporarily push it into the array
    },

    // Save the edited or new address
    async saveEdit() {
      const token = localStorage.getItem('authToken'); // Get the token from local storage

      // Ensure all fields are filled out
      if (!this.editData.Name || !this.editData.phoneNumber || !this.editData.address) {
        alert('All fields are required.');
        return;
      }

      // If the address is new (no ID), send a POST request to add it
      if (!this.editData.ID) {
        try {
          await axios.post('https://mygroceries-backend.vercel.app/addresses', this.editData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          alert('Address added successfully!');
          this.fetchAddresses(); // Refresh the address list
        } catch (error) {
          console.error('Failed to add address:', error);
          alert('Failed to add address. Please try again.');
        }
      } else {
        // If the address has an ID, send a PATCH request to update it
        const updatedAddressData = {
          name: this.editData.Name,
          phoneNumber: this.editData.phoneNumber,
          address: this.editData.address
        };

        try {
          await axios.patch(`https://mygroceries-backend.vercel.app/addresses/${this.editData.ID}`, updatedAddressData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          alert('Address updated successfully!');
          this.fetchAddresses(); // Refresh the address list
        } catch (error) {
          console.error('Failed to update address:', error);
          alert('Failed to update address. Please try again.');
        }
      }

      this.editIndex = -1; // Exit edit mode
    },

    // Cancel editing an address
    cancelEdit() {
      if (this.editIndex === this.addresses.length - 1 && !this.addresses[this.editIndex].ID) {
        // If it's a new address being added and the user cancels, remove it from the array
        this.addresses.pop();
      }
      this.editIndex = -1; // Exit edit mode
    },

    // Delete an address
    async deleteAddress(index) {
      const token = localStorage.getItem('authToken');  // Get the token from local storage
      const addressID = this.addresses[index].ID;  // Ensure the address ID is being passed correctly

      if (!addressID) {
        alert('Invalid address ID');
        return;
      }
      console.log(addressID);

      try {
        const confirmed = confirm('Are you sure you want to delete this address?');  // Confirmation prompt
        if (confirmed) {
          await axios.delete(`https://mygroceries-backend.vercel.app/addresses/${addressID}`, {
            headers: {
              'Authorization': `Bearer ${token}`,  // Include token in headers
            },
          });
          alert('Address deleted successfully!');
          this.fetchAddresses();  // Refresh the address list
        }
      } catch (error) {
        console.error('Failed to delete address:', error);
        alert('Failed to delete address. Please try again.');
      }
    },
  },

  // Fetch the addresses when the component is mounted
  mounted() {
    this.fetchAddresses(); // Fetch addresses when the component is mounted
  }
}
</script>


<style scoped>
.address-container {
  width: 100%;
  max-width: 70vw;
  height: 70vh;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  overflow-x: hidden;
}

h3 {
  text-align: center;
}

.address-entry {
  padding-bottom: 15px;
}

.display-address {
  line-height: 1.5;
}

button {
  margin: 5px 0;
}

.add-button {
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-align: center;
  display: block;
  width: 100%;
}
</style>
