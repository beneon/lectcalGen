// 现在把这个内容写进了一个module，用法是new一个，按照data,uri,schema,collection,config的顺序写参数
// 根据参数的不同决定是进行添加数据（multi），列出现有内容（list）和清空数据（delete）。
const mongoose = require('mongoose');
var DbTool = function(db,model){
	this.db = db
	this.model = model
}
DbTool.prototype.dbList = function (criteria,cb){
	this.model.find(criteria).exec((err,docs)=>{
		cb(err,docs)
	})
}
DbTool.prototype.dbPurge = function(cb){
	this.model.deleteMany({},(err,msg)=>{
		// console.log(msg);
		cb(err,msg)
	})
}
DbTool.prototype.dbBatchInsert = function(data,cb){
	this.model.insertMany(data,(err,docs)=>{
		if(err)console.error(err)
		var eDocs = docs[Symbol.iterator]()
		var entry
		iter.call(this,eDocs)
		function iter(eDocs){
			var entry = eDocs.next()
			if(!entry.done){
				entry.value.save().then(arguments.callee.call(this,eDocs))
			}else{
				console.log("done");
				this.dbList({},cb)
			}
		}
	})
}
DbTool.prototype.singleInsert = function(entry,cb){
	this.model.insert
}
exports.DbTool = DbTool
