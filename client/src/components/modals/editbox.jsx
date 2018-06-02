import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import debounce from 'lodash.debounce';

import {Button, Modal, Checkbox} from '../common';
import {closeModal, editFormField, requestPostBoxAuth} from '../../redux/actions';

export const modalKey = 'editBox';

class EditBoxModal extends React.Component {
  componentDidUpdate(prevProps) {
    const {visible} = this.props;
    if (!prevProps.visible && visible) {
      this.firstInput && this.firstInput.focus();
    }
  }

  render() {
    const {
      visible,
      form,
      formErrors,
      errorMessage,
      closeModalFn,
      editFormFieldFn,
      requestPostBoxAuthFn,
    } = this.props;

    return (
      <Modal visible={visible} onClose={closeModalFn}> 
        <div style={styles.container}>
          <div style={styles.headingContainer}>
            <div style={styles.modalHeadingImage}/>
            <h2 style={styles.modalHeading}>
              Edit Box
            </h2>
            <div style={styles.clearfix}/>
          </div>
          <div style={styles.innerContainer}>
            <div style={styles.section}>
              <h3 style={styles.sectionHeading}>
                Enter Your Box Passcode
              </h3>
              <input
                type='password'
                style={[
                  styles.input[formErrors.passcode ? 'error' : 'normal'],
                  styles.sectionInput,
                ]}
                maxLength={32}
                placeholder='Passcode'
                defaultValue={form.passcode}
                onChange={e => editFormFieldFn('passcode', e.target.value)}
                ref={el => {this.firstInput = el;}}
              />
                {formErrors.passcode
                  ? <div style={styles.errorMessage}>
                      {formErrors.passcode}
                    </div>
                  : null
                }
            </div>
          </div>
          {errorMessage
            ? <div style={styles.errorMessage}>
                {errorMessage}
              </div>
            : null
          }
          <Button
            style={styles.submitButton}
            isSubmit={true}
            onClick={requestPostBoxAuthFn}
          >
            Submit
          </Button>
          {/* Remember Me */}
          <Checkbox
            label='Remember my Box'
            style={styles.checkbox}
            checked={form.rememberMe}
            onChange={() => editFormFieldFn('rememberMe', !form.rememberMe)}
          />
          <div style={styles.clearfix}/>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {modalVisibilities} = state.ui.present;
  const {editBox, editBoxErrors, editBoxErrorMessage} = state.forms;
  return {
    visible: modalVisibilities[modalKey],
    form: editBox,
    formErrors: editBoxErrors,
    errorMessage: editBoxErrorMessage,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeModalFn: () => dispatch(closeModal(modalKey)),
    editFormFieldFn: debounce((field, value) =>
      dispatch(editFormField(modalKey, field, value)), 100), 
    requestPostBoxAuthFn: () => dispatch(requestPostBoxAuth()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditBoxModal);

const styles = styler`
  container
    width: 360px
    padding: 34px 24px 22px

  headingContainer
    margin-bottom: 16px

  innerContainer
    display: flex
    flex-direction: row
    align-items: flex-start
    margin-bottom: 13px

  modalHeading
    float: left
    font-size: 19px
    font-style: normal
    text-transform: uppercase
    letter-spacing: 1px

  modalHeadingImage
    float: left
    width: 46px
    height: 46px
    margin-right: 6px
    background-image: url("${require('../../images/tearbox_new.svg')}")
    background-repeat: no-repeat
    background-size: contain
    margin-top: -10px
    margin-left: -6px

  section
    flex: 1
    margin-bottom: 18px

  sectionHeading
    font-weight: bold
    text-transform: uppercase
    letter-spacing: 0.6px
    margin-bottom: 12.5px

  sectionCaption
    font-size: 11px
    line-height: 1.5em
    font-style: italic
    color: rgba(55,67,79,0.65)
    margin-bottom: 12.5px

  input
    &normal
      border-bottom: 1px solid rgba(55,67,79,0.2)

    &error
      border-bottom: 1px solid rgba(217,52,35,1)

  sectionInput
    width: 100%
    padding: 4px 0
    outline: none
    margin-bottom: 5px

  errorMessage
    text-align: right
    margin-bottom: 20px
    color: rgba(217,52,35,1)
    font-style: italic

  checkbox
    float: right
    text-align: right
    padding: 8px
    margin-right: 20px

  submitButton
    float: right
    padding: 6px 16px

  clearfix
    clear: both
`;
