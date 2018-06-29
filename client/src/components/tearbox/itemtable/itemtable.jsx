import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import XDate from 'xdate';

import TearIcon from './tearicon';
import {Icon} from '../../common';
import {toggleSort} from '../../../redux/actions';

const white = 'rgba(255,255,255,1)';
const grey = 'rgba(243,244,245,1)';


const headers = [
  {key: 'icon', text: '', isSortable: false},
  {key: 'color', text: 'Color', isSortable: true},
  {key: 'effect', text: 'Effect', isSortable: true},
  {key: 'piece', text: 'Piece', isSortable: true},
  {key: 'type', text: 'Type', isSortable: true},
  {key: 'rarity', text: 'Rarity', isSortable: true},
  {key: 'note', text: 'Note', isSortable: false},
  {key: 'created', text: 'Added', isSortable: true},
];

@Radium
class ItemTable extends React.Component {
  render() {
    const {items, sort, toggleSortFn} = this.props;
    const inner = items.length === 0
      ? <li style={styles.emptyItems}>No Items</li>
      : items.map((item, i) => 
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
              <li style={[styles.itemCol7]}>
                {(item.created && item.created != '')
                  ? new XDate(item.created).toString('MMM d')
                  : ''
                }
              </li>
              <li style={styles.itemRowInnerSmallContainer}>
                <ul style={styles.itemRowInnerSmallList}>
                  <li style={styles.itemInnerRow.normal}>
                    <div style={[styles.itemCol0.small]}>
                      <TearIcon item={item}/>
                    </div>
                    <div style={[styles.itemCol2.small]}>
                      {item.effect.name}
                    </div>
                  </li>
                  <li style={
                    styles.itemInnerRow[item.note.length ? 'normal' : 'borderless']
                  }>
                    <div style={[styles.itemCol1.small]}>{item.color.name}</div>
                    <div style={[styles.itemCol3.small]}>{item.piece.name}</div>
                    <div style={[styles.itemCol4.small]}>{item.type.name}</div>
                    <div style={[styles.itemCol5.small]}>{item.rarity.name}</div>
                  </li>
                  <li style={[
                    styles.itemCol6.small[item.note.length ? 'normal' : 'hidden']
                  ]}>
                    <div style={styles.itemCol6LabelSmall}>
                      Note
                    </div>
                    <div style={styles.itemCol6TextSmall}>
                      {item.note}
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        );

    return (
      <div style={styles.itemTable}>
        <ul style={[styles.itemRow, styles.itemTableLabels]}>
          {headers.map(({key, text, isSortable}, i) => {
            const isActive = key == sort.key;
            // Disable icon and note columns
            return (
              <li
                style={[
                  styles.itemTableLabel[isActive ? 'active' : 'normal'],
                  styles['itemCol'+i]
                ]}
                key={i}
              >
                <div
                  style={styles.itemTableLabelContainer[isSortable ? 'normal' : 'disabled']}
                  key={'itemTableLabelContainer'+i}
                  onClick={isSortable
                    ? () => toggleSortFn(key)
                    : undefined
                  }
                >
                  <span style={styles.itemTableLabelText}>
                    {text}
                  </span>
                  <Icon
                    name='keyboard_arrow_down'
                    style={[
                      styles.sortIcon[isActive ? 'visible' : 'hidden'],
                      styles.sortIconRotation[sort.order ? 'flipped' : 'normal'],
                    ]}
                  />
                </div>
                <div style={styles.clearfix}/>
              </li>
            );
          })}
        </ul>
        <div style={styles.clearfix}/>
        <ul style={[styles.itemEntries]}>
          {inner}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    sort: state.box.present.options.sort,
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
    font-size: 13px
    display: flex
    flex-direction: row
    line-height: 28px
    padding: 3px 0

    @media (max-width: 800px)
      display: block

  itemRowInnerSmallContainer
    display: none

    @media (max-width: 800px)
      display: block

  itemInnerRow
    display: flex
    flex-direction: row
    justify-content: left
    padding: 6px 0

    &normal
      border-bottom: 1px solid rgba(55,67,79,0.2)

    &borderless
      border-bottom: 0

  itemTableLabels
    border-bottom: 1px solid rgba(55,67,79,0.15)
    user-select: none

    @media (max-width: 800px)
      display: none

  itemTableLabel
    display: inline-block

    &active

    &normal
      color: inherit

  itemTableLabelContainer
    display: flex
    flex-direction: row
    cursor: pointer
    float: left
    transition: color 0.06s ease-in-out

    &disabled
      cursor: auto

    &normal
      :hover
        color: rgba(217,52,35,1)

  itemTableLabelText
    font-weight: bold
    display: block

  emptyItems
    text-align: center
    padding: 20px 0
    font-style: italic
    font-size: 21px
    color: rgba(55,67,79,0.6)

  sortIcon
    font-size: 15px
    line-height: 28px
    margin-left: 4px
    width: 14px

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
    width: 46px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        padding-right: 4px
        margin-left: 4px

  itemCol1
    width: 70px
    padding-right: 8px
    padding-right: 4px
    margin-left: 4px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        flex-basis: 60px
        padding: 0 4px

  itemCol2
    flex: 1
    padding-right: 4px
    margin-left: 4px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        flex: 1
        padding: 0 4px

  itemCol3
    width: 76px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block    
        flex-basis: 70px
        padding: 0 4px

  itemCol4
    width: 120px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        flex-basis: 120px
        text-align: left
        padding: 0 auto

  itemCol5
    width: 80px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        flex-basis: 80px
        text-align: left
        padding: 0 4px

  hidden
    display: none

  itemCol6
    width: 130px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      display: none

      &normal
        @media (max-width: 800px)
          padding: 6px 0 4px 3px
          display: flex
          margin-right: 10px
          font-style: italic
          color: rgba(55,67,79,0.6)

      &hidden

  itemCol6LabelSmall
    margin-right: 10px
    font-style: italic
    color: rgba(55,67,79,0.6)

  itemCol6TextSmall
    color: rgba(55,67,79,1)
    font-style: normal

  itemCol7
    width: 70px

    @media (max-width: 800px)
      display: none

  itemRowInnerSmallList
    display: none

    @media (max-width: 800px)
      display: block

  clearfix
    clear: both
`;
