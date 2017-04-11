import { Dispatch } from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Panel, ButtonGroup, Button, ListGroup, ListGroupItem, Grid, Form, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock  } from 'react-bootstrap';
import { ReactSlider } from './../../components/react-slider/react-slider';
import { BootstrapFormGroupStaticText } from './../../components/ui/bootstrapFormGroupStaticText';
import { GraphScreenState } from './model';
import { TextInput } from './../../components/ui/textInput';
import { LinearChart } from '../LinearChart';
import { EnumGraphPointsSelectionMode, EnumZoomSelected } from '../LinearChart/components/enums';
import { IChartDimensions } from '../linearChart/common/interfaces';
import { changeDateFromToValue, setupWindowWidthMinutes, setupGraphPointsSelectionMode, setupZoomWindowLimitation } from './actions';

interface MainScreenProps {
  state: GraphScreenState;
  dispatch: Dispatch<{}>;
}

export class MainScreen extends React.Component<MainScreenProps, void> {
  private _chartDimensions: IChartDimensions = {
    canvasHeight: 500,
    canvasWidth: 800,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0
  };

  /**
   * Calculates the difference in minutes between the datetime of the last available and the first available point
   */
  translateDateTimeToMinutesDomain(state: GraphScreenState, dateTime: moment.Moment): number {
    var result: number;
    switch (state.chartZoomSettings.zoomSelected) {
      case EnumZoomSelected.NoZoom:
        result = dateTime.diff(state.allPointsFrom.clone(), "minutes");
        break;
      case EnumZoomSelected.ZoomLevel1:
        result = dateTime.diff(state.chartZoomSettings.zoomLevel1PointsFrom.clone(), "minutes");
        break;
      case EnumZoomSelected.ZoomLevel2:
        result = dateTime.diff(state.chartZoomSettings.zoomLevel2PointsFrom.clone(), "minutes");
        break;
    }
    return result;
  }

  calculateDomainLengthMinutes(state: GraphScreenState): number {
    var result: number;
    switch (state.chartZoomSettings.zoomSelected) {
      case EnumZoomSelected.NoZoom:
        result = this.translateDateTimeToMinutesDomain(state, state.allPointsTo);
        break;
      case EnumZoomSelected.ZoomLevel1:
        result = this.translateDateTimeToMinutesDomain(state, state.chartZoomSettings.zoomLevel1PointsTo);
        break;
      case EnumZoomSelected.ZoomLevel2:
        result = this.translateDateTimeToMinutesDomain(state, state.chartZoomSettings.zoomLevel2PointsTo);
        break;
    }
    return result;
  }

  translateMinutesDomainToDateTime(state: GraphScreenState, minutes: number): moment.Moment {
    var result: moment.Moment;
    switch (state.chartZoomSettings.zoomSelected) {
      case EnumZoomSelected.NoZoom:
        result = state.allPointsFrom.clone().add(minutes, "minutes");
        break;
      case EnumZoomSelected.ZoomLevel1:
        result = state.chartZoomSettings.zoomLevel1PointsFrom.clone().add(minutes, "minutes");
        break;
      case EnumZoomSelected.ZoomLevel2:
        result = state.chartZoomSettings.zoomLevel2PointsFrom.clone().add(minutes, "minutes");
        break;
    }
    return result;
  }

  getGraphPointsSelectionButtonStyle(stateMode: EnumGraphPointsSelectionMode, expectedMode: EnumGraphPointsSelectionMode): string {
    return stateMode == expectedMode ? "success" : "default";
  }

  getZoomButtonStyle(stateMode: EnumZoomSelected, expectedMode: EnumZoomSelected): string {
    return stateMode == expectedMode ? "success" : "default";
  }

  calculateSliderValue(state: GraphScreenState): number[] {
    return [
      this.translateDateTimeToMinutesDomain(state, state.windowDateFrom), 
      this.translateDateTimeToMinutesDomain(state, state.windowDateTo)
    ];
  }

  isButtonDisabled(zoomLimitationLevelButtonIsPresenting: EnumZoomSelected, currentZoomLimitationLevel: EnumZoomSelected): boolean {
    return Math.abs(zoomLimitationLevelButtonIsPresenting - currentZoomLimitationLevel) > 1;
  }

  render() {
    const { state, dispatch } = this.props;

    return (
      <div>
        <h5>
          This screen uses Bootstrap input controls that define
          max-values of randomly selected (x,y) points and the total number of points,
          that are immediately rendered in D3-based svg component on the screen.   
        </h5>
        <Grid>
          <Row>
            <Col componentClass={ControlLabel} md={2}>
               Samples from:
            </Col>
            <Col md={2}>
              <BootstrapFormGroupStaticText text={state.allPointsFrom.format("YYYY-MM-DD HH:mm")} />
            </Col>
            <Col componentClass={ControlLabel} md={2}>
              Samples to:
            </Col>
            <Col md={2}>
              <BootstrapFormGroupStaticText text={state.allPointsTo.format("YYYY-MM-DD HH:mm")} />
            </Col>
            <Col componentClass={ControlLabel} md={2}>
              Total number of samples:
            </Col>
            <Col md={2}>
              <BootstrapFormGroupStaticText text={state.allPoints.length.toString()} />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} md={2}>
               Window date from:
            </Col>
            <Col md={2}>
              <BootstrapFormGroupStaticText text={state.windowDateFrom.format("YYYY-MM-DD HH:mm")} />
            </Col>
            <Col componentClass={ControlLabel} md={2}>
              Window date to:
            </Col>
            <Col md={2}>
              <BootstrapFormGroupStaticText text={state.windowDateTo.format("YYYY-MM-DD HH:mm")} />
            </Col>
            <Col componentClass={ControlLabel} md={2}>
              Min. window width:
            </Col>
            <Col md={2}>
              <BootstrapFormGroupStaticText text={ state.dateFromToMinimalWidthMinutes.toString() + " minutes"} />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} md={12}>
              <ButtonGroup>
                <Button bsSize="xs" onClick={() => this.props.dispatch(setupGraphPointsSelectionMode(EnumGraphPointsSelectionMode.NoSelection)) } 
                  bsStyle={this.getGraphPointsSelectionButtonStyle(state.graphPointsSelectionMode, EnumGraphPointsSelectionMode.NoSelection)}>No selection</Button>
                <Button bsSize="xs" onClick={() => this.props.dispatch(setupGraphPointsSelectionMode(EnumGraphPointsSelectionMode.SelectUnselectSingle)) } 
                  bsStyle={this.getGraphPointsSelectionButtonStyle(state.graphPointsSelectionMode, EnumGraphPointsSelectionMode.SelectUnselectSingle)}>Select single point</Button>
                <Button bsSize="xs" onClick={() => this.props.dispatch(setupGraphPointsSelectionMode(EnumGraphPointsSelectionMode.SelectMultiple)) } 
                  bsStyle={this.getGraphPointsSelectionButtonStyle(state.graphPointsSelectionMode, EnumGraphPointsSelectionMode.SelectMultiple)}>Select multiple points</Button>
                <Button bsSize="xs" onClick={() => this.props.dispatch(setupGraphPointsSelectionMode(EnumGraphPointsSelectionMode.UnselectMultiple))} 
                  bsStyle={this.getGraphPointsSelectionButtonStyle(state.graphPointsSelectionMode, EnumGraphPointsSelectionMode.UnselectMultiple)}>Unselect multiple points</Button>
              </ButtonGroup>
              &nbsp;
              <ButtonGroup>
                <Button bsSize="xs"
                  onClick={() => this.props.dispatch(setupWindowWidthMinutes(state.windowDateTo.diff(state.windowDateFrom, "minutes"))) }>
                  Lock window width to current
                </Button>
                <Button bsSize="xs"
                  onClick={() => this.props.dispatch(setupWindowWidthMinutes(5)) }>
                  Unlock window width
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} md={12}>
              <LinearChart 
                chartDimensions={this._chartDimensions}
                zoomSettings={this.props.state.chartZoomSettings}
                data={this.props.state.allPoints} 
                windowDateFrom={this.props.state.windowDateFrom} 
                windowDateTo={this.props.state.windowDateTo}
                yMinValue={this.props.state.yMinValue}
                yMaxValue={this.props.state.yMaxValue}
                secondsPerSample={this.props.state.secondsPerSample}
                graphPointsSelectionMode={this.props.state.graphPointsSelectionMode} />
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} md={12}>
              <ButtonGroup>
                <Button 
                  disabled={this.isButtonDisabled(EnumZoomSelected.NoZoom, state.chartZoomSettings.zoomSelected)} 
                  bsSize="xs" 
                  onClick={() => this.props.dispatch(setupZoomWindowLimitation(EnumZoomSelected.NoZoom)) } 
                  bsStyle={this.getZoomButtonStyle(state.chartZoomSettings.zoomSelected, EnumZoomSelected.NoZoom)}>
                  View All
                </Button>
                <Button 
                  disabled={this.isButtonDisabled(EnumZoomSelected.ZoomLevel1, state.chartZoomSettings.zoomSelected)}
                  bsSize="xs" 
                  onClick={() => this.props.dispatch(setupZoomWindowLimitation(EnumZoomSelected.ZoomLevel1)) } 
                  bsStyle={this.getZoomButtonStyle(state.chartZoomSettings.zoomSelected, EnumZoomSelected.ZoomLevel1)}>
                  Zoom level 1
                </Button>
                <Button 
                  disabled={this.isButtonDisabled(EnumZoomSelected.ZoomLevel2, state.chartZoomSettings.zoomSelected)}
                  bsSize="xs" 
                  onClick={() => this.props.dispatch(setupZoomWindowLimitation(EnumZoomSelected.ZoomLevel2)) } 
                  bsStyle={this.getZoomButtonStyle(state.chartZoomSettings.zoomSelected, EnumZoomSelected.ZoomLevel2)}>
                  Zoom level 2
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col componentClass={ControlLabel} md={12}>
              <ReactSlider
                value={this.calculateSliderValue(state)}
                min={0} 
                max={this.calculateDomainLengthMinutes(state)} 
                pearling={true}
                minDistance={state.dateFromToMinimalWidthMinutes}
                onChange={(e: Array<number>) => {
                  var [fromMinutes, toMinutes] = e;
                  var newDateFrom = this.translateMinutesDomainToDateTime(state, fromMinutes);
                  var newDateTo = this.translateMinutesDomainToDateTime(state, toMinutes);
                  if (!this.props.state.windowDateFrom.isSame(newDateFrom) || !this.props.state.windowDateTo.isSame(newDateTo)) {
                    this.props.dispatch(changeDateFromToValue(newDateFrom.format("YYYY-MM-DD HH:mm"), newDateTo.format("YYYY-MM-DD HH:mm")));
                    return;
                  }
                }}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

//function call every time re-render is happening,
//allows to transfer all application state to only 
//a fragment MainScreen component keeps interest in 
const mapStateToProps = state => {
  //console.log() only for demonstration purposes
  // console.log('mainScreen mapStateToProps', state);
  return  {
    state: state.graphScreenState
  }
};


export default connect(mapStateToProps)(MainScreen);