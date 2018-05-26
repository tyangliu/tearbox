import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import Icon from '../common/icon';

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
          <h3 style={styles.sectionHeading} onClick={onToggle}>
            <span style={styles.sectionHeadingText}>
              {title}
            </span>
            <Icon name='arrow_drop_down'
                  style={styles.dropdownIcon[visible ? 'normal' : 'flipped']}/>
            <div style={styles.clearfix}/>
          </h3>
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
    margin-bottom: 30px
    overflow: hidden

  sectionHeading
    cursor: pointer
    float: left
    font-size: 16px
    font-weight: bold
    text-transform: uppercase
    letter-spacing: 1px
    margin-bottom: 5px
    transition: color 0.06s ease-in-out
    user-select: none

    :hover
      color: rgba(217,52,35,1)

  sectionHeadingText
    display: block
    float: left

  dropdownIcon
    float: left
    font-size: 24px
    line-height: 15px
    margin-left: 3px
    transform-origin: 50% 52%
    transition: transform 0.15s ease-in-out

    &normal
      transform: rotateX(0deg)

    &flipped
      transform: rotateX(-180deg)

  collapsableContainer
    position: relative
    
    &show
      height: auto
      opacity: 1

    &hide
      height: 0
      opacity: 0

  clearfix
    clear: both
`;
