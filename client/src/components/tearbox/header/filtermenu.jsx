import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import Icon from '../../common/icon';
import Popover from '../../common/popover';
import Button from '../../common/button';

import {
  toggleFilterMenu,
  closeFilterMenu,
  toggleFilter,
  selectAllFilter,
  unselectAllFilter,
} from '../../../redux/actions';

const options = [
  {
    label: 'Color',
    key: 'color',
    layout: 'h',
    choices: [
      {label: 'Red', value: 0, color: 'rgba(217,52,35,1)'},
      {label: 'Blue', value: 1, color: 'rgba(9,118,186,1)'},
      {label: 'Purple', value: 2, color: 'rgba(110,36,193,1)'},
    ],
  },
  {
    label: 'Piece',
    key: 'piece',
    layout: 'h',
    choices: [
      {label: 'Top', value: 0},
      {label: 'Bottom', value: 1},
      {label: 'Gloves', value: 2},
      {label: 'Shoes', value: 3},
    ],
  },
  {
    label: 'Type',
    key: 'type',
    layout: 'v',
    choices: [
      {label: 'Balance', value: 0},
      {label: 'Destruction', value: 1},
      {label: 'Proficiency', value: 2},
      {label: 'Transformation', value: 3},
    ],
  },
  {
    label: 'Rarity',
    key: 'rarity',
    layout: 'h',
    choices: [
      {label: 'Elite', value: 0, color: 'rgba(173,104,156,1)'},
      {label: 'Unique', value: 1, color: 'rgba(178,143,78,1)'},
    ],
  },
];

const selectedColor = 'rgba(78,95,130,1)';
const unselectedColor = 'rgba(55,67,79,1)';

const getChoiceColor = (key, choice, filterOpts) => {
  return filterOpts[key][choice.value]
    ? (choice.color || selectedColor)
    : unselectedColor;
};

@Radium
class FilterMenu extends React.Component {
  handleButtonClick = event => {
    const {toggleFilterMenuFn} = this.props;
    toggleFilterMenuFn();
    // Prevent click from triggering outer click onClose
    // of popover.
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  };

  render() {
    const {
      filterOpts,
      visible,
      closeFilterMenuFn,
      toggleFilterFn,
      selectAllFilterFn,
      unselectAllFilterFn,
      style,
    } = this.props;

    return (
      <div style={[styles.filterMenu, style]}>
        <button style={styles.filterButton[visible ? 'active' : 'normal']}
                onClick={this.handleButtonClick}>
          <Icon name='filter_list' style={styles.icon}/>
          <div style={styles.filterLabel}>
            Filter
          </div>
          <div style={styles.clearfix}/>
        </button>
        <Popover style={styles.popover}
                 visible={visible}
                 onClose={closeFilterMenuFn}>
          <button style={styles.closeButton}
                  onClick={this.handleButtonClick}>
            <Icon name='close' style={styles.closeIcon}/>
          </button>
          <ul style={styles.popoverSections}>
            {options.map((opt, i) =>
              <li style={styles.popoverSection} key={i}>
                <span style={styles.sectionLabel}>
                  {opt.label}
                </span>
                <ul style={styles.sectionList[opt.layout]}>
                  {opt.choices.map((choice, j) =>
                    <li style={[
                          styles.sectionChoice[opt.layout],
                          styles.sectionChoiceVisibility[filterOpts[opt.key][choice.value] ? 'normal' : 'dim'],
                          {
                            color: getChoiceColor(opt.key, choice, filterOpts),
                          }]}
                        onClick={event => {
                          toggleFilterFn(opt.key, choice.value);
                          event.stopPropagation();
                          event.nativeEvent.stopImmediatePropagation();
                        }}
                        key={`filterChoice${i}${j}`}>
                      {choice.label}
                    </li>
                  )}
                </ul>
                <div style={styles.clearfix}/>
              </li>
            )}
          </ul>
          <div style={styles.buttonContainer}>
            <Button style={styles.selectButton}
                    key={'unselectAll'}
                    onClick={unselectAllFilterFn}>
              Clear
            </Button>
            <Button style={styles.selectButton}
                    key={'selectAll'}
                    onClick={selectAllFilterFn}>
              Select All
            </Button>
          </div>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    filterOpts: state.box.options.filter,
    visible: state.ui.filterVisibility,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggleFilterMenuFn: () => dispatch(toggleFilterMenu()),
    closeFilterMenuFn: () => dispatch(closeFilterMenu()),
    toggleFilterFn: (key, choice) => dispatch(toggleFilter(key, choice)),
    selectAllFilterFn: () => dispatch(selectAllFilter()),
    unselectAllFilterFn: () => dispatch(unselectAllFilter()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterMenu);

const styles = styler`
  filterMenu
    position: relative

  filterButton
    cursor: pointer
    user-select: none
    border: 0
    margin-left: 20px
    padding: 6px
    line-height: 19.5px
    float: left
    position: relative
    z-index: 2

    &normal
      color: inherit

    &active
      color: rgba(217,52,35,1)

    :hover
      color: rgba(217,52,35,1)

  icon
    float: left

  closeButton
    color: rgba(55,67,79,0.7)
    border: 0
    padding: 2px
    float: right
    margin: 2px 3px 0 0

    :hover
      color: rgba(217,52,35,1)

  closeIcon
    line-height: 21px
    font-size: 16px

  filterLabel
    float: left
    margin-left: 5px
    margin-right: 10px

  popover 
    user-select: none
    position: absolute
    width: 300px
    top: 25px
    left: 15px

  popoverSections
    margin-top: 4px

  popoverSection
    padding: 0 10px
    border-bottom: 1px solid rgba(55,67,79,0.1)

  sectionLabel
    font-style: italic
    float: left
    padding: 8px 0
    margin-right: 10px
    display: block
    width: 50px
    color: rgba(55,67,79,0.65)

  sectionList
    float: left

    &h

    &v
      padding: 6px 0 9px

  sectionChoice
    cursor: pointer
    display: inline-block
    text-transform: uppercase
    font-weight: bold
    font-size: 12px
    letter-spacing: 0.5px
    margin-top: 2px

    &h
      padding: 6px 0
      margin-right: 8px
      display: inline-block

    &v
      padding: 0
      display: block

  sectionChoiceVisibility
    &normal
      opacity: 1

      :hover
        opacity: 1

    &dim
      opacity: 0.3

      :hover
        opacity: 0.6

  buttonContainer
    text-align: center
    padding: 10px

  selectButton
    display: inline-block
    margin-right: 8px
    padding: 4px 14px

  clearfix
    clear: both
`;
