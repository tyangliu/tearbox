import React from 'react';
import Radium from 'radium';
import styler from 'react-styling';

@Radium
export default class Logo extends React.Component {
  render() {
    return (
      <div style={[styles.logo, this.props.style || {}]}/>
    );
  }
}

const styles = styler`
  logo
    background-image: url("${require('../../images/tearbox_logo.svg')}")
    background-repeat: no-repeat
    background-size: contain
`;
