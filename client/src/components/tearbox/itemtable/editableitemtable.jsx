import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import debounce from 'lodash.debounce';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import {animateScroll as scroll} from 'react-scroll';

import TearIcon from './tearicon';
import {Icon, SelectBox} from '../../common';

import {
  editAddItem,
  editDeleteItem,
  editMoveItem,
  searchItemEffects,
  editItemField,
} from '../../../redux/actions';

const white = 'rgba(255,255,255,1)';
const grey = 'rgba(243,244,245,1)';

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

const colorOpts = [
  {label: 'Red', value: 0},
  {label: 'Blue', value: 1},
  {label: 'Purple', value: 2},
];

const pieceOpts = [
  {label: 'Top', value: 0},
  {label: 'Bottom', value: 1},
  {label: 'Gloves', value: 2},
  {label: 'Shoes', value: 3},
];

const typeOpts = [
  {label: 'Balance', value: 0},
  {label: 'Destruction', value: 1},
  {label: 'Proficiency', value: 2},
  {label: 'Transformation', value: 3},
];

const rarityOpts = [
  {label: 'Elite', value: 0},
  {label: 'Unique', value: 1},
];

const filterConfig = {
  ignoreCase: false,
  ignoreAccents: false,
  trim: false,
  matchFrom: 'any',
};

@Radium
class EditableItemTable extends React.Component {
  handleEffectsInputChange = (inputValue) => {
    const {searchItemEffectsFn} = this.props;
    searchItemEffectsFn(inputValue);
  };

  focusNewItem = () => {
    this.lastItemFirstSelect && this.lastItemFirstSelect.focus();
  };

  handleAddItemClick = () => {
    const {groupIdx, editAddItemFn, isLast} = this.props;
    editAddItemFn(groupIdx);
    this.addItemEl.blur();
    if (isLast) {
      scroll.scrollToBottom();
    }
    // Focus the newly created item once it's rendered.
    setTimeout(this.focusNewItem, 200);
  };

  handleAddItemKeyPress = event => {
    if (event.key != 'Enter') {
      return;
    }
    this.handleAddItemClick();
  };

  filterOptions = (opts, item) => opts.filter(opt =>
    item.effect.x_piece_id == null || opt.value === item.effect.x_piece_id
  );

  render() {
    const {
      items,
      tears,
      groupIdx,
      groupStableIdx,
      searchTerm,
      effects,

      editDeleteItemFn,

      editItemFieldFn,
      debouncedEditItemFieldFn,
    } = this.props;

    const effectOpts = effects.map(effect => ({
      label: effect.name,
      value: effect.id,
    }));

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
        <Droppable
          droppableId={`itemTableDroppable_${groupIdx}`}
          type={`ITEM_${groupIdx}`}
        >
          {(provided, snapshot) => (
            <ul style={[styles.itemEntries]} ref={provided.innerRef}>
              {items.map((item, i) => 
                <Draggable
                  key={item.idx}
                  draggableId={`itemDraggable_${groupIdx}_${i}`}
                  index={i}
                >
                  {(provided, snapshot) => (
                    <li
                      style={styles.itemEntry}
                      key={item.idx}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <ul style={[styles.itemRow, {backgroundColor: i % 2 == 0 ? white : grey}]}>
                        <li style={[styles.itemCol0]} {...provided.dragHandleProps} tabIndex={-1}>
                         <Icon style={styles.dragIcon}
                               name='drag_indicator'
                               />
                        </li>
                        <li style={[styles.itemCol1]}>
                          <TearIcon item={item} style={styles.tearIcon}/>
                        </li>
                        <li style={[styles.itemCol2]}>
                          <SelectBox
                            style={styles.itemSelect}
                            value={{label: item.color.name, value: item.color.id}}
                            options={colorOpts}
                            onChange={({label, value}) =>
                              editItemFieldFn(tears, groupIdx, i, 'color_id', value)
                            }
                            getRef={
                              (i === items.length - 1)
                                ? e => {this.lastItemFirstSelect = e;}
                                : undefined
                            }
                          />
                        </li>
                        <li style={[styles.itemCol3]}>
                          <SelectBox
                            style={styles.itemSelect}
                            value={{label: item.effect.name, value: item.effect.id}}
                            options={effectOpts}
                            onChange={({label, value}) => 
                              editItemFieldFn(tears, groupIdx, i, 'effect_id', value)
                            }
                            onInputChange={this.handleEffectsInputChange}
                            filterOption={(opt, v) => true}
                            noOptionsMessage={() => 'Search effects'}
                          />
                        </li>
                        <li style={[styles.itemCol4]}>
                          <SelectBox
                            style={styles.itemSelect}
                            value={{label: item.piece.name, value: item.piece.id}}
                            options={this.filterOptions(pieceOpts, item)}
                            onChange={({label, value}) =>
                              editItemFieldFn(tears, groupIdx, i, 'piece_id', value)
                            }
                          />
                        </li>
                        <li style={[styles.itemCol5]}>
                          <span style={styles.itemText}>
                            {item.type.name || ''}
                          </span>
                        </li>
                        <li style={[styles.itemCol6]}>
                          <span style={styles.itemText}>
                            {item.rarity.name || ''}
                          </span>
                        </li>
                        <li style={[styles.itemCol7]}>
                          <input
                            type='text'
                            style={styles.noteInput}
                            maxLength={80}
                            placeholder=''
                            defaultValue={item.note}
                            onChange={e =>
                              debouncedEditItemFieldFn(tears, groupIdx, i, 'note', e.target.value)
                            }/>
                        </li>
                        <li style={[styles.itemCol8]}>
                          <div onClick={() => editDeleteItemFn(groupIdx, i)}>
                            <Icon style={styles.closeIcon} name='close'/>
                          </div>
                        </li>
                      </ul>
                    </li>
                  )}
                </Draggable>
              )}
            </ul>
          )}
        </Droppable>
        <div
          name={`addItemButton_${groupIdx}`}
          style={styles.addItem}
          key={`addItemButton_${groupIdx}`}
          tabIndex={0}
          onClick={this.handleAddItemClick}
          onKeyPress={this.handleAddItemKeyPress}
          ref={e => {this.addItemEl = e}}
        >
          <Icon style={styles.addIcon} name='add'/>
          <span style={styles.addItemText}>Add Item</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {tears} = state;
  const {
    effectsSearchTerm,
    filteredEffects,
  } = tears;

  return {
    tears,
    effects: filteredEffects,
    searchTerm: effectsSearchTerm,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    editAddItemFn: groupIdx => dispatch(editAddItem(groupIdx)),
    editDeleteItemFn: (groupIdx, idx) => dispatch(editDeleteItem(groupIdx, idx)),
    editMoveItemFn: (groupIdx, srcIdx, destIdx) =>
      dispatch(editMoveItem(groupIdx, srcIdx, destIdx)),

    searchItemEffectsFn: debounce((searchTerm) =>
      dispatch(searchItemEffects(searchTerm)), 150),
    editItemFieldFn: (tears, groupIdx, idx, key, value) =>
      dispatch(editItemField(tears, groupIdx, idx, key, value)),
    debouncedEditItemFieldFn: debounce((tears, groupIdx, idx, key, value) =>
      dispatch(editItemField(tears, groupIdx, idx, key, value)), 100),
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
    line-height: 28px
    padding: 3px 0

  itemTableLabels
    border-bottom: 1px solid rgba(55,67,79,0.15)
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

  itemText
    color: rgba(55,67,79,0.6)
    display: block

  itemSelect
    line-height: 28px
    margin-bottom: -1px

  noteInput
    width: 130px
    background: none
    border-bottom: 1px solid rgba(55,67,79,0.2)
    padding: 3px 0
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
    width: 76px
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
    line-height: 28px

    :hover
      color: rgba(55,67,79,0.6)

    :active
      color: rgba(55,67,79,1)

  closeIcon
    color: rgba(55,67,79,0.3)
    line-height: 28px
    cursor: pointer

    :hover
      color: rgba(217,52,35,0.6)

    :active
      color: rgba(217,52,35,1)
  
  addItem
    cursor: pointer
    user-select: none
    display: flex
    flex-direction: row
    margin: 2px 0
    padding: 1px 0 0
    border: 2px dashed rgba(55,67,79,0.15)
    border-radius: 3px
    color: rgba(55,67,79,0.5)

    :hover, :focus
      outline: none
      border: 2px dashed rgba(180,40,36,0.2)
      color: rgba(217,52,35,1)
      background: rgba(180,40,36,0.05)

  addIcon
    padding: 0 4px
    line-height: 28px
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
