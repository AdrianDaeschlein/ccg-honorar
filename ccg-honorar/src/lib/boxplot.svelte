<script lang="ts">
    import "../lib/styles/global.css";
    import {onMount, onDestroy} from "svelte";

    let containerWidth: number;
    const maxStatValue = 300000; // Assuming your stats are in a range of 0-100

    let scaledMedian: number;
    let scaledP25: number;
    let scaledP75: number;
    let scaledAverage: number;

    onMount(() => {
        updateWidth();
        return () => window.removeEventListener("resize", updateWidth);
    });

    export let median: number;
    export let p25: number;
    export let p75: number;
    export let mean: number;
  
    // Calculate scaled dimensions and positions
    function updateWidth() {
      containerWidth = Math.min(window.innerWidth * 0.9, 500);
        // Update scale positions reactively
        scaledMedian = scale(median);
        scaledP25 = scale(p25);
        scaledP75 = scale(p75);
        scaledAverage = scale(mean);
    }
  
    // Function to scale the stat value to container width
    function scale(value: number) {
      return (value / maxStatValue) * containerWidth;
    }

    onDestroy(() => {
      window.removeEventListener('resize', updateWidth);
    });
  </script>
  
  <div class="boxplot-container rounded-2xl flex items-center justify-center h-full">
    <div class="box" style="left: {scaledP25}px; width: {scaledP75 - scaledP25}px;"></div>
    <div class="p25" style="left: {scaledP25}px;"></div>
    <div class="p75" style="left: {scaledP75}px;"></div>
    <div class="median" style="left: {scaledMedian}px;"></div>
    <div class="average" style="left: {scaledAverage}px;"></div>

    <!-- X-axis scale -->
    <div class="x-axis"></div>
    <div class="scale start">0</div>
    <div class="scale middle">150.000</div>
    <div class="scale end">300.000</div>
  </div>
  
  <style>
    .boxplot-container {
      position: relative;
      width: 90vw;
      max-width: 500px;
      height: 224px;
      /* Additional container styles */
      background-color: white;
    }
    .box {
      height: 1px;
      position: absolute;
      border-right: hidden;
      border-left: hidden;
      border-top: hidden;
      border-color: black;
      border-width: 1px;
      /* Additional box styles */
    }
    .median, .average{
      height: 100px;
      width: 2px;
      position: absolute;
      /* Additional line styles */
    }
    .p25, .p75 {
      height: 50px;
      width: 2px;
      position: absolute;
      /* Additional line styles */
    }
    .median {
      background-color: #E66A57;
    }
    .average {
      background-color: #50A192;
    }
    .p25 {
      background-color: #6793D6;
    }
    .p75 {
      background-color: #6793D6;
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

    .scale.middle {
        bottom: 8px;
    }

    .scale.end {
        right: 5px;
        bottom: 8px;
    }
  </style>
  