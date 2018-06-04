import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import styler from 'react-styling';
import DocumentTitle from 'react-document-title';

import {Logo, Button} from '../common';
import NewBoxModal, {modalKey as newBoxKey} from '../modals/newbox';

import {openModal} from '../../redux/actions';

@Radium
class Home extends React.Component {
  render() {
    const {ownBoxId, openModalFn, goToFn} = this.props;
    return (
      <DocumentTitle title='Tearbox'>
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
            <section style={styles.hero}>
              <div style={styles.heroImage}/>
              <h2 style={styles.heroHeading}>
                <span style={styles.em}>tearbox</span> helps you create & share El Tear lists.
              </h2>
            </section>
            <section style={styles.infoSection}>
              <h3 style={styles.infoHeading}>
                How it Works
              </h3>
              <div style={styles.infoContainer}>
                <p style={[styles.infoText, styles.infoText1]}>Create a box and add your items</p>
                <p style={[styles.infoText, styles.infoText2]}>Copy the unique box link</p>
                <p style={[styles.infoText, styles.infoText3]}>Share it on Discord, forums, wherever!</p>
              </div>
              <div style={styles.infoContainerMid}>
                <p style={[styles.infoTextMid, styles.infoTextMid1]}>Create a box and add your items</p>
                <p style={[styles.infoTextMid, styles.infoTextMid2]}>Copy the unique box link</p>
                <p style={[styles.infoTextMid, styles.infoTextMid3]}>Share it on Discord, forums, wherever!</p>
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
      </DocumentTitle>
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
    goToFn: url => dispatch(push(url)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);

const styles = styler`
  home
    width: 100%
    display: flex
    flex-direction: column
    align-items: center
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

  hero
    flex: 1
    flex-direction: column
    justify-content: center
    display: flex
    align-items: center 
    min-height: 400px

  heroImage
    width: 258px
    height: 198px
    margin-bottom: 20px
    display: block
    background-image: url("${require('../../images/tearbox_hero.svg')}")
    background-repeat: no-repeat
    background-size: 258px 198px

  heroHeading
    font-size: 24px
    line-height: 1.5em
    font-weight: normal
    font-style: normal
    display: block
    padding: 0 20px

    @media (max-width: 700px)
      text-align: center

  em
    font-weight: bold
    color: rgba(55,67,79,1)

  infoSection
    min-height: 420px
    display: flex
    flex-direction: column
    flex-basis: 400px
    align-items: center
    justify-content: center
    padding: 40px 0
    border-top: 1px solid rgba(55,67,79, 0.15)
    border-bottom: 1px solid rgba(55, 67, 79, 0.15)

    @media (max-width: 850px)
      min-height: 700px

  infoContainer
    width: 780px
    flex: 1
    background-image: url("${require('../../images/tearbox_instruction_bg.jpg')}")
    background-repeat: no-repeat
    background-size: contain
    background-position: bottom center
    position: relative

    @media (max-width: 850px)
      display: none

  infoContainerMid
    display: none

    @media (max-width: 850px)
      display: block
      width: 330px
      background-image: url("${require('../../images/tearbox_instruction_mobile.svg')}")
      flex: 1
      background-repeat: no-repeat
      background-size: contain
      background-position: bottom center
      position: relative

  infoHeading
    font-weight: bold
    font-size: 17px
    text-transform: uppercase
    letter-spacing: 1px
    margin-bottom: 12px

  infoText
    font-size: 15px
    position: absolute

    @media (max-width: 850px)
      display: none

  infoTextMid
    font-size: 15px
    position: absolute

  infoText1
    width: 390px
    text-align: center
    top: 30px
    left: 15px
    
  infoText2
    width: 280px
    text-align: center
    top: 30px
    left: 500px

  infoText3
    width: 280px
    text-align: center
    left: 50%
    margin-left: -50%

  infoTextMid1
    width: 390px
    text-align: center
    left: 50%
    margin-left: -195px
    top: 40px

  infoTextMid2
    width: 280px
    text-align: center
    left: 50%
    margin-left: -140px
    top: 346px

  infoTextMid3
    width: 280px
    text-align: center
    left: 50%
    margin-left: -140px
    top: 490px

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
