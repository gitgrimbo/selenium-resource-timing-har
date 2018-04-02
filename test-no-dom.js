const fs = require("fs");
const dataFn = require("../performance-bookmarklet/dist/tempEs5/data-fn.js");
const perfData = JSON.parse(fs.readFileSync("./data.json"));
const data = dataFn(perfData.document.domain, perfData.location.host, perfData.location.href, perfData.perfTiming, perfData.resources, perfData.marks, perfData.measures);
data.isValid = data.isValid();
console.log(data);
