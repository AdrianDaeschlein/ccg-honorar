<script lang="ts">

</script>

<style>
    .tooltip:hover .tooltiptext {
      visibility: visible;
      opacity: 1;
    }
    .tooltiptext {
      visibility: hidden;
      width: 120px;
      background-color: #555;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px;
      position: absolute;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.3s;
    }
    </style>

<head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<h1 class="text-3xl font-bold underline">Bestyrelseshonorarer - Board Fees</h1>
<p>What are common salaries for Danish Boards Members?</p>
<div class="container mx-auto">
    <div class="flex flex-col md:flex-row">
        <div class="input-div w-full md:w-1/3 p-4 bg-zinc-600">
            <!-- Single Input Component -->
            <div class="flex items-center">
                <label for="countries" class="block w-2/3  mb-2 text-sm font-medium text-gray-900 dark:text-white">Number of employees</label>
                <div class="tooltip ml-2 mr-2">
                    <span class="material-icons">info</span>
                    <div class="tooltiptext">
                      Select the number of employees in your organization
                    </div>
                  </div>
                <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>Select number</option>
                    <option value="1">1-4</option>
                    <option value="2">5-9</option>
                    <option value="3">10-50</option>
                    <option value="4">50-250</option>
                    <option value="5">250+</option>
                </select>
            </div>
        </div>
        <div class="output-div w-full md:w-2/3 p-4 bg-indigo-700">
            Output
        </div>
    </div>
</div>



