<script lang="ts">
    import "../lib/styles/global.css";

    export let median: number;
    export let p25: number;
    export let p75: number;
    export let mean: number;
  
    const containerWidth = 500; // Width of the boxplot container in pixels
    const maxStatValue = 200000; // Assuming your stats are in a range of 0-100
  
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
    /* scaledMedian = scale(37969);
    scaledP25 = scale(19594);
    scaledP75 = scale(73172);
    scaledAverage = scale(69323); */
  </script>
  
  <div class="boxplot-container rounded-2xl flex items-center justify-center h-full">
    <div class="box" style="left: {scaledP25}px; width: {scaledP75 - scaledP25}px;"></div>
    <div class="median" style="left: {scaledMedian}px;"></div>
    <div class="average" style="left: {scaledAverage}px;"></div>

    <!-- X-axis scale -->
    <div class="x-axis"></div>
    <div class="scale start">0</div>
    <div class="scale end">200,000</div>
  </div>
  
  <style>
    .boxplot-container {
      position: relative;
      width: 500px;
      height: 224px;
      /* Additional container styles */
      background-color: white;
    }
    .box {
      height: 100px;
      position: absolute;
      border: 1px solid black;
      /* Additional box styles */
    }
    .median, .average {
      height: 100px;
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

    /* X-axis line */
    .x-axis {
        position: absolute;
        bottom: 30px;
        left: 5px;
        right: 15px;
        width: 98%;
        height: 2px;
        background-color: black;
    }
    .x-axis::after {
    content: '';
    position: absolute;
    right: -2px; /* Adjust as needed for positioning */
    top: -5px; /* Center vertically relative to the line */
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 10px solid black;
}

    /* Scale labels */
    .scale {
        position: absolute;
        bottom: 0px;
        font-size: 12px;
    }

    .scale.start {
        left: 5px;
        bottom: 8px;
    }

    .scale.end {
        right: 5px;
        bottom: 8px;
    }
  </style>
  