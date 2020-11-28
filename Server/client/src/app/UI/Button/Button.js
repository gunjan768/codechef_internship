import React from 'react';
import classes from './Button.module.css';

const button = ({children, onTagAddHandler}) => 
{
    return (
        <button
            className = { classes.Button }
            onClick = { onTagAddHandler }
        > 
            { children }
        </button>
    )
}

export default button;