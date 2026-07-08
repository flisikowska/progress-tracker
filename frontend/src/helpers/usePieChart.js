import { useEffect } from 'react';
import * as d3 from 'd3';

const radius = 90;
const inner = Math.min(radius, 150);
const outer = Math.max(radius, 150);

const POP_OFFSET = 18; // stałe wysunięcie zaznaczonego segmentu (px)

const PAD = POP_OFFSET + 6;

const SIZE = outer * 2 + PAD * 2;
const CENTER = outer + PAD;

const arc = d3.arc()
  .outerRadius(inner + 8)
  .innerRadius(outer);

const usePieChart = (data, setComponent, selected) => {
  const selectedId = selected?.user_id;

  // rysowanie wykresu
  useEffect(() => {
    const pie = d3.pie()
      .sort(null)
      .value(d => d.amount);

    const svg = d3.select("#pieChart").append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr("overflow", 'unset')
      .attr('viewBox', `0 0 ${SIZE} ${SIZE}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append("g")
      .attr("transform", `translate(${CENTER},${CENTER})`);

    svg
      .selectAll("path")
      .data(pie(data))
      .enter().append("path")
      .style("fill", d => d.data.color)
      .style("stroke", d => d.data.color)
      .style("stroke-width", d => d.data.name === "Pozostało" ? "0px" : "2px")
      .style("cursor", d => d.data.name === "Pozostało" ? "default" : "pointer")
      .attr("d", arc)
      .attr("id", d => `pieArc${d.data.user_id}`)
      .attr("fill-opacity", 0.6)
      .on("mouseenter", function (event, d) {
        d3.select(this).transition('fade').duration(250).attr("fill-opacity", 0.7);
        d3.select(`#chartArea${d.data.user_id}`).transition('fade').duration(250).attr('fill-opacity', '0.7');
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).transition('fade').duration(250).attr("fill-opacity", 0.6);
        d3.select(`#chartArea${d.data.user_id}`).transition('fade').duration(250).attr('fill-opacity', '0.6');
      })
      .on("mouseenterchart", function (event, d) {
        d3.select(this).transition('fade').duration(250).attr("fill-opacity", 0.7);
      })
      .on("mouseleavechart", function (event, d) {
        d3.select(this).transition('fade').duration(250).attr("fill-opacity", 0.6);
      })
      .on("click", function (event, d) {
        setComponent(d.data.name === "Pozostało" ? null : d.data);
      });

    svg.selectAll("path").filter(d => d.data.name === "Pozostało").lower();

    return () => {
      d3.select("#pieChart").select("svg").remove();
    };
  }, [data, setComponent]);

  useEffect(() => {
    const g = d3.select('#pieChart').select('svg').select('g');
    if (g.empty()) return;

    const FULL = 2 * Math.PI - 0.01; // segment obejmujący (prawie) całe koło

    const remaining = data.find(d => d.name === 'Pozostało');
    const circleFull = !remaining || remaining.amount <= 0;

    let rotation = 0;
    if (selectedId != null) {
      g.selectAll('path').each(function (d) {
        if (d.data.user_id === selectedId && (d.endAngle - d.startAngle) < FULL) {
          rotation = 90 - ((d.startAngle * (180 / Math.PI)) + ((d.endAngle - d.startAngle) * (180 / Math.PI) / 2));
        }
      });
    }
    g.transition('pop')
      .duration(800)
      .attr('transform', `translate(${CENTER},${CENTER}) rotate(${rotation})`);

    g.selectAll('path')
      .transition('pop')
      .duration(800)
      .attr('transform', function (d) {
        if (selectedId != null && d.data.user_id === selectedId && !circleFull) {
          const mid = (d.startAngle + d.endAngle) / 2;
          return `translate(${Math.sin(mid) * POP_OFFSET},${-Math.cos(mid) * POP_OFFSET})`;
        }
        return 'translate(0,0)';
      });
  }, [selectedId, data]);
};

export default usePieChart;
