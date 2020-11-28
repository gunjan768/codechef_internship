import React from 'react';
import DisplayEachTag from './DisplayEachTag';

const SLICE_FIRST_N_ELEMENTS = 9;

const TagsOfProblem = ({tags, currentTagArray, handleProblem}) => 
{
    let isTagPresent = new Map();

    for(let i=0; i<currentTagArray.length; i++)
    isTagPresent.set(currentTagArray[i], true);

    return (
        <div style = {{ display: "flex", flexDirection: "row", }}>
        {
            tags.length && 
            tags.slice(0,SLICE_FIRST_N_ELEMENTS).map((tag, ind) =>
            {
                return (
                    <DisplayEachTag 
                        key = { ind }
                        tag = { tag } 
                        isTagPresent = { isTagPresent }
                        handleProblem = { handleProblem }
                    />
                );
            })
        }
        </div>
    );
}

export default TagsOfProblem;
