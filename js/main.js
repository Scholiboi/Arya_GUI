import TableCsv from "./TableCsv.js";
const tableRoot = document.querySelector("#csvRoot");
const csvFileInput = document.querySelector("#csvFileInput"); 
const tableCsv = new TableCsv (tableRoot);
csvFileInput.addEventListener("change", e => { 
    console.log("File selected", csvFileInput.files[0]);
    Papa.parse(csvFileInput.files[0], {
    delimiter: ",",
    skipEmptyLines: true,
    complete: results => {
    tableCsv.update(results.data.slice(1), results_data[0]);
    }
}
)
}
);