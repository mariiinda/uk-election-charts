import { select as d3Select, mouse as d3Mouse } from "d3-selection";

export function tooltip(text, chart, labelList) {
  return selection => {
    function mouseover() {
      const currentNode = d3Select(this);
      currentNode.classed("highlighted", true);
      chart.append("div").attr("class", "tooltip");
    }

    function mousemove(d, i) {
      const currentNode = d3Select(this);
      currentNode.classed("highlighted", true);
      const mouse = d3Mouse(chart.node());
      const tool = chart
        .select(".tooltip")
        .attr(
          "style",
          `left:${Math.round(mouse[0]) + 5}px; top:${Math.round(mouse[1]) + 10}px`
        );
      tool.html(`${labelList[i]} ${d.data.seats}`);
    }

    function mouseout() {
      const currentNode = d3Select(this);
      currentNode.classed("highlighted", false);
      d3Select(".tooltip").remove();
    }

    selection
      .on("mouseover.tooltip", mouseover)
      .on("mousemove.tooltip", mousemove)
      .on("mouseout.tooltip", mouseout);
  };
}
