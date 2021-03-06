import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import DocumentTitle from 'react-document-title';
import capitalize from 'lodash.capitalize';

import {Header} from './header';
import Search from './header/search';
import FilterMenu from './header/filtermenu';
import {Button} from '../common';
import InfoBox from './infobox';
import {ItemTable} from './itemtable';
import Section from './section';
import NewBoxModal from '../modals/newbox';
import EditBoxModal from '../modals/editbox';
import Footer from './footer';
import NotFound from '../errors/NotFound';
import Empty from './empty';

import {
  loadTears,
  requestGetBox,
  toggleGroup,
  openModal,
} from '../../redux/actions';

import {
  UNAVAILABLE,
  REQUESTED,
  RECEIVED,
  NOT_FOUND,

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
    const {
      boxStatus,
      box,
      match,
    } = this.props;

    if (boxStatus !== RECEIVED || box.id !== match.params.id) {
      this.refreshBox();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.refreshBox();
    }
  }

  render() {
    const {
      box,
      boxStatus,
      groupVisibilities,
      ownBoxId,
      toggleGroupFn,
      openModalFn,
    } = this.props;

    if (boxStatus === NOT_FOUND) {
      return (
        <DocumentTitle title='Not Found - Tearbox'>
          <NotFound/>
        </DocumentTitle>
      );
    }

    const title = box.name ? `${box.name}'s Box - Tearbox` : 'Tearbox';

    // TODO: loading component 
    if (!box.id) {
      return (
        <DocumentTitle title={title}>
          <div/>
        </DocumentTitle>
      );
    }

    const inner = box.groupDisplays.length === 0
      ? <Empty style={styles.empty}/>
      : (box.groupDisplays || []).map((group, i) => 
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
        ); 

    return (
      <DocumentTitle title={title}>
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
                  <Footer style={styles.footer}/>
                </div>
              </div>

              <div style={styles.right}> 
                <div style={styles.controlContainer}>
                  <Search style={styles.search}/>
                  <FilterMenu style={styles.filterMenu}/>
                </div>
                {inner}
              </div>
              <div style={styles.clearfix}/>
            </div>
          </div>
          <Footer style={styles.footerMid}/>
          <NewBoxModal/>
          <EditBoxModal/>
        </div>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {ui, tears, box} = state;
  return {
    boxStatus: ui.present.boxStatus,
    box: box.present.data,
    groupVisibilities: ui.present.groupVisibilities,
    ownBoxId: ui.present.ownBoxId,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadTearsFn: () => dispatch(loadTears()),
    requestGetBoxFn: id => dispatch(requestGetBox(id)),
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

  tearboxContainer
    width: 100%
    max-width: 1600px
    margin: 0 auto

  headerContainer
    position: sticky
    top: 0
    z-index: 2
    background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(255,255,255,0.9) 80%,rgba(255,255,255,0) 100%)

  container
    padding: 0 30px

    @media (max-width: 700px)
      display: flex
      flex-direction: column
      padding: 0 20px

  left
    background: rgba(255,255,255,1)
    float: left
    width: 300px
    margin: 0 30px 0 0
    position: sticky
    top: 103px
    z-index: 1

    @media (max-width: 1120px)
      margin: 0 0 30px 0
      border-top: 1px solid rgba(55,67,79,0.2)
      border-bottom: 1px solid rgba(55,67,79,0.2)
      width: auto
      float: none
      flex: 1
      position: static

  mainLeftContent
    flex: 1

  leftTop
    padding: 10px 0
    flex: 1

  right
    background: rgba(255,255,255,1)
    overflow: hidden
    margin-bottom: 60px

    @media (max-width: 1120px)
      overflow: visible

  controlContainer
    display: none

    @media (max-width: 1120px)
      display: flex
      margin: 10px 0 30px

  search
    padding: 6px 6px 4px 0
    display: inline-block
    flex: 1

  filterMenu
    display: inline-block

  footer
    @media (max-width: 1120px)
      display: none

  footerMid
    display: none

    @media (max-width: 1120px)
      border-top: 1px solid rgba(55,67,79,0.2)
      display: block

    @media (min-width: 700px) and (max-width: 1120px)
      padding: 30px

    @media (max-width: 700px)
      padding: 20px

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

    @media (max-width: 700px)
      display: block

  sectionTitleLabel
    display: block
    padding:  4px 10px 4px 0

  sectionTitleTag
    display: block
    margin: 4px 0
    padding: 0 10px
    border-left: 2px solid rgba(55,67,79,0.25)
    font-style: italic
    font-weight: normal
    text-transform: none
    letter-spacing: 0
    font-size: 16px
    line-height: 20.5px

    @media (max-width: 700px)
      padding: 0
      border-left: none

  clearfix
    clear: both
`;
