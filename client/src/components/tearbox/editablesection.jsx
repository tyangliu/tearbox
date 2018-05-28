import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import debounce from 'lodash.debounce';

import {Icon, Button} from '../common';

import {
  editDeleteGroup,
  editMoveGroup,
  editGroupTitle,
} from '../../redux/actions';

@Radium
class EditableSection extends React.Component {
  static defaultProps = {
    visible: true,
    onToggle: () => {},
  };

  render() {
    const {
      onToggle,
      title,
      visible,
      groupIdx,

      editDeleteGroupFn,
      editGroupTitleFn,
    } = this.props;

    return (
      <section style={styles.section}>
        <div style={styles.sectionHeadingContainer}>
          <div style={styles.sectionHeadingLeft}>
            <Icon style={styles.dragIcon} name='drag_indicator'/>
            <h3 style={styles.sectionHeading}
                key={`sectionHeading_${title}`}>
              <input type='text'
                     maxLength={24}
                     defaultValue={title}
                     placeholder='e.g. Selling, Buying, &hellip;'
                     style={styles.sectionHeadingInput}
                     onChange={e => editGroupTitleFn(groupIdx, e.target.value)}/>
              <span style={styles.dropdownIconContainer}
                    onClick={onToggle}>
                <Icon name='arrow_drop_down'
                      style={styles.dropdownIcon[visible ? 'normal' : 'flipped']}/>
              </span>
              <div style={styles.clearfix}/>
            </h3>
          </div>
          <Button icon='delete'
                  style={styles.deleteButton}
                  onClick={() => editDeleteGroupFn(groupIdx)}>
            Delete Section
          </Button>
          <div style={styles.clearfix}/>
        </div>
        <div style={styles.collapsableContainer[visible ? 'show' : 'hide']}>
          {this.props.children}
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    editDeleteGroupFn: groupIdx => dispatch(editDeleteGroup(groupIdx)),
    editMoveGroupFn: (srcIdx, destIdx) =>
      dispatch(editMoveGroup(srcIdx, destIdx)),
    editGroupTitleFn: debounce((groupIdx, title) => dispatch(editGroupTitle(groupIdx, title)), 500),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditableSection);

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

  dropdownIconContainer 
    :hover
      color: rgba(217,52,35,1)


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
