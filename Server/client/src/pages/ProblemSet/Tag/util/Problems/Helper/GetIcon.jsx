import React from 'react';
import { Icon } from 'semantic-ui-react';
import classes from './Style.module.css';

const IconExampleDisabled = ({name, color}) => 
{
    return (
        <Icon name = { name } color = { color || "blue" } className = { classes.AddTagIcon }/>
    );
}

export default IconExampleDisabled;