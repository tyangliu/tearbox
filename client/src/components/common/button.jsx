import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

@Radium
export default class Button extends React.Component {
  render() {
    const {label, icon, onClick, style} = this.props;
    return (
      <button style={[styles.actionButton, style]} onClick={onClick}>
        <i style={styles.icon} className='material-icons'>
          {icon}
        </i>
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
    line-height: 24px
    border-radius: 9999px
    padding: 5px 8px
    margin-bottom: 8px
    text-align: left
    display: block
    background: rgba(255,255,255,1)
    transition: background 0.06s ease-in-out color 0.06s ease-in-out
    user-select: none

    :hover
      color: rgba(217,52,35,1)
      background: rgba(180,40,36,0.05)
      border: 1px solid rgba(180,40,36,0.12)

  actionButtonText
    margin-left: 10px

  icon
    width: 20px
    font-size: 17px
    line-height: 24px
    display: block
    float: left
`;
