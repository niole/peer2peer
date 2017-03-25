import React, {PropTypes, Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SiteContainer from './SiteContainer.jsx';


injectTapEventPlugin();

const { string } = PropTypes;
const propTypes = {
  userEmail: string.isRequired,
};

class App extends Component {
	render() {
    const {
      userEmail,
    } = this.props;

		return (
      <div className="landing-page">
        <SiteContainer
          userEmail={ userEmail }
         />
      </div>
		);
	}
}
App.propTypes = propTypes;
export default App;
