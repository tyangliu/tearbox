import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import {Logo, Icon} from '../../common';
import Search from './search';
import FilterMenu from './filtermenu';

@Radium
class Header extends React.Component {
  render() {
    return (
      <div style={[styles.container, styles.header]}>
        <div style={styles.left}>
          <Logo style={styles.logo}/>
        </div>
        <div style={[styles.right, styles.headerRight]}>
          <Search style={styles.search}/>
          <FilterMenu style={styles.filterMenu}/>
          <button style={styles.optionsButton}>
            <Icon name='more_horiz' style={styles.icon}/>
            <div style={styles.clearfix}/>
          </button>
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
    padding: 10px 0

  left
    min-width: 270px
    flex-basis: 270px
    margin: 0 30px 0 0
    order: 1

  right
    flex-grow: 1
    order: 2

  header:
    margin-bottom: 20px

  headerRight
    padding-top: 36px

  logo
    width: 141px
    height: 73px
    margin-left: -12px

  search
    padding: 4px 4px 4px 0
    float: left

  icon
    float: left

  filterMenu
    float: left

  optionsButton
    border: 0
    margin-left: 20px
    padding: 4px 4px
    float: right

  clearfix
    clear: both
`;
