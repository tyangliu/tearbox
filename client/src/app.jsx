import React from 'react';
import Radium, {Style} from 'radium';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router';
import styler from 'react-styling';

import {Home, Tearbox, EditableTearbox, NotFound} from './components';

class App extends React.Component {
  render() {
    return (
      <div style={styles.app}>
        <Style
          rules={{...styles.appRules, ...{
            '.tooltip': {
              backgroundColor: 'rgba(55,67,79,.9) !important',
              padding: '4px 10px',
            },
            '.tooltip.place-bottom:after': {
              borderBottomColor: 'rgba(55,67,79,.9) !important',
            },
          }}}
        />
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/box/:id' component={Tearbox}/>
          <Route path='/box/:id/edit' component={EditableTearbox}/>
          <Route component={NotFound}/>
        </Switch>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

const styles = styler`
  app
    color: rgba(55,67,79,1)
    display: flex
    flex-direction: column
    font-family: "ff-tisa-sans-web-pro", sans-serif
    font-size: 13px
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
      border: 1px solid rgba(55,67,79,0.2)
      padding: 0
      outline: none
      user-select: none

    h2
      font-size: 21px
      font-weight: bold
      font-style: italic

    ::-webkit-input-placeholder, :-ms-input-placeholder, ::-moz-placeholder, :-moz-placeholder
      color: rgba(55,67,79,0.65)
      font-style: italic
      font-weight: normal

    ::selection
      background: rgba(37,174,215,0.4)
`;
