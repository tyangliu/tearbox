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
        <div style={styles.midSize}>
          <div style={styles.innerContainer}>
            <h2 style={styles.boxHeader}>
              {box.name}'s Box
            </h2>
            {showEdit
              ? <button
                  style={styles.editButton}
                  onClick={openModalFn}
                >
                  <Icon name='edit' style={styles.editIcon}/>
                </button>
              : null
            }
          </div>
          <ClipboardBox
            value={`https://tearbox.io/box/${box.id}`}
            style={styles.linkshare.midSize}
          />
        </div>
        <ContactList
          fields={box.fields || []}
          style={styles.contactList}
        />
        <ClipboardBox
          value={`https://tearbox.io/box/${box.id}`}
          style={styles.linkshare}
        />
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
  infoBox
    @media (min-width: 700px) and (max-width: 1120px)
      display: flex
      flex-direction: row
      justify-content: flex-start
      align-items: flex-start

  innerContainer
    display: flex
    flex-direction: row
    align-items: flex-start

  midSize
    @media (max-width: 1120px)
      flex-basis: 50%

  boxHeader
    margin-top: 10px
    font-size: 21px
    margin-bottom: 1em
    flex: 1

    @media (max-width: 1120px)
      padding-right: 30px
      margin-bottom: 20px

  editButton
    cursor: pointer
    color: rgba(55,67,79,0.8)
    border: none
    padding: 0 10px
    float: right
    margin-top: 10px

    :hover
      color: rgba(217,52,35,1)

  contactList
    @media (min-width: 700px) and (max-width: 1120px)
      flex-basis: 50%
      padding-left: 30px
      margin-bottom: 4px

  linkshare
    margin-bottom: 60px

    @media (min-width: 700px) and (max-width: 1120px)
      display: none

    @media (max-width: 700px)
      display: flex
      margin-bottom: 16px

    midSize
      display: none

      @media (min-width: 700px) and (max-width: 1120px)
        display: flex
        margin-bottom: 0
`;
