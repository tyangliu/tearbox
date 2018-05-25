import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import TearIcon from './tearicon';

const white = 'rgba(255,255,255,1)';
const grey = 'rgba(55,67,79,0.06)';

@Radium
class ItemTable extends React.Component {
  render() {
    const {items} = this.props;
    console.log(items);
    return (
      <div style={styles.itemTable}>
        <ul style={[styles.itemRow, styles.itemTableLabels]}>
          <li style={[styles.itemTableLabel, styles.itemCol0]}></li>
          <li style={[styles.itemTableLabel, styles.itemCol1]}>Color</li>
          <li style={[styles.itemTableLabel, styles.itemCol2]}>
            <span style={styles.itemTableLabelText}>
              Effect
            </span>
            <i style={[styles.icon, styles.dropdownIcon, styles.labelDropdownIcon]} className='material-icons'>
              keyboard_arrow_down
            </i>
          </li>
          <li style={[styles.itemTableLabel, styles.itemCol3]}>Piece</li>
          <li style={[styles.itemTableLabel, styles.itemCol4]}>Type</li>
          <li style={[styles.itemTableLabel, styles.itemCol5]}>Rarity</li>
          <li style={[styles.itemTableLabel, styles.itemCol6]}>Notes</li>
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
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
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

  itemTableLabel
    display: inline-block

  itemTableLabelText
    display: block
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
    line-height: 18px
    margin-left: 6px

  labelDropdownIcon
    font-size: 14px
    line-height: 24px
    float: left

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
