import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import {
  SelectBox,
  Button,
  Modal,
} from '../common';

import {closeModal} from '../../redux/actions';

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
  render() {
    const {visible, closeModalFn} = this.props;
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
                  <input type='text'
                         style={styles.nameInput}
                         maxLength={20}
                         placeholder='Your name'
                         onChange={() => {}}/>
                  <span style={styles.nameText}>
                    &#8217;s Box
                  </span>
                </div>
                <ul style={styles.contactFields}>
                  {/* Server Select */}
                  <li style={styles.contactField}>
                    <span style={styles.contactFieldLabel}>
                      Server
                      <span style={styles.required}>*</span>
                    </span>
                    <SelectBox
                      style={styles.contactFieldSelect}
                      value={serverChoices[0]}
                      options={serverChoices}
                    />
                    <div style={styles.clearfix}/>
                  </li>
                  {/* Contact Textfields */}
                  {contactFields.map(field =>
                    <li style={styles.contactField}
                        key={'contactField_' + field.key}>
                      <span style={styles.contactFieldLabel}>
                        {field.label}
                        {field.required
                          ? <span style={styles.required}>*</span>
                          : null}
                      </span>
                      <input type='text'
                             style={styles.contactFieldInput}
                             maxLength={80}
                             placeholder=''
                             onChange={() => {}}/>
                      <div style={styles.clearfix}/>
                    </li>
                  )}
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
                <input type='password'
                       style={styles.sectionInput}
                       maxLength={32}
                       placeholder='Create a passcode (6 or longer)'
                       onChange={() => {}}/>
                <input type='password'
                       style={styles.sectionInput}
                       maxLength={32}
                       placeholder='Re-enter passcode'
                       onChange={() => {}}/>
              </div>
              {/* Email */}
              <div style={styles.section}>
                <h3 style={styles.sectionHeading}>
                  Email
                </h3>
                <p style={styles.sectionCaption}>
                  Optional&mdash;In case you forget your passcode.
                </p>
                <input type='email'
                       style={styles.sectionInput}
                       maxLength={32}
                       placeholder='Email Address'
                       onChange={() => {}}/>
              </div>
            </div>
          </div>
          <Button style={styles.submitButton} isSubmit={true}>
            Create
          </Button>
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
  const {modalVisibilities} = state.ui;
  return {
    visible: modalVisibilities[modalKey],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeModalFn: () => dispatch(closeModal(modalKey)),    
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewBoxModal);

const styles = styler`
  container
    width: 700px
    padding: 34px 24px 22px

  innerContainer
    display: flex
    flex-direction: row
    align-items: flex-start
    margin-bottom: 13px

  left
    flex-basis: 50%
    padding-right: 15px

  right
    flex: 1
    padding-left: 15px

  headingContainer
    margin-bottom: 16px

  modalHeading
    float: left
    font-size: 21px
    font-style: normal
    text-transform: uppercase
    letter-spacing: 1px

  modalHeadingImage
    float: left
    width: 46px
    height: 46px
    margin-right: 6px
    background-image: url("${require('../../images/tearbox_hero.svg')}")
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

  nameInput
    min-width: 0
    font-style: italic
    font-weight: bold
    outline: none
    color: inherit
    border-bottom: 1px solid rgba(55,67,79,0.2)

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

  contactFieldSelect
    flex: 1

  contactFieldInput
    border-bottom: 1px solid rgba(55,67,79,0.2)
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
    border-bottom: 1px solid rgba(55,67,79,0.2)
    width: 100%
    padding: 4px 0
    outline: none
    margin-bottom: 5px

  footnote
    color: rgba(55,67,79,0.65)
    padding: 7px 0
    font-style: italic

  required
    color: rgba(217,52,35,1)
    font-style: normal
    font-weight: normal

  submitButton
    float: right
    padding: 6px 16px

  clearfix
    clear: both
`;

