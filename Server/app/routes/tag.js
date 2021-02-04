const express           	=       	require("express");
const mongoose          	=       	require("mongoose");
const Tag          	        =       	require("../models/Tag/Tag");
const UserDefined           =           require("../models/Tag/UserDefined");
const axios                 =           require("axios");
const fs                    =           require("fs");
const Problem          	    =       	require("../models/Problem/Problem");
const UserTagProblem        =           require("../models/UserTagProblem/TagProblem");

const router = express.Router();

module.exports = router;
const LIMIT = 50;

router.post('/tag', 
async ({ body: { currentUser, currentPageNumber, currentSwitchState: { checkedAuthor, checkedConcept } } }, res, next) =>
{     
    let data = [], userData = [];
    
    try
    {   
        // console.log(currentPageNumber);

        if(checkedAuthor && checkedConcept)
        {
            data = await Tag.find({},{_id: 0, tag: 1, count: 1, type: 1})
            .skip(LIMIT*(currentPageNumber-1))
            .limit(LIMIT);
        }
        else if(checkedAuthor)
        {
            data = await Tag.find(
            {
                type : { $eq: "author" }
            },
            {
                _id: 0, 
                tag: 1, count: 1, type: 1

            })
            .sort({ _id: 1 })
            .skip(LIMIT*(currentPageNumber-1))
            .limit(LIMIT);
        }
        else if(checkedConcept)
        {
            data = await Tag.find(
            {
                type: { $ne: "author" }
            },
            {
                _id: 0, 

            })
            .sort({ _id: 1 })
            .skip(LIMIT*(currentPageNumber-1))
            .limit(LIMIT);
        }

        // console.log(currentUser);

        if(currentUser && Object.keys(currentUser).length !== 0 && currentUser.constructor === Object)
        {
            const { userId } = currentUser;

            if(userId !== undefined && userId !== null)
            {
                userData = await UserDefined.find({userId},{ _id: 0, userId: 0 })
                .sort({ _id: 1 })
                .skip(LIMIT*(currentPageNumber-1))
                .limit(LIMIT);
                
                if(userData && userData.length)
                userData = userData[0].tags;
            }

            return res.status(200).json({ data, userData });
        } 

        return res.status(200).json({ data, userData });
    }
    catch(error)
    {
        console.log({error});

        return res.status(500).json(
        {
            error : "Error creating user due to server break down"
        });
    }
});

router.post('/search_tag', async ({body: { currentUser, value }}, res, next) =>
{     
    let data = [], userData = [];
    
    try
    {
        if(value === undefined)
        {
            data = await Tag.find({},{_id: 0, tag: 1}).limit(LIMIT);
        }
        else
        {
            data = await Tag.find(
            {
                tag: { $regex: value, $options: "$i" }
            },
            {
                _id: 0, tag: 1

            }).limit(LIMIT);
        }

        if(currentUser && Object.keys(currentUser).length !== 0 && currentUser.constructor === Object)
        {
            const { userId } = currentUser;

            if(userId !== undefined && userId !== null)
            {
                if(value === undefined)
                {
                    userData = await UserDefined.find({userId},{ _id: 0, userId: 0 }).limit(LIMIT);
                    
                    userData = userData[0].tags;

                    userData = userData.map(value =>
                    {
                        return {
                            tag: value
                        }
                    });
                }
                else
                {
                    userData = await UserDefined.aggregate(
                    [
                        { $unwind: { path: "$tags" }},
                        { $match: { $and: [{ userId: { $eq: userId }}, { tags: { $regex: value } }] }},
                        { $group: { _id: { tag: "$tags"}} }
                    ]);

                    userData = userData.map(value => value._id);
                }
            }
        }

        return res.status(200).json({ data, userData });  
    }
    catch(error)
    {
        return res.status(500).json(
        {
            error : "Error creating user due to server break down"
        });
    }
});

const seeTagIsAlreadyThere = async (userId, tagname) =>
{
    try
    {   
        const isTagPresent = await UserDefined.findOne(
        {
            $and: 
            [ 
                { userId: userId }, 
                { tags: { $in: tagname } },
            ]
        },
        {
            _id: 1 
        });

        return (isTagPresent !== null);
    }   
    catch(error)
    {
        return true;
    }
}

router.post('/add_new_tag', async ({body: { currentUser, problemCode, tagname }}, res, next) =>
{     
    try
    {
        if(currentUser && Object.keys(currentUser).length !== 0 && currentUser.constructor === Object)
        {
            const { userId } = currentUser;
            
            if(userId !== undefined && userId !== null)
            {
                const isTagAlreadyPresent = await Problem.findOne(
                {
                    $and:
                    [
                        { problemCode: { $eq: problemCode }},
                        {
                            $or:
                            [
                                {
                                    userDefined:
                                    {
                                        $elemMatch:
                                        {
                                            userId: { $eq: userId },
                                            userTags: { $in: tagname }
                                        }
                                    }
                                },
                                { 
                                    tags: { $in: tagname } 
                                }
                            ]
                        } 
                    ]
                },
                {
                    _id: 1
                });
                
                if(isTagAlreadyPresent)
                {
                    return res.status(200).json({ "message": "Tag exists" }); 
                }

                const hasUserCreatedHisFirstTagForThisProblem = await Problem.findOne(
                {
                    $and:
                    [
                        { problemCode: { $eq: problemCode }},
                        { userDefined: { $exists: true, $ne: null }},
                        { userDefined: { $type: "array" }},
                        { "userDefined.userId" : { $eq: userId }}
                    ]
                },
                {
                    _id: 1
                });

                const isTagPresent = await seeTagIsAlreadyThere(userId, tagname);
                
                if(hasUserCreatedHisFirstTagForThisProblem)
                {
                    await Problem.updateOne(
                    {
                        $and: 
                        [ 
                            { problemCode: { $eq: problemCode }}, 
                            { "userDefined.userId": { $eq: userId } },
                        ]
                    },
                    {
                        $push: 
                        { 
                            "userDefined.$.userTags": 
                            {
                                $each: [tagname], 
                                $position: 0 
                            },
                        }
                    }, 
                    {
                        upsert: true
                    });
                }
                else
                {
                    await Problem.updateOne({problemCode},
                    {
                        $push: 
                        { 
                            "userDefined": 
                            {
                                $each: 
                                [
                                    { 
                                        userId: userId, 
                                        userTags: [tagname]
                                    } 
                                ],
                                $position: 0
                            },
                        }
                    }, 
                    {
                        upsert: true
                    });
                }

                if(!isTagPresent)
                {
                    await UserDefined.updateOne(
                    {
                        $and: 
                        [ 
                            { userId: { $eq: userId }},
                        ]
                    },
                    {
                        $push: 
                        { 
                            "tags": 
                            { 
                                $each: [tagname], 
                                $position: 0 
                            } 
                        }
                    },
                    {
                        upsert: true
                    });
                }
            }
        }
        
        return res.status(200).send({"success": "Successfully Added"});
    }
    catch(error)
    {
        console.log(error);

        return res.status(500).json(
        {
            error : "Error creating user due to server break down"
        });
    }
});



// *************************************** Code for fetching data from the codechef api ******************************************


router.get('/fetch_all_tags',async (req, res, next) =>
{     
    // let tagsArray = [];
    // const token = "";
 
    // try
    // {
    //     for(let i=0;i<20;i++)
    //     {
    //         const { data: { result: { data: { content } } } } = await axios.get(
    //             `https://api.codechef.com/tags/problems?offset=${i*100}&limit=100`,
    //         {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
            
    //         for(let key in content)
    //         tagsArray.push(content[key]);

    //         console.log(tagsArray);
    //     }

    //     fs.writeFile("./tags.json", JSON.stringify(tagsArray, null, 4), error => 
    //     {
    //         if(error) 
    //         {
    //             console.error(err);

    //             return;
    //         };

    //         console.log("File has been created");
    //     });
    // }
    // catch(error)
    // {
    //     return res.status(500).json(
    //     {
    //         error : "Error creating user due to server break down"
    //     })
    // }
});