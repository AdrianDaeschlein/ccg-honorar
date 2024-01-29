<script lang="ts">
    import * as XLSX from 'xlsx';
    import * as d3 from 'd3';
    import Boxplot from '$lib/boxplot.svelte';
    import Linechart from '$lib/linechart.svelte';
    import { onMount } from 'svelte';
    import { initializeApp } from "firebase/app";
    import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';
    import "../lib/styles/global.css";

    // assets
    import cbs_logo from "$lib/cbs_logo_ccg_rgb_blue.svg";

    const firebaseConfig = {
        apiKey: "AIzaSyCSq9_HALkQ9bLphnpvQYdlJjKei-B3NMg",
        authDomain: "ccg-honorar.firebaseapp.com",
        projectId: "ccg-honorar",
        storageBucket: "ccg-honorar.appspot.com",
        messagingSenderId: "382719109528",
        appId: "1:382719109528:web:bb15985dd959d73f7be3ed",
        measurementId: "G-T88Q5RVGZB"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    // const analytics = getAnalytics(app);



    let HONORAR_VARIABLES: any;
    let DATA_VALUES: any;
    let MONTHLY_AVG_EXPORT: number[] = [];
    let results: any[] = [];
    let isLoading = true;
    let valuesCalculated = false;
    let answersDict: { [key: string]: string } = {};
    
    let keyword = ""
    let actual_salary = ""

    let mean = 0;
    let median = 0;
    let std = 0;
    let p25 = 0;
    let p75 = 0;

    let isEnglish = true;
    let text = "text";
    let explanation = "explanation";

    onMount(async () => {
        fetch('/honorar-variables2.json')
            .then((response) => response.json())
            .then(json => {
                HONORAR_VARIABLES = json
                for(var i in HONORAR_VARIABLES)
                    results.push([i, HONORAR_VARIABLES [i]]);
                isLoading = false;
            });

        fetch('/data_values.json')
            .then((response) => response.json())
            .then(json => {
                DATA_VALUES = json
                isLoading = false;
            });
        
        fetch('/monthly_avg_export.xlsx')
        .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData: number[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                MONTHLY_AVG_EXPORT = jsonData.flat();

            })
            .catch(error => {
                console.error("Error fetching or parsing the Excel file", error);
            });
    })

    function onCalculate() {
        isLoading = true;
        fetch('/baseline.xlsx')
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
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

                sketchGraph();
            })
            .catch(error => {
                console.error("Error fetching or parsing the Excel file", error);
            });

        onAdapt();
        isLoading = false;
        scrollToOutput();
    };

    function onAdapt() {
        valuesCalculated = false;
        let correctionValues: { key: string, value: number[] }[] = [];
        fetch('/baseline.xlsx')
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
                // Here you can get the first sheet name to access the sheet:
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Convert sheet to JSON
                // Convert sheet to an array of arrays
                const arrayData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                for (var i in answersDict) {
                    const danish_key = HONORAR_VARIABLES[i]['danish_key']
                    if (danish_key == "") {
                        continue;
                    } else {
                        let column: number = 1;
                        answersDict['employees'] == "Select answer" ? column = 1 : column = 1 + 3*Number(answersDict['employees']);
                        let correctionValue = [
                            arrayData[DATA_VALUES[danish_key]-2][column].replace(/\*/g, ''),
                            arrayData[DATA_VALUES[danish_key]-2][column + 1].replace(/\*/g, ''),
                            arrayData[DATA_VALUES[danish_key]-2][column + 2].replace(/\*/g, ''),
                        ]

                        // make laborcosts_employees 0 for now
                        if (danish_key == "laborcosts_employees") {
                            correctionValue = [0, 0, 0]
                        }

                        // TODO fix for mc questions
                        if (answersDict[i] == "Select answer" || answersDict[i] == "2") {
                            correctionValue = [0, 0, 0]
                        }

                        correctionValues.push({ key: danish_key, value: correctionValue })
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching or parsing the Excel file", error);
            });
        
        // timeout to wait for the fetch to finish
        setTimeout(() => {
            for (let i in correctionValues) {
                p25 = Math.round(p25 * (1 + Number(correctionValues[i].value[0])));
                median = Math.round(median * (1 + Number(correctionValues[i].value[1])));
                p75 = Math.round(p75 * (1 + Number(correctionValues[i].value[2])));
            }
            // round mean and std
            mean = Math.round(mean);
            std = Math.round(std);
            isLoading = false;
            valuesCalculated = true;
        }, 500);
    }

    function sketchGraph() {
        let simulatedData: number[] = d3.range(100000).map(() => {
            let value;
            do {
                value = d3.randomNormal(mean, std)();
            } while (value < 0);
            return value;
        });

        const margin = { top: 30, right: 30, bottom: 30, left: 50 },
            width = 800 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#kdePlot")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

        const maxData = d3.max(simulatedData) ?? mean; // Fallback to mean if max is undefined
        const minData = d3.min(simulatedData) ?? mean; // Fallback to mean if min is undefined
        // Create the X-axis scale
        const x = d3.scaleLinear()
            .domain([0, 350000])
            .range([0, width]);

        // Add the X-axis to the svg
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Calculate the KDE
        const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40), simulatedData);

        // Add the KDE path to the svg
        svg.append("path")
            .datum(kde)
            .attr("fill", "#69b3a2")
            .attr("stroke", "#000")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x((d: any) => x(d[0]))
                .y((d: any) => height - d[1] * 5000000) // Scale the y value to fit in our graph, you may need to adjust this
            );
    }

    function kernelDensityEstimator(kernel: any, X: any, data: number[]) {
        return X.map((x: number) => [x, d3.mean(data, (v: number) => kernel(x - v))]);
    }

    function kernelEpanechnikov(k: number) {
        return (v: number) => Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    }

    async function pushCorrection() {
        let correctionAnswerDict = answersDict
        correctionAnswerDict['keyword'] = keyword
        correctionAnswerDict['actual_salary'] = actual_salary

		await addDoc(collection(db, 'honorar-corrections'), correctionAnswerDict);
	}

    function scrollToOutput() {
        setTimeout(() => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }, 500);
    }

    function onChangeLanguage(event: any) {
        isEnglish = event.target.value == "true" ? true : false;
        isEnglish ? text = "text" : text = "danish_text";
        isEnglish ? explanation = "explanation" : explanation = "danish_explanation";
    }

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
    <select
    on:change={onChangeLanguage}
    class="mr-2">
        <option value="true" selected>🇬🇧 English</option>
        <option value="false">🇩🇰 Danish</option>
    </select>
    <img src={cbs_logo} alt="CBS Logo" class="w-1/2 md:w-1/4">
</div>
<h1 class="text-3xl font-cbs-new-bold text-cbs-blue ml-1 md:ml-20 mt-3 md:mt-0">{isEnglish ? "BOARD FEE CALCULATOR" : "BEREGNER AF BESTYRELSESHONORAR"}</h1>
<p class="text-cbs-blue font-cbs-serif-italic ml-1 md:ml-20">{isEnglish ? "What are common salaries for Danish Board Members?" : "Hvad er almindelige lønninger for danske bestyrelsesmedlemmer?"}</p>

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
                        <span class="align-middle text-sm">{result[1][text]}</span>
                    </div>
                    <div class="tooltip ml-2 mr-2 justify-items-center">
                        <span class="material-icons align-middle">info</span>
                        <div class="tooltiptext">
                            {result[1][explanation]}
                        </div>
                    </div>
                    <select 
                    bind:value={answersDict[result[0]]}
                    id="employees" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {#if isEnglish}
                            <option selected>Select</option>
                        {:else}
                            <option selected>Vælg</option>
                        {/if}
                        {#each result[1].options as option}
                            <option value="{option.value}">{option.text}</option>
                        {/each}
                    </select>
                </div>
                {/each}
            {/if}
            <button on:click={() => location.reload()} class="bg-cbs-blue text-white font-bold py-2 px-4 rounded-full mt-4">
                {isEnglish ? "Refresh" : "Genindlæs"}
            </button>
            <button on:click={onCalculate} class="bg-cbs-blue text-white font-bold py-2 px-4 rounded-full mt-4">{isEnglish ? "Calculate" : "Beregne"}</button>
        </div>
        <!-- <div class="output-div w-full md:w-2/3 p-4 bg-cbs-blue rounded-3xl "> -->
        <div id="outputDiv" class="output-div flex flex-col justify-between w-full p-4 bg-cbs-blue rounded-t-3xl  md:rounded-3xl min-h-full">
            <div class="flex flex-wrap justify-around text-center">
                <div class="flex flex-col items-center m-2">
                    <p class="text-white">{isEnglish ? "25th Percentile" : "25. Percentil"}</p>
                    <p class="text-white">{p25} DKK</p>
                </div>
                <div class="flex flex-col items-center m-2">
                    <div class="flex items-center justify-center">
                        <div class="w-4 h-4 bg-red-500 mr-2"></div> <!-- Small red square -->
                        <p class="text-white">Median</p>
                    </div>
                    <p class="text-white">{median} DKK</p>
                </div>
                <div class="flex flex-col items-center m-2">
                    <p class="text-white">{isEnglish ? "75th Percentile" : "75. Percentil"}</p>
                    <p class="text-white">{p75} DKK</p>
                </div>
                <div class="flex flex-col items-center m-2">
                    <div class="flex items-center justify-center">
                        <div class="w-4 h-4 bg-green-500 mr-2"></div> <!-- Small green square -->
                        <p class="text-white">{isEnglish ? "Mean" : "Gennemsnit"}</p>
                    </div>
                    <p class="text-white">{mean} DKK</p>
                </div>
                <div class="flex flex-col items-center m-2">
                    <p class="text-white">{isEnglish ? "Standard Deviation" : "Standardafvigelse"}</p>
                    <p class="text-white">{std} DKK</p>
                </div>
            </div>
            <!-- <div id="kdePlot"></div> -->
            {#if !isLoading && valuesCalculated}
                <div class="h-56 w-full flex items-center justify-center">
                    <Boxplot {median} {p25} {p75} {mean}/>
                </div>
                <div class="pt-4">
                    <p class="text-cbs-white">{isEnglish ? "Help us and send a correction:" : "Hjælp os og send en rettelse:"}</p>
                    <div class="flex flex-col sm:flex-row m-2 items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <input bind:value={keyword} placeholder={isEnglish ? "Keyword" : "Nøgleord"} type="text" id="small-input" class="block p-2 w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <input bind:value={actual_salary} placeholder={isEnglish ? "Actual Monthly Salary in DKK" : "Faktisk månedsløn i DKK"} type="text" id="small-input" class="block p-2 w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <button on:click={pushCorrection} class="m-2 px-4 bg-cbs-white text-cbs-blue rounded-full w-full sm:w-auto">Send</button>
                    </div>
                </div>
                
            {/if}
            <!-- <div class="w-96 h-56">
                <Linechart {MONTHLY_AVG_EXPORT}/>
            </div> -->
            
        </div>
    </div>
</div>
