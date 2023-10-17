<script lang="ts">
    import { onMount } from 'svelte';

    let HONORAR_VARIABLES: any;
    let results: any[] = [];
    let isLoading = true;

    onMount(async () => {
        // const response = await fetch('../src/lib/honorar-variables.json')
        // HONORAR_VARIABLES = await response.json()
        fetch('../src/lib/honorar-variables.json')
            .then((response) => response.json())
            .then(json => {
                HONORAR_VARIABLES = json
                for(var i in HONORAR_VARIABLES)
                    results.push([i, HONORAR_VARIABLES [i]]);
                isLoading = false;
            });

        console.log(results);

        
    })
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
{#if isLoading}
    <p>Loading...</p>
{:else}
    {#each results as result}
        <p>{result[1].text}</p>
    {/each}
{/if}
<div class="container mx-auto">
    <div class="flex flex-col md:flex-row">
        <div class="input-div w-full md:w-1/3 p-4 bg-zinc-600">
            <!-- Input Component Loop -->
            {#if isLoading}
                <p>Loading...</p>
            {:else}
                {#each results as result}
                <div class="flex items-center align-middle">
                    <div class="flex items-center w-1/2 ">
                        <span class="align-middle text-sm">{result[1].text}</span>
                    </div>
                    
                    <div class="tooltip ml-2 mr-2 justify-items-center">
                        <span class="material-icons align-middle">info</span>
                        <div class="tooltiptext">
                        Select the number of employees in your organization
                        </div>
                    </div>
                    <select id="employees" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Select number</option>
                        <option value="1">1-4</option>
                        <option value="2">5-9</option>
                        <option value="3">10-50</option>
                        <option value="4">50-250</option>
                        <option value="5">250+</option>
                    </select>
                </div>
                {/each}
            {/if}
            <!-- Single Input Component -->
            <div class="flex items-center align-middle">
                <div class="flex items-center w-1/2 ">
                    <span class="align-middle text-sm">Number of employees</span>
                </div>
                
                <div class="tooltip ml-2 mr-2 justify-items-center">
                    <span class="material-icons align-middle">info</span>
                    <div class="tooltiptext">
                      Select the number of employees in your organization
                    </div>
                </div>
                <select id="employees" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
