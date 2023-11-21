<script lang="ts">
    export let median: number;
    export let p25: number;
    export let p75: number;
    export let mean: number;
  
    const containerWidth = 300; // Width of the boxplot container in pixels
    const maxStatValue = 100000; // Assuming your stats are in a range of 0-100
  
    // Function to scale the stat value to container width
    function scale(value: number) {
      return (value / maxStatValue) * containerWidth;
    }
  
    // Calculate scaled dimensions and positions
    let scaledMedian = scale(median);
    let scaledP25 = scale(p25);
    let scaledP75 = scale(p75);
    let scaledAverage = scale(mean);
    // Additional calculations for whiskers or other elements can be added here
    scaledMedian = scale(37969);
    scaledP25 = scale(19594);
    scaledP75 = scale(73172);
    scaledAverage = scale(69323);
  </script>
  
  <div class="boxplot-container">
    <div class="box" style="left: {scaledP25}px; width: {scaledP75 - scaledP25}px;"></div>
    <div class="median" style="left: {scaledMedian}px;"></div>
    <div class="average" style="left: {scaledAverage}px;"></div>
    <!-- Add other elements like whiskers, average marker, etc. -->
  </div>
  
  <style>
    .boxplot-container {
      position: relative;
      width: 300px;
      height: 200px;
      /* Additional container styles */
    }
    .box {
      height: 20px;
      background-color: blue;
      position: absolute;
      /* Additional box styles */
    }
    .median, .average {
      height: 20px;
      width: 2px;
      position: absolute;
      /* Additional line styles */
    }
    .median {
      background-color: red;
    }
    .average {
      background-color: green;
    }
    /* Additional styles for other elements */
  </style>
  