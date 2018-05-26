import React from 'react';
import Radium from 'radium';
import styler from 'react-styling';

@Radium
export default class Icon extends React.Component {
  render() {
    const {name, style} = this.props;
    return (
      <i style={[styles.icon, style]} className='material-icons'>
        {name}
      </i>
    );
  }
}

const styles = styler`
  icon
    font-size: 17px
    line-height: 22px
    display: block
    user-select: none
`;
