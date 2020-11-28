import React, { useState, useEffect, useCallback } from 'react'
import classes from './ProblemTag.module.css';
import { Card, Container } from 'semantic-ui-react';
import HeaderPart from './HeaderPart';
import CustomizedSwitches from './util/Filter';
import Tags from './util/Tags/Tags';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTag } from './Store/TagActions';
import Problems from './util/Problems/Problems';
import { fetchProblem } from './Store/ProblemActions';
import Spinner from '../../../app/Spinner/Spinner';
import withErrorHandler from '../../../features/hoc/withErrorHandler/withErrorHandler';
import axios from '../../../features/api/axios';
// import _ from 'lodash';


const ProblemTag = () => 
{
    const [loading, setLoading] = useState(false);
    const [activateProblem, setAactivateProblem] = useState(false);
    const [currentTagArray, setCurrentTagArray] = useState([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [hasMoreTag, setHasMoreTag] = useState(false);
    const [loadMoreTag, setLoadMoreTag] = useState(false);
    const [hasMoreProblem, setHasMoreProblem] = useState(false);
    const [loadMoreProblem, setLoadMoreProblem] = useState(false);
    
    const [switchState, setSwitchState] = React.useState(
    {
        checkedAuthor: true,
        checkedConcept: true,
        checkedUserDefined: true
    });

    const currentUser = useSelector(state => state.auth.currentUser);
    const tagArray = useSelector(state => state.tag.currentTagArray);
    const userTagArray = useSelector(state => state.tag.currentUserDefinedTagArray);
    const problemArray = useSelector(state => state.problem.currentProblemArray);
    
    const dispatch = useDispatch();

    const alterTag = useCallback(async (currentSwitchState, current_page_number) => 
    {
        if(current_page_number === 1)
        {
            setLoading(true);
        }
        else
        {
            setLoadMoreTag(true);
        }

        setAactivateProblem(false);
        
        let hasMoreToLoad;

        try
        { 
            hasMoreToLoad = await dispatch(fetchTag(currentSwitchState, current_page_number, currentUser));
        }
        catch(error)
        {          
            console.log({error});
        }
        
        setLoadMoreTag(false);
        setSwitchState({...currentSwitchState});
        setCurrentPageNumber(current_page_number);
        setHasMoreTag(hasMoreToLoad);
        setCurrentTagArray([]);

        setTimeout(() =>
        {
            setLoading(false);
            
        }, 100);

    },[dispatch, currentUser])
    
    useEffect(() => 
    {
        (async () => 
        {
            try 
            {
                const stateOfSwitch = 
                {
                    checkedAuthor: true, checkedConcept: true, checkedUserDefined: true
                };

                await alterTag(stateOfSwitch, 1);
            }
            catch(error) 
            {
                throw new Error(error);
            }

        })();
        
        return () => {}

    }, [alterTag]);

    useEffect(() => 
    {
        window.scrollTo(0, 0);
        
    }, [])

    const handleSwitchState = async (currentSwitchState, current_page_number) =>
    {
        try
        {
            window.scrollTo(0, 0);

            await alterTag(currentSwitchState, current_page_number);
        }
        catch(error)
        {
            throw error;
        }
    }

    const getNextTags = async () =>
    {
        try
        {
            await alterTag(switchState, currentPageNumber+1);
        }
        catch(error)
        {
            throw error;
        }
    }

    const alterProblem = useCallback(async (current_tag_array, page_number) =>
    {
        if(!current_tag_array || !current_tag_array.length)
        return;

        // console.log(current_tag_array, page_number);

        if(page_number === 1)
        {
            setLoading(true);
        }
        else
        {
            setLoadMoreProblem(true);
        }
        
        setCurrentPageNumber(page_number);
        setAactivateProblem(true);
        setCurrentTagArray(current_tag_array);

        let hasMoreToLoad;
        
        try
        {
            hasMoreToLoad = await dispatch(fetchProblem(current_tag_array, currentUser, page_number));
        }
        catch(error)
        {
            throw error;
        }

        setLoadMoreProblem(false);
        setHasMoreProblem(hasMoreToLoad);

        setTimeout(() =>
        {
            setLoading(false);

        },100);

    },[dispatch, currentUser]);

    const handleProblem = async (current_tag_array, current_page_number) =>
    {
        try
        {
            window.scrollTo(0, 0);

            await alterProblem(current_tag_array, current_page_number);
        }
        catch(error)
        {
            throw error;
        }
    }

    const getNextProblems = async () =>
    {
        try
        {
            // console.log(currentPageNumber, currentTagArray);

            const scrollPostionTop = document.documentElement.scrollTop || document.body.scrollTop;

            if(scrollPostionTop === 0)
            return;
            
            await alterProblem(currentTagArray, currentPageNumber+1);
        }
        catch(error)
        {
            throw error;
        }
    }

    // console.log(loadMoreProblem, hasMoreProblem);

    return (
        <Container className = { classes.Container }>
            <Card.Group>
                <Card fluid color='red'>
                    <div className = { classes.OuterBox }> 
                        <div>
                            <HeaderPart 
                                handleProblem = { handleProblem }
                            />
                            {
                                !activateProblem &&
                                <CustomizedSwitches 
                                    handleSwitchState = { handleSwitchState }
                                />
                            }
                        </div>
                        <div className = { classes.Tag }>
                            { 
                                !activateProblem && !loading && 
                                <Tags 
                                    tagArray = { tagArray }
                                    userTagArray = { userTagArray }
                                    handleProblem = { handleProblem }
                                    switchState = { switchState }
                                    hasMoreTag = { hasMoreTag }
                                    loadMoreTag = { loadMoreTag }
                                    getNextTags = { getNextTags }
                                /> 
                            }
                            { !activateProblem && loading && <Spinner color = { "black" }/> }
                            { 
                                activateProblem &&
                                <Problems 
                                    problemArray = { problemArray }
                                    handleSwitchState = { handleSwitchState }
                                    loading = { loading }
                                    currentTagArray = { currentTagArray }
                                    handleProblem = { handleProblem }
                                    loadMoreProblem = { loadMoreProblem }
                                    hasMoreProblem = { hasMoreProblem }
                                    getNextProblems = { getNextProblems }
                                /> 
                            }
                            { activateProblem && loading && <Spinner color = { "black" }/> }
                        </div>
                    </div>
                </Card>
            </Card.Group>
        </Container>
    );
}


export default withErrorHandler(ProblemTag, axios);