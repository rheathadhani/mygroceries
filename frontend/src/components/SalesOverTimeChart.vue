<template>
  <div class="card shadow-sm mb-4"> 
    <div class="card-header bg-dark text-white text-center">
      Sales Revenue Over Time
    </div>
    <div class="card-body"> <!-- Card body for the chart -->
      <canvas id="salesOverTimeChart"></canvas>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; 
Chart.register(...registerables);
export default {
  name: 'SalesOverTimeChart',
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.fetchSalesData();
  },
  methods: {
    async fetchSalesData() {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('https://mygroceries-backend.vercel.app/admin/sales-over-time', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const salesData = response.data;
        const labels = salesData.map(data => data.day); // Use raw 'day' from API
        const salesValues = salesData.map(data => data.totalSales);
        this.createChart(labels, salesValues);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    },
    createChart(labels, salesValues) {
      const ctx = document.getElementById('salesOverTimeChart').getContext('2d');
      if (this.chart) { this.chart.destroy(); }
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Sales Revenue By Date', data: salesValues, borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)', borderWidth: 2, fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time', // Set x-axis to be time-based
              time: {
                unit: 'day', // Adjust unit to 'day'
                tooltipFormat: 'MMM dd, yyyy', // Format in tooltips
                displayFormats: { day: 'MMM dd', },
              },
              title: {display: true, text: 'Date',},
            },
            y: {
              title: { display: true, text: 'Sales' },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const value = context.raw;
                  const date = new Date(context.label); // Format the date from the label
                  const formattedDate = date.toLocaleDateString(); // Custom date format
                  return `${label}: ${value} (on ${formattedDate})`;
                },
              },
            },
          },
        },
      });
    }
  },
};
</script>

<style scoped>
#salesOverTimeChart {
  max-width: 100%;
  height: 300px;
}
</style>
