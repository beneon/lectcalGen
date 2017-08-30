// 第一周
// 9月4日
// 至
// 9月10日
// 第二周
// 9月11日
// 至
// 9月17日
var pug = require('pug')
const assert = require('assert');
const fs = require('fs');
var datasrc = fs.readFileSync('data.json','utf-8')
var fn = pug.compileFile('pug/tbl.pug',{pretty:true})
var aoa = []
var num2Chn = "一二三四五六七八九十".split("")
num2Chn.unshift("")
var w1d1 = new Date(2017,8,3)
// 生成教学日历第一栏第几周，几号到几号
// ==========
function weekGen(wkNum){
  assert(wkNum<100,"out of range for wkNum")
  assert(wkNum>0,"out of range for wkNum")
  var shi = (wkNum-wkNum%10)/10
  if(shi<1){
    shi = ""
  }else if(shi<2){
    shi = "十"
  }else{
    shi = num2Chn[shi]+"十"
  }
  var ge = num2Chn[wkNum%10]
  var template = "第"+shi+ge+"周"
  var wkStart= new Date(w1d1.getFullYear(),w1d1.getMonth(),w1d1.getDate()+(wkNum-1)*7)
  var wkEnd = new Date(wkStart.getFullYear(),wkStart.getMonth(),wkStart.getDate()+6)
  wkStartStr = wkStart.getMonth()+1+"月"+wkStart.getDate()+"日"
  wkEndStr = wkEnd.getMonth()+1+"月"+wkEnd.getDate()+"日"
  template = template + "<br>" + wkStartStr + "<br>至<br>" + wkEndStr
  return template
}

// 添加学时统计数据
var weekTimeDataGen(wkNum){

}
// 接入外部数据
for (var i = 1; i <= 12; i++) {
  aoa.push([weekGen(i)])
}

var outputStr = fn({
  header:false,
  // theads:[1,2,3,4],
  data:aoa
}).replace(/&lt;/g,"<").replace(/&gt;/g,">")

fs.writeFile('output.html',outputStr,(e,msg)=>{
  if(e)console.error(e);
  console.log(msg);
})
