import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import Icon from './icon';

@Radium
export default class Button extends React.Component {
  static defaultProps = {
    isSubmit: false,
  };

  render() {
    const {icon, onClick, style, isSubmit} = this.props;
    return (
      <button style={[styles.button[isSubmit ? 'submit' : 'normal'], style]}
              onClick={onClick}>
        {icon ? <Icon name={icon} style={styles.icon}/> : null}
        <span style={styles.buttonText}>
          {this.props.children}
        </span>
      </button>
    );
  }
}

const styles = styler`
  button
    font-weight: bold
    cursor: pointer
    line-height: 22px
    border-radius: 9999px
    padding: 6px 11px
    text-align: left
    display: block
    background: rgba(255,255,255,1)
    transition: background 0.06s ease-in-out color 0.06s ease-in-out
    user-select: none

    &normal
      :hover
        color: rgba(217,52,35,1)
        background: rgba(180,40,36,0.05)
        border: 1px solid rgba(180,40,36,0.2)

      :active
        background: rgba(180,40,36,0.2)

    &submit
      border: 1px solid rgba(37,174,215,1)
      color: rgba(255,255,255,1)
      background: rgba(37,174,215,1)


      :hover
        color: rgba(255,255,255,1)
        border: 1px solid rgba(67,204,245,1)
        background: rgba(67,204,245,1)

      :active
        color: rgba(255,255,255,1)
        border: 1px solid rgba(7,144,185,1)
        background: rgba(7,144,185,1)

  icon
    line-height: 22px
    font-size: 14px
    margin-right: 6px
    float: left
`;
