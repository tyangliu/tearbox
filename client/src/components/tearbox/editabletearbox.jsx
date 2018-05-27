import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import {EditableHeader} from './header';
import InfoBox from './infobox';
import {EditableItemTable} from './itemtable';
import Section from './section';
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
                <Section title={group.label}
                         key={i}
                         visible={groupVisibilities[i]}
                         onToggle={() => toggleGroupFn(i)}>
                  <EditableItemTable items={group.items}/>
                </Section>
              )}
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
    padding: 10px 0

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

  clearfix
    clear: both
`;
