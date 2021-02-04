const mongoose          =       require("mongoose");

const ProblemSchema = mongoose.Schema(
{
	languagesSupported:
	{
        type: [String],
        required: true,
	},
	tags:
	{
        type: Array,
        of: String,
		required: true,
	},
	problemCode: 
	{
		type: String,
		required: true,
    },
    problemName: 
	{
		type: String,
		required: true,
    },
    dateAdded: 
	{
		type: String,
		required: true,
    },
    sourceSizeLimit: 
	{
		type: String,
		required: true,
    },
    maxTimeLimit: 
	{
		type: String,
		required: true,
    },
    challengeType: 
	{
		type: String,
		required: true,
    },
    author: 
	{
		type: String,
		required: true,
    },
    successfulSubmissions: 
	{
		type: String,
		default: "0"
    },
    totalSubmissions: 
	{
		type: String,
		default: "0"
    },
    partialSubmissions: 
	{
		type: String,
		default: "0"
    },
    body: 
	{
		type: String,
		required: true,
    },
    accuracy: 
	{
		type: String,
		default: "0.00"
	},
	userDefined: 
	[
		{
			userId:
			{
				type: String,
				required: true
			},
			userTags:
			{
				type: Array,
				of: String,
				required: true
			}
		}
	]
});

module.exports = mongoose.model('problem', ProblemSchema);