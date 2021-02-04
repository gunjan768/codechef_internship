const mongoose          =       require("mongoose");

const UserTagSchema = mongoose.Schema(
{
	// id: mongoose.Schema.Types.ObjectId, 
	userId:
	{
		type: String,
        required: true,
	},
	tags:
	{
		type: Array,
		of: String
	},
});

module.exports = mongoose.model('user_defined_tag', UserTagSchema);