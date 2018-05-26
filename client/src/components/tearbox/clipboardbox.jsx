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
  const {copied} = state.ui;
  return {
    copied,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const unsetCopiedFn = () => dispatch(unsetCopied());
  const setCopiedFn = () => {
    dispatch(setCopied());
    setTimeout(unsetCopiedFn, 2000);
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
    padding: 0 4px

  clipboardText
    padding: 6px 4px
    line-height: 18px
    display: inline-block

  linkIcon
    margin-left: 4px
    padding: 3px 0 4.5px 0
    margin-top: 1px
    line-height: 21px
    font-size: 14px
    float: left

  copyButton
    border: 1px solid rgba(55,67,79,0.2)
    text-transform: uppercase
    letter-spacing: 0.6px
    font-weight: bold
    font-size: 8px
    float: right
    line-height: 20px
    border-radius: 3px
    margin-top: 3px
    padding: 1px 6px 0
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
