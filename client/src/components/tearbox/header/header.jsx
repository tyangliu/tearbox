import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import {replace} from 'react-router-redux';
import styler from 'react-styling';

import localMap from '../../../localMap';
import {Logo, Button, Icon} from '../../common';
import Search from './search';
import FilterMenu from './filtermenu';

import {modalKey as newBoxKey} from '../../modals/newbox';
import {modalKey as editBoxKey} from '../../modals/editbox';
import {openModal} from '../../../redux/actions';
import {PREV_BOX_TOKEN_KEY} from '../../../redux/constants';

@Radium
class Header extends React.Component {
  handleEditClick = () => {
    const {
      id,
      ownBoxId,
      openModalFn,
      goToFn,
    } = this.props;
    const token = localMap.get(PREV_BOX_TOKEN_KEY);
    
    if (id && ownBoxId === id && token) {
      goToFn(`/box/${id}/edit`);
    } else {
      openModalFn(editBoxKey);
    }
  };

  render() {
    const {ownBoxId, openModalFn} = this.props;
    return (
      <div style={[styles.container, styles.header]}>
        <div style={styles.left}>
          <Logo style={styles.logo}/>
        </div>
        <div style={[styles.right, styles.headerRight]}>
          <div style={styles.controlContainer}>
            <Search style={styles.search}/>
            <FilterMenu style={styles.filterMenu}/>
          </div>
          <div style={styles.buttonContainer}>
            <Button
              icon='edit'
              style={styles.button}
              key='editboxbutton'
              onClick={this.handleEditClick}
            >
              Edit this Box
            </Button>
            <Button
              icon='note_add'
              style={styles.button}
              onClick={() => openModalFn(newBoxKey)}
            >
              {ownBoxId ? 'Make a new Box' : 'Make your own Box'}
            </Button>
          </div>
          <div style={styles.buttonContainerSmall}>
            <Button
              icon='edit'
              style={[styles.button, styles.buttonSmall]}
              key='editboxbutton'
              onClick={this.handleEditClick}
            >
              <span style={styles.buttonSmallText}>
                Edit
              </span>
            </Button>
            <Button
              icon='note_add'
              style={[styles.button, styles.buttonSmall]}
              onClick={() => openModalFn(newBoxKey)}
            >
              <span style={styles.buttonSmallText}>
                New Box
              </span>
            </Button>
          </div>
          <div style={styles.clearfix}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {box, ui} = state;
  return {
    id: box.present.data.id,
    ownBoxId: ui.present.ownBoxId,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openModalFn: key => dispatch(openModal(key)),
    goToFn: url => dispatch(replace(url)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);

const styles = styler`
  container
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: flex-start
    align-items: stretch
    padding: 10px 30px 0

    @media (max-width: 1120px)
      margin-bottom: 30px

    @media (max-width: 700px)
      padding: 10px 20px 0

  left
    min-width: 300px
    flex-basis: 300px
    margin: 0 30px 0 0
    order: 1

    @media (max-width: 1120px)
      min-width: 0
      flex-basis: 0
      flex: 1

  right
    display: flex
    flex-direction: row
    flex: 1
    order: 2

    @media (max-width: 1120px)
      flex: initial

  header:
    margin-bottom: 20px

  headerRight
    padding-top: 31px

  logo
    width: 141px
    height: 73px
    margin-left: -12px

  controlContainer
    padding: 2px 0
    flex: 1

    @media (max-width: 1120px)
      display: none

  search
    padding: 6px 6px 4px 0
    display: inline-block

  filterMenu
    display: inline-block

  buttonContainer
    @media (max-width: 700px)
      display: none

  buttonContainerSmall
    display: none

    @media (max-width: 700px)
      display: block

  button
    display: inline-block
    padding: 6px 20px 6px 11px
    margin-left: 6px

  buttonSmall
    @media (max-width: 440px)
      padding: 6px 0
      border: 0
      margin-left: 16px

      :hover
        background: inherit

      :active
        background: inherit

    @media (max-width: 360px)
      transform: scale(1.5)
      transform-origin: 100% 50%
      margin-right: -6px

  buttonSmallText
    @media (max-width: 360px)
      display: none

  clearfix
    clear: both
`;
