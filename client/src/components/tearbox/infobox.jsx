import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';

import ContactList from './contactlist';
import ClipboardBox from './clipboardbox';

@Radium
class InfoBox extends React.Component {
  render() {
    const {box, style} = this.props;
    return (
      <div style={[styles.infoBox, style]}>
        <h2 style={styles.boxHeader}>
          {box.name}'s Box
        </h2>
        <ContactList fields={box.fields || []}/>
        <ClipboardBox value={`https://tearbox.io/box/${box.id}`}
                      style={styles.linkshare}/>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {ui, tears, box} = state;
  return {
    box: box.present.data,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InfoBox);

const styles = styler`
  boxHeader
    margin-top: 10px
    font-size: 21px
    margin-bottom: 1em

  linkshare
    margin-bottom: 60px
`;
