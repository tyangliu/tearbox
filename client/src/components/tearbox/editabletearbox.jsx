import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import {EditableHeader} from './header';
import {Icon} from '../common';
import InfoBox from './infobox';
import {EditableItemTable} from './itemtable';
import EditableSection from './editablesection';
import Footer from './footer';

import {
  RECEIVED,

  loadTears,
  fetchBox,
  toggleGroup,

  editAddGroup,
} from '../../redux/actions';

@Radium
class EditableTearbox extends React.Component {
  handleAddGroupClick = () => {
    const {editAddGroupFn} = this.props;
    editAddGroupFn();
    this.addGroupEl.blur();
  };

  handleAddGroupKeyPress = event => {
    if (event.key != 'Enter') {
      return;
    }
    this.handleAddGroupClick();
  };

  componentDidMount() {
    const {boxStatus, fetchBoxFn} = this.props;
    if (boxStatus !== RECEIVED) {
      fetchBoxFn();
    }
  }

  render() {
    const {
      box,
      groupVisibilities,
      toggleGroupFn,
    } = this.props;

    return (
        <div style={styles.tearbox}>
          <div style={styles.tearboxContainer}>
            <div style={styles.headerContainer}>
              <EditableHeader/>
            </div>
            <div style={styles.container}>
              <div style={styles.left}>
                <div style={styles.mainLeftContent}>
                  <div style={styles.leftTop}>
                    <InfoBox/>
                  </div>
                  <Footer/>
                </div>
              </div>

              <div style={styles.right}>
                {(box.groups || []).map((group, i) => 
                  <EditableSection title={group.label}
                           key={i}
                           groupIdx={i}
                           visible={groupVisibilities[i]}
                           onToggle={() => toggleGroupFn(i)}>
                    <EditableItemTable items={group.items} groupIdx={i}/>
                  </EditableSection>
                )}
                <div style={styles.addSection}
                     tabIndex={0}
                     onClick={this.handleAddGroupClick}
                     onKeyPress={this.handleAddGroupKeyPress}
                     ref={e => {this.addGroupEl = e}}>
                  <Icon style={styles.addIcon} name='create_new_folder'/>
                  <span style={styles.addSectionText}>Add Section</span>
                </div>
              </div>

            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {ui, tears, box} = state;
  return {
    boxStatus: ui.boxStatus,
    box: box.stagingData,
    groupVisibilities: ui.groupVisibilities,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadTearsFn: () => dispatch(loadTears()),
    fetchBoxFn: () => dispatch(fetchBox()),
    toggleGroupFn: idx => dispatch(toggleGroup(idx)),

    editAddGroupFn: () => dispatch(editAddGroup()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditableTearbox);

const styles = styler`
  tearbox
    width: 100%
    min-width: 1020px
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    height: 100vh

  tearboxContainer
    width: 100%
    max-width: 1600px

  container
    padding: 0 30px
    height: 100vh
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: flex-start
    align-items: stretch

  headerContainer
    position: fixed
    max-width: 1600px
    min-width: 1020px
    width: 100%
    padding: 0 30px
    background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(255,255,255,0.8) 70%,rgba(255,255,255,0) 100%)
    z-index: 1

  left
    min-height: 100%
    min-width: 270px
    margin: 0 30px 0 0

  mainLeftContent
    flex: 1
    min-height: 100%
    display: flex
    flex-direction: column
    padding: 113px 0 0 0
    position: fixed

  leftTop
    min-width: 270px
    flex: 1

  right
    padding: 118px 0 0 0
    flex: 1
    order: 2

  button
    width: 100%
    margin-bottom: 6px

  icon
    width: 20px
    font-size: 17px
    line-height: 24px
    display: block
    float: left
    user-select: none

  footnote
    text-align: right
    font-style: italic
    color: rgba(0,0,0,0.5)
    user-select: none

  addSection
    cursor: pointer
    user-select: none
    display: flex
    flex-direction: row
    margin: 2px 0 30px 0
    padding: 1px 0
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
    line-height: 40px
    margin: 0 20px 0 23px

  addSectionText
    font-weight: bold
    font-size: 11px
    text-transform: uppercase
    letter-spacing: 0.5px
    line-height: 40px

  clearfix
    clear: both
`;
