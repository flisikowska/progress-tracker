import { useEffect } from 'react';
import * as d3 from 'd3';

const radius = 90;
const inner = Math.min(radius, 150);
const outer = Math.max(radius, 150);

const arc = d3.arc()
  .outerRadius(inner - 10)
  .innerRadius(outer);

const arcOver = d3.arc()
  .outerRadius(inner - 10)
  .innerRadius(outer + 20);

const usePieChart = (data, setComponent, selected) => {
  const selectedId = selected?.user_id;

  // rysowanie wykresu
  useEffect(() => {
    const pieChartElement = d3.select('#pieChart');
    const width = parseInt(pieChartElement.style('width'), 10);
    const height = width;

    const pie = d3.pie()
      .sort(null)
      .value(d => d.amount);

    const svg = d3.select("#pieChart").append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr("overflow", 'unset')
      .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg
      .selectAll("path")
      .data(pie(data))
      .enter().append("path")
      .style("fill", d => d.data.color)
      .style("stroke", d => d.data.color)
      .style("stroke-width", d => d.data.name === "Pozostało" ? "0px" : "2px")
      .attr("d", arc)
      .attr("id", d => `pieArc${d.data.user_id}`)
      .attr("fill-opacity", 0.3)
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("fill-opacity", 0.4);
        d3.select(`#chartArea${d.data.user_id}`).attr('fill-opacity', '0.4');
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).attr("fill-opacity", 0.3);
        d3.select(`#chartArea${d.data.user_id}`).attr('fill-opacity', '0.3');
      })
      .on("mouseenterchart", function (event, d) {
        d3.select(this).attr("fill-opacity", 0.4);
      })
      .on("mouseleavechart", function (event, d) {
        d3.select(this).attr("fill-opacity", 0.3);
      })
      .on("click", function (event, d) {
        setComponent(d.data.name === "Pozostało" ? null : d.data);
      });

    return () => {
      d3.select("#pieChart").select("svg").remove();
    };
  }, [data, setComponent]);

  // obrót koła podąża za wybranym userem (jak wcześniej) — na desktopie
  useEffect(() => {
    const g = d3.select('#pieChart').select('svg').select('g');
    if (g.empty()) return;

    const width = parseInt(d3.select('#pieChart').style('width'), 10);
    const height = width;

    g.selectAll('path')
      .transition()
      .duration(800)
      .attr('d', arc);

    if (selectedId == null) {
      g.transition()
        .duration(800)
        .attr('transform', `translate(${width / 2},${height / 2}) rotate(0)`);
      return;
    }

    g.selectAll('path').each(function (d) {
      if (d.data.user_id === selectedId) {
        const angle = 90 - ((d.startAngle * (180 / Math.PI)) + ((d.endAngle - d.startAngle) * (180 / Math.PI) / 2));
        g.transition()
          .duration(800)
          .attr('transform', `translate(${width / 2},${height / 2}) rotate(${angle})`);
        d3.select(this)
          .transition()
          .duration(800)
          .attr('d', arcOver);
      }
    });
  }, [selectedId, data]);
};

export default usePieChart;
