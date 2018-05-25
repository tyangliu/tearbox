import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

@Radium
export default class ClipboardBox extends React.Component {
  render() {
    const {value, style} = this.props;
    return (
      <div style={[styles.clipboardBox, style]}>
        <i style={[styles.icon, styles.linkIcon]} className='material-icons'>
          link
        </i>
        <span style={styles.clipboardText}>
          {value}
        </span>
      </div>
    );
  }
}

const styles = styler`
  clipboardBox
    background: rgba(0,0,0,0.07)
    padding: 5px 8px
    border-radius: 3px

  clipboardText
    line-height: 24px
    display: inline-block
    margin-left: 10px

  icon
    width: 20px
    font-size: 17px
    line-height: 24px
    display: block
    float: left
    user-select: none

  linkIcon
    margin-top: 2px
    line-height: 22px
`;
