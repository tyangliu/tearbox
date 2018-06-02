import React from 'react';
import Radium from 'radium';
import styler from 'react-styling';

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
        <div style={styles.check[checked ? 'checked' : 'unchecked']}/>
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
    line-height: 16px

    :hover
      color: rgba(217,52,35,1)

  check
    display: inline-block
    border-radius: 3px
    width: 16px
    height: 16px
    vertical-align: top

    &checked
      border: 1px solid rgba(37,174,215,1)
      background: rgba(37,174,215,1)

    &unchecked
      border: 1px solid rgba(55,67,79,0.3)
      background: rgba(255,255,255,1)

  label
    display: inline-block
    margin-left: 6px
    line-height: 16px
    vertical-align: top
`;
