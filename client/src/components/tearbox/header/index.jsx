import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import Logo from '../../common/logo';
import Search from './search';

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
          <button style={styles.filterButton}>
            <i style={styles.icon} className='material-icons'>
              filter_list
            </i>
            <div style={styles.filterLabel}>
              Filter
            </div>
            <div style={styles.clearfix}/>
          </button>
          <button style={styles.optionsButton}>
            <i style={styles.icon} className='material-icons'>
              more_horiz
            </i>
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
    min-width: 220px
    flex-basis: 220px
    margin: 0 40px 0 0
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
    padding: 4px 10px 0 0
    float: left

  icon
    width: 20px
    font-size: 17px
    line-height: 24px
    display: block
    float: left
    user-select: none

  filterButton
    user-select: none
    border: 0
    margin-left: 20px
    padding: 4px 10px
    line-height: 24px
    float: left

  filterLabel
    float: left
    margin-left: 5px
    margin-right: 10px

  optionsButton
    border: 0
    margin-left: 20px
    padding: 4px 10px
    line-height: 24px
    float: right
`;
