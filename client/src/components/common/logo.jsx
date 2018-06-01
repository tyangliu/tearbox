import React from 'react';
import {Link} from 'react-router-dom';
import Radium from 'radium';
import styler from 'react-styling';

@Radium
export default class Logo extends React.Component {
  render() {
    return (
      <Link to='/'>
        <div style={[styles.logo, this.props.style || {}]}/>
      </Link>
    );
  }
}

const styles = styler`
  logo
    background-image: url("${require('../../images/tearbox_logo.svg')}")
    background-repeat: no-repeat
    background-size: contain
`;
