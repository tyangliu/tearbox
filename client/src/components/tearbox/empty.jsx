import React from 'react';
import Radium from 'radium';
import styler from 'react-styling';

@Radium
export default class Empty extends React.Component {
  render() {
    const {style} = this.props
    return (
      <div style={[styles.emptyContainer, style]}>
        <div style={styles.emptyImage}/>
        <h3 style={styles.emptyText}>
          It's an empty box!
        </h3>
      </div>
    );
  }
}

const styles = styler`
  emptyContainer
    padding: 30px
    margin-top: 100px
    align-items: center
    justify-content: center
    display: flex
    flex-direction: column

  emptyImage
    width: 275px
    height: 144px
    background-image: url("${require('../../images/tearbox_empty.svg')}")
    background-repeat: no-repeat
    background-size: contain
    opacity: 0.3
    margin-bottom: 20px

  emptyText
    color: rgba(55,67,79,0.6)
    line-height: 31.5px
    font-size: 21px
    font-style: italic
`;
