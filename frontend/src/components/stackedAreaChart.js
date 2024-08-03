import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

const StyledContainer= styled.div`
    max-width:600px;
    margin:auto;
`;

const StyledSvg=styled.svg`
    text-align:center;
`;

const StyledG=styled.g`
    color:#333;
`;

const StackedAreaChart = ({   data }) => {
  const [dynamicSize, setDynamicSize] = useState({ width: 600, height: 400 });
  const { width, height } = dynamicSize;

  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Data Wrangling: stack the data
  const stackKeys = ['Karolina', 'Kasia', 'Angelika', 'Emilia'];
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
      .style('font-weight', '500')
      .style('font-family', '"DM Sans", sans-serif')
      .style('font-size', '.85rem')
      .call(xAxisGenerator);
    
      xTicks
      .selectAll('text')
      .attr('transform', 'translate(0, 3)');
      
      d3.select(xTicks.selectAll('.tick text').nodes()[0]).attr('transform', 'translate(-17, 3)');
    

    const yAxisGenerator = d3.axisLeft(yScale)
      .tickFormat(d => `${(d / 60).toFixed(0)}h`); // Format to display hours without decimal
    svgElement.append('g')
        .call(yAxisGenerator)
        .style('font-weight', '500')
        .style('font-family', '"DM Sans", sans-serif')
        .style('font-size', '.85rem')
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
    <StyledContainer>
      <StyledSvg width='100%' height='100%' viewBox={`0 0 600 400`}>
        <StyledG transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}>
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
                    strokeWidth="1px"
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
    </StyledContainer>
  );
};

export default StackedAreaChart;