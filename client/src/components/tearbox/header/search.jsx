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
               placeholder='Search'
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
  const {searchTerm} = state.box.present.options;
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
    border-bottom: 1px solid rgba(55,67,79,0.2)

  searchIcon
    float: left
    margin-top: 1px
    line-height: 18.5px

  closeButton
    color: rgba(55,67,79,0.7)
    border: 0
    padding: 0 2px
    line-height: 19.5px
    float: right
    margin: 0

    :hover
      color: rgba(217,52,35,1)

    &visible:
      opacity: 1
      pointer-events: auto

    &hidden:
      opacity: 0
      pointer-events: none

  closeIcon
    margin-top: 1px
    font-size: 16px

  searchInput
    margin-left: 10px
    line-height: 19.5px
    float: left
    width: 220px
    outline: none
    padding: 0
`;
