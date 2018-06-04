import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import capitalize from 'lodash.capitalize';
import isUrl from 'is-url';

@Radium
export default class ContactList extends React.Component {
  render() {
    const {fields, style} = this.props;
    return (
      <ul style={[styles.contactList, style]}>
        {fields
          .filter(field => field.value !== '')
          .map(field => 
            <li style={styles.contactItem} key={field.label}>
              <div style={styles.contactItemLabel}>
                {capitalize(field.label)}
              </div>
              <div style={styles.contactItemValue}>
                {isUrl(field.value)
                  ? <a href={field.value} target='_blank'>
                      {field.value}
                    </a>
                  : field.value
                }
              </div>
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

  contactItem
    display: flex
    flex-direction: row

  contactItemLabel
    color: rgba(55,67,79,0.65)
    font-style: italic
    min-width: 70px
    flex-basis: 70px

  contactItemValue
    margin-left: 10px
    word-break: break-all
`;
