import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import TearIcon from './tearicon';
import {Icon, SelectBox} from '../../common';

const white = 'rgba(255,255,255,1)';
const grey = 'rgba(55,67,79,0.06)';

const headers = [
  {key: 'drag', text: ''},
  {key: 'icon', text: ''},
  {key: 'color', text: 'Color'},
  {key: 'effect', text: 'Effect'},
  {key: 'piece', text: 'Piece'},
  {key: 'type', text: 'Type'},
  {key: 'rarity', text: 'Rarity'},
  {key: 'note', text: 'Note'},
  {key: 'delete', text: ''},
];

@Radium
class EditableItemTable extends React.Component {
  render() {
    const {items, tears} = this.props;
    const colorOpts = tears.colors.map(color => ({label: color.name, value: color.id}));
    return (
      <div style={styles.itemTable}>
        <ul style={[styles.itemRow, styles.itemTableLabels]}>
          {headers.map(({key, text}, i) => {
            // Disable first and last columns (icons, notes)
            return (
              <li style={[
                    styles.itemTableLabel.normal,
                    styles['itemCol'+i]
                  ]}
                  key={i}>
                <div style={styles.itemTableLabelContainer.disabled}
                     key={'itemTableLabelContainer'+i}>
                  <span style={styles.itemTableLabelText}>
                    {text}
                  </span>
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
                 <Icon style={styles.dragIcon} name='drag_indicator'/>
                </li>
                <li style={[styles.itemCol1]}>
                  <TearIcon item={item} style={styles.tearIcon}/>
                </li>
                <li style={[styles.itemCol2]}>
                  <SelectBox
                    value={{label: item.color.name, value: item.color.id}}
                    options={colorOpts}
                  />
                </li>
                <li style={[styles.itemCol3]}>
                  <SelectBox
                    value={{label: item.effect.name, value: item.effect.id}}
                    options={[]}
                  />
                </li>
                <li style={[styles.itemCol4]}>
                  <SelectBox
                    value={{label: item.piece.name, value: item.piece.id}}
                    options={[]}
                  />
                </li>
                <li style={[styles.itemCol5]}>
                  <SelectBox
                    value={{label: item.type.name, value: item.type.id}}
                    options={[]}
                  />
                </li>
                <li style={[styles.itemCol6]}>
                  <SelectBox
                    value={{label: item.rarity.name, value: item.rarity.id}}
                    options={[]}
                  />
                </li>
                <li style={[styles.itemCol7]}>
                  <input type='text'
                         style={styles.noteInput}
                         maxLength={80}
                         placeholder=''
                         value={item.note}
                         onChange={() => {}}/>
                </li>
                <li style={[styles.itemCol8]}>
                 <Icon style={styles.closeIcon} name='close'/>
                </li>
              </ul>
            </li>
          )}
          <li style={styles.addItem}>
            <Icon style={styles.addIcon} name='add'/>
            <span style={styles.addItemText}>Add Item</span>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {tears} = state;
  return {
    tears,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditableItemTable);

const styles = styler`
  itemRow
    font-size: 13px
    display: flex
    flex-direction: row
    padding: 2px 0

  itemTableLabels
    border-bottom: 1px solid rgba(55,67,79,0.15)
    padding: 7px 0 7px
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
    font-weight: bold
    display: block
    float: left

  tearIcon
    margin-top: 1.5px

  noteInput
    width: 176px
    background: none
    border-bottom: 1px solid rgba(55,67,79,0.2)
    padding: 4px 0
    outline: none

  itemCol0
    text-align: center
    width: 24px
    padding-right: 8px

  itemCol1
    width: 46px
    padding-right: 8px

  itemCol2
    width: 70px
    padding-right: 8px

  itemCol3
    flex: 1
    padding-right: 8px

  itemCol4
    width: 70px
    padding-right: 8px

  itemCol5
    width: 120px
    padding-right: 8px

  itemCol6
    width: 80px
    padding-right: 8px

  itemCol7
    width: 176px
    padding-right: 8px

  itemCol8
    text-align: center
    width: 24px

  dragIcon
    color: rgba(55,67,79,0.3)
    line-height: 30px
    cursor: move

  closeIcon
    color: rgba(55,67,79,0.3)
    line-height: 30px
    cursor: pointer
  
  addItem
    cursor: pointer
    user-select: none
    display: flex
    flex-direction: row
    margin: 2px 0
    padding: 1px 0
    border: 2px dashed rgba(55,67,79,0.15)
    color: rgba(55,67,79,0.5)

    :hover
      border: 2px dashed rgba(180,40,36,0.2)
      color: rgba(217,52,35,1)
      background: rgba(180,40,36,0.05)

    :active
      background: rgba(180,40,36,0.2)

  addIcon
    padding: 0 4px
    line-height: 27px
    margin: 0 20px 0 23px

  addItemText
    font-weight: bold
    font-size: 11px
    text-transform: uppercase
    letter-spacing: 0.5px
    line-height: 27px
    
  clearfix
    clear: both
`;
