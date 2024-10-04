<template>
    <div class="card shadow-sm mb-4">
      <!-- Card Body -->
      <div class="card-body text-center">
        <h5 class="card-title text-muted">{{ title }}</h5>
        <h2 class="card-text font-weight-bold">{{ value }}</h2>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "DashboardCard",
    props: {
      title: {
        type: String,
        required: true,
      },
      value: {
        type: [String, Number],
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .card {
    max-width: 250px; /* Adjust the width of the card */
    border-radius: 8px;
  }
  
  .card-title {
    font-size: 1rem; /* Adjust title size */
    margin-bottom: 0.5rem;
  }
  
  .card-text {
    font-size: 2rem; /* Adjust value size */
    color: #333;
  }
  
  .card-body {
    padding: 20px; /* Add padding for card body */
  }
  </style>
  