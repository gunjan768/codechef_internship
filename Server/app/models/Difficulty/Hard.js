const mongoose          =       require("mongoose");

const HardSchema = mongoose.Schema(
{
	id: mongoose.Schema.Types.ObjectId, 
	problemCode:
	{
		type: String,
        required: true,
        unique: true
	},
	problemName:
	{
		type: String,
		required: true,
	},
	successfulSubmissions: 
	{
		type: String,
		required: true,
		// match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	accuracy: 
	{
		type: String,
		required: true
	}
});

module.exports = mongoose.model('hard', HardSchema);