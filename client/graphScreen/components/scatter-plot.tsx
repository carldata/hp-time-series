import * as React   from 'react';
import * as d3      from 'd3';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import DataCircles  from './data-circle';
import XYAxis       from './x-y-axis';
import { Point2D } from '../model';

export interface ScatterPlotProps {
  width: number;
  height: number;
  padding: number;
  data: Point2D[];
}

export class ScatterPlot extends React.Component<ScatterPlotProps, void> {
  xMax   = (data)  => d3.max(data, (d: Point2D) => d.x);
  yMax   = (data)  => d3.max(data, (d: Point2D) => d.y);
  
  xScale = (props: ScatterPlotProps) => {
    return d3.scale.linear()
      .domain([0, this.xMax(props.data)])
      .range([props.padding, props.width - props.padding * 2]);
  };
  
  yScale = (props: ScatterPlotProps) => {
    return d3.scale.linear()
      .domain([0, this.yMax(props.data)])
      .range([props.height - props.padding, props.padding]);
  };

  render() {
    return (
      <svg width={this.props.width} height={this.props.height}>
        <DataCircles data={this.props.data} xScale={this.xScale(this.props)} yScale={this.xScale(this.props)} />
        <XYAxis 
          height={this.props.height} 
          padding={30}
          xScale={this.xScale(this.props)} 
          yScale={this.yScale(this.props)} />
      </svg>
    );
  }
}

export default ScatterPlot;