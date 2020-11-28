import { Typography } from '@material-ui/core';
import React from 'react'
import { Grid, Loader } from 'semantic-ui-react';
import EachTag from './EachTag';
import InfiniteScroll from 'react-infinite-scroller';

const Tags = 
({ 
    tagArray, 
    handleProblem, 
    userTagArray, 
    switchState: { checkedAuthor, checkedConcept, checkedUserDefined },
    hasMoreTag,
    loadMoreTag,
    getNextTags
}) => 
{
    if(!checkedUserDefined && !checkedAuthor && !checkedConcept)
    {
        return (
            <Typography>Please switch on atleast one tag option</Typography>
        );
    }

    if(checkedUserDefined && !checkedAuthor && !checkedConcept && !userTagArray.length)
    {
        return (
            <Typography>No tag related to your search has been found...!!</Typography>
        );
    }

    const doOperationOnArray = userTagArray =>
    {
        return userTagArray.map(value =>
        {
            return {
                tag: value,
                count: 0,
                type: "user"
            };
        })
    }

    let currentTags;

    if((checkedAuthor || checkedConcept) && checkedUserDefined)
    {
        userTagArray = doOperationOnArray(userTagArray); 
        currentTags = userTagArray.concat(tagArray);
    }
    else if(checkedUserDefined)
    {
        userTagArray = doOperationOnArray(userTagArray);
        currentTags = userTagArray;
    }
    else
    {
        currentTags = tagArray;
    }

    return (
        <InfiniteScroll
            pageStart = { 0 }
            loadMore = { getNextTags }
            hasMore = { !loadMoreTag && hasMoreTag }
            initialLoad = { false }
        >
            <Grid columns='4' doubling stackable>
                <Grid.Row>
                {
                    currentTags.map((value, ind) =>
                    {
                        return (
                            <Grid.Column key = { ind }>
                                <EachTag value = { value } handleProblem = { handleProblem }/>
                            </Grid.Column>
                        );
                    })
                }
                </Grid.Row>
                <Grid.Row>
                    <div>
                        <Grid.Column>
                            <Loader active = { loadMoreTag }/>
                        </Grid.Column>
                    </div>
                </Grid.Row>
            </Grid>
        </InfiniteScroll>
    );
}

export default Tags;