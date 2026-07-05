import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

const StyledContainer = styled.div`
  margin: auto;
`;

const StyledSvg = styled.svg`
  text-align: center;
`;

const StyledG = styled.g`
  color: #333;
`;

const StackedAreaChart = ({ data, goal, width, height, users, selectedUserId }) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const colorScale = Object.fromEntries(
    users.map(({ user_id, user_color }) => [user_id, `#${user_color}`])
  );  

  const processData = useCallback((rawData) => {
    if (!rawData || Object.keys(rawData).length === 0)
        return [];
    const weeks = Object.keys(rawData);

    if (!weeks.length)
        return [];

    return weeks.map(week => {
        const formattedWeek = new Date(week).toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
          });
        const entry = { x: formattedWeek };
        // każdy członek grupy ma wartość w każdym tygodniu (brak aktywności = 0),
        // inaczej d3.stack robi NaN i obszar nie jest wypełniany
        users.forEach(u => {
            entry[u.user_id] = rawData[week][u.user_id] || 0;
        });
        return entry;
    });
    }, [users]);
    const processedData = useMemo(() => processData(data), [data, processData]);
    const stackKeys = (selectedUserId != null
        ? users.filter(m => m.user_id === selectedUserId)
        : users
    ).map(m => m.user_id);
    const stackSeries = d3.stack()
      .keys(stackKeys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);
    const series = stackSeries(processedData);
    const maxMinutes = d3.max(series, s => d3.max(s, d => d[1])) || goal; 
    const yScale = useMemo(() => d3.scaleLinear()
    .domain([0, Math.max(maxMinutes, goal)])
    .range([boundsHeight, 0]), [boundsHeight, maxMinutes, goal]);

  const xScale = useMemo(() => d3.scalePoint()
      .domain(processedData.map(d => d.x).reverse())
      .range([0, boundsWidth]), [processedData, boundsWidth]);

  useEffect(() => {
      const svgElement = d3.select(axesRef.current);
      svgElement.selectAll('*').remove();
      
      const xAxisGenerator = d3.axisBottom(xScale)
      .tickFormat((d, i) => d); 

      const xTicks = svgElement.append('g')
          .attr('transform', `translate(0, ${boundsHeight})`)
          .style('font-weight', '500')
          .style('font-family', '"DM Sans", sans-serif')
          .style('font-size', '.85rem')
          .style('pointer-events', 'none')
          .call(xAxisGenerator);

      xTicks.selectAll('text')
          .attr('transform', 'translate(0, 4)');


      const yAxisGenerator = d3.axisLeft(yScale)
          .tickFormat(d => `${(d / 60).toFixed(0)}h`);
          
      svgElement.append('g')
          .call(yAxisGenerator)
          .style('font-weight', '500')
          .style('font-family', '"DM Sans", sans-serif')
          .style('font-size', '.85rem')
          .style('pointer-events', 'none')

         
      svgElement.append('line')
      .attr('x1', 0)
      .attr('x2', boundsWidth)
      .attr('y1', yScale(goal - 1))
      .attr('y2', yScale(goal - 1))
      .attr('stroke', '#555')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5') 
      .attr('pointer-events', 'none'); 
      
      svgElement.append('text')
      .attr('x', boundsWidth - 5)
      .attr('y', yScale(1200) - 3)
      .attr('text-anchor', 'end')
      .attr('cursor', 'default')
      .attr('font-size', '0.9rem')
      .attr('font-weight', '600')
      .attr('font-family', '"DM Sans", sans-serif')
      .style('pointer-events', 'none')
      .attr('fill', '#555')
      .text('cel');

  }, [xScale, yScale, boundsHeight, boundsWidth, goal]);

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
                            document.getElementById(`pieArc${serie.key}`)?.dispatchEvent(new Event('mouseenterchart'));
                            d3.select(e.currentTarget).select('path').attr('fill-opacity', 0.7);
                        }}
                        onMouseLeave={(e) => {
                            document.getElementById(`pieArc${serie.key}`)?.dispatchEvent(new Event('mouseleavechart'));
                            d3.select(e.currentTarget).select('path').attr('fill-opacity', 0.6);
                        }}
                        onClick={() => {
                            document.getElementById(`pieArc${serie.key}`)?.dispatchEvent(new Event('click'));
                        }}
                    >
                        <path
                            id={`chartArea${serie.key}`}
                            className="opacity"
                            data-key={serie.key}
                            d={areaBuilder(serie)}
                            stroke="none"
                            fill={colorScale[serie.key]}
                            fillOpacity={0.6}
                            style={{ transition: 'fill-opacity 0.25s' }}
                        />
                        <path
                            d={lineBuilder(serie)}
                            stroke={colorScale[serie.key]}
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