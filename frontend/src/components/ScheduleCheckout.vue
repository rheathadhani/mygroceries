<template>
  <div class="schedule-checkout card shadow-sm mx-auto">
    <!-- Card Header for Delivery Schedule -->
    <div class="card-header bg-dark text-white text-center mb-2 py-2">
      Delivery Schedule
    </div>

    <!-- Card Body for Date and Time Selection -->
    <div class="card-body">
      <form @submit.prevent="submitSchedule">
        <!-- Date and Time Picker -->
        <div class="form-group mb-3">
          <label for="dateTime" class="form-label">Pick a date & time</label>
          <input type="datetime-local" id="dateTime" v-model="selectedDateTime" class="form-control" required />
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-dark w-100">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScheduleCheckout",
  data() {
    return {
      selectedDateTime: '',
    };
  },
  watch: {
    selectedDateTime(newValue) {
      if (newValue) {
        this.$emit('scheduleSet', newValue); // Emit the selected date directly
      } else {
        this.$emit('scheduleSet', null); // Emit null if no date is selected
      }
    }
  },
  methods: {
    submitSchedule() {
      console.log('Selected Date & Time:', this.selectedDateTime);
      this.$emit('scheduleSet', this.selectedDateTime); // Emit the selected date directly
    }
  }

};
</script>

<style scoped>
.schedule-checkout {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 8px;
  background-color: #ffffff;
}

.card-header {
  font-size: 16px;
}

.form-label {
  font-size: 1em;
  color: #000;
  margin-bottom: 5px;
}
</style>
