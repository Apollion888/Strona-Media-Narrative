import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const DataVisualization = ({ 
  data = [],
  type = 'timeline',
  width = 800,
  height = 400,
  className = ''
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width, height });

  // Sample blog data if none provided
  const defaultData = [
    { date: '2024-01', views: 1200, posts: 5, comments: 89 },
    { date: '2024-02', views: 1450, posts: 3, comments: 102 },
    { date: '2024-03', views: 1680, posts: 7, comments: 156 },
    { date: '2024-04', views: 1890, posts: 4, comments: 134 },
    { date: '2024-05', views: 2100, posts: 6, comments: 178 },
    { date: '2024-06', views: 2350, posts: 5, comments: 201 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  // Responsive dimensions
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setDimensions({
          width: Math.min(containerWidth, width),
          height: height
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  useEffect(() => {
    if (!svgRef.current || !chartData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 80, bottom: 40, left: 60 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    if (type === 'timeline') {
      renderTimeline(g, chartData, innerWidth, innerHeight);
    } else if (type === 'stats') {
      renderStats(g, chartData, innerWidth, innerHeight);
    } else if (type === 'network') {
      renderNetwork(g, chartData, innerWidth, innerHeight);
    }

  }, [chartData, dimensions, type]);

  const renderTimeline = (g, data, width, height) => {
    // Parse dates
    const parseDate = d3.timeParse("%Y-%m");
    const parsedData = data.map(d => ({
      ...d,
      date: parseDate(d.date)
    }));

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.views)])
      .range([height, 0]);

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.views))
      .curve(d3.curveCardinal);

    // Add gradient definition
    const gradient = g.append("defs")
      .append("linearGradient")
      .attr("id", "cyberpunk-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", height)
      .attr("x2", 0).attr("y2", 0);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#00ff00")
      .attr("stop-opacity", 0);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#00ff00")
      .attr("stop-opacity", 0.3);

    // Area under curve
    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.views))
      .curve(d3.curveCardinal);

    g.append("path")
      .datum(parsedData)
      .attr("fill", "url(#cyberpunk-gradient)")
      .attr("d", area);

    // Main line
    const path = g.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#00ff00")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Animate line drawing
    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Data points
    g.selectAll(".dot")
      .data(parsedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.views))
      .attr("r", 0)
      .attr("fill", "#00ffff")
      .attr("stroke", "#00ff00")
      .attr("stroke-width", 2)
      .transition()
      .delay((d, i) => i * 100)
      .duration(500)
      .attr("r", 4);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y")))
      .selectAll("text")
      .style("fill", "#00ff00")
      .style("font-family", "monospace");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", "#00ff00")
      .style("font-family", "monospace");

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "#00ff00")
      .style("stroke-opacity", 0.1);

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "#00ff00")
      .style("stroke-opacity", 0.1);
  };

  const renderStats = (g, data, width, height) => {
    const barHeight = height / data.length - 10;
    
    const maxViews = d3.max(data, d => d.views);
    const xScale = d3.scaleLinear()
      .domain([0, maxViews])
      .range([0, width]);

    const bars = g.selectAll(".bar")
      .data(data)
      .enter().append("g")
      .attr("class", "bar")
      .attr("transform", (d, i) => `translate(0,${i * (barHeight + 10)})`);

    // Background bars
    bars.append("rect")
      .attr("width", width)
      .attr("height", barHeight)
      .attr("fill", "rgba(0, 255, 0, 0.1)")
      .attr("rx", 4);

    // Data bars
    bars.append("rect")
      .attr("width", 0)
      .attr("height", barHeight)
      .attr("fill", "#00ff00")
      .attr("rx", 4)
      .transition()
      .delay((d, i) => i * 200)
      .duration(1000)
      .attr("width", d => xScale(d.views));

    // Labels
    bars.append("text")
      .attr("x", 10)
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("fill", "#ffffff")
      .style("font-family", "monospace")
      .style("font-size", "12px")
      .text(d => `${d.date}: ${d.views} views, ${d.posts} posts`);
  };

  const renderNetwork = (g, data, width, height) => {
    // Create network data structure
    const nodes = data.map((d, i) => ({
      id: i,
      date: d.date,
      views: d.views,
      posts: d.posts,
      comments: d.comments,
      x: Math.random() * width,
      y: Math.random() * height
    }));

    const links = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      links.push({
        source: i,
        target: i + 1,
        strength: nodes[i].views / 1000
      });
    }

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).strength(0.1))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(20));

    // Links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#00ff00")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.strength));

    // Nodes
    const node = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", d => Math.sqrt(d.views) / 10)
      .attr("fill", "#00ffff")
      .attr("stroke", "#00ff00")
      .attr("stroke-width", 2);

    // Node labels
    const labels = g.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .text(d => d.date)
      .style("fill", "#ffffff")
      .style("font-family", "monospace")
      .style("font-size", "10px")
      .attr("text-anchor", "middle");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y - 15);
    });
  };

  return (
    <div ref={containerRef} className={`data-visualization ${className}`}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(0, 255, 0, 0.3)',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default DataVisualization;
