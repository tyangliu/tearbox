import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import debounce from 'lodash.debounce';

import {search} from '../../../redux/actions';

@Radium
class Search extends React.Component {
  state = {
    searchTermOptimistic: '',
  };

  onChange = e => {
    const {searchFn} = this.props;
    const term = e.target.value;
    searchFn(term);
    this.setState({searchTermOptimistic: term});
  };

  render() {
    const {searchTerm, searchFn, style} = this.props;
    const {searchTermOptimistic} = this.state;
    return (
      <div style={[styles.searchBox, style]}>
        <i style={[styles.icon, styles.searchIcon]} className='material-icons'>
          search
        </i>
        <input type='text'
               style={styles.searchInput}
               value={searchTermOptimistic}
               placeholder="Search"
               onChange={this.onChange}/>
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
    margin-top: 1px
    line-height: 23px

  icon
    width: 20px
    font-size: 17px
    line-height: 24px
    display: block
    float: left
    user-select: none

  searchInput
    margin-left: 8px
    line-height: 24px
    float: left
    width: 340px
    outline: none
    padding: 0
`;
