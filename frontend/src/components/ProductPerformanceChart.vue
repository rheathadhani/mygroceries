<template>
  <div class="card shadow-sm mb-4">
    <!-- Add Bootstrap card class -->
    <div class="card-header bg-dark text-white text-center">
      Product Performance
    </div>
    <div class="card-body">
      <!-- Card body for the chart -->
      <canvas id="productPerformanceChart"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

// Register the necessary components
Chart.register(...registerables);

export default {
  name: 'ProductPerformanceChart',
  data() {
    return {
      productLabels: [],
      salesData: [],
    };
  },
  mounted() {
    this.fetchProductPerformance();
  },
  methods: {
    async fetchProductPerformance() {
      try {
        const token = localStorage.getItem('authToken'); // Get auth token from local storage
        const response = await axios.get('https://mygroceries-backend.vercel.app/admin/product-performance', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assuming the response contains an array of products with 'productName' and 'totalSales'
        const productPerformance = response.data;
        this.productLabels = productPerformance.map(product => product.productName);
        this.salesData = productPerformance.map(product => product.totalSales);

        this.createChart();
      } catch (error) {
        console.error('Error fetching product performance data:', error);
      }
    },
    createChart() {
      const ctx = document.getElementById('productPerformanceChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar', // Specify the type of chart
        data: {
          labels: this.productLabels, // Dynamic product names
          datasets: [
            {
              label: 'Sales Revenue',
              data: this.salesData, // Dynamic sales data
              backgroundColor: [
                'rgba(54, 162, 235, 0.8)', // Blue shades
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(54, 162, 235, 0.8)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)', // Blue shades for border
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(54, 162, 235, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {display: true, text: 'Products'},
            },
            y: {
              display: true,
              beginAtZero: true,
              title: { display: true, text: 'Sales Revenue Figures'},
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
#productPerformanceChart {
  max-width: 100%;
  height: 300px;
}
</style>
