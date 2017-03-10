import React, {PropTypes, Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SiteContainer from './SiteContainer.jsx';


injectTapEventPlugin();


export default class App extends Component {
	render() {
		return (
      <div className="landing-page">
        <SiteContainer/>
      </div>
		);
	}
}
