import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import styler from 'react-styling';
import {ActionCreators} from 'redux-undo';
import ReactTooltip from 'react-tooltip';

import {Logo, Icon, Button} from '../../common';
import {cancelEdit, requestPatchBox} from '../../../redux/actions';

const leaveMessage = 'Leave with unsaved changes?';

@Radium
class EditableHeader extends React.Component {
  componentDidUpdate() {
    const {isDirty} = this.props;
    window.onbeforeunload = isDirty && (() => leaveMessage);
  }

  componentWillUnmount() {
    window.onbeforeunload = null;
  }

  confirmCancel = () => {
    const {isDirty} = this.props;
    if (!isDirty) {
      return true;
    }
    return confirm(leaveMessage);
  }

  onCancel = () => {
    const {id, cancelEditFn} = this.props;
    if (this.confirmCancel()) {
      cancelEditFn(id);
      window.onbeforeunload = null;
    }
  };

  onNavHome = () => {
    const {goToFn} = this.props;
    if (this.confirmCancel()) {
      goToFn('/');
    }
  };

  onSave = () => {
    const {requestPatchBoxFn} = this.props;
    requestPatchBoxFn();
    window.onbeforeunload = null;
  };

  render() {
    const {
      id,
      style,
      cancelEditFn,
      requestPatchBoxFn,
      canRedo,
      canUndo,
      undoFn,
      redoFn,
    } = this.props;

    return (
      <div style={[styles.container, styles.header, style]}>
        <div style={styles.left}>
          <Logo
            shouldLink={false}
            style={styles.logo}
            onClick={this.onNavHome}
          />
        </div>
        <div style={[styles.right, styles.headerRight]}>
          <div style={styles.controlContainer}>
            <div style={styles.controlGroup.last}>
              <button
                data-tip='React-tooltip'
                data-for='undoButton'
                style={styles.controlButton[canUndo ? 'normal' : 'disabled']}
                onClick={canUndo ? undoFn : undefined}
                key='editableheaderUndoButton'
              >
                <Icon name='undo' style={styles.icon}/>
              </button>
              <button
                data-tip='React-tooltip'
                data-for='redoButton'
                style={styles.controlButton[canRedo ? 'normal' : 'disabled']}
                onClick={canRedo ? redoFn : undefined}
                key='editableheaderRedoButton'
              >
                <Icon name='redo' style={styles.icon}/>
              </button>
            </div>
            <ReactTooltip
              class='tooltip'
              place='bottom'
              id='undoButton'
              effect='solid'
            >
              Undo (Ctrl+Z)
            </ReactTooltip>
            <ReactTooltip
              class='tooltip'
              place='bottom'
              id='redoButton'
              effect='solid'
            >
              Redo (Ctrl+Y)
            </ReactTooltip>
          </div>
          <div style={styles.buttonContainer}>
            <Button
              style={styles.button}
              onClick={this.onCancel}
            >
              Cancel
            </Button>
            <Button
              style={styles.button}
              isSubmit={true}
              key='tearboxSaveButton'
              onClick={this.onSave}
            >
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
  const {past, present, future} = state.box;
  return {
    id: present.data.id,
    isDirty: present.stagingData.isDirty,
    canRedo: future.length > 0,
    canUndo: past.length > 0,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    cancelEditFn: id => dispatch(cancelEdit(id)),
    requestPatchBoxFn: () => dispatch(requestPatchBox()),
    undoFn: () => dispatch(ActionCreators.undo()),
    redoFn: () => dispatch(ActionCreators.redo()),
    goToFn: url => dispatch(push(url)),
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
    min-width: 300px
    flex-basis: 300px
    margin: 0 30px 0 0
    order: 1

  right
    display: flex
    flex-direction: row
    flex-grow: 1
    order: 2

  header:
    margin-bottom: 20px

  headerRight
    padding-top: 31px

  logo
    width: 141px
    height: 73px
    margin-left: -12px

  controlContainer
    display: flex
    flex-direction: row
    padding: 2px 0
    flex: 1

  controlGroup
    margin: 0 8px 6px 0
    padding: 0 8px 0 0

    &normal
      border-right: 1px solid rgba(55,67,79,0.2)

    &last  

  icon
    float: left

  controlButton
    user-select: none
    border: none
    padding: 6px 3px
    margin-right: 6px
    line-height: 19.5px

    &normal
      cursor: pointer

      :hover
        color: rgba(217,52,35,1)

    &disabled
      color: rgba(55,67,79,0.4)

  buttonLabel
    float: left
    margin-left: 5px
    margin-right: 10px

  button
    display: inline-block
    padding: 6px 16px
    margin-left: 6px 

  clearfix
    clear: both
`;
