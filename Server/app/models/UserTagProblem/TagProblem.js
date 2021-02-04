const mongoose          =       require("mongoose");

const UserTagProblemSchema = mongoose.Schema(
{
    // id: mongoose.Schema.Types.ObjectId,
    userId:
	{
		type: String,
        required: true,
	},
    problems:
    [
        {
            problemCode:
            {
                type: String,
                required: true,
            },
            tags:
            {
                type: Array,
                of: String,
                default: []
            }
        },
    ]
});

module.exports = mongoose.model('user_tag_problem', UserTagProblemSchema);