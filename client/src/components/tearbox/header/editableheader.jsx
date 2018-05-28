import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import {Logo, Icon, Button} from '../../common';

@Radium
class EditableHeader extends React.Component {
  render() {
    const {style} = this.props;
    return (
      <div style={[styles.container, styles.header, style]}>
        <div style={styles.left}>
          <Logo style={styles.logo}/>
        </div>
        <div style={[styles.right, styles.headerRight]}>
          <div style={styles.buttonGroup}>
            <Button style={styles.button}>
              Cancel
            </Button>
            <Button style={styles.button}
                    isSubmit={true}
                    key='tearboxSaveButton'>
              Save
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditableHeader);

const styles = styler`
  container
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: flex-start
    align-items: stretch
    padding: 10px 30px 0

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
    padding-top: 32px

  logo
    width: 141px
    height: 73px
    margin-left: -12px

  icon
    float: left

  buttonGroup
    float: right
    display: flex
    flex-direction: row
    align-items: flex-start

  button
    padding: 6px 16px
    margin-left: 6px

  clearfix
    clear: both
`;
