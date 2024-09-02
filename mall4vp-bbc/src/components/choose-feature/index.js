import './index.scss'

export default {
  name: 'choose-feature',
  props: {
    isGetChooseData: {// 是否开始返回数据
      type: Boolean,
      default: false
    }
  },
  watch: {
    isGetChooseData () {
      if (!this.currentchooseFeatures.renovationId) {
        this.$message.error(this.$i18n.t('shopFeature.chooseFeature.choosePageTips'))
        return
      }
      this.$emit('chooseChooseFeaturesFun', {
        data: this.currentchooseFeatures
      })
    }
  },
  data () {
    return {
      list: [],
      currentchooseFeatures: {}, // 当前选择的
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  mounted () {
    this.getMiniPagesList()
  },
  methods: {
    /**
     * 获取微页面列表
     */
    getMiniPagesList () {
      this.$http({
        url: this.$http.adornUrl('/platform/shopRenovation/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize,
              renovationType: 2
            }
          )
        )
      }).then(({ data }) => {
        this.list = data.records
        this.totalPage = data.total
      }).catch((error) => {
        console.log('err', error)
      })
    },
    // 每页数
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getMiniPagesList()
    },
    // 当前页
    handleCurrentPageChange (val) {
      this.pageIndex = val
      this.getMiniPagesList()
    },
    /**
     * 选择微页面
     */
    handleCurrentChange (ev) {
      this.currentchooseFeatures = ev
    }
  }
}
