import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import classes from './Spinner.module.css';

const useStyles = makeStyles(theme => (
{
    root: 
    {
        display: 'flex',
        '& > * + *': 
        {
            marginLeft: theme.spacing(2),
        },
    },
}));

const CircularIndeterminate = ({color}) => 
{
    const classStyle = useStyles();

    return (
        <div className = { classStyle.root }>
            <CircularProgress 
                color = "inherit"
                className = { classes.loader }
                variant="indeterminate"
            />
        </div>
    );
}

export default CircularIndeterminate;