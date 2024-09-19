import React, { useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { parseISO, differenceInCalendarWeeks, endOfISOWeek, format } from 'date-fns';

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

const StyledContainer = styled.div`
  max-width: 600px;
  margin: auto;
`;

const StyledSvg = styled.svg`
  text-align: center;
`;

const StyledG = styled.g`
  color: #333;
`;
const getWeekNumber = (dateString) => {
    const date = parseISO(dateString);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const weekNumber = differenceInCalendarWeeks(date, startOfYear, { weekStartsOn: 1 }) + 1;
    return weekNumber;
};

const generateWeeklyData = (data_V1) => {
    const weeklyData = {};
    const people = data_V1.map(person => person.Type);
    const currentDate = new Date();
    const endWeek = getWeekNumber(format(endOfISOWeek(currentDate), 'yyyy-MM-dd'));
    const startWeek = endWeek - 9;

    for (let week = startWeek; week <= endWeek; week++) {
        weeklyData[week] = { x: `${week}` };
        people.forEach(person => {
            weeklyData[week][person] = 0;
        });
    }

    data_V1.forEach(person => {
        person.activities.forEach(activity => {
            const weekNumber = getWeekNumber(activity.date);
            if (weekNumber !== null && weekNumber >= startWeek && weekNumber <= endWeek) {
                const timeInMinutes =activity.time ;
                weeklyData[weekNumber][person.Type] += timeInMinutes;
            }
        });
    });

    return Object.values(weeklyData).sort((a, b) => a.x.localeCompare(b.x));
};

const StackedAreaChart = ({ goal, selectedComponent, setSelectedComponent, width, height, activities }) => {
  const data = generateWeeklyData(activities);
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const stackKeys =  activities.map(item => item.Type);
  const stackSeries = d3.stack()
      .keys(stackKeys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

  const series = stackSeries(data);

  const colorScale = d3.scaleOrdinal()
      .domain(stackKeys)
      .range(['#e94547', '#7dcef5', '#79c191', '#bd66bd']);
//   const colorScale=activities.map(item => item.Color);
  const maxMinutes = d3.max(series, s => d3.max(s, d => d[1])) || goal; 

  const yScale = useMemo(() => d3.scaleLinear()
    .domain([0, Math.max(maxMinutes, goal)])
    .range([boundsHeight, 0]), [boundsHeight, maxMinutes]);

  const xScale = useMemo(() => d3.scalePoint()
      .domain(data.map(d => d.x))
      .range([0, boundsWidth]), [data, boundsWidth]);

  useEffect(() => {
      const svgElement = d3.select(axesRef.current);
      svgElement.selectAll('*').remove();

      const xAxisGenerator = d3.axisBottom(xScale)
      .tickFormat((d, i) => i === 0 ? `tydz. ${d}` : d); 

      const xTicks = svgElement.append('g')
          .attr('transform', `translate(0, ${boundsHeight})`)
          .style('font-weight', '500')
          .style('font-family', '"DM Sans", sans-serif')
          .style('font-size', '.85rem')
          .call(xAxisGenerator);

      xTicks.selectAll('text')
          .attr('transform', 'translate(0, 3)');

      d3.select(xTicks.selectAll('.tick text').nodes()[0]).attr('transform', 'translate(-17, 3)');

      const yAxisGenerator = d3.axisLeft(yScale)
          .tickFormat(d => `${(d / 60).toFixed(0)}h`);
          
      svgElement.append('g')
          .call(yAxisGenerator)
          .style('font-weight', '500')
          .style('font-family', '"DM Sans", sans-serif')
          .style('font-size', '.85rem');

      svgElement.append('line')
      .attr('x1', 0)
      .attr('x2', boundsWidth)
      .attr('y1', yScale(goal - 1))
      .attr('y2', yScale(goal - 1))
      .attr('stroke', '#555')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5'); 
      
      svgElement.append('text')
      .attr('x', boundsWidth - 5)
      .attr('y', yScale(1200) - 3)
      .attr('text-anchor', 'end')
      .attr('cursor', 'default')
      .attr('font-size', '0.9rem')
      .attr('font-weight', '600')
      .attr('font-family', '"DM Sans", sans-serif')
      .attr('fill', '#555')
      .text('cel');
  }, [xScale, yScale, boundsHeight]);

  const areaBuilder = d3.area()
      .x(d => xScale(d.data.x))
      .y1(d => yScale(d[1]))
      .y0(d => yScale(d[0]));

  const lineBuilder = d3.line()
      .x(d => xScale(d.data.x))
      .y(d => yScale(d[1]));

    return (
    <StyledContainer>
        <StyledSvg width='100%' height='100%' viewBox={`0 0 ${width} ${height}`}>
            <StyledG transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}>
                {series && series.map((serie, i) => (
                    <g key={i}
                        onMouseEnter={(e) => {
                            if (serie.key !== (selectedComponent && selectedComponent.Type)) {
                                d3.select(e.currentTarget).select('path').attr('fill-opacity', 0.4);
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (serie.key !== (selectedComponent && selectedComponent.Type)) {
                                d3.select(e.currentTarget).select('path').attr('fill-opacity', 0.3);
                            }
                        }}
                        onClick={() => {
                            setSelectedComponent(serie.key);
                        }}
                    >
                        <path
                            data-key={serie.key}
                            d={areaBuilder(serie)}
                            stroke="none"
                            fill={colorScale(serie.key)}
                            fillOpacity={serie.key === selectedComponent ? 0.5 : 0.3}
                        />
                        <path
                            d={lineBuilder(serie)}
                            stroke={colorScale(serie.key)}
                            fill="none"
                            strokeWidth={1.7}
                        />
                    </g>
                ))}
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