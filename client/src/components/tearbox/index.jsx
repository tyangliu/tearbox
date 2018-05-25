import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import Header from './header';
import ContactList from './contactlist';
import ClipboardBox from './clipboardbox';
import Button from '../common/button';
import ItemTable from './itemtable';
import Section from './section';
import Footer from './footer';

import {
  UNAVAILABLE,
  REQUESTED,
  RECEIVED,

  loadTears,
  fetchBox,
  toggleGroup,
} from '../../redux/actions';

@Radium
class Tearbox extends React.Component {
  componentDidMount() {
    const {boxStatus, fetchBoxFn} = this.props;
    if (boxStatus !== RECEIVED) {
      fetchBoxFn();
    }
  }

  render() {
    const {tears, box, groupVisibilities, toggleGroupFn} = this.props;
    console.log(tears);
    return (
      <div style={styles.tearbox}>
        <div style={styles.tearboxContainer}>
          <Header/>
          <div style={[styles.container, styles.main]}>

            <div style={[styles.left, styles.mainLeft]}>
              <div style={styles.mainLeftContent}>
                <h2 style={styles.boxHeader}>
                  {box.name}'s Box
                </h2>
                <ContactList fields={box.fields || []}/>
                <ClipboardBox value={`tearbox.io/box/${box.id}`} style={styles.linkshare}/>
                <Button label='Make your own Box' icon='note_add' style={styles.button}/>
                <Button label='Edit this Box' icon='edit' style={styles.button}/>
                <p style={styles.footnote}>
                  (if you own this box)
                </p>
              </div>
              <Footer/>
            </div>

            <div style={styles.right}>
              {(box.groupDisplays || []).map((group, i) => 
                <Section title={group.label}
                         key={i}
                         visible={groupVisibilities[i]}
                         onToggle={() => toggleGroupFn(i)}>
                  <ItemTable items={group.items}/>
                </Section>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {ui, tears, box} = state;
  return {
    tearsStatus: ui.tearsStatus,
    tears,
    boxStatus: ui.boxStatus,
    box: box.data,
    groupVisibilities: ui.groupVisibilities,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadTearsFn: () => dispatch(loadTears()),
    fetchBoxFn: () => dispatch(fetchBox()),
    toggleGroupFn: idx => dispatch(toggleGroup(idx)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tearbox);

const styles = styler`
  tearbox
    width: 100%
    min-width: 1200px
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    height: 100vh

  tearboxContainer
    width: 100%
    max-width: 1600px
    padding: 0 30px
    display: flex
    flex-direction: column
    flex: 1

  container
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: flex-start
    align-items: stretch
    padding: 10px 0

  main
    flex: 1

  mainLeft
    display: flex
    flex-direction: column

  mainLeftContent
    flex: 1

  left
    flex-basis: 230px
    margin: 0 40px 0 0
    order: 1

  right
    flex-grow: 1
    order: 2

  boxHeader
    margin-bottom: 12px

  linkshare
    margin-bottom: 60px

  button
    width: 100%

  icon
    width: 20px
    font-size: 17px
    line-height: 24px
    display: block
    float: left

  footnote
    text-align: right
    font-style: italic
    color: rgba(0,0,0,0.5)

  clearfix
    clear: both
`;
