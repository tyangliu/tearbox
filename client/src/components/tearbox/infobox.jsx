import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import {Icon} from '../common';
import ContactList from './contactlist';
import ClipboardBox from './clipboardbox';

import {modalKey as boxInfoKey} from '../modals/boxinfo';
import {openModal} from '../../redux/actions';

@Radium
class InfoBox extends React.Component {
  static defaultProps = {
    showEdit: false,
  };

  render() {
    const {box, showEdit, style, openModalFn} = this.props;
    return (
      <div style={[styles.infoBox, style]}>
        {showEdit
          ? <button
              style={styles.editButton}
              onClick={openModalFn}
            >
              <Icon name='edit' style={styles.editIcon}/>
            </button>
          : null
        }
        <h2 style={styles.boxHeader}>
          {box.name}'s Box
        </h2>
        <ContactList fields={box.fields || []}/>
        <ClipboardBox value={`https://tearbox.io/box/${box.id}`}
                      style={styles.linkshare}/>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {box} = state;
  return {
    box: box.present.data,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openModalFn: () => dispatch(openModal(boxInfoKey)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InfoBox);

const styles = styler`
  boxHeader
    margin-top: 10px
    font-size: 21px
    margin-bottom: 1em

  editButton
    cursor: pointer
    color: rgba(55,67,79,0.8)
    border: none
    padding: 0 10px
    float: right

    :hover
      color: rgba(217,52,35,1)

  linkshare
    margin-bottom: 60px
`;
