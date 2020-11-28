import React from 'react';
import classes from "./Problems.module.css";
import EachProblem from './EachProblem';
import { Button, Grid, Icon, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { Typography } from '@material-ui/core';


const Problems = 
({
    problemArray, 
    handleSwitchState, 
    loading, 
    currentTagArray,
    handleProblem,
    getNextProblems,
    loadMoreProblem,
    hasMoreProblem
}) => 
{
    if(!loading && problemArray && !problemArray.length)
    {
        return (
            <div className = { classes.Container }>
                <div style = {{ marginBottom: "50px" }}>
                    <Button 
                        animated 
                        secondary 
                        onClick = 
                        { 
                            () => 
                            {
                                const switch_state = {checkedAuthor: true, checkedConcept: true, checkedUserDefined: true};
                                
                                handleSwitchState(switch_state, 1); 
                            }
                        }
                    >
                        <Button.Content visible>Tags Page</Button.Content>
                        <Button.Content hidden>
                            <Icon name='arrow left' />
                        </Button.Content>
                    </Button>
                </div>

                <Typography>No question is found, narrow down your search</Typography>
            </div>
        );
    }

    return (
        <InfiniteScroll
            pageStart = { 0 }
            loadMore = { getNextProblems }
            hasMore = { !loadMoreProblem && hasMoreProblem }
            initialLoad = { false }
        >
            <div className = { classes.Container }>
                <div style = {{ marginBottom: "50px" }}>
                    <Button 
                        animated 
                        secondary 
                        onClick = 
                        { 
                            () => 
                            {
                                const switch_state = {checkedAuthor: true, checkedConcept: true, checkedUserDefined: true};
                                
                                handleSwitchState(switch_state, 1); 
                            }
                        }
                    >
                        <Button.Content visible>Tags Page</Button.Content>
                        <Button.Content hidden>
                            <Icon name='arrow left' />
                        </Button.Content>
                    </Button>
                </div>
                {
                    !loading && problemArray && !problemArray.length &&
                    <Typography>No question is found, narrow down your search</Typography>
                }
                { 
                    !loading && problemArray && problemArray.length && problemArray.map((value, ind) =>
                    {
                        return (
                            <EachProblem 
                                key = { ind } 
                                value = { value } 
                                currentTagArray = { currentTagArray }
                                handleProblem = { handleProblem }
                            />
                        );
                    })
                }
            </div>
            <Grid>
                <Grid.Row>
                    <div>
                        <Grid.Column>
                            <Loader active = { loadMoreProblem }/>
                        </Grid.Column>
                    </div>
                </Grid.Row>
            </Grid>
        </InfiniteScroll>
    );
}

export default Problems;