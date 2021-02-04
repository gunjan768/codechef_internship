const express           	=       	require("express");
const mongoose          	=       	require("mongoose");
const bcrypt 				= 			require('bcrypt'); 				// install version bcrypt@3.0.6
const User          		=       	require("../models/User/user");
const jwt               	=       	require("jsonwebtoken");
const notRequired       	=       	require('dotenv').config();
const checkAuth         	=       	require("../middleware/auth");

const router = express.Router();

module.exports = router;

const { JWT_ACCESS_SECRET_KEY } = require('../config');

router.post("/register", async (req, res, next) =>
{
	const { body: { email, password, username, displayname } } = req;
	
	try 
	{
		const userFound = await User.findOne(
		{ 
			$or: 
			[
				{ email },
				{ username }
			]
		}, { displayname: 0, _id: 0, password: 0 });
		
		if(userFound)
		{
			return res.status(409).json(
			{
				error: "Email or username already registered"
			});
		}

		const saltRounds = 12;

		const hashedPassword = await bcrypt.hash(password, saltRounds);
		
		const user = new User(
		{
			// id: new mongoose.Types.ObjectId(),
			name: displayname,
			username,
			email,
			password: hashedPassword
		});

		await user.save();

		return res.status(201).json(
		{
			message: "User created"
		});
	}
	catch(error) 
	{
		return res.status(500).json(
		{
			error : "Error creating user due to server down"
		});
	}

	// User.findOne({email}).exec()
	// .then(user => 
	// {
	// 	if(user)
	// 	{
	// 		res.status(409).json(
	// 		{
	// 			error: "Email exists"
	// 		})

	// 		return;
	// 	}
	// 	else
	// 	{
	// 		const saltRounds = 12;

	// 		bcrypt.genSalt(saltRounds, (errors, salt) =>
	// 		{
	// 			bcrypt.hash(password, saltRounds, (error, hash) =>
	// 			{
	// 				if(error)
	// 				{
	// 					return res.status(500).json({ error });
	// 				}
	// 				else
	// 				{
	// 					const user = new User(
	// 					{
	// 						id: new mongoose.Types.ObjectId(),
	// 						name: displayname,
	// 						username,
	// 						email,
	// 						password: hash
	// 					});

	// 					user.save()
	// 					.then(() => 
	// 					{
	// 						return res.status(201).json(
	// 						{
	// 							message: "User created"
	// 						});
	// 					})
	// 					.catch(err =>
	// 					{
	// 						return res.status(500).json(
	// 						{
	// 							error: err
	// 						})
	// 					})
	// 				}
	// 			});
	// 		})
	// 	}
	// })
})

router.post("/login", async (req, res, next) =>
{
	const { body: { username, password } } = req;

	try
	{
		const user = await User.findOne({username},{username: 0, name: 0, email: 0});

		if(!user)
		throw res.status(401).json({ message: 'Auth failed'});

		const isEqual = await bcrypt.compare(password, user.password);
		
		if(!isEqual)
		throw res.status(401).json({ message: 'Auth failed'});

		const token = jwt.sign(
		{
			username: username,
			userId: user._id
		}, 
		JWT_ACCESS_SECRET_KEY,
		{
			expiresIn: '1h'
		});
	
		return res.status(200).json(
		{
			message: 'Auth Successful',
			token
		});
	}
	catch(error)
	{
		return res.status(500).json(
		{
			error : "Error creating user due to server down"
		});
	}

	// User.findOne({username},{displayname: 0, email: 0}).exec()
	// .then(user => 
	// {
	// 	console.log(user);

	// 	if(!user)
	// 	{
	// 		res.status(401).json(
	// 		{
	// 			message: 'Auth failed'
	// 		})

	// 		return;
	// 	}

	// 	bcrypt.compare(password, user.password, (error, result) =>
	// 	{
	// 	    if(error)
	// 	    {
	// 	    	res.status(401).json(
	// 			{
	// 				message: 'Auth failed'
	// 			})

	// 			return;
	// 	    }

	// 	    if(result)
	// 	    {
	// 	    	const token = jwt.sign(
	// 	    	{
	// 	    		username: user.username,
	// 	    		userId: user.id
	// 	    	}, 
	// 	    	process.env.accessSecretKey,
	// 			{
	// 				expiresIn: '1h'
	// 			})

	// 	    	return res.status(200).json(
	// 			{
	// 				message: 'Auth Successful' ,
	// 				token
	// 			})
	// 	    }
	// 	    else
	// 	    {
	// 	    	res.status(401).json(
	// 			{
	// 				message: 'Auth failed'
	// 			})

	// 			return;
	// 	    }
	// 	});
	// })
	// .catch(error =>
	// {
	// 	console.log(error);

	// 	return res.status(500).json(
	// 	{
	// 		error: error
	// 	})
	// })
})

router.get("/check_user", checkAuth, (req, res) =>
{
	return res.status(200).json(
	{
		message: 'Successfully checked ' ,
		data: req.userData
	})
})


module.exports = router;