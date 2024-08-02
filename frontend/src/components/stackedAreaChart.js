import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

const StyledSvg=styled.svg`
    font-size:1.2rem;
    text-align:center;
`;

const StyledG=styled.g`
    color:#333;
`;
const StackedAreaChart = ({ width, height, data }) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Data Wrangling: stack the data
  const stackKeys = ['groupA', 'groupB', 'groupC', 'groupD'];
  const stackSeries = d3.stack()
    .keys(stackKeys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);
  const series = stackSeries(data);

  // Define color scale
  const colorScale = d3.scaleOrdinal()
    .domain(stackKeys)
    .range(['#e94547', '#7dcef5', '#79c191', '#bd66bd', '#dcdcdc']);

  // Y axis - set max to 1200 minutes
  const maxMinutes = 1200;
  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, maxMinutes])
      .range([boundsHeight, 0]);
  }, [height, maxMinutes]);

  // X axis
  const xScale = useMemo(() => {
    return d3.scalePoint()
      .domain(data.map(d => d.x))
      .range([0, boundsWidth]);
  }, [data, width]);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();

    const xAxisGenerator = d3.axisBottom(xScale);
    var xTicks = svgElement.append('g')
      .attr('transform', `translate(0, ${boundsHeight})`)
      .style('font-weight', '600')
      .style('font-size', '.8rem')
      .call(xAxisGenerator);
      
    xTicks
        .selectAll('text')
        .attr('transform', 'translate(0, 3)');

    const yAxisGenerator = d3.axisLeft(yScale)
      .tickFormat(d => `${(d / 60).toFixed(0)}h`); // Format to display hours without decimal
    svgElement.append('g')
        .call(yAxisGenerator)
        .style('font-weight', '600')
        .style('font-size', '.7rem')
        ;
  }, [xScale, yScale, boundsHeight]);

  // Build the line
  const areaBuilder = d3.area()
    .x(d => xScale(d.data.x))
    .y1(d => yScale(d[1]))
    .y0(d => yScale(d[0]));

     // Build the line
  const lineBuilder = d3.line()
  .x(d => xScale(d.data.x))
  .y(d => yScale(d[1]));

  return (
    <div>
      <StyledSvg width={width} height={height}>
        <StyledG
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
        {series && series.map((serie, i) => (
            <>
                <path
                    key={i}
                    d={areaBuilder(serie)}
                    opacity={1}
                    stroke="none"
                    fill={colorScale(serie.key)}
                    fillOpacity={0.3}
                    />
                <path
                    d={lineBuilder(serie)}
                    opacity={1}
                    stroke={colorScale(serie.key)}
                    fill="none"
                    strokeWidth="2px"
                />
            </>
        ))};
        </StyledG>
        <StyledG
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
      </StyledSvg>
    </div>
  );
};

export default StackedAreaChart;