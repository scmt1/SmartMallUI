import * as d3 from 'd3'
/* eslint-disable import/prefer-default-export */
// const initWidth = 960
// const initHeight = 600
const rectWidth = 150
const edgeOpacity = 0.8
/**
 * 将数据渲染到图
 * @param {*} data 经过load的数据
 * @param {string} domSelector 选择器
 */
export function render0 (data, domSelector) {
  const { nodes, edges } = data

  // eslint-disable-next-line no-undef
  const svg = d3.select(domSelector)
  // .attr('width', initWidth)
  // .attr('height', initHeight)
  // 清除上次绘图
  svg.selectAll('g.column').remove()
  svg.selectAll('path').remove()

  // ===========================================================================
  //      draw nodes
  // ===========================================================================
  svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'column')
      .append('rect')
      .attr('class', 'page')
      .attr('fill', '#c1daf9')
      .attr('x', function (d) { return d.x })
      .attr('y', function (d) { return d.y })
      .attr('width', rectWidth)
      .attr('height', function (d) { return d.height + 40 })
      .attr('style', 'fill:url(#myLinearGradient1)')

  const columnContainer = svg.selectAll('g.column')
      .data(nodes)

  columnContainer.append('text')
      .text(function (d) { return d.name })
      .attr('x', function (d) {
        return d.x + 10
      })
      .attr('y', function (d) { return d.yName })
      .attr('class', 'title')

  columnContainer.append('text')
      .text(function (d) { return d.value })
      .attr('x', function (d) { return d.x + 10 })
      .attr('y', function (d) { return d.yValue + 10 })
      .attr('class', 'title')

  // ===========================================================================
  //      draw edges
  // ===========================================================================
  svg.selectAll('path')
    .data(edges)
    .enter()
    .append('path')
    .attr('d', d => d.d)
    .attr('stroke', '#e4edf8')
    .attr('stroke-width', d => d.height)
    .attr('fill', 'none')
    .attr('opacity', edgeOpacity)
    .on('mouseover', function () {
        // eslint-disable-next-line no-undef
      d3.select(this).attr('stroke', '#85b1fb')
    })
    .on('mouseout', function () {
        // eslint-disable-next-line no-undef
      d3.select(this).attr('stroke', '#e1ebf7')
    })
}
