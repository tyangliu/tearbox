import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {setCopied, unsetCopied} from '../../redux/actions';

@Radium
class ClipboardBox extends React.Component {
  selectText = () => {
    const {textEl} = this;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(textEl);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  render() {
    const {value, copied, style, setCopiedFn} = this.props;
    return (
      <div style={[styles.clipboardBox, style]}>
        <span style={styles.clipboardText}
              ref={e => this.textEl = e}
              onClick={this.selectText}>
          {value}
        </span>
        <CopyToClipboard text={value} onCopy={setCopiedFn}>
          <button style={styles.copyButton[copied ? 'active' : 'normal']}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </CopyToClipboard>
        <div style={styles.clearfix}/>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {copied} = state.ui.present;
  return {
    copied,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const unsetCopiedFn = () => dispatch(unsetCopied());
  const setCopiedFn = () => {
    dispatch(setCopied());
    setTimeout(unsetCopiedFn, 1500);
  };

  return {
    setCopiedFn,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClipboardBox);

const styles = styler`
  clipboardBox
    background: rgba(55,67,79,0.1)
    border-radius: 3px
    padding: 0 6px
    display: flex
    flex-direction: row

  clipboardText
    padding: 9px 3px
    line-height: 18px
    flex: 1

  copyButton
    cursor: pointer
    border: 1px solid rgba(55,67,79,0.3)
    text-transform: uppercase
    letter-spacing: 0.6px
    font-weight: bold
    font-size: 11px
    border-radius: 3px
    margin: 4px 0
    padding: 0 8px
    transition: background 0.1s ease-in-out

    &normal
      background: rgba(255,255,255,1)
      pointer-events: auto

      :hover
        color: rgba(217,52,35,1)
        border: 1px solid rgba(217,52,35,0.4)

    &active
      background: rgba(37,174,215,1)
      color: rgba(255,255,255,1)
      border: 1px solid rgba(37,174,215,1)
      pointer-events: none

      :hover
        color: rgba(255,255,255,1)
        border: 1px solid rgba(37,174,215,1)


  clearfix
    clear: both
`;
