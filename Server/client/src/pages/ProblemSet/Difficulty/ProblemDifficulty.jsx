import React, { useEffect, useState, useCallback } from 'react';
import { Container, Tab, Table } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import Pagination from '../../../app/util/pagination';
import { fetchQuestion } from './DifficultyActions';
import classes from './ProblemDifficulty.module.css';

const panes = 
[
    { menuItem: 'School' },
    { menuItem: 'Easy' },
    { menuItem: 'Medium' },
    { menuItem: 'Hard' }, 
    { menuItem: 'Challenge' }, 
    { menuItem: 'Peer'}
];

const ProblemDifficulty = () =>
{
    const [loading, setLoading] = useState(true);
    const [difficultyLevel, setdifficultyLevel] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activePaginationIndex, setactivePaginationIndex] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    
    const questionArray = useSelector(state => state.difficulty.currentQuestionArray);

    const dispatch = useDispatch();

    const alterQuestion = useCallback(async(page_number, difficulty_level) =>
    {
        let totalDocuments;

        try
        {
            totalDocuments = await dispatch(fetchQuestion(difficulty_level, page_number));
        }
        catch(error)
        {          
            console.log({error});
        }
        
        setPageNumber(page_number);
        setdifficultyLevel(difficulty_level);
        setTotalPage(Math.floor(totalDocuments/20));

    },[dispatch]);

    useEffect(() =>
    {
        setLoading(true);

        (async () =>
        {
            try
            {
                await alterQuestion(1, "School");

                setLoading(false);
            }
            catch(error)
            {
                console.log({error});
            }

        })();

    },[alterQuestion]);

    const handleTabChange = async (event, {activeIndex}) =>
    {
        event.defaultPrevented = true;

        setActiveIndex(activeIndex);
        setactivePaginationIndex(1);

        await alterQuestion(1, panes[activeIndex].menuItem);
    }
    
    const handlePageChange = async (event, { activePage }) =>
    {
        setactivePaginationIndex(activePage);

        await alterQuestion(activePage, difficultyLevel);
    }

    if(loading)
    {
        return <LoadingComponent/>
    }

    return (
        <Container className = { classes.Container }>
            <Tab 
                panes = { panes } 
                onTabChange = { handleTabChange }
                activeIndex = { activeIndex }
                renderActiveOnly = { true }
                // menu = {{ secondary: true, pointing: true }}
            />

            <Tab.Pane className = { classes.TabPane }>
                <Table celled inverted fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Code</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Successful Submission</Table.HeaderCell>
                            <Table.HeaderCell>Accuracy</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {
                        questionArray.length && questionArray.map(({problemCode, problemName, successfulSubmissions, accuracy}, ind) => 
                        {   
                            return (
                                <Table.Row key = { ind } positive textAlign="left">
                                    <Table.Cell>{ problemCode }</Table.Cell>
                                    <Table.Cell>{ problemName }</Table.Cell>
                                    <Table.Cell>{ successfulSubmissions }</Table.Cell>
                                    <Table.Cell>{ parseFloat(accuracy).toFixed(2) }</Table.Cell>
                                </Table.Row>
                            );
                        })
                    }
                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='4'>
                                <Pagination 
                                    pageChange = { handlePageChange }
                                    activePaginationIndex = { activePaginationIndex }
                                    totalPage = { totalPage }
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </Tab.Pane>
        </Container>
    );
}

export default ProblemDifficulty;