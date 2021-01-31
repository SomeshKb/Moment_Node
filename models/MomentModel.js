var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MomentSchema = new Schema({
	title: {type: String, required: true},
	tags: [{type: String,required:true}],
	description:{type: String, required: true},
	filePath : {type:String},
	user: { type: Schema.ObjectId, ref: "User", required: true }
}, {timestamps: true});

module.exports = mongoose.model("Moment", MomentSchema);