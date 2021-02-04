const jwt               =       require("jsonwebtoken");
const notRequired       =       require('dotenv').config();

const { JWT_ACCESS_SECRET_KEY }  = require('../config')

module.exports = (req, res, next) =>
{
	try
	{
		// verify() method returns the decoded token if succeeds
		// if token is sent through body
		// const decoded = jwt.verify(req.body.token, process.env.accessSecretKey);
		const wholeArray = req.headers.authorization;
		const token = wholeArray.split(" ")[1];

		// if token is sent through headers
		// Here we have not used callback i.e we stored the result in the variable
		// named 'decoded' i.e we used a synchronous way instead of asynchronous (callback) 
		const decoded = jwt.verify(token, JWT_ACCESS_SECRET_KEY);

		req.userData = decoded;
		
		next();
	}
	catch(error)
	{
		return res.status(401).json(
		{
			message: 'Auth failed'
		})
	}
}