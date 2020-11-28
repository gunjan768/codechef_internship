import { Typography } from '@material-ui/core';
import React from 'react';
import DividingLine from './DividingLine';
import Button from '../../../../../../app/UI/Button/Button';
import GetIcon from './GetIcon';
import { openModal } from '../../../../../../features/modals/modalActions';
import { useDispatch, useSelector } from 'react-redux';
import classes from './Style.module.css';


const ExtraOfProblem = ({successfulSubmissions, accuracy, problemCode}) => 
{
    const dispatch = useDispatch();

    const currentUser = useSelector(state => state.auth.currentUser);
    const isUserLoggedIn = currentUser && currentUser.userId;

    const onTagAddHandler = () =>
    {
        if(!isUserLoggedIn)
        {
            dispatch(openModal('UnauthModal'))

            return;
        }

        dispatch(openModal("AddNewTag", { problemCode }));
    }

    return (
        <div   
            style = 
            {{ 
                display: "flex", flexDirection: "column"
            }}
        >

            <div 
                style = 
                {{ 
                    display: "flex", flexDirection: "row", height: "50px",
                    marginTop: "18px", marginBottom: "7px"
                }}
            >
                <Typography variant="h6" color="gray">
                    Accuracy : { parseFloat(accuracy).toFixed(2) }%
                </Typography>
                <DividingLine />
                <Typography variant="h6">
                    Submissions : { successfulSubmissions } 
                </Typography>
            </div>
            
            <div
                style =
                {{
                    display: "flex", 
                    flexDirection: "row-reverse", 
                    position: "relative",
                    top: "-120px"
                }}
            >
                <Button
                    onTagAddHandler = { onTagAddHandler }
                >
                    <div className = { classes.AddTagIcon }>
                        <GetIcon name="add circle" color="white"/>Add Tag
                    </div>
                </Button>
            </div>

        </div>
    );
}

export default ExtraOfProblem;
