import React from 'react';
import './start.css';
import AppName from '../../app/layout/AppName';

const StartPage = ({history}) => 
{
	return (
		<div>
			
			<div className="ui inverted vertical masthead center aligned segment">
				<div className="ui text container">

					<h1 className="ui inverted stackable header">
						<img className="ui image massive" src="/assets/logo.png" alt="logo"/>
						<div className="content"><AppName /></div>
					</h1>

					<h2  style = {{ wordSpacing: "2px" }}>We stand together, we code together, we live together</h2>

					<div onClick = { () => history.push('/home')} className="ui huge white inverted button">
						Get Started
						<i className="right arrow icon" />
					</div>
				</div>
			</div>

			<div style = {{ textAlign: 'center', wordSpacing: "3px" }}>
				<strong><AppName /> 2020. All rights reserved. Copyright @Gunjan.</strong>
				<strong>&nbsp;For more details you can visit</strong>{' '}
				<a href="https://www.codechef.com/" title="Freepik" target="blank">CodeChef</a>
			</div>
		</div>
	);
}

export default StartPage;