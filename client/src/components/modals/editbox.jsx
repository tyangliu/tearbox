import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import {Button, Modal} from '../common';

import {closeModal} from '../../redux/actions';

export const modalKey = 'editBox';

class EditBoxModal extends React.Component {
  render() {
    const {visible, closeModalFn} = this.props;
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
              <input type='password'
                     style={styles.sectionInput}
                     maxLength={32}
                     placeholder='Passcode'
                     onChange={() => {}}/>
            </div>
          </div>
          <Button style={styles.submitButton} isSubmit={true}>
            Submit
          </Button>
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

  sectionInput
    border-bottom: 1px solid rgba(55,67,79,0.2)
    width: 100%
    padding: 4px 0
    outline: none
    margin-bottom: 5px

  submitButton
    float: right
    padding: 6px 16px

  clearfix
    clear: both
`;
