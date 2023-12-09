<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
  
    export let MONTHLY_AVG_EXPORT: number[] = [];
  
    let chartCanvas: any;
  
    onMount(() => {
      // Data preprocessing
      const frequencyMap = MONTHLY_AVG_EXPORT.reduce((acc: any, val: any) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
  
      const labels = Object.keys(frequencyMap);
      const data = Object.values(frequencyMap);
  
      const ctx = chartCanvas.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Frequency',
            data,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  </script>
  
  <canvas bind:this={chartCanvas}></canvas>
  