<template>
  <div class="mod-indexT">
    <svg class="mainSvg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient
          id="myLinearGradient1"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
          spreadMethod="pad"
        >
          <stop offset="0%" stop-color="#d9eec9" stop-opacity="1" />
          <stop offset="100%" stop-color="#85ca54" stop-opacity="1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>
<script>
import { loadGraph0 } from './load.js'
import { render0 } from './render.js'
import sankey from './layout.js'
export default {
  data () {
    return {
      graphData: {
        node: [
          { // id: 0
            name: '__VIRTUAL__', level: -1
          },
          { // id: 1
            name: '/index', level: 0
          },
          { // id: 2
            name: '/page1', level: 1
          },
          { // id: 3
            name: '/page2', level: 1
          },
          { // id: 4
            name: '/page3', level: 1
          },
          { // id: 5
            name: '/index', level: 2
          },
          { // id: 6
            name: '/page1', level: 2
          },
          { // id: 7
            name: '/page2', level: 2
          },
          { // id: 8
            name: '/index', level: 3
          },
          { // id: 9
            name: '/page1', level: 3
          },
          { // id: 10
            name: '/page2', level: 3
          },
          { // id: 11
            name: '/page3', level: 3
          }
        ],
        edge: [
          { startNode: 1, endNode: 2 }, // id: 0
          { startNode: 1, endNode: 3 }, // id: 1
          { startNode: 1, endNode: 4 }, // id: 2
          { startNode: 2, endNode: 5 }, // id: 3
          { startNode: 2, endNode: 6 }, // id: 4
          { startNode: 2, endNode: 7 }, // id: 5
          { startNode: 3, endNode: 5 }, // id: 6
          { startNode: 4, endNode: 5 }, // id: 7
          { startNode: 5, endNode: 8 }, // id: 8
          { startNode: 5, endNode: 9 }, // id: 9
          { startNode: 5, endNode: 10 }, // id: 10
          { startNode: 6, endNode: 8 }, // id: 11
          { startNode: 7, endNode: 8 } // id: 12
        ],
        graph: [
          {
            nodeProperty: [
              { id: 0, value: 0 },
              { id: 1, value: 12000 },
              { id: 2, value: 6000 },
              { id: 3, value: 2000 },
              { id: 4, value: 1000 },
              { id: 5, value: 2200 },
              { id: 6, value: 2000 },
              { id: 7, value: 1400 },
              { id: 8, value: 1200 },
              { id: 9, value: 1000 },
              { id: 10, value: 70 },
              { id: 11, value: 14 }
            ],
            edgeProperty: [
              { id: 0, value: 6000 },
              { id: 1, value: 2000 },
              { id: 2, value: 1000 },
              { id: 3, value: 2000 },
              { id: 4, value: 2000 },
              { id: 5, value: 1400 },
              { id: 6, value: 100 },
              { id: 7, value: 100 },
              { id: 8, value: 600 },
              { id: 9, value: 1000 },
              { id: 10, value: 600 },
              { id: 11, value: 300 },
              { id: 12, value: 300 }
            ],
            otherData: []
          }
        ]
      }
    }
  },
  mounted () {
    this.aa()
  },
  methods: {
    aa () {
      const info = loadGraph0(this.graphData)
      const layout = sankey().nodes(info.nodes).edges(info.edges)
      const data = layout()
      render0(data, '.mainSvg')
    }
  }
}
</script>

<style lang="scss">
.mod-indexT {
  .title {
    font-family: Arial;
    font-size: 12px;
    white-space: nowrap;
    color: #c42020;
  }
  svg,
  rect {
    box-sizing: border-box;
  }
}
</style>