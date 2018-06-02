import React from 'react';
import Radium from 'radium';
import styler from 'react-styling';

import Icon from './icon';

@Radium
export default class Checkbox extends React.Component {
  static defaultProps = {
    checked: false,
    label: '',
    onClick: () => {},
  };

  render() {
    const {checked, label, onChange, style} = this.props;
    return (
      <div
        style={[styles.checkbox, style]}
        onClick={onChange}
      >
        <Icon
          name={checked ? 'check_box' : 'check_box_outline_blank'}
          style={styles.check[checked ? 'checked' : 'unchecked']}
        />
        <div style={styles.label}>
          {label}
        </div>
      </div>
    );
  }
}

const styles = styler`
  checkbox
    cursor: pointer
    display: block
    line-height: 19.5px

    :hover
      color: rgba(217,52,35,1)

  check
    line-height: 19.5px
    font-size: 19.5px
    display: inline-block
    border-radius: 3px
    width: 16px
    height: 16px
    vertical-align: top
    text-align: center

    &checked
      color: rgba(37,174,215,1)

    &unchecked
      color: rgba(55,67,79,0.3)

  label
    display: inline-block
    margin-left: 6px
    line-height: 19.5px
    vertical-align: top
`;
