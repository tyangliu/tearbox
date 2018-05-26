import React from 'react';
import Radium, {Style} from 'radium';
import {Route, Switch} from 'react-router';
import styler from 'react-styling';

import {Home, Tearbox} from './components';

export default class App extends React.Component {
  render() {
    return (
      <div style={styles.app}>
        <Style rules={styles.appRules}/>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/box' component={Tearbox}/>
        </Switch>
        {this.props.children}
      </div>
    );
  }
}

const styles = styler`
  app
    color: rgba(55,67,79,1)
    display: flex
    flex-direction: column
    font-family: "ff-tisa-sans-web-pro", sans-serif
    font-size: 11px
    height: 100vh
    line-height: 1.5em

  appRules 
    *
      box-sizing: border-box

    input
      font-family: inherit
      font-size: inherit
      color: inherit
      border: none
  
    button
      color: inherit
      font-family: inherit
      font-size: inherit
      background: none
      border: 1px solid rgba(55,67,79,0.15)
      padding: 0
      outline: none
      user-select: none

    h2
      font-size: 18px
      font-weight: bold
      font-style: italic

    ::-webkit-input-placeholder, :-ms-input-placeholder, ::-moz-placeholder, :-moz-placeholder
      color: rgba(55,67,79,0.65)
      font-style: italic

    ::selection
      background: rgba(37,174,215,0.4)
`;
