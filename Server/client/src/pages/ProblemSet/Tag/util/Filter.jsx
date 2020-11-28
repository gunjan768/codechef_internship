import React from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


const AuthorSwitch = withStyles(theme => (
{
    root: 
    {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: 
    {
        padding: 1,
        '&$checked': 
        {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': 
            {
                backgroundColor: '#52d869',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': 
        {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: 
    {
        width: 24,
        height: 24,
    },
    track: 
    {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => 
{
    return (
        <Switch
            focusVisibleClassName = { classes.focusVisible }
            disableRipple
            classes =
            {{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

const ConceptSwitch = withStyles(theme => (
{
    root: 
    {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: 
    {
        padding: 1,
        '&$checked': 
        {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': 
            {
                backgroundColor: purple,
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': 
        {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: 
    {
        width: 24,
        height: 24,
    },
    track: 
    {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => 
{
    return (
        <Switch
            focusVisibleClassName = { classes.focusVisible }
            disableRipple
            classes =
            {{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

const UserDefinedSwitch = withStyles(theme => (
{
    root: 
    {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: 
    {
        padding: 1,
        '&$checked': 
        {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': 
            {
                backgroundColor: "#039be5",
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': 
        {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: 
    {
        width: 24,
        height: 24,
    },
    track: 
    {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => 
{
    return (
        <Switch
            focusVisibleClassName = { classes.focusVisible }
            disableRipple
            classes =
            {{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

const CustomizedSwitches = ({ handleSwitchState }) => 
{
    const [switchState, setSwitchState] = React.useState(
    {
        checkedAuthor: true,
        checkedConcept: true,
        checkedUserDefined: true 
    });

    const currentUser = useSelector(state => state.auth.currentUser);

    const handleSwitchChange = event => 
    {
        setSwitchState({ ...switchState, [event.target.name]: event.target.checked });

        handleSwitchState({...switchState, [event.target.name]: event.target.checked}, 1);
    }

    return (
        <FormGroup>
            <div style = {{ marginLeft: "10px" }}>
                <FormControlLabel
                    control = 
                    { 
                        <AuthorSwitch 
                            checked = { switchState.checkedAuthor } 
                            onChange = { handleSwitchChange } 
                            name="checkedAuthor" 
                        />
                    }
                    label="Authors"
                />
                <FormControlLabel
                    control = 
                    { 
                        <ConceptSwitch 
                            checked = { switchState.checkedConcept }
                            onChange = { handleSwitchChange } 
                            name="checkedConcept" 
                        /> 
                    }
                    label="Concepts"
                />
                {
                    currentUser && currentUser.userId && 
                    <FormControlLabel
                        control = 
                        { 
                            <UserDefinedSwitch 
                                checked = { switchState.checkedUserDefined }
                                onChange = { handleSwitchChange } 
                                name="checkedUserDefined" 
                            /> 
                        }
                        label="Your Tags (private)"
                    />
                }
            </div>
        </FormGroup>
    );
}

export default CustomizedSwitches;