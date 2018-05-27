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
} from '../../redux/actions';

@Radium
class EditableTearbox extends React.Component {
  componentDidMount() {
    const {boxStatus, fetchBoxFn} = this.props;
    if (boxStatus !== RECEIVED) {
      fetchBoxFn();
    }
  }

  render() {
    const {
      tears,
      box,
      groupVisibilities,
      toggleGroupFn,
    } = this.props;
    return (
      <div style={styles.tearbox}>
        <div style={styles.tearboxContainer}>
          <EditableHeader/>
          <div style={[styles.container, styles.main]}>

            <div style={[styles.left, styles.mainLeft]}>
              <div style={styles.mainLeftContent}>
                <InfoBox/>
              </div>
              <Footer/>
            </div>

            <div style={styles.right}>
              {(box.groupDisplays || []).map((group, i) => 
                <EditableSection title={group.label}
                         key={i}
                         visible={groupVisibilities[i]}
                         onToggle={() => toggleGroupFn(i)}>
                  <EditableItemTable items={group.items}/>
                </EditableSection>
              )}
              <div style={styles.addSection} tabIndex={0}>
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
    tearsStatus: ui.tearsStatus,
    tears,
    boxStatus: ui.boxStatus,
    box: box.data,
    groupVisibilities: ui.groupVisibilities,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadTearsFn: () => dispatch(loadTears()),
    fetchBoxFn: () => dispatch(fetchBox()),
    toggleGroupFn: idx => dispatch(toggleGroup(idx)),
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
    padding: 0 30px
    display: flex
    flex-direction: column
    flex: 1

  container
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: flex-start
    align-items: stretch

  main
    flex: 1

  mainLeft
    display: flex
    flex-direction: column

  mainLeftContent
    flex: 1

  left
    min-width: 270px
    flex-basis: 270px
    margin: 0 30px 0 0
    order: 1

  right
    margin-top: 5px
    flex-grow: 1
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
    margin: 2px 0
    padding: 1px 0
    border: 2px dashed rgba(55,67,79,0.15)
    border-radius: 3px
    color: rgba(55,67,79,0.5)

    :hover, :focus
      outline: none
      border: 2px dashed rgba(180,40,36,0.2)
      color: rgba(217,52,35,1)
      background: rgba(180,40,36,0.05)

    :active
      background: rgba(180,40,36,0.2)

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
