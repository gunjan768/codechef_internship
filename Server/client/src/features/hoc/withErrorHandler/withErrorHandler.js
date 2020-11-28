import React from 'react';
import Modal from '../../modals/ModalNext/Modal';
import Aux from '../Auxs/Auxs';

const withErrorHandler = (WrappedComponent, axios) =>
{
    // Here we have used a class without name and it is called class factory. Here we are returning
    // the whole class.
    return class extends React.Component
    {
        constructor(props)
        {
            super(props);

            this.reqInterceptor =  axios.interceptors.request.use(req =>
            {
                // console.log(req);

                this.setState(
                {
                    error: null
                })

                return req;
            })

            this.resInterceptor = axios.interceptors.response.use(res => res, error =>
            {
                // console.log("Error in withErrorHandler\n",error);

                this.setState({ error });
            })
        }
        
        state = 
        {
            error: null
        }

        // Will be called when the rendering of all the children completed and rendering of this component
        // also completed
        // componentDidMount()
        // {}
        
        // componentWillUnmount() method is called when a component is being removed from the DOM
        componentWillUnmount()
        {
            // You will output as 0,0 as these are indexes of reqInterceptor and resInterceptor respectively as
            // they both are two different list of interceptors
            // console.log(this.reqInterceptor,this.resInterceptor);

            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfimedHandler = () =>
        {
            this.setState({ error: null });
        }

        render()
        {
            return (
                <Aux>
                    <Modal show = { this.state.error } modalClosed = { this.errorConfimedHandler }>
                    { 
                        this.state.error ? this.state.error.message : null 
                    }
                    </Modal>

                    <WrappedComponent { ...this.props } />
                </Aux>
            )
        }
    }
}

export default withErrorHandler;