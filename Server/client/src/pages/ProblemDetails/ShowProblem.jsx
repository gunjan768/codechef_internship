import React from 'react'
// import { Button, Icon, Image, Modal } from 'semantic-ui-react'
import {useLocation} from 'react-router-dom'
import withErrorHandler from '../../features/hoc/withErrorHandler/withErrorHandler';
import axios from '../../features/api/axios';

const ModalExampleScrollingContent = () => 
{
    const location = useLocation();

    return (
        <React.Fragment>
            {
                location.state && location.state.body && 
                <div 
                    dangerouslySetInnerHTML =
                    {{
                        __html: location.state.body
                    }}
                />
            }
            {
                !location.state && <div>Please open in the same page</div>
            }
        </React.Fragment>
    );
}

export default  withErrorHandler(ModalExampleScrollingContent, axios);