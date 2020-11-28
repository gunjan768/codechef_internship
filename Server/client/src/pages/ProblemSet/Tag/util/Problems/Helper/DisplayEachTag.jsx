import React from 'react';

const DisplayEachTag = ({tag, isTagPresent, handleProblem}) => 
{
    let bgColor = "#f1f1f1";

    if(isTagPresent.has(tag))
    bgColor = "#ffff4d";

    const onClickHandleProblem = ({target: { innerHTML }}) =>
    {
        let currentTagArray = [];

        currentTagArray.push(innerHTML);

        handleProblem(currentTagArray, 1);
    }

    const styles = 
    {
        height: "35px",
        background: bgColor, 
        marginRight: "10px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "gray",
        padding: "7px",
        color: "#3f3f3f",
        cursor: "pointer",
    };

    return (
        <div 
            style = {{...styles, position: "relative", bottom: "50px"}}
            onClick = { onClickHandleProblem }
        >
            { tag === "depth-first-search" ? "DFS" : tag}
        </div>
    );
}

export default DisplayEachTag;