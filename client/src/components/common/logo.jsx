import React from 'react';
import {Link} from 'react-router-dom';
import Radium from 'radium';
import styler from 'react-styling';

@Radium
export default class Logo extends React.Component {
  static defaultProps = {
    shouldLink: true,
  };

  render() {
    const {style, shouldLink, onClick} = this.props;

    return (
      <div
        style={[styles.logoContainer, style]}
        onClick={onClick}
      >
        {shouldLink
          ? <Link to='/'>
              <div style={styles.logo}/>
            </Link>
          : <div style={styles.logo}/>
        }
      </div>
    );
  }
}

const styles = styler`
  logo
    cursor: pointer
    width: 100%
    height: 100%
    background-image: url("${require('../../images/tearbox_logo.svg')}")
    background-repeat: no-repeat
    background-size: contain
`;
