import React, { useCallback, useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { CircularProgress } from '@material-ui/core';
import { searchTag } from '../Store/TagActions';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import classes from '../ProblemTag.module.css';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;     // When check box is not selected
const checkedIcon = <CheckBoxIcon fontSize="small" />;          // When check box is selected
const FIRST_N_ELEMENTS = 20;

let currentSearchTagArray = [];

const CheckboxesTags = ({handleProblem}) =>
{
    const [autoSearchTagArray, setAutoSearchTagArray] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // you can also use createRef() but it's a class based component. 
    const ref = React.useRef();

    // const loader = open && autoSearchTagArray.length;

    const currentUser = useSelector(state => state.auth.currentUser);
    const dispatch = useDispatch();
  
    const onChangeTagHandler = React.useCallback(async value =>
    {
        let data = [];
    
        setLoading(true);
        
        try
        {
            data = await dispatch(searchTag(value, currentUser));
        }
        catch(error)
        {
            console.log({error});
        }

        setTimeout(() =>
        {
            setLoading(false);
            setAutoSearchTagArray(data);

        },200);

    },[dispatch, setLoading, setAutoSearchTagArray, currentUser]);

    React.useEffect(() => 
    {
        (async () => 
        {
            try
            {
                await onChangeTagHandler();
            }
            catch(error)
            {
                throw new Error("Eror while fetching data from the database");
            }
        })();
    
        return () => 
        {
        };

    }, [onChangeTagHandler]);
    
    const onHandleSpecificTagArray = ({inputProps: { value }}) =>
    { 
        onChangeTagHandler(ref.current.value);

        // Dont use this value as it will contain one letter less ( oncahnge is called before params update in renderInput props 
        // of Autocomplete ). So we have used ref to get the value associated with TextField.
        // console.log(value);   
           
        // console.log(ref.current.value);
    }

    const copyIntoArray = useCallback(({InputProps: { startAdornment }}) =>
    {
        if(!startAdornment)
        {
            currentSearchTagArray = [];

            return;
        }

        let currentTagArray = [];
  
        if(startAdornment.length > 2 && startAdornment[2].props.label === undefined)
        {
            if(currentSearchTagArray.length > 2)
            {
                if(startAdornment[0].props.label === currentSearchTagArray[0] && 
                    startAdornment[1].props.label === currentSearchTagArray[1]
                )
                return;

                currentTagArray = currentSearchTagArray;
                currentSearchTagArray = [];
                
                if(startAdornment[0].props.label === currentTagArray[1])
                currentSearchTagArray.push(currentTagArray[1]);
                
                if(startAdornment[0].props.label === currentTagArray[0])
                currentSearchTagArray.push(currentTagArray[0]);
                
                for(let i=2; i<currentTagArray.length; i++)
                {
                    currentSearchTagArray.push(currentTagArray[i]);
                }
            }

            return;
        }

        for(let i=0; i<startAdornment.length; i++)
        {
            currentTagArray.push(startAdornment[i].props.label);
        }

        currentSearchTagArray = currentTagArray;

    },[]);

    return (
        <div style = {{ display: "flex", flexDirection: "row" }}>
            <Button 
                size="mini" 
                content="Apply Tags" 
                primary 
                className = { classes.applyTagsButton }
                onClick = 
                { 
                    event => handleProblem(currentSearchTagArray || [], 1) 
                }
            />
            <Autocomplete
                multiple
                id="tag-search-box"
                options = { (autoSearchTagArray.length && autoSearchTagArray.slice(0, FIRST_N_ELEMENTS)) || [] }
                disableCloseOnSelect
                limitTags = { 2 }
                getOptionLabel = { autoSearchTag => autoSearchTag.tag }
                style = {{ width: 350 }}
                // onOpen = { () => { setOpen(true) }}
                // onClose = { () => { setOpen(false) }}
                renderOption = { (autoSearchTag, {selected}) => 
                {
                    return (
                        <React.Fragment>
                            <Checkbox
                                icon = { icon }
                                checkedIcon = { checkedIcon }
                                style = {{ marginRight: 8 }}
                                checked = { selected }
                                name="checkBox"
                            />
                            { autoSearchTag.tag }
                        </React.Fragment>
                    );
                }}
                renderInput = { params => 
                {
                    copyIntoArray(params);

                    return (
                        <TextField 
                            { ...params } 
                            variant="outlined"
                            label="Search Tags"
                            placeholder="Tags"
                            value = { params.inputProps.value }
                            InputProps = 
                            {{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        { loading ? <CircularProgress color="inherit" size = { 20 } /> : null }
                                        { params.InputProps.endAdornment }
                                    </React.Fragment>
                                ),
                            }}
                            inputRef = { ref }
                            onChange = { () => onHandleSpecificTagArray(params) }
                        />
                    );
                }}
                // onChange = { (event) => onHandleSpecificTagArray(event) }
            />
        </div>
    );
}

export default CheckboxesTags;