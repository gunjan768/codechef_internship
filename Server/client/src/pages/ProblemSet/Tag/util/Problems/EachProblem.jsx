import React from 'react';
import classes from "./EachProblem.module.css";
import ContentOfProblem from './Helper/ContentOfProblem';
import ExtraOfProblem from './Helper/ExtraOfProblem';
import TagsOfProblem from './Helper/TagsOfProblem';

const EachProblem = (
{
    value : { problemCode, problemName, tags, successfulSubmissions, accuracy, author, body }, currentTagArray, handleProblem 
}) => 
{
    // console.log(currentTagArray);

    return (
        <div className = { classes.OuterBox }>
            <ContentOfProblem 
                problemCode = { problemCode } 
                problemName = { problemName } 
                author = { author }
                body = { body }
            />
            <ExtraOfProblem 
                successfulSubmissions = { successfulSubmissions } 
                accuracy = { accuracy }
                problemCode = { problemCode }
            />
            <TagsOfProblem tags = { tags } currentTagArray = { currentTagArray } handleProblem = { handleProblem }/>
        </div>
    );
}

export default EachProblem;