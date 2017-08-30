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
const XLSX = require('XLSX');
var datasrc = JSON.parse(fs.readFileSync('data.json','utf-8'))
var xlsxsrc = XLSX.readFile('file/datasrc.xlsx')
var ws = xlsxsrc.Sheets['Sheet1']
var wsJSON = XLSX.utils.sheet_to_json(ws)
// console.log(wsJSON);
var fn = pug.compileFile('pug/tbl.pug',{pretty:true})
var aoa = []

var num2Chn = "一二三四五六七八九十".split("")
num2Chn.unshift("")

var w1d1 = new Date(2017,8,3)
// 生成教学日历第一栏第几周，几号到几号的函数
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
function weekTimeDataGen(wkNum){
  var entry = datasrc.lectTimeTtl.filter(e=>e.week==wkNum)
  assert(entry.length>0)
  for (key in entry[0]){
    entry[0][key]=entry[0][key]==0?"":entry[0][key]
  }
  return [
    entry[0].ttl,
    entry[0].lect,
    entry[0].expr
  ]
}
// 添加教学内容摘要
function weekSummary(wkNum){
  var stuffThisWeek = wsJSON.filter(e=>e.weekNum==wkNum)
  var rst = ""
  function courseNameProcess(e){
    return /([^\(（）\)]*)[\(（].*[）\)]/.exec(e)[1]
  }
  stuffThisWeek.forEach((e)=>{
    // assume to be only 2 types: lecture and experiment
    if(typeof e.lectOrder !== "undefined"){
      rst += "<span style='font-weight:bold'>讲授教师："+ datasrc.lectContent[e.lectOrder-1].teacher+"("+e.duration+"学时)"
      rst += " 周"+e.wkday+", "+e.time+"节</span>\r\n"
      rst += datasrc.lectContent[e.lectOrder-1].lectContent+"\r\n"
    }else{
      var expGroup1 = e.group.split(/[,，]/)[0]
      var expGroup2 = e.group.split(/[,，]/)[1]
      function expDesc(grp,firstOrsecond){
        return "实验"+e["exp"+firstOrsecond]+"("+e.duration+"学时) 周"+e.wkday+","+e.time+"\r\n"+grp+"组,"+e["expT"+firstOrsecond]+"\r\n"
      }
      rst+=expDesc(expGroup1,1)
      rst+=expDesc(expGroup2,2)
    }
  })
  return rst.replace(/\r\n/g,"<br>")
}
// 生成教学日历array of array
for (var i = 6; i <= 16; i++) {
  aoa.push([weekGen(i)].concat(weekTimeDataGen(i)).concat(["","",""]).concat(weekSummary(i)))
}
// console.log(aoa);
// pug 渲染
var outputStr = fn({
  header:false,
  // theads:[1,2,3,4],
  data:aoa
}).replace(/&lt;/g,"<").replace(/&gt;/g,">")

// 输出pug渲染结果
fs.writeFile('output.html',outputStr,(e,msg)=>{
  if(e)console.error(e);
})
