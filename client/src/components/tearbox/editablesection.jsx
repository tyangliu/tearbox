import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import debounce from 'lodash.debounce';

import {Icon, Button, SelectBox} from '../common';

import {
  editDeleteGroup,
  editMoveGroup,
  editGroupTitle,
  editGroupType,
} from '../../redux/actions';
import {groupTypeLabels} from '../../redux/constants';

const typeOpts = groupTypeLabels.map((label, i) => ({label, value: i}));

@Radium
class EditableSection extends React.Component {
  static defaultProps = {
    provided: {},
    visible: true,
    onToggle: () => {},
  };

  render() {
    const {
      provided,
      onToggle,
      title,
      type,
      visible,
      groupIdx,
      getRef,

      editDeleteGroupFn,
      editGroupTitleFn,
      editGroupTypeFn,
    } = this.props;
    return (
      <section
        key={`section_${groupIdx}`}
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeadingContainer}>
            <div
              style={styles.sectionHeadingLeft}>
              <div {...(provided.dragHandleProps || {})} tabIndex={-1}>
                <Icon style={styles.dragIcon} name='drag_indicator'/>
              </div>
              <h3 style={styles.sectionHeading}>
                <input
                  type='text'
                  maxLength={24}
                  defaultValue={title}
                  placeholder={'Section Title'}
                  style={styles.sectionHeadingInput}
                  onChange={e => editGroupTitleFn(groupIdx, e.target.value)}
                  ref={getRef}
                />
                <SelectBox
                  value={typeOpts[type]}
                  style={styles.dropdownTypeSelect}
                  options={typeOpts}
                  onChange={({label, value}) =>
                    editGroupTypeFn(groupIdx, value)
                  }
                />
                <div
                  style={styles.dropdownIconContainer}
                  tabIndex={-1}
                  onClick={onToggle}
                >
                  <Icon name='arrow_drop_down'
                        style={styles.dropdownIcon[visible ? 'normal' : 'flipped']}/>
                </div>
                <div style={styles.clearfix}/>
              </h3>
            </div>
            <Button
              icon='delete'
              style={styles.deleteButton}
              tabIndex={-1}
              onClick={() => editDeleteGroupFn(groupIdx)}
            >
              Delete Section
            </Button>
            <div style={styles.clearfix}/>
          </div>
          <div style={styles.collapsableContainer[visible ? 'show' : 'hide']}>
            {this.props.children}
          </div>
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
    editGroupTitleFn: debounce((groupIdx, title) => dispatch(editGroupTitle(groupIdx, title)), 100),
    editGroupTypeFn: (groupIdx, type) => dispatch(editGroupType(groupIdx, type)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditableSection);

const styles = styler`
  sectionContainer
    background: rgba(255,255,255,1)
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

  sectionHeadingText
    display: block

  sectionHeadingInput
    width: 300px
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
    margin-right: 6px
    outline: none 

    :hover
      color: rgba(55,67,79,0.6)

    :active
      color: rgba(55,67,79,1)

  deleteButton
    float: right
    color: rgba(55,67,79,0.6)
    cursor: pointer
    padding: 2px 9px

  dropdownTypeSelect
    font-size: 16px
    font-style: italic
    font-weight: normal
    text-transform: none
    letter-spacing: 0
    line-height: 27.5px
    width: 80px
    margin-left: 18px

  dropdownIconContainer 
    outline: none
    :hover
      color: rgba(217,52,35,1)

  dropdownIcon
    font-size: 24px
    line-height: 28.5px
    margin-left: 10px
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
