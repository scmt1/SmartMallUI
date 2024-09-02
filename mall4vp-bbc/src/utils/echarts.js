import * as echarts from 'echarts/core'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  VisualMapComponent,
  GraphicComponent
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
  [GridComponent, LegendComponent, TooltipComponent, ToolboxComponent, VisualMapComponent, GraphicComponent, LineChart, BarChart, PieChart, CanvasRenderer, MapChart]
)

export default echarts
