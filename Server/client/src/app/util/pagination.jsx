import React from 'react'
import { Pagination } from 'semantic-ui-react'
import { Icon } from 'semantic-ui-react'

const PaginationExamplePagination = ({ pageChange, activePaginationIndex, totalPage }) => 
{  
    return (
        <Pagination 
            // defaultActivePage = { 1 } 
            activePage = { activePaginationIndex }
            totalPages = { totalPage } 
            floated='right'
            onPageChange = { pageChange }
            firstItem = 
            {{
                'aria-label': 'First item',
                content: <Icon name='angle double left' disabled = { activePaginationIndex === 1 ? true : false }/> 
                
            }}
            lastItem = 
            {{
                'aria-label': 'Last item',
                content: <Icon name='angle double right' disabled = { activePaginationIndex === totalPage ? true : false }/> 
            }}
            prevItem =
            {{
                'aria-label': 'Previous item',
                content: <Icon name='angle left' disabled = { activePaginationIndex === 1 ? true : false }/>,
            }}
            nextItem = 
            {{
                'aria-label': 'Next item',
                content: <Icon name='angle right' disabled = { activePaginationIndex === totalPage ? true : false }/>,
            }}
        />
    );
}

export default PaginationExamplePagination