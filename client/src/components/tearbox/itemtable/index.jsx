import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import TearIcon from './tearicon';

const white = 'rgba(255,255,255,1)';
const grey = 'rgba(55,67,79,0.06)';

import {toggleSort} from '../../../redux/actions';

const headers = [
  {key: 'icon', text: ''},
  {key: 'color', text: 'Color'},
  {key: 'effect', text: 'Effect'},
  {key: 'piece', text: 'Piece'},
  {key: 'type', text: 'Type'},
  {key: 'rarity', text: 'Rarity'},
  {key: 'notes', text: 'Notes'},
];

@Radium
class ItemTable extends React.Component {
  render() {
    const {items, sort, toggleSortFn} = this.props;
    return (
      <div style={styles.itemTable}>
        <ul style={[styles.itemRow, styles.itemTableLabels]}>
          {headers.map(({key, text}, i) => {
            const isActive = key == sort.key;
            // Disable first and last columns (icons, notes)
            const isDisabled = i == 0 || i == headers.length - 1;
            return (
              <li style={[
                    styles.itemTableLabel[isActive ? 'active' : 'normal'],
                    styles['itemCol'+i]
                  ]}
                  key={i}>
                <div style={styles.itemTableLabelContainer[isDisabled ? 'disabled' : 'normal']}
                     key={'itemTableLabelContainer'+i}
                     onClick={isDisabled
                      ? () => {}
                      : () => toggleSortFn(key)
                     }>
                  <span style={styles.itemTableLabelText}>
                    {text}
                  </span>
                  <i style={[
                      styles.icon,
                      styles.sortIcon[isActive ? 'visible' : 'hidden'],
                      styles.sortIconRotation[sort.order ? 'flipped' : 'normal'],
                    ]}
                    className='material-icons'>
                    keyboard_arrow_down
                  </i>
                </div>
                <div style={styles.clearfix}/>
              </li>
            );
          })}
        </ul>
        <div style={styles.clearfix}/>
        <ul style={[styles.itemEntries]}>
          {items.map((item, i) => 
            <li style={styles.itemEntry} key={i}>
              <ul style={[styles.itemRow, {backgroundColor: i % 2 == 0 ? white : grey}]}>
                <li style={[styles.itemCol0]}>
                  <TearIcon item={item}/>
                </li>
                <li style={[styles.itemCol1]}>{item.color.name}</li>
                <li style={[styles.itemCol2]}>{item.effect.name}</li>
                <li style={[styles.itemCol3]}>{item.piece.name}</li>
                <li style={[styles.itemCol4]}>{item.type.name}</li>
                <li style={[styles.itemCol5]}>{item.rarity.name}</li>
                <li style={[styles.itemCol6]}>{item.note}</li>
              </ul>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    sort: state.box.options.sort,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggleSortFn: key => dispatch(toggleSort(key)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ItemTable);

const styles = styler`
  itemRow
    display: flex
    flex-direction: row
    line-height: 24px
    padding: 3px 0

  itemTableLabels
    border-bottom: 1px solid rgba(55,67,79,0.15)
    margin-bottom: 3px
    user-select: none

  itemTableLabel
    display: inline-block

    &active

    &normal
      color: inherit

  itemTableLabelContainer
    cursor: pointer
    float: left
    transition: color 0.06s ease-in-out

    &disabled
      cursor: auto

    &normal
      :hover
        color: rgba(217,52,35,1)

  itemTableLabelText
    display: block
    float: left

  icon
    width: 20px
    font-size: 17px
    line-height: 24px
    display: block
    float: left
    user-select: none

  sortIcon
    font-size: 13px
    margin-top: 1px
    line-height: 23px
    margin-left: 4px
    float: left

    &visible
      pointer-events: auto
      
    &hidden
      opacity: 0
      pointer-events: none

  sortIconRotation
    transition: transform 0.15s ease-in-out
    transform-origin: 50% 49%

    &normal
      transform: rotateX(0deg)

    &flipped
      transform: rotateX(-180deg)

  itemCol0
    width: 40px
    padding-right: 10px

  itemCol1
    width: 70px
    padding-right: 10px

  itemCol2
    flex: 1

  itemCol3
    width: 70px
    padding-right: 10px

  itemCol4
    width: 110px
    padding-right: 10px

  itemCol5
    width: 70px
    padding-right: 10px

  itemCol6
    width: 160px

  clearfix
    clear: both
`;
