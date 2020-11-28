import { Typography } from '@material-ui/core'
import React from 'react';
import GetIcon from './GetIcon';
import { Link } from 'react-router-dom';

const ContentOfProblem = ({problemCode, problemName, author, body}) => 
{
    return (
        <div>
            <Typography variant="h5" component="h2" color="primary">
                <Link 
                    to = 
                    {{
                        pathname: `/problem/${problemCode}`,
                        state: { body },
                        // query: { body },
                        // hash: body
                    }}
                >
                    { problemName }
                </Link> - { problemCode } &nbsp; {' '}
                <GetIcon name="edit" color="pink"/>{ author }
                
            </Typography>
        </div>
    );
}

export default ContentOfProblem;
