import React, { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { MinutesToFormattedTime } from '../helpers/functions';

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
  const svgRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const colorScale = Object.fromEntries(
    users.map(({ user_id, user_color }) => [user_id, `#${user_color}`])
  );
  const nameById = Object.fromEntries(
    users.map(({ user_id, user_name }) => [user_id, user_name])
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

      // poziome linie siatki - ułatwiają odczyt wartości przez całą szerokość
      const gridGenerator = d3.axisLeft(yScale)
          .ticks(5)
          .tickSize(-boundsWidth)
          .tickFormat('');

      const grid = svgElement.append('g')
          .attr('class', 'grid')
          .call(gridGenerator);
      grid.selectAll('line')
          .attr('stroke', '#e9e9ef')
          .attr('stroke-dasharray', '0');
      grid.select('.domain').remove();

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
          .ticks(5)
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
      .attr('y1', yScale(goal))
      .attr('y2', yScale(goal))
      .attr('stroke', '#555')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5')
      .attr('pointer-events', 'none');

      svgElement.append('text')
      .attr('x', boundsWidth - 5)
      .attr('y', yScale(goal) - 6)
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

  // najechanie -> ustal najbliższy tydzień (do linii prowadzącej i tooltipa)
  const handleMove = (e) => {
      const svg = svgRef.current;
      if (!svg || !processedData.length) return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const loc = pt.matrixTransform(ctm.inverse());
      const px = loc.x - MARGIN.left;
      let best = 0;
      let bestDist = Infinity;
      processedData.forEach((d, i) => {
          const dist = Math.abs(xScale(d.x) - px);
          if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setHovered(best);
  };

  // dane tooltipa dla aktualnie najechanego tygodnia
  const tooltip = useMemo(() => {
      if (hovered == null || !processedData[hovered]) return null;
      const week = processedData[hovered];
      const rows = stackKeys.map(key => ({
          key,
          name: nameById[key],
          color: colorScale[key],
          minutes: week[key] || 0,
      })).sort((a, b) => b.minutes - a.minutes);
      const total = rows.reduce((sum, r) => sum + r.minutes, 0);
      const cx = xScale(week.x);

      const rowH = 18;
      const headerH = 22;
      const pad = 8;
      const boxH = headerH + rows.length * rowH + pad;
      const maxChars = Math.max(
          `${week.x}  •  ${MinutesToFormattedTime(total)}`.length,
          ...rows.map(r => `${r.name}${MinutesToFormattedTime(r.minutes)}`.length + 4)
      );
      const boxW = Math.max(130, 24 + maxChars * 6.5);
      // domyślnie po prawej od kursora, przy krawędzi przerzuć w lewo
      let bx = cx + 12;
      if (bx + boxW > boundsWidth) bx = cx - 12 - boxW;
      const by = 6;

      return { week, rows, total, cx, rowH, headerH, pad, boxH, boxW, bx, by };
  }, [hovered, processedData, stackKeys, nameById, colorScale, xScale, boundsWidth]);

    return (
    <StyledContainer>
        <StyledSvg
            ref={svgRef}
            width='100%'
            height='100%'
            viewBox={`0 0 ${width} ${height}`}
            onMouseMove={handleMove}
            onMouseLeave={() => setHovered(null)}
        >
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
                        {/* punkty danych - szczegół ułatwiający odczyt pojedynczych tygodni */}
                        {serie.map((d, j) => (
                            <circle
                                key={j}
                                cx={xScale(d.data.x)}
                                cy={yScale(d[1])}
                                r={2.2}
                                fill="#fff"
                                stroke={colorScale[serie.key]}
                                strokeWidth={1.5}
                                pointerEvents="none"
                            />
                        ))}
                    </g>
                ))}

                {/* linia prowadząca + wyróżnione punkty dla najechanego tygodnia */}
                {tooltip && (
                    <g pointerEvents="none">
                        <line
                            x1={tooltip.cx}
                            x2={tooltip.cx}
                            y1={0}
                            y2={boundsHeight}
                            stroke="#999"
                            strokeWidth={1}
                            strokeDasharray="4,4"
                        />
                        {series.map((serie, i) => (
                            <circle
                                key={i}
                                cx={tooltip.cx}
                                cy={yScale(serie[hovered][1])}
                                r={4}
                                fill={colorScale[serie.key]}
                                stroke="#fff"
                                strokeWidth={1.5}
                            />
                        ))}
                    </g>
                )}
            </StyledG>

            <StyledG
                width={boundsWidth}
                height={boundsHeight}
                ref={axesRef}
                transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
            />

            {/* tooltip ze szczegółami tygodnia */}
            {tooltip && (
                <StyledG
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
                    pointerEvents="none"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                    <rect
                        x={tooltip.bx}
                        y={tooltip.by}
                        width={tooltip.boxW}
                        height={tooltip.boxH}
                        rx={8}
                        fill="#fff"
                        stroke="#e2e2ea"
                        strokeWidth={1}
                        style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}
                    />
                    <text
                        x={tooltip.bx + tooltip.pad}
                        y={tooltip.by + 16}
                        fontSize="0.8rem"
                        fontWeight="700"
                        fill="#333"
                    >
                        {tooltip.week.x}
                    </text>
                    <text
                        x={tooltip.bx + tooltip.boxW - tooltip.pad}
                        y={tooltip.by + 16}
                        fontSize="0.75rem"
                        fontWeight="600"
                        fill="#888"
                        textAnchor="end"
                    >
                        Σ {MinutesToFormattedTime(tooltip.total)}
                    </text>
                    {tooltip.rows.map((r, idx) => {
                        const ry = tooltip.by + tooltip.headerH + idx * tooltip.rowH + 12;
                        return (
                            <g key={r.key}>
                                <circle
                                    cx={tooltip.bx + tooltip.pad + 4}
                                    cy={ry - 4}
                                    r={4}
                                    fill={r.color}
                                />
                                <text
                                    x={tooltip.bx + tooltip.pad + 14}
                                    y={ry}
                                    fontSize="0.78rem"
                                    fill="#444"
                                >
                                    {r.name}
                                </text>
                                <text
                                    x={tooltip.bx + tooltip.boxW - tooltip.pad}
                                    y={ry}
                                    fontSize="0.78rem"
                                    fontWeight="600"
                                    fill="#333"
                                    textAnchor="end"
                                >
                                    {MinutesToFormattedTime(r.minutes)}
                                </text>
                            </g>
                        );
                    })}
                </StyledG>
            )}
        </StyledSvg>
    </StyledContainer>
);
};

export default StackedAreaChart;
