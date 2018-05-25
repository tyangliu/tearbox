import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import Logo from '../common/logo';
import Button from '../common/button';

@Radium
class Home extends React.Component {
  render() {
    return (
      <div style={styles.home}>
        <div style={styles.homeContainer}>
          <header style={styles.header}>
            <div style={styles.headerContainer}>
              <Button label='Make your own Box' icon='note_add' style={styles.button}/>
              <Logo style={styles.logo}/>
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
              <p style={[styles.infoText, styles.infoText1]}>Create a tearbox and add your items</p>
              <p style={[styles.infoText, styles.infoText2]}>Copy the unique box link</p>
              <p style={[styles.infoText, styles.infoText3]}>Share it on Discord, forums, wherever!</p>
            </div>
          </section>
          <footer style={styles.footer}>
            <ul style={styles.creditsList}>
              <li style={styles.creditsItem}>Made by <span style={styles.em}>tom</span> with help from many friends</li>
              <li style={styles.creditsItem}>Logo drawn by <span style={styles.em}>Sourcream</span></li>
            </ul>
          </footer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);

const styles = styler`
  home
    width: 100%
    min-width: 800px
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

  logo
    width: 141px
    height: 73px
    margin-left: -12px

  button
    width: 160px
    display: block
    float: right
    margin-top: 32px

  hero
    flex: 1
    flex-direction: column
    justify-content: center
    display: flex
    align-items: center 
    min-height: 300px

  heroImage
    width: 258px
    height: 198px
    margin-bottom: 20px
    display: block
    background-image: url("${require('../../images/tearbox_hero.svg')}")
    background-repeat: no-repeat
    background-size: 258px 198px

  heroHeading
    font-weight: normal
    font-style: normal
    display: block

  em
    font-weight: bold
    color: rgba(55,67,79,1)

  infoSection
    min-height: 400px
    display: flex
    flex-direction: column
    flex-basis: 400px
    align-items: center
    justify-content: center
    padding: 30px 0
    border-top: 1px solid rgba(55,67,79, 0.15)
    border-bottom: 1px solid rgba(55, 67, 79, 0.15)

  infoContainer
    width: 780px
    flex: 1
    background-image: url("${require('../../images/tearbox_instruction_bg.jpg')}")
    background-repeat: no-repeat
    background-size: contain
    background-position: bottom center
    position: relative

  infoHeading
    font-weight: bold
    font-size: 14px
    text-transform: uppercase
    letter-spacing: 1px
    margin-bottom: 12px

  infoText
    font-size: 14px
    position: absolute

  infoText1
    width: 390px
    text-align: center
    top: 30px
    left: 15px
    
  infoText2
    width: 240px
    text-align: center
    top: 30px
    left: 520px

  infoText3
    width: 240px
    text-align: center
    top: 180px
    left: 520px

  footer
    margin: 0 auto

  creditsItem
    color: rgba(55,67,79,0.65)
    display: inline-block
    padding: 16px 8px

  clearfix
    clear: both
`;
