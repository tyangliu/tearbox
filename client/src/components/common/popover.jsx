import React from 'react';
import Radium from 'radium';
import styler from 'react-styling';

@Radium
export default class Popover extends React.Component {
  static defaultProps = {
    visible: false,
    onClose: () => {},
  };

  handleKeyPress = event => {
    const {visible, onClose} = this.props;
    if (event.key != 'Escape' || !visible) {
      return;
    }
    onClose && onClose();
  };

  handleOuterClick = event => {
    const {onClose} = this.props;
    onClose && onClose();
  };

  handlePopoverClick = event => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  };

  componentDidMount() {
    document.addEventListener('click', this.handleOuterClick);
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOuterClick);
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  render() {
    const {style, visible} = this.props;
    return (
      <div style={[styles.popover[visible ? 'visible' : 'hidden'], style]}
           onClick={this.handlePopoverClick}>
        {this.props.children}
      </div>
    );
  }
}

const styles = styler`
  popover
    border: 1px solid rgba(55,67,79,0.1)
    border-radius: 3px
    box-shadow: 0 1px 1px rgba(55,67,79,0.5)
    background: rgba(255,255,255,1)
    z-index: 1
    transition: opacity 0.08s ease-in-out

    &visible
      pointer-events: auto
      opacity: 1

    &hidden
      pointer-events: none
      opacity: 0
      
`;
