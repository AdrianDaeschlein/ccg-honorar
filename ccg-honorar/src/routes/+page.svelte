<script lang="ts">
    import { onMount } from 'svelte';
    import "../lib/styles/global.css";

    let HONORAR_VARIABLES: any;
    let results: any[] = [];
    let isLoading = true;
    let answersDict: { [key: string]: string } = {};

    onMount(async () => {
        fetch('../src/lib/honorar-variables.json')
            .then((response) => response.json())
            .then(json => {
                HONORAR_VARIABLES = json
                for(var i in HONORAR_VARIABLES)
                    results.push([i, HONORAR_VARIABLES [i]]);
                isLoading = false;
            });
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
<!-- insert svg  -->
<div class="flex justify-end mt-2 mr-2">
    <img src="../src/lib/cbs_logo_ccg_rgb_blue.svg" alt="CBS Logo" class="w-1/2 md:w-1/4">
</div>
<h1 class="text-3xl font-cbs-new-bold text-cbs-blue">BOARD FEE CALCULATOR</h1>
<p class="text-cbs-blue">What are common salaries for Danish Boards Members?</p>

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
                            {result[1].explanation}
                        </div>
                    </div>
                    <select 
                    bind:value={answersDict[result[0]]}
                    id="employees" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Select answer</option>
                        {#each result[1].options as option}
                            <option value="{option.value}">{option.text}</option>
                        {/each}
                    </select>
                </div>
                {/each}
            {/if} 
        </div>
        <div class="output-div w-full md:w-2/3 p-4 bg-cbs-blue">
            <!-- answerdict to string -->
            <p class="text-white">Your answers: {JSON.stringify(answersDict)}</p>
        </div>
    </div>
</div>
