import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

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
            <i style={[styles.icon, styles.dropdownIcon]} className='material-icons'>
              {visible ? 'arrow_drop_down' : 'arrow_drop_up'}
            </i>
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
    margin-bottom: 12px
    transition: color 0.1s ease-in-out

    :hover
      color: rgba(217,52,35,1)

  sectionHeadingText
    float: left

  icon
    width: 20px
    font-size: 17px
    line-height: 24px
    display: block
    float: left

  dropdownIcon
    float: left
    display: block
    line-height: 17px
    font-size: 24px
    margin-left: 6px

  collapsableContainer
    position: relative

    show
      height: auto

    hide
      height: 0

  clearfix
    clear: both
`;
