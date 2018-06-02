import React from 'react';
import Radium from 'radium';
import styler from 'react-styling';
import ModalBase from 'react-responsive-modal';

import {Icon} from '../common';
import {closeModal} from '../../redux/actions';

@Radium
export default class Modal extends React.Component {
  static defaultProps = {
    visible: false,
    onClose: () => {},
  };

  closeClearHover = () => {
    this.setState({_radiumStyleState: {newboxmodalclose: {':hover': false}}});
    this.props.onClose();
  };

  render() {
    const {visible, onClose} = this.props;
    return (
      <ModalBase open={visible}
             styles={styles.modalStyles}
             animationDuration={500}
             onClose={onClose}
             showCloseIcon={false}>
        <button style={styles.closeButton}
                onClick={this.closeClearHover}
                key='newboxmodalclose'>
          <Icon name='close' style={styles.closeIcon}/>
        </button>
        {this.props.children}
      </ModalBase>
    );
  }
}

const styles = styler`
  modalStyles
    modal
      color: rgba(55,67,79,1)
      padding: 0
      font-family: "ff-tisa-sans-web-pro", sans-serif
      font-size: 13px
      line-height: 1.5em
      border-radius: 3px
      box-shadow: 0 2px 3px 1px rgba(55,67,79,0.7)

    overlay
      background: rgba(55,67,79,0.7)

  closeButton
    color: rgba(55,67,79,0.7)
    border: 0
    padding: 1px 4px
    float: right
    margin: 10px 8px 0 0

    :hover
      color: rgba(217,52,35,1)

  closeIcon
    line-height: 21px
    font-size: 18px
`;
