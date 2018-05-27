import React from 'react';
import Radium from 'radium';
import styler from 'react-styling';

const pieces = ['Top', 'Bottom', 'Gloves', 'Shoes'];
const colors = ['Red', 'Blue', 'Purple'];

const itemToPath = item => `Elrianode${pieces[item.piece_id]}${colors[item.color_id]}${item.effect.type_id + 1}.jpg`;

const pathToHash = {
  'ElrianodeTopBlue1.jpg': require('../../../images/ElrianodeTopBlue1.jpg'),
  'ElrianodeTopBlue2.jpg': require('../../../images/ElrianodeTopBlue2.jpg'),
  'ElrianodeTopBlue3.jpg': require('../../../images/ElrianodeTopBlue3.jpg'),
  'ElrianodeTopBlue4.jpg': require('../../../images/ElrianodeTopBlue4.jpg'),

  'ElrianodeTopRed1.jpg': require('../../../images/ElrianodeTopRed1.jpg'),
  'ElrianodeTopRed2.jpg': require('../../../images/ElrianodeTopRed2.jpg'),
  'ElrianodeTopRed3.jpg': require('../../../images/ElrianodeTopRed3.jpg'),
  'ElrianodeTopRed4.jpg': require('../../../images/ElrianodeTopRed4.jpg'),

  'ElrianodeTopPurple1.jpg': require('../../../images/ElrianodeTopPurple1.jpg'),
  'ElrianodeTopPurple2.jpg': require('../../../images/ElrianodeTopPurple2.jpg'),
  'ElrianodeTopPurple3.jpg': require('../../../images/ElrianodeTopPurple3.jpg'),
  'ElrianodeTopPurple4.jpg': require('../../../images/ElrianodeTopPurple4.jpg'),

  'ElrianodeBottomBlue1.jpg': require('../../../images/ElrianodeBottomBlue1.jpg'),
  'ElrianodeBottomBlue2.jpg': require('../../../images/ElrianodeBottomBlue2.jpg'),
  'ElrianodeBottomBlue3.jpg': require('../../../images/ElrianodeBottomBlue3.jpg'),
  'ElrianodeBottomBlue4.jpg': require('../../../images/ElrianodeBottomBlue4.jpg'),

  'ElrianodeBottomRed1.jpg': require('../../../images/ElrianodeBottomRed1.jpg'),
  'ElrianodeBottomRed2.jpg': require('../../../images/ElrianodeBottomRed2.jpg'),
  'ElrianodeBottomRed3.jpg': require('../../../images/ElrianodeBottomRed3.jpg'),
  'ElrianodeBottomRed4.jpg': require('../../../images/ElrianodeBottomRed4.jpg'),

  'ElrianodeBottomPurple1.jpg': require('../../../images/ElrianodeBottomPurple1.jpg'),
  'ElrianodeBottomPurple2.jpg': require('../../../images/ElrianodeBottomPurple2.jpg'),
  'ElrianodeBottomPurple3.jpg': require('../../../images/ElrianodeBottomPurple3.jpg'),
  'ElrianodeBottomPurple4.jpg': require('../../../images/ElrianodeBottomPurple4.jpg'),

  'ElrianodeGlovesBlue1.jpg': require('../../../images/ElrianodeGlovesBlue1.jpg'),
  'ElrianodeGlovesBlue2.jpg': require('../../../images/ElrianodeGlovesBlue2.jpg'),
  'ElrianodeGlovesBlue3.jpg': require('../../../images/ElrianodeGlovesBlue3.jpg'),
  'ElrianodeGlovesBlue4.jpg': require('../../../images/ElrianodeGlovesBlue4.jpg'),

  'ElrianodeGlovesRed1.jpg': require('../../../images/ElrianodeGlovesRed1.jpg'),
  'ElrianodeGlovesRed2.jpg': require('../../../images/ElrianodeGlovesRed2.jpg'),
  'ElrianodeGlovesRed3.jpg': require('../../../images/ElrianodeGlovesRed3.jpg'),
  'ElrianodeGlovesRed4.jpg': require('../../../images/ElrianodeGlovesRed4.jpg'),

  'ElrianodeGlovesPurple1.jpg': require('../../../images/ElrianodeGlovesPurple1.jpg'),
  'ElrianodeGlovesPurple2.jpg': require('../../../images/ElrianodeGlovesPurple2.jpg'),
  'ElrianodeGlovesPurple3.jpg': require('../../../images/ElrianodeGlovesPurple3.jpg'),
  'ElrianodeGlovesPurple4.jpg': require('../../../images/ElrianodeGlovesPurple4.jpg'),

  'ElrianodeShoesBlue1.jpg': require('../../../images/ElrianodeShoesBlue1.jpg'),
  'ElrianodeShoesBlue2.jpg': require('../../../images/ElrianodeShoesBlue2.jpg'),
  'ElrianodeShoesBlue3.jpg': require('../../../images/ElrianodeShoesBlue3.jpg'),
  'ElrianodeShoesBlue4.jpg': require('../../../images/ElrianodeShoesBlue4.jpg'),

  'ElrianodeShoesRed1.jpg': require('../../../images/ElrianodeShoesRed1.jpg'),
  'ElrianodeShoesRed2.jpg': require('../../../images/ElrianodeShoesRed2.jpg'),
  'ElrianodeShoesRed3.jpg': require('../../../images/ElrianodeShoesRed3.jpg'),
  'ElrianodeShoesRed4.jpg': require('../../../images/ElrianodeShoesRed4.jpg'),

  'ElrianodeShoesPurple1.jpg': require('../../../images/ElrianodeShoesPurple1.jpg'),
  'ElrianodeShoesPurple2.jpg': require('../../../images/ElrianodeShoesPurple2.jpg'),
  'ElrianodeShoesPurple3.jpg': require('../../../images/ElrianodeShoesPurple3.jpg'),
  'ElrianodeShoesPurple4.jpg': require('../../../images/ElrianodeShoesPurple4.jpg'),
};

@Radium
export default class TearIcon extends React.Component {
  render() {
    const {item, style} = this.props;
    const path = pathToHash[itemToPath(item)];
    return (
      <div style={[styles.itemIcon, style, {
        backgroundImage: path ? `url("${path}")` : 'none',
      }]}/>
    );
  }
}

const styles = styler`
  itemIcon
    width: 28px
    height: 28px
    background-repeat: no-repeat
    background-size: contain
`;
