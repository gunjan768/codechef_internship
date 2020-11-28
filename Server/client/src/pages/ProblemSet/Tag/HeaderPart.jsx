import React from 'react'
import { Divider, Header, Segment } from 'semantic-ui-react';
import Typography from '@material-ui/core/Typography';
import SearchBar from './util/SearchBar';
import classes from './ProblemTag.module.css';

const HeaderPart = ({handleProblem}) =>
{
    return (
        <Segment className = { classes.HeaderPart }>
            <Typography variant="h4" floated="left"> Problem Tags</Typography>
            <Header as='h2' floated='right'>
                <div>
                    <SearchBar handleProblem = { handleProblem }/>
                </div>
            </Header>
            <Divider clearing />
            <Typography >
                This page will help you search for problems on <strong>CodeFriends</strong> based on their tags. You can also 
                find problem set by your favorite authors, of varying difficulty levels, of a particular topic and a lot more. 
            </Typography>
        </Segment>
    );
}

export default HeaderPart;