const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const assert = require('assert');
const fs = require('fs');
var DbTool = require('./xlsx2mongoDB.js').DbTool
var inputFile = path.join(__dirname,"..","file","test.xlsx")
var outputFile = path.join(__dirname,"..","file","test.json")
var workbook = xlsx.readFile(inputFile)
var sN = workbook.SheetNames[1]
var aoa = xlsx.utils.sheet_to_json(workbook.Sheets[sN],{header:1})
// console.log(aoa);
// assert:一二三四五/1,2都有
aoa = aoa.filter(e=>e.length>=4).map(unMerge).map(infoExtract)
function unMerge(row,iAoa,aoa){
	// 合并单元格取消合并以后会把"总体"值放在最上面的一个格子里，所以下面所有的空格子都应该取最上面的一个格子。但是这是在**不存在空格子**的前提下
	// 小心空格子！！！
	if(iAoa>0){
		for (var i = 0; i < row.length; i++) {
			if(typeof row[i]=="undefined"){
				row[i]=aoa[iAoa-1][i]
				assert(typeof row[i]!=="undefined",aoa[iAoa-1]+";"+row)
			}
		}
		return row
	}else{
		return row
	}
}
function infoExtract(row){
	// [ '一/1,2', '范宇等', '护理岗位综合技能（内科部分实训）（第13,15周，7/8/9组）', '【医学技术训练室】', '一' ]
	assert(row.length>=4,row)
	var info = {}
	info.weekday = translator(row[0].split("/")[0])
	info.classNum = translator(row[0].split("/")[1])
	assert(!/，/.test(info.classNum),info.classNum)
	info.teacher = row[1]
	// info.teacher在这里只是暂时这么设置
	var classInfo = /(.*)[\(（]第(.*)周[\)）](.*)/.exec(row[2].trim())
	assert(classInfo,row[2])
	assert(/[-，,\d]*/.exec(classInfo[2])[0].length==classInfo[2].length,/[-,\d]*/.exec(classInfo[2])[0]+JSON.stringify(classInfo))
	info.class = classInfo[1]
	info.weekNum = barReplace(classInfo[2]).split(/[,，]/).map(e=>Number.parseInt(e))
	function barReplace(txt){
		var barSep = /(\d+)-(\d+)/g
		var rst = txt.replace(barSep,(m,p1,p2,off,str)=>{
			var fromNum = Number.parseInt(p1)
			var toNum = Number.parseInt(p2)
			for(var i = fromNum+1;i<=toNum;i++){
				p1 = p1+","+i
			}
			return p1
		})
		return rst
	}
	function translator(str){
		var dict = {}
		dict["一"]=1
		dict["二"]=2
		dict["三"]=3
		dict["四"]=4
		dict["五"]=5
		dict["1,2"]=1
		dict["3,4"]=2
		dict["5,6"]=3
		dict["7,8"]=4
		dict["晚上"]=5
		dict["9,10"]=5
		return dict[str]
	}
	info.supple = classInfo[3]
	info.addr = /【(.*)】/.exec(row[3])[1]
	return info
}
var mongouri = 'mongodb://localhost/lectcal'
var schema = mongoose.Schema({
	weekday:Number,
	classNum:Number,
	teacher:String,
	class:String,
	weekNum:[Number],
	supple:String,
	addr:String
})
var collection = "curriculum"
var model1 = mongoose.model(collection,schema)
mongoose.connect(mongouri)
var db = mongoose.connection
var dbTool = new DbTool(db,model1)
db.on('error',console.error.bind(console,'connection error'))
db.on('open',()=>{
	dbTool.dbList({},(err,docs)=>{
		db.close()
	})
	// dbTool.dbPurge(model1)
	// dbTool.dbBatchInsert(aoa)
})
// TODO：xlsx数据里面是没有写班级信息的，这个是体现在sheetname里面，所以看一下在哪里添加？
