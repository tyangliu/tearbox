import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import {Logo, Button, Icon} from '../../common';
import Search from './search';
import FilterMenu from './filtermenu';

import {modalKey as newBoxKey} from '../../modals/newbox';
import {modalKey as editBoxKey} from '../../modals/editbox';

import {openModal} from '../../../redux/actions';

@Radium
class Header extends React.Component {
  render() {
    const {ownBoxId, openModalFn} = this.props;
    return (
      <div style={[styles.container, styles.header]}>
        <div style={styles.left}>
          <Logo style={styles.logo}/>
        </div>
        <div style={[styles.right, styles.headerRight]}>
          <Search style={styles.search}/>
          <FilterMenu style={styles.filterMenu}/>
          <div style={styles.buttonContainer}>
            <Button
              icon='edit'
              style={styles.button}
              key='editboxbutton'
              onClick={() => openModalFn(editBoxKey)}
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
          <div style={styles.clearfix}/>
        </div>
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
    openModalFn: key => dispatch(openModal(key)),
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

  left
    min-width: 300px
    flex-basis: 300px
    margin: 0 30px 0 0
    order: 1

  right
    flex-grow: 1
    order: 2

  header:
    margin-bottom: 20px

  headerRight
    padding-top: 32px

  logo
    width: 141px
    height: 73px
    margin-left: -12px

  search
    padding: 4px 4px 4px 0
    margin-top: 4px
    float: left

  icon
    float: left

  filterMenu
    float: left
    margin-top: 4px

  buttonContainer
    float: right

  button
    padding: 6px 20px 6px 11px
    display: inline-block
    margin-left: 6px

  clearfix
    clear: both
`;
