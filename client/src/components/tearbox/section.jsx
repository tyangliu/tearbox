import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import {Icon, Button} from '../common';

@Radium
export default class Section extends React.Component {
  static defaultProps = {
    editable: false,
    visible: true,
    onToggle: () => {},
  };

  render() {
    const {onToggle, title, visible, editable} = this.props;
    return (
      <section style={styles.section}>
        <div style={styles.sectionHeadingContainer}>
          <div style={styles.sectionHeadingLeft}>
            {editable
              ? <Icon style={styles.dragIcon} name='drag_indicator'/>
              : null}
            <h3 style={styles.sectionHeading} onClick={onToggle}>
              <span style={styles.sectionHeadingText}>
                {title}
              </span>
              <Icon name='arrow_drop_down'
                    style={styles.dropdownIcon[visible ? 'normal' : 'flipped']}/>
              <div style={styles.clearfix}/>
            </h3>
          </div>
          {editable
            ? <Button icon='delete'
                      style={styles.deleteButton}>
                Delete Section
              </Button>
            : null}
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

  dragIcon
    line-height: 28.5px
    color: rgba(55,67,79,0.3)
    cursor: move
    margin-right: 6px

    :hover
      color: rgba(55,67,79,0.6)

    :active
      color: rgba(55,67,79,1)
      

  deleteButton
    float: right
    color: rgba(55,67,79,0.6)
    cursor: pointer
    padding: 2px 9px

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
      height: auto
      opacity: 1

    &hide
      height: 0
      opacity: 0

  clearfix
    clear: both
`;
