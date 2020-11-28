import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router';

const NotFound = ({ history }) => 
{
	return (
		<Segment placeholder>
			<Header icon>
				<Icon name='search' />
				Oops - We've looked everywhere but couldn't find this. Sorry :(
			</Header>
			<Segment.Inline>
				<Button onClick = { () => history.push('/home') } primary>Return to Home page</Button>
			</Segment.Inline>
		</Segment>
	);
};

export default withRouter(NotFound);