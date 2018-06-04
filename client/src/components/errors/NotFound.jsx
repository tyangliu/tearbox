import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import styler from 'react-styling';

import {Logo, Button} from '../common';
import NewBoxModal, {modalKey as newBoxKey} from '../modals/newbox';

import {openModal, setOwnBoxId} from '../../redux/actions';
import {PREV_BOX_ID_KEY} from '../../redux/constants';

@Radium
class NotFound extends React.Component {
  render() {
    const {ownBoxId, openModalFn, goToFn} = this.props;
    return (
      <div style={styles.home}>
        <div style={styles.homeContainer}>
          <header style={styles.header}>
            <div style={styles.headerContainer}>
              <Logo style={styles.logo}/>
              <div style={styles.buttonContainer}>
                {ownBoxId &&
                  <Button
                    icon='navigate_next'
                    style={styles.button}
                    onClick={() => goToFn(`/box/${ownBoxId}`)}
                  >
                    Open my Box
                  </Button>
                }
                <Button
                  icon='note_add'
                  style={styles.button}
                  onClick={() => openModalFn(newBoxKey)}
                >
                  {ownBoxId ? 'Make a new Box' : 'Make your own Box'}
                </Button>
              </div>
              <div style={styles.buttonContainerSmall}>
                {ownBoxId &&
                  <Button
                    icon='navigate_next'
                    style={[styles.button, styles.buttonSmall]}
                    onClick={() => goToFn(`/box/${ownBoxId}`)}
                  >
                    <span style={styles.buttonSmallText}>
                      My Box
                    </span>
                  </Button>
                }
                <Button
                  icon='note_add'
                  style={[styles.button, styles.buttonSmall]}
                  onClick={() => openModalFn(newBoxKey)}
                >
                  <span style={styles.buttonSmallText}>
                    New Box
                  </span>
                </Button>
              </div>
            </div>
          </header>
          <section style={styles.main}>
            <div style={styles.notfound}>
              <div style={styles.notfoundImage}/>
              <h2 style={styles.notfoundTitle}>
                <span style={styles.em}>Ow!</span> This page doesn't exist.
              </h2>
            </div>
          </section>
          <footer style={styles.footer}>
            <ul style={styles.creditsList}>
              <li style={styles.creditsItem}>Made by <span style={styles.em}>tom</span> with help from many friends</li>
              <li style={styles.creditsItem}>Logo drawn by <span style={styles.em}>Sourcream</span></li>
            </ul>
          </footer>
        </div>
        <NewBoxModal/>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {ownBoxId} = state.ui.present;
  return {
    ownBoxId,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openModalFn: key => dispatch(openModal(key)),
    setOwnBoxIdFn: id => dispatch(setOwnBoxId(id)),
    goToFn: url => dispatch(push(url)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotFound);

const styles = styler`
  home
    width: 100%
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    height: 100vh

  homeContainer
    width: 100%
    display: flex
    flex-direction: column
    flex: 1

  header
    width: 100%
    margin: 0 auto
    padding: 10px 0

  headerContainer
    width: 100%
    max-width: 1280px
    margin: 0 auto
    padding: 0 30px
    display: flex
    flex-direction: row

    @media (max-width: 700px)
      padding: 0 20px

  logo
    width: 141px
    height: 73px
    margin-left: -12px

  buttonContainer
    margin-top: 32px
    text-align: right
    flex: 1

    @media (max-width: 700px)
      display: none

  buttonContainerSmall
    display: none

    @media (max-width: 700px)
      margin-top: 32px
      flex: 1
      display: block
      text-align: right

  button
    margin-left: 6px
    display: inline-block
    padding: 6px 20px 6px 11px

  buttonSmall
    @media (max-width: 440px)
      padding: 6px 0
      border: 0
      margin-left: 16px

      :hover
        background: inherit

      :active
        background: inherit

    @media (max-width: 360px)
      transform: scale(1.5)
      transform-origin: 100% 50%
      margin-right: -6px

  buttonSmallText
    @media (max-width: 360px)
      display: none

  main
    flex: 1
    flex-direction: column
    justify-content: center
    display: flex
    align-items: center 
    border-bottom: 1px solid rgba(55, 67, 79, 0.15)
    min-height: 500px

  em
    font-weight: bold
    color: rgba(55,67,79,1)

  notfoundImage
    width: 309px
    height: 351px
    background-image: url("${require('../../images/tearbox_notfound.svg')}")
    background-repeat: no-repeat
    background-size: contain
    margin-bottom: 30px
    opacity: 0.5

  notfoundTitle
    font-weight: normal
    font-size: 24px
    font-style: normal
    text-align: center

  footer
    margin: 0 auto

    @media (max-width: 500px)
      padding: 24px 0 8px

  creditsItem
    color: rgba(55,67,79,0.65)
    display: inline-block
    padding: 24px 8px

    @media (max-width: 500px)
      display: block
      padding: 0 8px 16px

  clearfix
    clear: both
`;
