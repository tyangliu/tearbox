import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import capitalize from 'lodash.capitalize';

export default class ContactList extends React.Component {
  render() {
    const {fields} = this.props;
    return (
      <ul style={styles.contactList}>
        {fields
          .filter(field => field.value !== '')
          .map(field => 
            <li style={styles.contactItem} key={field.label}>
              <span style={styles.contactItemLabel}>
                {capitalize(field.label)}
              </span>
              <span style={styles.contactItemValue}>
                {field.value}
              </span>
            </li>
          )
      } 
      </ul>
    );
  }
}

const styles = styler`
  contactList
    margin-bottom: 24px

  contactItemLabel
    color: rgba(55,67,79,0.65)
    font-style: italic
    display: inline-block
    width: 70px

  contactItemValue
    margin-left: 10px
    display: inline-block
`;
