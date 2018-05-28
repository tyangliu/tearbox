import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

@Radium
export default class Footer extends React.Component {
  render() {
    const {style} = this.props;
    return (
        <div style={[styles.footer, style]}>
          <p style={styles.siteDescription}>
            <span style={styles.em}>tearbox</span> helps you create & share El Tear lists.
          </p>
          <ul style={styles.creditsList}>
            <li style={styles.creditsItem}>Made by <span style={styles.em}>tom</span> with help from many friends</li>
            <li style={styles.creditsItem}>Logo drawn by <span style={styles.em}>Sourcream</span></li>
          </ul>
        </div>
    );
  }
}

const styles = styler`
  footer
    padding: 60px 0 30px

  em
    color: rgba(55,67,79,1)
    font-weight: bold
    font-style: normal

  siteDescription
    margin-bottom: 30px

  creditsItem
    color: rgba(55,67,79,0.65)

  clearfix
    clear: both
`;
