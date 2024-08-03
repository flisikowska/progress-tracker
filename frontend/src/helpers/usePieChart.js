import { useEffect } from 'react';
import * as d3 from 'd3';

const usePieChart = (data_V1, setSelectedComponent) => {
  useEffect(() => {
    const width = parseInt(d3.select('#pieChart').style('width'), 10);
    const height = width;
    const radius = 90;
    // const radius = (Math.min(width, height) - 15) / 2;
    const types = data_V1.map(d => d.Type);

    var inner = Math.min(radius, 150);
    var outer = Math.max(radius, 150);

    const arcOver = d3.arc()
      .outerRadius(inner - 10)
      .innerRadius(outer + 20);

    const color = d3.scaleOrdinal()
      .domain(types)
      .range(["#e94547", "#7dcef5", "#79c191", "#bd66bd", "#dcdcdc"]);

    const arc = d3.arc()
      .outerRadius(inner - 10)
      .innerRadius(outer);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.Amount);
    // Compute the position of each group on the pie
    // var pie = d3.pie()
    //   .value(function (d) { return d.Amount; })
    //   .sort(function (a, b) { console.log(a); return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart

    const svg = d3.select("#pieChart").append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr("overflow", 'unset')
      .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const g = svg.selectAll("path")
      .data(pie(data_V1))
      .enter().append("path")
      .style("fill", d => color(d.data.Type))
      .style("stroke",  d => color(d.data.Type))  // Ramka wokół segmentu
      .style("stroke-width", d=> d.data.Type==="Pozostało"? "0px": "2px")  // Grubość ramki
      .style("fill-opacity", 0.3)  // Przezroczystość wypełnienia
      .attr("d", arc)
      .on("click", function (event, d) {
        change(d, this);
      });

    const change = (d, i) => {
      const angle = 90 - ((d.startAngle * (180 / Math.PI)) + ((d.endAngle - d.startAngle) * (180 / Math.PI) / 2));
      const pieChartContainer = document.querySelector('#pieChartContainer');
      if (d.data.Type !== "Pozostało") {
        pieChartContainer.style.transform = 'translateX(0)';
        setTimeout(() => {
          setSelectedComponent(() => d);
        },800); // Opóźnienie pojawienia się komponentu po animacji
        svg.transition()
        .duration(1000)
        .attr("transform", "translate(" + width/2 + "," + height / 2 + ") rotate(" + angle + ")");
      }
      else {
        if(window.innerWidth >= 1000)
          pieChartContainer.style.transform = 'translateX(270px)';
        setSelectedComponent(null);
        svg.transition()
        .duration(1000)
        .attr("transform", "translate(" + width/2 + "," + height / 2 + ") rotate(" + 0 + ")");
      }
      svg.selectAll("path")
        .transition()
        .duration(1000)
        .attr("d", arc);
      d3.select(i)
        .transition()
        .duration(1000)
        .attr("d", arcOver);
    };

    // Cleanup on component unmount
    return () => {
      d3.select("#pieChart").select("svg").remove();
    };

  }, [data_V1, setSelectedComponent]);
};

export default usePieChart;