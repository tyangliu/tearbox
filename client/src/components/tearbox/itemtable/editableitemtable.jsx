import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import debounce from 'lodash.debounce';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import {animateScroll as scroll} from 'react-scroll';
import ReactTooltip from 'react-tooltip';

import TearIcon from './tearicon';
import {Icon, SelectBox} from '../../common';

import {
  editToggleSort,
  editAddItem,
  editDeleteItem,
  editMoveItem,
  searchItemEffects,
  editItemField,
  editItemFieldBatched,
} from '../../../redux/actions';

const white = 'rgba(255,255,255,1)';
const grey = 'rgba(243,244,245,1)';

const headers = [
  {key: 'drag', text: '', isSortable: false},
  {key: 'icon', text: '', isSortable: false},
  {key: 'color', text: 'Color', isSortable: true},
  {key: 'effect', text: 'Effect', isSortable: true},
  {key: 'piece', text: 'Piece', isSortable: true},
  {key: 'type', text: 'Type', isSortable: true},
  {key: 'rarity', text: 'Rarity', isSortable: true},
  {key: 'note', text: 'Note', isSortable: false},
  {key: 'delete', text: '', isSortable: false},
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
      scroll.scrollToBottom({duration: 300, delay: 0});
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

  handleInputKeyDown = e => {
    if (e.ctrlKey && (e.key === 'z' || e.key === 'y')) {
      e.preventDefault();
      e.nativeEvent.preventDefault();
    }
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
      sort,

      editToggleSortFn,
      editDeleteItemFn,
      editItemFieldFn,
      editItemFieldBatchedFn,
    } = this.props;

    const effectOpts = effects.map(effect => ({
      label: effect.name,
      value: effect.id,
    }));

    return (
      <div style={styles.itemTable}>
        <ul style={[styles.itemRow, styles.itemTableLabels]}>
          {headers.map(({key, text, isSortable}, i) => {
            const isActive = key == sort.key;
            // Disable drag, icon, note, delete columns
            return (
              <li
                style={[
                  styles.itemTableLabel[isActive ? 'active' : 'normal'],
                  styles['itemCol'+i]
                ]}
                key={`header_${i}`}
              >
                <div
                  data-tip='React-tooltip'
                  data-for={`header_${key}`}
                  style={styles.itemTableLabelContainer[isSortable ? 'normal' : 'disabled']}
                  key={'itemTableLabelContainer'+i}
                  onClick={isSortable
                    ? () => editToggleSortFn(key)
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
                {isSortable
                  ? <ReactTooltip
                      class='tooltip'
                      place='bottom'
                      id={`header_${key}`}
                      effect='float'
                    >
                      Sort by {text}
                    </ReactTooltip>
                  : null
                }
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
                        <li
                          style={[styles.itemCol0]}
                          {...provided.dragHandleProps}
                          tabIndex={-1}
                        >
                          <Icon
                            style={styles.dragIcon}
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
                            value={item.note}
                            onKeyDown={this.handleInputKeyDown}
                            onChange={e => {
                              if (e.ctrlKey) return;
                              editItemFieldBatchedFn(tears, groupIdx, i, 'note', e.target.value);
                            }}/>
                        </li>
                        <li style={[styles.itemCol8]}>
                          <div onClick={() => editDeleteItemFn(groupIdx, i)}>
                            <Icon style={styles.closeIcon} name='close'/>
                          </div>
                        </li>
                        <li style={styles.itemRowInnerSmallContainer}>
                          <div style={styles.itemRowInnerSmallList}>
                            <div style={styles.itemInnerRow}>
                              <div
                                style={[styles.itemCol0.small]}
                                {...provided.dragHandleProps}
                                tabIndex={-1}
                              >
                                <Icon style={styles.dragIcon}
                                     name='drag_indicator'
                                     />
                              </div>
                              <div style={[styles.itemCol1.small]}>
                                <TearIcon item={item} style={styles.tearIcon}/>
                              </div>
                              <div style={[styles.itemCol3.small]}>
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
                              </div>
                              <div style={[styles.itemCol8.small]}>
                                <div onClick={() => editDeleteItemFn(groupIdx, i)}>
                                  <Icon style={styles.closeIcon} name='close'/>
                                </div>
                              </div>
                            </div>
                            <div style={styles.itemInnerRow}>
                              <div style={[styles.itemCol2.small]}>
                                <SelectBox
                                  style={styles.itemSelect}
                                  value={{label: item.color.name, value: item.color.id}}
                                  options={colorOpts}
                                  onChange={({label, value}) =>
                                    editItemFieldFn(tears, groupIdx, i, 'color_id', value)
                                  }
                                />
                              </div>
                              <div style={[styles.itemCol4.small]}>
                                <SelectBox
                                  style={styles.itemSelect}
                                  value={{label: item.piece.name, value: item.piece.id}}
                                  options={this.filterOptions(pieceOpts, item)}
                                  onChange={({label, value}) =>
                                    editItemFieldFn(tears, groupIdx, i, 'piece_id', value)
                                  }
                                />
                              </div>
                              <div style={[styles.itemCol5.small]}>
                                <span style={styles.itemText}>
                                  {item.type.name || ''}
                                </span>
                              </div>
                              <div style={[styles.itemCol6.small]}>
                                <span style={styles.itemText}>
                                  {item.rarity.name || ''}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li style={[styles.itemCol7.small]}>
                          <div style={styles.itemCol7LabelSmall}>
                            Note
                          </div>
                          <input
                            type='text'
                            style={styles.noteInput}
                            maxLength={80}
                            placeholder=''
                            value={item.note}
                            onKeyDown={this.handleInputKeyDown}
                            onChange={e => {
                              if (e.ctrlKey) return;
                              editItemFieldBatchedFn(tears, groupIdx, i, 'note', e.target.value);
                            }}/>
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
    sort: state.box.present.editOptions.sort,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    editToggleSortFn: key => dispatch(editToggleSort(key)),
    editAddItemFn: groupIdx => dispatch(editAddItem(groupIdx)),
    editDeleteItemFn: (groupIdx, idx) => dispatch(editDeleteItem(groupIdx, idx)),
    editMoveItemFn: (groupIdx, srcIdx, destIdx) =>
      dispatch(editMoveItem(groupIdx, srcIdx, destIdx)),

    searchItemEffectsFn: debounce((searchTerm) =>
      dispatch(searchItemEffects(searchTerm)), 150),
    editItemFieldFn: (tears, groupIdx, idx, key, value) =>
      dispatch(editItemField(tears, groupIdx, idx, key, value)),
    editItemFieldBatchedFn: (tears, groupIdx, idx, key, value) =>
      dispatch(editItemFieldBatched(tears, groupIdx, idx, key, value)),
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
    border-bottom: 1px solid rgba(55,67,79,0.2)

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

    @media (max-width: 800px)
      flex: 1

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
    text-align: center
    width: 24px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        padding-right: 4px

  itemCol1
    width: 46px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        padding: 0 4px

  itemCol2
    width: 70px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        flex-basis: 60px
        padding: 0 4px
        margin-left: 20px

  itemCol3
    flex: 1
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        flex: 1
        padding: 0 4px

  itemCol4
    width: 76px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        flex-basis: 70px
        padding: 0 4px

  itemCol5
    width: 120px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      @media (max-width: 800px)
        display: block
        flex-basis: 120px
        text-align: left
        padding: 0 4px

  itemCol6
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

  itemCol7
    width: 176px
    padding-right: 8px

    @media (max-width: 800px)
      display: none

    small
      display: none

      @media (max-width: 800px)
        padding: 6px 0 4px 23px
        display: flex

  itemCol7LabelSmall
    margin-right: 10px
    font-style: italic
    color: rgba(55,67,79,0.6)

  itemCol8
    text-align: center
    width: 24px

    @media (max-width: 800px)
      display: none

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
