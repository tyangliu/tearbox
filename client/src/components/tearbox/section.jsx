import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import {Icon, Button} from '../common';

@Radium
export default class Section extends React.Component {
  static defaultProps = {
    visible: true,
    onToggle: () => {},
  };

  render() {
    const {onToggle, title, visible} = this.props;
    return (
      <section style={styles.section}>
        <div style={styles.sectionHeadingContainer}>
          <div style={styles.sectionHeadingLeft}>
            <h3 style={styles.sectionHeading}
                onClick={onToggle}>
                <span style={styles.sectionHeadingText}>
                  {title}
                </span>
              <span style={styles.dropdownIconContainer}>
                <Icon name='arrow_drop_down'
                      style={styles.dropdownIcon[visible ? 'normal' : 'flipped']}/>
              </span>
              <div style={styles.clearfix}/>
            </h3>
          </div>
          <div style={styles.clearfix}/>
        </div>
        <div style={styles.collapsableContainer[visible ? 'show' : 'hide']}>
        {this.props.children}
        </div>
      </section>
    );
  }
}

const styles = styler`
  section
    padding: 15px 0

  sectionHeadingLeft
    float: left
    display: flex
    flex-direction: row

  sectionHeading
    cursor: pointer
    float: left
    font-size: 19px
    line-height: 1.5em
    font-weight: bold
    text-transform: uppercase
    letter-spacing: 1px
    margin-bottom: 10px
    transition: color 0.06s ease-in-out
    user-select: none
    display: flex
    flex-direction: row

    :hover
      color: rgba(217,52,35,1)

  sectionHeadingText
    display: block

  sectionHeadingInput
    width: 360px
    text-transform: inherit
    letter-spacing: inherit
    font-weight: inherit
    font-size: inherit
    line-height: 27.5px
    display: block
    color: inherit
    padding: 0
    outline: none
    border-bottom: 1px solid rgba(55,67,79,0.2)

  dropdownIcon
    font-size: 24px
    line-height: 28.5px
    margin-left: 3px
    transition: transform 0.15s ease-in-out

    &normal
      transform: rotateX(0deg)

    &flipped
      transform: rotateX(-180deg)

  collapsableContainer
    position: relative
    
    &show
      pointer-events: auto
      height: auto
      opacity: 1

    &hide
      pointer-events: none
      height: 0
      opacity: 0

  clearfix
    clear: both
`;
