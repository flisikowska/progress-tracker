import { useEffect, useState } from 'react';
import * as d3 from 'd3';

const usePieChart = (data_V1, setSelectedComponent, selectedComponent) => {
  const [currentRotation, setCurrentRotation] = useState(0); 
  useEffect(() => {
    const pieChartElement = d3.select('#pieChart');
    const width = parseInt(pieChartElement.style('width'), 10);
    const height = width;
    const radius = 90;
    const inner = Math.min(radius, 150);
    const outer = Math.max(radius, 150);

    const arc = d3.arc()
      .outerRadius(inner - 10)
      .innerRadius(outer);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.Amount);

    const svg = d3.select("#pieChart").append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr("overflow", 'unset')
      .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append("g")
      .attr("transform", window.innerWidth <= 1000 ? "translate(" + width / 2 + "," + height / 2 + ") rotate(270)" : "translate(" + width / 2 + "," + height / 2 + ") rotate(" + currentRotation + ")");

    const g = svg.selectAll("path")
      .data(pie(data_V1))
      .enter().append("path")
      .style("fill", d => d.data.Color)
      .style("stroke", d => d.data.Color)
      .style("stroke-width", d => d.data.Type === "Pozostało" ? "0px" : "2px")
      .style("fill-opacity", d => (d.data.Type === (selectedComponent && selectedComponent.Type) ? 0.5 : 0.3))
      .attr("d", arc)
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("fill-opacity", 0.5);
      })
      .on("mouseleave", function (event, d) {
        if (d.data.Type !== (selectedComponent && selectedComponent.Type)) {
          d3.select(this).attr("fill-opacity", 0.3);
        }
      })
      .on("click", function (event, d) {
        // const selectedPie = pieData.find(d => d.data.Type === currentSelectedComponent.Type);
        if (d.data.Type !== "Pozostało") {
          const angle = 90 - ((d.startAngle * (180 / Math.PI)) + ((d.endAngle - d.startAngle) * (180 / Math.PI) / 2));
          setCurrentRotation(currentRotation+angle);
          console.log(currentRotation);
          setSelectedComponent(d.data);
        } else {
          setSelectedComponent(null);
        }
      });

    // Cleanup on component unmount
    return () => {
      d3.select("#pieChart").select("svg").remove();
    };
  }, [data_V1]);

  useEffect(() => {
    const currentSelectedComponent = selectedComponent || { Type: "Pozostało" };
    const radius = 90;
    const inner = Math.min(radius, 150);
    const outer = Math.max(radius, 150);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.Amount);

    const pieData = pie(data_V1); // Obliczamy dane pie

    const svg = d3.select("#pieChart").select("svg");

    const arcOver = d3.arc()
      .outerRadius(inner - 10)
      .innerRadius(outer + 20);

    const arc = d3.arc()
      .outerRadius(inner - 10)
      .innerRadius(outer);

      const selectedPie = pieData.find(d => d.data.Type === currentSelectedComponent.Type);
      const angle = 90 - ((selectedPie.startAngle * (180 / Math.PI)) + ((selectedPie.endAngle - selectedPie.startAngle) * (180 / Math.PI) / 2));
      const pieChartContainer = document.querySelector('#pieChartContainer');
      if (selectedPie.data.Type !== "Pozostało") {
        pieChartContainer.style.transform = 'translateX(0)';
        svg.transition()
          .duration(1000)
          .attr("transform", "rotate(" + angle + ")");
      } else {
        if (window.innerWidth >= 1000)
          pieChartContainer.style.transform = 'translateX(270px)';
          svg.transition()
            .duration(1000)
            .attr("transform", "rotate(0)");
      }

      svg.selectAll("path")
        .transition()
        .duration(1000)
        .attr("d", arc);

      d3.select(svg.selectAll("path").filter(p => p.data.Type === selectedPie.data.Type).node())
        .transition()
        .duration(1000)
        .attr("d", arcOver);
    
  }, [data_V1, selectedComponent]);

};

export default usePieChart;