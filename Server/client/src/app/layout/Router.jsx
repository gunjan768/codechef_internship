import React, { PureComponent } from 'react';
import { Container } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import StartPage from '../../pages/Start/start';
// import NotFound from './NotFound';
import Home from '../../pages/Home/Home';
import NavBar from '../../features/nav/NavBar/NavBar';
// import ProblemDifficulty from '../../pages/ProblemSet/Difficulty/ProblemDifficulty';
// import ProblemTag from '../../pages/ProblemSet/Tag/ProblemTag';
import { connect } from 'react-redux';
import { authCheckState } from '../../features/auth/authActions';
import ModalManager from '../../features/modals/ModalManager';
import ShowProblem from '../../pages/ProblemDetails/ShowProblem'; 
import '../../App.css';
import asyncComponent from '../../features/hoc/asyncComponent/asyncComponent';
// import Footer from '../../features/nav/Footer/Footer';

const asyncProblemDifficulty = asyncComponent(() => 
{
    return import('../../pages/ProblemSet/Difficulty/ProblemDifficulty');
})

const asyncProblemTag = asyncComponent(() => 
{
    return import('../../pages/ProblemSet/Tag/ProblemTag');
})

const asyncNotFound = asyncComponent(() => 
{
    return import('./NotFound');
})

class RouterPage extends PureComponent 
{
	componentDidMount()
    {
        this.props.onTryAutoSignup();
	}
	
	render() 
	{
		return (
			<div>
				<ModalManager/>
				<Switch>
					<Route exact path="/" component = { StartPage } />
				</Switch>

				<Route
					path="/(.+)"
					render = 
					{ 
						() => (
							<div>
								<NavBar />
								<Container className="main">
									<Switch>
										<Route exact path="/home" component = { Home } />
										<Route exact path="/problems/difficulty" component = { asyncProblemDifficulty } />
										<Route exact path="/problems/tag" component = { asyncProblemTag } />
										<Route 
											exact
											path="/problem/:id"
											component = 
											{
												prop => 
												{
													// console.log(prop); 
													// console.log(pp);
													
													return <ShowProblem { ...this.props }/>
												}
											}
										/>
										<Route component = { asyncNotFound } />
									</Switch>
								</Container>
								{/* <Footer /> */}
							</div>
						)
					}
				/>
			</div>
		);
	}
}

// mapStateToProps actually stores a function which expects the state stored in redux as the input and returns a JS object which is a 
// map of props names and slices of the state stored in redux. Here only which part of state stored in redux we want to send or inject
// in the container (means in class) as a props. It will be called each time automatically whenever there is a change in the redux state
// and will update the state.
const mapStateToProps = state => 
{
    return (
    {
        authenticated: state.auth.authenticated
    });
}
  
// mapDispatchToProps stores a function which excepts a function as an argument. This function is a dispatch function. When you call
// any one of the functions defined inside mapDispatchToProps , dispatch() will be executed and then it will search each and every
// reducers for the 'type' so every reducers defined will run.
const mapDispatchToProps = dispatch => 
{
    return (
    {
        onTryAutoSignup: () => dispatch(authCheckState())
    })
}

// withRouter is a HOC which is used to wrap the component so that Router will still work as we have used another HOC which is connect
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouterPage));