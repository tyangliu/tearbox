import React from 'react';
import Radium from 'radium';
import {connect} from 'react-redux';
import styler from 'react-styling';
import {animateScroll as scroll} from 'react-scroll';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import {EditableHeader} from './header';
import {Icon} from '../common';
import InfoBox from './infobox';
import {EditableItemTable} from './itemtable';
import EditableSection from './editablesection';
import Footer from './footer';
import NotFound from '../errors/NotFound';

import {
  loadTears,
  requestGetBox,
  toggleGroup,
  editAddGroup,
  endDrag,
} from '../../redux/actions';

import {
  UNAVAILABLE,
  REQUESTED,
  RECEIVED,
  NOT_FOUND,
} from '../../redux/constants';

@Radium
class EditableTearbox extends React.Component {
  focusNewGroup = () => {
    this.lastItemFirstInput && this.lastItemFirstInput.focus();
  };

  handleAddGroupClick = () => {
    const {editAddGroupFn} = this.props;
    editAddGroupFn();
    this.addGroupEl.blur();
    scroll.scrollToBottom();
    // Focus the newly created group once it's rendered.
    setTimeout(this.focusNewGroup, 200);
  };

  handleAddGroupKeyPress = event => {
    if (event.key != 'Enter') {
      return;
    }
    this.handleAddGroupClick();
  };

  refreshBox = () => {
    const {boxStatus, requestGetBoxFn, match} = this.props;
    requestGetBoxFn(match.params.id);
  };

  constructor(props) {
    super(props);
    this.refreshBox();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.refreshBox();
    }
  }

  render() {
    const {
      box,
      boxStatus,
      groupVisibilities,
      toggleGroupFn,
      endDragFn,
    } = this.props;

    if (boxStatus === NOT_FOUND) {
      return <NotFound/>;
    }
    // TODO: loading component 
    if (!box.id) {
      return <div/>;
    }

    return (
      <DragDropContext
        onDragEnd={endDragFn}
      >
          <div style={styles.tearbox}>
            <div style={styles.tearboxContainer}>
              <div style={styles.headerContainer}>
                <EditableHeader/>
              </div>
              <div style={styles.container}>
                <div style={styles.left}>
                  <div style={styles.mainLeftContent}>
                    <div style={styles.leftTop}>
                      <InfoBox/>
                    </div>
                  </div>
                  <Footer/>
                </div>

                <div style={styles.right}>
                  <Droppable
                    droppableId='itemGroupDroppable'
                    type='GROUP'
                  >
                    {(provided, snapshot) => (
                      <div style={styles.rightInner} ref={provided.innerRef}>
                        {(box.groups || []).map((group, i) =>
                          <Draggable
                            key={group.idx}
                            draggableId={`groupDraggable_${i}`}
                            index={i}
                          >
                            {(provided, snapshot) => (
                              <EditableSection
                                title={group.name}
                                type={group.type}
                                groupIdx={i}
                                groupStableIdx={group.idx}
                                provided={provided}
                                getRef={
                                  (i === box.groups.length - 1)
                                    ? e => {this.lastItemFirstInput = e;}
                                    : undefined
                                }
                                visible={groupVisibilities[i]}
                                onToggle={() => toggleGroupFn(i)}
                              >
                                <EditableItemTable
                                  items={group.items}
                                  groupIdx={i}
                                  groupStableIdx={group.idx}
                                  isLast={i == box.groups.length -1}
                                />
                              </EditableSection>
                            )}
                          </Draggable>
                        )}
                      </div>
                    )}
                  </Droppable>
                  <div style={styles.addSection}
                       key='addGroupButton'
                       tabIndex={0}
                       onClick={this.handleAddGroupClick}
                       onKeyPress={this.handleAddGroupKeyPress}
                       ref={e => {this.addGroupEl = e}}>
                    <Icon style={styles.addIcon} name='create_new_folder'/>
                    <span style={styles.addSectionText}>Add Section</span>
                  </div>
                </div>
                <div style={styles.clearfix}/>
              </div>
            </div>
          </div>
      </DragDropContext>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {ui, tears, box} = state;
  return {
    boxStatus: ui.boxStatus,
    box: box.stagingData,
    groupVisibilities: ui.groupVisibilities,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadTearsFn: () => dispatch(loadTears()),
    requestGetBoxFn: id => dispatch(requestGetBox(id)),
    toggleGroupFn: idx => dispatch(toggleGroup(idx)),

    editAddGroupFn: () => dispatch(editAddGroup()),
    endDragFn: result => dispatch(endDrag(result)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditableTearbox);

const styles = styler`
  tearbox
    width: 100%
    min-width: 1120px
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    height: 100vh

  tearboxContainer
    width: 100%
    max-width: 1600px
    display: flex
    flex-direction: column
    flex: 1

  headerContainer
    position: sticky
    top: 0
    z-index: 2
    background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(255,255,255,0.9) 80%,rgba(255,255,255,0) 100%)

  container
    padding: 0 30px

  left
    background: rgba(255,255,255,1)
    float: left
    flex-direction: column
    width: 300px
    margin: 0 30px 0 0
    position: sticky
    top: 103px
    z-index: 1

  mainLeftContent
    flex: 1

  leftTop
    padding: 10px 0
    flex: 1

  right
    background: rgba(255,255,255,1)
    overflow: hidden

  button
    width: 100%
    margin-bottom: 6px

  icon
    width: 20px
    font-size: 17px
    line-height: 24px
    display: block
    float: left
    user-select: none

  footnote
    text-align: right
    font-style: italic
    color: rgba(0,0,0,0.5)
    user-select: none

  addSection
    cursor: pointer
    user-select: none
    display: flex
    flex-direction: row
    margin: 2px 0 30px 0
    padding: 1px 0
    border: 2px dashed rgba(55,67,79,0.15)
    border-radius: 3px
    color: rgba(55,67,79,0.5)

    :hover, :focus
      outline: none
      border: 2px dashed rgba(180,40,36,0.2)
      color: rgba(217,52,35,1)
      background: rgba(180,40,36,0.05)

  addIcon
    padding: 0 4px
    line-height: 40px
    margin: 0 20px 0 23px

  addSectionText
    font-weight: bold
    font-size: 11px
    text-transform: uppercase
    letter-spacing: 0.5px
    line-height: 40px

  clearfix
    clear: both
`;
