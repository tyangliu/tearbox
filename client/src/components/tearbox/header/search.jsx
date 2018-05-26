import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import debounce from 'lodash.debounce';

import {search} from '../../../redux/actions';
import Icon from '../../common/icon';

@Radium
class Search extends React.Component {
  state = {
    searchTermOptimistic: '',
  };

  updateTerm = term => {
    const {searchFn} = this.props;
    searchFn(term);
    this.setState({searchTermOptimistic: term});
  };

  render() {
    const {searchTerm, searchFn, style} = this.props;
    const {searchTermOptimistic} = this.state;
    const showClose = searchTermOptimistic.length > 0;
    return (
      <div style={[styles.searchBox, style]}>
        <Icon name='search' style={styles.searchIcon}/>
        <input type='text'
               style={styles.searchInput}
               value={searchTermOptimistic}
               maxLength={32}
               placeholder="Search"
               onChange={e => this.updateTerm(e.target.value)}/>
        <button style={styles.closeButton[showClose ? 'visible' : 'hidden']}
                onClick={() => this.updateTerm('')}>
          <Icon name='close' style={styles.closeIcon}/>
        </button>
        <div style={styles.clearfix}/>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {searchTerm} = state.box.options;
  return {
    searchTerm,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    searchFn: debounce(term => dispatch(search(term)), 200),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);

const styles = styler`
  searchBox
    border-bottom: 1px solid rgba(0,0,0,0.15)

  searchIcon
    float: left
    margin-top: 1px
    line-height: 21px

  closeButton
    border: 0
    padding: 0 2px
    float: right
    margin: 0

    &visible:
      opacity: 1
      pointer-events: auto

    &hidden:
      opacity: 0
      pointer-events: none

  closeIcon
    margin-top: 1px
    line-height: 21px
    font-size: 13px

  searchInput
    margin-left: 10px
    line-height: 22px
    float: left
    width: 220px
    outline: none
    padding: 0
`;
