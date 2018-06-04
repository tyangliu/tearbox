import React from 'react';
import Radium, {Style, StyleRoot} from 'radium';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router';
import styler from 'react-styling';
import NotificationSystem from 'react-notification-system';

import localMap from './localMap';
import {Home, Tearbox, EditableTearbox, NotFound} from './components';
import {
  setOwnBoxId,
  setNotificationCreator,
  requestPostBoxRefresh,
} from './redux/actions';
import {PREV_BOX_ID_KEY} from './redux/constants';

class App extends React.Component {
  notificationSystem = null;

  constructor(props) {
    super(props);
    const {requestPostBoxRefreshFn, setOwnBoxIdFn} = this.props;

    const existingBoxId = localMap.get(PREV_BOX_ID_KEY);
    if (!existingBoxId) {
      return;
    }
    requestPostBoxRefreshFn();
    setOwnBoxIdFn(existingBoxId);
  }

  addNotificationCreator = (level, message) => e => {
    e && e.preventDefault();
    this.notificationSystem.addNotification({
      autoDismiss: 2,
      position: 'tc',
      level,
      message,
    });
  };

  componentDidMount() {
    const {setNotificationCreatorFn} = this.props;
    setNotificationCreatorFn(this.addNotificationCreator);
  }

  render() {
    return (
      <StyleRoot>
        <div style={styles.app}>
          <Style
            rules={{...styles.appRules, ...{
              '.tooltip': {
                backgroundColor: 'rgba(55,67,79,.9) !important',
                padding: '4px 10px',
                lineHeight: '19.5px',
              },
              '.tooltip.place-bottom:after': {
                borderBottomColor: 'rgba(55,67,79,.9) !important',
              },
            }}}
          />
          <NotificationSystem
            ref={el => this.notificationSystem = el}
            style={styles.notificationSystem}
          />
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/box/:id' component={Tearbox}/>
            <Route path='/box/:id/edit' component={EditableTearbox}/>
            <Route component={NotFound}/>
          </Switch>
          {this.props.children}
        </div>
      </StyleRoot>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setOwnBoxIdFn: id => dispatch(setOwnBoxId(id)),
    setNotificationCreatorFn: fn => dispatch(setNotificationCreator(fn)),
    requestPostBoxRefreshFn: () => dispatch(requestPostBoxRefresh()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

const styles = styler`
  app
    background: rgba(255,255,255,1)
    color: rgba(55,67,79,1)
    font-family: "ff-tisa-sans-web-pro", sans-serif
    font-size: 13px
    line-height: 1.5em
    min-width: 330px

  notificationSystem
    Containers
      DefaultStyle
        width: 360
      tc
        margin-left: -180

    NotificationItem
      DefaultStyle
        box-shadow: 0 2px 3px 1px rgba(55,67,79,0.2)
        border-radius: 3px
        text-align: center
        padding: 10px

      success
        background: rgba(232,247,252,1)
        color: rgba(55,67,79,1)
        border-top: 3px solid rgba(37,174,215,1)

      error
        background: rgba(252,234,230,1)
        color: rgba(217,52,35,1)
        border-top: 3px solid rgba(217,52,35,1)

    Dismiss
      success
        background-color: none
        color: rgba(37,174,215,1)

      error
        background-color: none
        color: rgba(217,52,35,1) 

  appRules 
    *
      box-sizing: border-box

    input
      font-family: inherit
      font-size: inherit
      color: inherit
      background: rgba(255,255,255,1)
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

    a
      color: rgba(37,174,215,1)
      text-decoration: none

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
