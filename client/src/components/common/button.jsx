import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import Icon from './icon';

@Radium
export default class Button extends React.Component {
  render() {
    const {label, icon, onClick, style} = this.props;
    return (
      <button style={[styles.actionButton, style]} onClick={onClick}>
        <Icon name={icon} style={styles.icon}/>
        <span style={styles.actionButtonText}>
          {label}
        </span>
      </button>
    );
  }
}

const styles = styler`
  actionButton
    cursor: pointer
    line-height: 22px
    border-radius: 9999px
    padding: 3px 8px 4.5px
    margin-bottom: 6px
    text-align: left
    display: block
    background: rgba(255,255,255,1)
    transition: background 0.06s ease-in-out color 0.06s ease-in-out
    user-select: none

    :hover
      color: rgba(217,52,35,1)
      background: rgba(180,40,36,0.05)
      border: 1px solid rgba(180,40,36,0.2)

  actionButtonText
    margin-left: 6px

  icon
    margin-top: 1px
    line-height: 21px
    font-size: 14px
    float: left
`;
