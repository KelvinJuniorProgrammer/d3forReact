import * as d3 from 'd3'
import data from  '../../data/graphData.json'
import { useRef, useEffect, useState } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
function Graph() {
    const svgRef = useRef(null);
    const width = 800;
    const height = 600;
    const root = d3.hierarchy(data);
    const links = root.links();
    const nodes = root.descendants();

    const drag = simulation => {
  
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
      return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
    }

    useEffect(() => {
      //创建svg容器
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      //创建力模拟器,模拟器将管理力、位置和速度，并更新每个节点的位置
      const simulation = forceSimulation()
        .force("link", forceLink().id(d => d.id))
        .force("charge", forceManyBody())
        .force("center", forceCenter(width / 2, height / 2));
        
        simulation.nodes(nodes);
        simulation.force("link").links(links);

        

      //为每个节点创建一个新的SVG元素，并将其添加到SVG容器中
      const node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .call(drag(simulation));

      //为每个链接创建一个新的SVG元素，并将其添加到SVG容器中
      const link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

      //在模拟器更新节点位置时，使用D3.js提供的选择器和缓动函数来更新节点和链接的位置。
      simulation.on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
      
        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);
      });
    }, []);

    //将节点和链接数据传递给模拟器
    


    
  
    return <div>
        <h1>知识图谱</h1>
        <svg ref={svgRef}></svg>
        
    </div>
}

export default Graph