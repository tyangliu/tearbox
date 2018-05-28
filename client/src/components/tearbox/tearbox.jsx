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
import NewBoxModal, {modalKey as newBoxKey} from '../modals/newbox';
import EditBoxModal, {modalKey as editBoxKey} from '../modals/editbox';
import Footer from './footer';

import {
  UNAVAILABLE,
  REQUESTED,
  RECEIVED,

  loadTears,
  fetchBox,
  toggleGroup,
  openModal,
} from '../../redux/actions';

@Radium
class Tearbox extends React.Component {
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
      openModalFn,
    } = this.props;
    return (
      <div style={styles.tearbox}>
        <div style={styles.tearboxContainer}>
          <div style={styles.headerContainer}>
            <Header/>
          </div>
          <div style={styles.container}>
            <div style={styles.left}>
              <div style={styles.mainLeftContent}>
                <div style={styles.leftTop}>
                  <InfoBox/>
                  <Button icon='note_add'
                          style={styles.button}
                          key='newboxbutton'
                          onClick={() => openModalFn(newBoxKey)}>
                    Make your own Box
                  </Button>
                  <Button icon='edit'
                          style={styles.button}
                          key='editboxbutton'
                          onClick={() => openModalFn(editBoxKey)}>
                    Edit this Box
                  </Button>
                  <p style={styles.footnote}>
                    (if you own this box)
                  </p>
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
                        {group.label !== '' ? group.label : group.type.label}
                      </span>
                      {group.label !== '' ?
                        <span style={styles.sectionTitleTag} key={`sectionTitleTag_${group.id}`}>
                          {capitalize(group.type.label)}
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
    box: box.data,
    groupVisibilities: ui.groupVisibilities,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadTearsFn: () => dispatch(loadTears()),
    fetchBoxFn: () => dispatch(fetchBox()),
    toggleGroupFn: idx => dispatch(toggleGroup(idx)),
    openModalFn: key => dispatch(openModal(key)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tearbox);

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
    width: 270px
    margin: 0 30px 0 0
    position: sticky
    top: 103px
    z-index: 1

  mainLeftContent
    flex: 1

  leftTop
    padding: 10px 0
    min-width: 270px
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

  footnote
    text-align: right
    font-style: italic
    color: rgba(0,0,0,0.5)
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
