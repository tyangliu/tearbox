import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import capitalize from 'lodash.capitalize';

import {Header} from './header';
import {Button} from '../common';
import InfoBox from './infobox';
import {ItemTable} from './itemtable';
import Section from './section';
import NewBoxModal from '../modals/newbox';
import EditBoxModal from '../modals/editbox';
import Footer from './footer';
import NotFound from '../errors/NotFound';

import {
  loadTears,
  requestGetBox,
  toggleGroup,
  openModal,
  setOwnBoxId,
} from '../../redux/actions';

import {
  UNAVAILABLE,
  REQUESTED,
  RECEIVED,
  NOT_FOUND,

  PREV_BOX_ID_KEY,

  groupTypeLabels,
} from '../../redux/constants';

@Radium
class Tearbox extends React.Component {
  refreshBox = () => {
    const {boxStatus, requestGetBoxFn, match} = this.props;
    requestGetBoxFn(match.params.id);
  };

  constructor(props) {
    super(props);
    const {setOwnBoxIdFn} = this.props;
    this.refreshBox();

    if (!localStorage) {
      return;
    }

    const existingBoxId = localStorage.getItem(PREV_BOX_ID_KEY);
    if (!existingBoxId) {
      return;
    }
    setOwnBoxIdFn(existingBoxId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.refreshBox();
    }
  }

  render() {
    const {
      tears,
      box,
      boxStatus,
      groupVisibilities,
      ownBoxId,
      toggleGroupFn,
      openModalFn,
    } = this.props;

    if (boxStatus === NOT_FOUND) {
      return <NotFound/>;
    }
    // TODO: loading component 
    if (!box.id) {
      return <div/>;
    }

    return (
      <div style={styles.tearbox}>
        <div style={styles.tearboxContainer}>
          <div style={styles.headerContainer}>
            <Header
              ownBoxId={ownBoxId}
            />
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
              {(box.groupDisplays || []).map((group, i) => 
                <Section
                  title={
                    <span style={styles.sectionTitle} key={`sectionTitle_${group.id}`}>
                      <span style={styles.sectionTitleLabel}>
                        {group.name !== '' ? group.name : groupTypeLabels[group.type]}
                      </span>
                      {group.name !== '' ?
                        <span style={styles.sectionTitleTag} key={`sectionTitleTag_${group.id}`}>
                          {capitalize(groupTypeLabels[group.type])}
                        </span> : null
                      }
                    </span>
                  }
                  key={i}
                  visible={groupVisibilities[i]}
                  onToggle={() => toggleGroupFn(i)}
                >
                  <ItemTable items={group.items}/>
                </Section>
              )}
            </div>
            <div style={styles.clearfix}/>
          </div>
        </div>
        <NewBoxModal/>
        <EditBoxModal/>
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
    box: box.present.data,
    groupVisibilities: ui.groupVisibilities,
    ownBoxId: ui.ownBoxId,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadTearsFn: () => dispatch(loadTears()),
    requestGetBoxFn: id => dispatch(requestGetBox(id)),
    toggleGroupFn: idx => dispatch(toggleGroup(idx)),
    openModalFn: key => dispatch(openModal(key)),
    setOwnBoxIdFn: id => dispatch(setOwnBoxId(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tearbox);

const styles = styler`
  tearbox
    width: 100%
    min-width: 1120px
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    height: 100vh

  tearboxContainer
    width: 100%
    max-width: 1600px
    display: flex
    flex-direction: column
    flex: 1

  headerContainer
    position: sticky
    top: 0
    z-index: 2
    background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(255,255,255,0.9) 80%,rgba(255,255,255,0) 100%)

  container
    padding: 0 30px

  left
    background: rgba(255,255,255,1)
    float: left
    flex-direction: column
    width: 300px
    margin: 0 30px 0 0
    position: sticky
    top: 103px
    z-index: 1

  mainLeftContent
    flex: 1

  leftTop
    padding: 10px 0
    flex: 1

  right
    background: rgba(255,255,255,1)
    overflow: hidden

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

  sectionTitle
    display: flex
    flex-direction: row
    line-height: 19.5px

  sectionTitleLabel
    padding:  4px 10px 4px 0

  sectionTitleTag
    margin: 4px 0
    padding: 0 10px
    border-left: 2px solid rgba(55,67,79,0.25)
    font-style: italic
    font-weight: normal
    text-transform: none
    letter-spacing: 0
    font-size: 16px
    line-height: 20.5px

  clearfix
    clear: both
`;
