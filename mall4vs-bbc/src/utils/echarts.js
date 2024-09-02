import * as echarts from 'echarts/core'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent
} from 'echarts/components'
import {
  LineChart,
  BarChart,
  PieChart,
  MapChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'

echarts.use(
  [GridComponent, LegendComponent, TooltipComponent,ToolboxComponent, LineChart, BarChart, PieChart, CanvasRenderer, MapChart]
)

export default echarts
