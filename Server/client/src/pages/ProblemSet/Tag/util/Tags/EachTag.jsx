import React from 'react'
import { Button, Label } from 'semantic-ui-react'
import classes from './EachTag.module.css';

const EachTag = ({value: { tag, count, type }, handleProblem}) => 
{
    let color;

    if(type === "user")
    color = "blue";
    else if(type === "author")
    color = "green";
    else
    color = "red";

    const displayTagRealtedProblemHandler = (_,{content}) =>
    {
        let currentTag = [];

        currentTag.push(content);

        handleProblem(currentTag, 1);
    }

    return (
        <div className = { classes.OuterContainer }>
            <Button as='div' labelPosition='right' className = { classes.ButtonHead } inverted fluid >
                <Button 
                    basic
                    className = { classes.ButtonItem } 
                    content = { tag }
                    onClick = { displayTagRealtedProblemHandler }
                />
                <Label as='a' basic color = { color } pointing='left' className = { classes.LabelItem }>
                    x{count}
                </Label>
            </Button>
        </div>
    );
}

export default EachTag;