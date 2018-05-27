import React from 'react';
import Radium from 'radium';
import styler from 'react-styling';

import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import Icon from './icon';

@Radium
export default class SelectBox extends React.Component {
  static defaultProps = {
    style: {},
    useAsync: false,
  };

  render() {
    const {style, useAsync, ...rest} = this.props;
    const SelectComponent = useAsync ? AsyncSelect : Select;
    return (
      <div style={[styles.selectContainer, style]}>
        <SelectComponent
          styles={selectStyles}
          components={{
            DropdownIndicator: () => (
              <Icon name='arrow_drop_down' style={styles.dropdownIcon}/>
            ),
          }}
          {...rest}
        />
      </div>
    );
  }
}

const styles = styler`
  selectContainer
    display: block
    position: relative

  dropdownIcon
    font-size: 13px
    line-height: 13px
    margin-top: 1px

  select
    control
      display: flex
      border-bottom: 1px solid rgba(55,67,79,0.2)
      padding: 4px 0
      cursor: text

      &normal

      &active

    valueContainer
      border: none
      padding: 0

    input
      padding: 0      

    singleValue
      color: rgba(55,67,79,1)
      margin: 0
      padding: 0

    placeholder
      font-style: italic
      margin: 0

    indicatorSeparator

    menu
      margin: 0
      border-radius: 0 0 3px 3px
      box-shadow: 0 1px 1px 1px rgba(55,67,79,0.2)

    menuList
      padding: 0 0 2px

    option
      padding: 4px

      &normal
        background: rgba(255,255,255,1)
      &selected
        background: rgba(37,174,215,1)

        :active
          background: rgba(7,144,185,1)

      &focused
        color: rgba(217,52,35,1)
        background: rgba(217,52,35,0.1)

        :active
          background: rgba(217,52,35,0.2)

    noOptionsMessage
      padding: 4px
`;

const selectStyles = {
  control: (ss, {isFocused}) => ({
    ...styles.select.control[isFocused ? 'active' : 'normal'],
  }),
  input: ss => ({
    ...styles.select.input,
  }),
  valueContainer: ss => ({
    ...ss,
    ...styles.select.valueContainer,
  }),
  singleValue: ss => ({
    ...ss,
    ...styles.select.singleValue,
  }),
  placeholder: ss => ({
    ...ss,
    ...styles.select.placeholder,
  }),
  indicatorSeparator: ss => ({
    ...styles.select.indicatorSeparator,
  }),
  menu: ss => ({
    ...ss,
    ...styles.select.menu,
  }),
  menuList: ss => ({
    ...ss,
    ...styles.select.menuList,
  }),
  option: (ss, {isFocused, isSelected}) => ({
    ...ss,
    ...styles.select.option[
      isSelected
        ? 'selected'
        : (isFocused ? 'focused' : 'normal')
      ],
  }),
  noOptionsMessage: ss => ({
    ...ss,
    ...styles.select.noOptionsMessage,
  }),
};
