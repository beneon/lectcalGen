var Xlsx2Aoa = require('./xlsxProcess.js').Xlsx2Aoa
const path = require('path');
var inputFile = path.join(__dirname,"..","file","test.xlsx")
var arr = []
var xlsx2Aoa = new Xlsx2Aoa(inputFile,(aoa)=>{
	arr = aoa
})
