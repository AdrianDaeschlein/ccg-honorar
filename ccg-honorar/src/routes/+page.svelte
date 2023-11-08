<script lang="ts">
    import * as XLSX from 'xlsx';
    import { onMount } from 'svelte';
    import "../lib/styles/global.css";

    let HONORAR_VARIABLES: any;
    let results: any[] = [];
    let isLoading = true;
    let valuesCalculated = false;
    let answersDict: { [key: string]: string } = {};

    let mean = 0;
    let median = 0;
    let std = 0;
    let p25 = 0;
    let p75 = 0;

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

    function onCalculate() {
        // Assuming 'baseline.xlsx' is in the public folder and can be fetched
        let value: string = ''
        fetch('../src/lib/baseline.xlsx')
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
                console.log(workbook);
                // Here you can get the first sheet name to access the sheet:
                const firstSheetName = workbook.SheetNames[1];
                const worksheet = workbook.Sheets[firstSheetName];
                // Convert sheet to JSON
                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
                // Now jsonData contains your Excel file data as an array of objects
                // You can access the data you need for calculations here
                // For example, if you want to get the value from the first row and first column:
                median = jsonData[Number(answersDict['employees'])]['Member Median'];
                mean = jsonData[Number(answersDict['employees'])]['Member Mean'];
                std = jsonData[Number(answersDict['employees'])]['Member SD'];
                p25 = jsonData[Number(answersDict['employees'])]['Member p25'];
                p75 = jsonData[Number(answersDict['employees'])]['Member p75'];

                // Do your calculations with the obtained values
                console.log(median);


            })
            .catch(error => {
                console.error("Error fetching or parsing the Excel file", error);
            });
        // timeput half second
        
        
    };
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
<!-- CCG Logo -->
<div class="flex justify-end mt-2 mr-2">
    <img src="../src/lib/cbs_logo_ccg_rgb_blue.svg" alt="CBS Logo" class="w-1/2 md:w-1/4">
</div>
<h1 class="text-3xl font-cbs-new-bold text-cbs-blue ml-20">BOARD FEE CALCULATOR</h1>
<p class="text-cbs-blue font-cbs-serif-italic ml-20">What are common salaries for Danish Boards Members?</p>

<div class="container mx-auto">
    <div class="flex flex-col md:flex-row">
        <div class="input-div w-full md:w-1/3 p-4">
            <!-- Input Component Loop -->
            {#if isLoading}
                <p>Loading...</p>
            {:else}
                {#each results as result}
                <div class="flex items-center align-middle m-2">
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
            <button on:click={onCalculate} class="bg-cbs-blue text-white font-bold py-2 px-4 rounded-full mt-4">Calculate</button> 
        </div>
        <div class="output-div w-full md:w-2/3 p-4 bg-cbs-blue rounded-3xl ">
            <!-- answerdict to string -->
            <p class="text-white">Mean: {mean}</p>
            <p class="text-white">Median: {median}</p>
            <p class="text-white">Standard Deviation: {std}</p>
            <p class="text-white">25th Percentile: {p25}</p>
            <p class="text-white">75th Percentile: {p75}</p>
        </div>
    </div>
</div>
