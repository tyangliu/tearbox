import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import debounce from 'lodash.debounce';

import {
  SelectBox,
  Button,
  Modal,
  Checkbox,
} from '../common';

import {
  closeModal,
  editFormField,
  requestPostBox,
} from '../../redux/actions';

const serverChoices = [
  {label: 'Solace', value: 'Solace'},
  {label: 'Gaia', value: 'Gaia'},
];

const contactFields = [
  {label: 'IGNs', key: 'igns', required: true},
  {label: 'Discord', key: 'discord', required: false},
  {label: 'Forum', key: 'forum', required: false},
  {label: 'Other', key: 'other', required: false},
];

export const modalKey = 'newBox';

@Radium
class NewBoxModal extends React.Component {
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
      requestPostBoxFn,
    } = this.props;

    return (
      <Modal visible={visible} onClose={closeModalFn}>
        <div style={styles.container}>
          <div style={styles.headingContainer}>
            <div style={styles.modalHeadingImage}/>
            <h2 style={styles.modalHeading}>
              New Box
            </h2>
            <div style={styles.clearfix}/>
          </div>
          <div style={styles.innerContainer}>
            <div style={styles.left}>
              <div style={styles.form}>
                <div style={styles.name}>
                  <input
                    type='text'
                    style={[
                      styles.input[formErrors.name ? 'error' : 'normal'],
                      styles.nameInput,
                    ]}
                    maxLength={20}
                    placeholder='Your name'
                    defaultValue={form.name}
                    onChange={e => editFormFieldFn('name', e.target.value)}
                    ref={el => {this.firstInput = el;}}
                  />
                  <span style={styles.nameText}>
                    &#8217;s Box
                  </span>
                </div>
                {formErrors.name
                  ? <div style={styles.inputError}>
                      {formErrors.name}
                    </div>
                  : null
                }
                <ul style={styles.contactFields}>
                  {/* Server Select */}
                  <li style={styles.contactField}>
                    <span style={styles.contactFieldLabel}>
                      Server
                      <span style={styles.required}>*</span>
                    </span>
                    <SelectBox
                      style={styles.contactFieldSelect}
                      value={{label: form.server, value: form.server}}
                      options={serverChoices}
                      onChange={({label, value}) =>
                        editFormFieldFn('server', value)
                      }
                    />
                    <div style={styles.clearfix}/>
                  </li>
                  {/* Contact Textfields */}
                  {contactFields.map(({label, key, required}) => [
                    <li
                      style={styles.contactField}
                      key={'contactField_' + key}
                    >
                      <span style={styles.contactFieldLabel}>
                        {label}
                        {required
                          ? <span style={styles.required}>*</span>
                          : null}
                      </span>
                      <input
                        type='text'
                        style={[
                          styles.input[formErrors[key] ? 'error' : 'normal'],
                          styles.contactFieldInput,
                        ]}
                        maxLength={80}
                        placeholder=''
                        defaultValue={form[key]}
                        onChange={e => editFormFieldFn(key, e.target.value)}
                      />
                      <div style={styles.clearfix}/>
                    </li>, 
                    formErrors[key]
                      ? <div style={styles.inputError}>
                          {formErrors[key]}
                        </div>
                      : null,
                  ])}
                </ul>
              </div>
            </div>
            <div style={styles.right}>
              {/* Passcode */}
              <div style={styles.section}>
                <h3 style={styles.sectionHeading}>
                  Passcode
                  <span style={styles.required}>*</span>
                </h3>
                <p style={styles.sectionCaption}>
                  You'll need this to edit your box later.
                </p>
                <input
                  type='password'
                  style={[
                    styles.input[formErrors.passcode ? 'error' : 'normal'],
                    styles.sectionInput,
                  ]}
                  maxLength={32}
                  placeholder='Create a passcode (6 or longer)'
                  defaultValue={form.passcode}
                  onChange={e => editFormFieldFn('passcode', e.target.value)}
                />                
                {formErrors.passcode
                  ? <div style={styles.inputError}>
                      {formErrors.passcode}
                    </div>
                  : null
                }
                <input
                  type='password'
                  style={[
                    styles.input[formErrors.passcodeReenter ? 'error' : 'normal'],
                    styles.sectionInput,
                  ]}
                  maxLength={32}
                  placeholder='Re-enter passcode'
                  defaultValue={form.passcodeReenter}
                  onChange={e => editFormFieldFn('passcodeReenter', e.target.value)}
                />
                {formErrors.passcodeReenter
                  ? <div style={styles.inputError}>
                      {formErrors.passcodeReenter}
                    </div>
                  : null
                }
              </div>
              {/* Email */}
              <div style={styles.section}>
                <h3 style={styles.sectionHeading}>
                  Email
                </h3>
                <p style={styles.sectionCaption}>
                  Optional&mdash;In case you forget your passcode or box link.
                </p>
                <input
                  type='email'
                  style={[
                    styles.input[formErrors.email ? 'error' : 'normal'],
                    styles.sectionInput
                  ]}
                  maxLength={32}
                  placeholder='Email Address'
                  defaultValue={form.email}
                  onChange={e => editFormFieldFn('email', e.target.value)}
                />
                {formErrors.email
                  ? <div style={styles.inputError}>
                      {formErrors.email}
                    </div>
                  : null
                }
              </div>
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
            onClick={requestPostBoxFn}
          >
            Create
          </Button>
          {/* Remember Me */}
          <Checkbox
            label='Remember my Box'
            style={styles.checkbox}
            checked={form.rememberMe}
            onChange={() => editFormFieldFn('rememberMe', !form.rememberMe)}
          />
          <p style={styles.footnote}>
            <span style={styles.required}>*</span>
            Required
          </p>
          <div style={styles.clearfix}/>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {modalVisibilities} = state.ui.present;
  const {newBox, newBoxErrors, newBoxErrorMessage} = state.forms;
  return {
    visible: modalVisibilities[modalKey],
    form: newBox,
    formErrors: newBoxErrors,
    errorMessage: newBoxErrorMessage,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeModalFn: () => dispatch(closeModal(modalKey)),    
    editFormFieldFn: debounce((field, value) =>
      dispatch(editFormField(modalKey, field, value)), 100),
    requestPostBoxFn: () => dispatch(requestPostBox()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewBoxModal);

const styles = styler`
  container
    padding: 34px 24px 22px

  innerContainer
    display: flex
    flex-direction: row
    align-items: flex-start
    margin-bottom: 13px

    @media (max-width: 700px)
      display: block

  left
    flex-basis: 50%
    padding-right: 15px

    @media (max-width: 700px)
      display: block
      padding-right: 0

  right
    flex: 1
    padding-left: 15px

    @media (max-width: 700px)
      display: block
      padding-left: 0

  headingContainer
    margin-bottom: 16px

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

  name
    font-size: 21px
    line-height: 19.5px
    font-weight: bold
    font-style: italic
    margin-bottom: 12px
    display: flex
    flex-direction: row
    align-items: flex-start
    position: relative

  input
    &normal
      border-bottom: 1px solid rgba(55,67,79,0.2)

    &error
      border-bottom: 1px solid rgba(217,52,35,1)

  errorMessage
    text-align: right
    margin-bottom: 20px
    color: rgba(217,52,35,1)
    font-style: italic

  inputError
    display: block
    text-align: right
    font-size: 13px
    font-weight: normal
    font-style: italic
    color: rgba(217,52,35,1)
    margin-bottom: 13px

  nameInput
    min-width: 0
    font-style: italic
    font-weight: bold
    outline: none
    color: inherit

  nameText
    display: block
    line-height: 1em
    flex-shrink: 0
    margin-top: 7px

  contactFields
    margin-bottom: 28px

  contactField
    display: flex
    flex-direction: row
    margin-bottom: 5px

  contactFieldLabel
    width: 80px
    margin-top: 5px
    display: block
    float: left
    font-style: italic
    color: rgba(55,67,79,0.65)

    @media (max-width: 700px)
      width: 60px

  contactFieldSelect
    flex: 1

  contactFieldInput
    min-width: 0
    flex: 1
    padding: 4px 0
    outline: none

  section
    margin-bottom: 22px

  sectionHeading
    font-weight: bold
    text-transform: uppercase
    letter-spacing: 0.6px

  sectionCaption
    font-size: 11px
    line-height: 1.5em
    font-style: italic
    color: rgba(55,67,79,0.65)
    margin-bottom: 12.5px

  sectionInput
    min-width: 0
    width: 100%
    padding: 4px 0
    outline: none
    margin-bottom: 5px

  footnote
    color: rgba(55,67,79,0.65)
    padding: 7px 0
    font-style: italic

    @media (max-width: 700px)
      display: none

  required
    color: rgba(217,52,35,1)
    font-style: normal
    font-weight: normal

  checkbox
    float: right
    text-align: right
    padding: 8px
    margin-right: 20px

    @media (max-width: 700px)
      margin-right: 10px

  submitButton
    float: right
    padding: 6px 16px

  clearfix
    clear: both
`;

