const express           	=       	require("express");
const mongoose          	=       	require("mongoose");
const School          	    =       	require("../models/Difficulty/School");
const Easy          	    =       	require("../models/Difficulty/Easy");
const Medium          	    =       	require("../models/Difficulty/Medium");
const Hard          	    =       	require("../models/Difficulty/Hard");
const Challenge          	=       	require("../models/Difficulty/Challenge");
const Problem          	    =       	require("../models/Problem/Problem");
const Peer          	    =       	require("../models/Difficulty/Peer");
const UserDefined           =           require("../models/Tag/UserDefined");
const Tag                   =           require("../models/Tag/Tag");
// const UserTagProblem     =           require("../models/UserTagProblem/TagProblem");
// const jwt               	=       	require("jsonwebtoken");
// const notRequired       	=       	require('dotenv').config();
// const checkAuth         	=       	require("../middleware/auth");


const router = express.Router();

module.exports = router;

const LIMIT = 20;

const DIFFICULTY_LEVEL_ARRAY =
{
    School,
    Easy,
    Medium,
    Hard,
    Challenge,
    Peer
};

router.post('/difficulty', async ({ body: { difficultyLevel, pageNumber } }, res, next) =>
{
    try
    {
        const Difficulty = DIFFICULTY_LEVEL_ARRAY[difficultyLevel];

        const data = await Difficulty.find({})
            .skip((pageNumber-1)*LIMIT)
            .limit(LIMIT);
            
        const totalCount = await Difficulty.aggregate( [{ $count: "myCount" }]);

        return res.status(200).json({ data, totalCount }); 
    }
    catch(error)
    {
        return res.status(500).json(
        {
            error : "Error creating user due to server down"
        });
    }
});

const performOperationOnArray = (array, map) =>
{
    array = array.filter(value => map.has(value) === false);

    return array;
}

router.post('/problem', async ({body: { currentTagArray, currentUser, currentPageNumber }},res, next) =>
{
    let data = [], userDefinedTags = [], tagsCommonToBoth = [];

    try
    {
        if(currentUser && Object.keys(currentUser).length !== 0 && currentUser.constructor === Object)
        {
            const { userId } = currentUser;
            
            // console.log(currentTagArray);

            if(userId !== undefined && userId !== null)
            {
                userDefinedTags = await UserDefined.aggregate(
                [
                    { 
                        $match: { userId: { $eq: userId } } 
                    },
                    {
                        $project: 
                        { 
                            commonToBoth: { $setIntersection: [ "$tags", currentTagArray ] }, 
                            _id: 0
                        } 
                    }
                ]);

                if(userDefinedTags && userDefinedTags.length)
                userDefinedTags = userDefinedTags[0].commonToBoth;

                // console.log("userDefined", userDefinedTags);

                tagsCommonToBoth = await Tag.find(
                {
                    tag: { $in: userDefinedTags }
                },
                {
                    _id: 0, tag: 1
                });

                tagsCommonToBoth = tagsCommonToBoth.map(value => value.tag);
                
                // console.log("tagsCommonToBoth", tagsCommonToBoth);

                let commonTag = new Map();

                for(let i=0; i<tagsCommonToBoth.length; i++)
                commonTag.set(tagsCommonToBoth[i], true);
                
                userDefinedTags = performOperationOnArray(userDefinedTags, commonTag);

                for(let i=0; i<userDefinedTags.length; i++)
                commonTag.set(userDefinedTags[i], true);

                currentTagArray = performOperationOnArray(currentTagArray, commonTag);

                let mergedArray = userDefinedTags.concat(tagsCommonToBoth);

                let problemArray = [], problemArrayTemp = [];

                // console.log("currentTagArray", currentTagArray);
                // console.log("mergedArray", mergedArray);

                if(mergedArray.length && currentTagArray.length)
                {
                    problemArray = await Problem.find(
                    {
                        $and:
                        [
                            { 
                                tags: { $all: currentTagArray } 
                            },
                            {
                                userDefined:
                                {
                                    $elemMatch:
                                    {
                                        userId: { $eq: userId },
                                        userTags: { $all: mergedArray }
                                    }
                                }
                            },
                        ]
                    },
                    {
                        _id: 0, tags: 1, accuracy: 1, successfulSubmissions: 1, problemCode: 1, problemName: 1, author: 1, body: 1,
                        userDefined:
                        {
                            $elemMatch:
                            {
                                userId: { $eq: userId },
                                userTags: { $all: mergedArray }
                            }
                        }
                    })
                    .sort({ _id: 1 })
                    .skip(LIMIT*(currentPageNumber-1))
                    .limit(LIMIT);
                }
                else if(mergedArray.length)
                {
                    problemArray = await Problem.find(
                    {
                        userDefined:
                        {
                            $elemMatch:
                            {
                                userId: { $eq: userId },
                                userTags: { $all: mergedArray }
                            }
                        }
                    },
                    {
                        _id: 0, tags: 1, accuracy: 1, successfulSubmissions: 1, problemCode: 1, problemName: 1, author: 1, body: 1,
                        userDefined:
                        {
                            $elemMatch:
                            {
                                userId: { $eq: userId },
                                userTags: { $all: mergedArray }
                            }
                        }
                    })
                    .sort({ _id: 1 })
                    .skip(LIMIT*(currentPageNumber-1))
                    .limit(LIMIT);
                }
                else if(currentTagArray.length)
                {
                    problemArray = await Problem.find(
                    { 
                        tags: { $all: currentTagArray } 
                    },
                    {
                        _id: 0, tags: 1, accuracy: 1, successfulSubmissions: 1, problemCode: 1, problemName: 1, author: 1, body: 1
                    })
                    .sort({ _id: 1 })
                    .skip(LIMIT*(currentPageNumber-1))
                    .limit(LIMIT);
                }

                // console.log("problemArray", problemArray.slice(0,4));

                mergedArray = currentTagArray.concat(tagsCommonToBoth);

                // console.log("userDefinedTags", userDefinedTags);
                // console.log("mergedArray", mergedArray);

                if(mergedArray.length && userDefinedTags.length)
                {
                    problemArrayTemp = await Problem.find(
                    {
                        $and:
                        [
                            { 
                                tags: { $all: mergedArray } 
                            },
                            { 
                                userDefined:
                                {
                                    $elemMatch:
                                    {
                                        userId: { $eq: userId },
                                        userTags: { $all: userDefinedTags }
                                    }
                                }
                            },
                        ]
                    },
                    {
                        _id: 0, tags: 1, accuracy: 1, successfulSubmissions: 1, problemCode: 1, problemName: 1, author: 1, body: 1,
                        userDefined:
                        {
                            $elemMatch:
                            {
                                userId: { $eq: userId },
                                userTags: { $all: userDefinedTags }
                            }
                        }
                    })
                    .sort({ _id: 1 })
                    .skip(LIMIT*(currentPageNumber-1))
                    .limit(LIMIT);
                }
                else if(userDefinedTags.length)
                {
                    problemArrayTemp = await Problem.find(
                    {
                        userDefined:
                        {
                            $elemMatch:
                            {
                                userId: { $eq: userId },
                                userTags: { $all: userDefinedTags }
                            }
                        }
                    },
                    {
                        _id: 0, tags: 1, accuracy: 1, successfulSubmissions: 1, problemCode: 1, problemName: 1, author: 1, body: 1,
                        userDefined:
                        {
                            $elemMatch:
                            {
                                userId: { $eq: userId },
                                userTags: { $all: userDefinedTags }
                            }
                        }
                    })
                    .sort({ _id: 1 })
                    .skip(LIMIT*(currentPageNumber-1))
                    .limit(LIMIT);
                }
                else if(mergedArray.length)
                {
                    problemArrayTemp = await Problem.find(
                    { 
                        tags: { $all: mergedArray } 
                    },
                    {
                        _id: 0, tags: 1, accuracy: 1, successfulSubmissions: 1, problemCode: 1, problemName: 1, author: 1, body: 1
                    })
                    .sort({ _id: 1 })
                    .skip(LIMIT*(currentPageNumber-1))
                    .limit(LIMIT);
                }

                // console.log("problemArrayTemp", problemArrayTemp.slice(0,4));

                problemArray = problemArray.concat(problemArrayTemp);

                // console.log("problemArray", problemArray.slice(0,4));

                let uniqueProblem = new Map();

                for(let i=0; i<problemArray.length; i++)
                {
                    if(uniqueProblem.has(problemArray[i].problemCode) === true)
                    continue;

                    data.push(problemArray[i]); 
                    uniqueProblem.set(problemArray[i].problemCode, true);
                }

                // console.log("data", data);

                data = data.map(({tags, accuracy, successfulSubmissions, problemCode, problemName, author, body, userDefined}) =>
                {
                    if(!userDefined || !userDefined.length)
                    {
                        return {
                            problemCode,
                            problemName,
                            accuracy,
                            successfulSubmissions,
                            author,
                            body,
                            tags
                        };
                    }
                    
                    // console.log(value);

                    return {
                        problemCode,
                        problemName,
                        accuracy,
                        successfulSubmissions,
                        author,
                        body,
                        tags: [...tags, ...userDefined[0].userTags],
                    };
                });

                // console.log("data1", data1);
            }
        }
        else
        {
            data = await Problem.find(
            {
                tags: { $all: currentTagArray }
            },
            {
                _id: 0, tags: 1, accuracy: 1, successfulSubmissions: 1, problemCode: 1, problemName: 1, author: 1, 
            })
            .sort({ _id: 1 })
            .skip(LIMIT*(currentPageNumber-1))
            .limit(LIMIT);
        }

        return res.status(200).json({ data });
    }
    catch(error)
    {
        // console.log(error);

        return res.status(500).json(
        {
            error : "Error creating user due to server down"
        });
    }
});