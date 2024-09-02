<template>
  <div class="small-modal-content">
    <div class="tables">
      <el-table
        ref="multipTable"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        :data="tableList"
        height="380"
        v-loading="pageLoading"
        :class="{'tables-checkedbox': !isMulilt}"
        @select="handleCancelSelected"
        @selection-change="selectChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column 
          prop="name" 
          :label="$t('pcdecorate.commonModal.pageTitle')" 
          align="left" 
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column 
          prop="createTime" 
          width="300px" 
          :label="$t('pcdecorate.commonModal.createTime')" 
          align="center" 
          show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <span style="color: #155BD4;cursor: pointer;" @click="hanldeClick(scope.row)">查看</span>
            </template>
        </el-table-column> -->
      </el-table>
      <el-pagination
        style="margin-top: 15px; text-align: right;"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="perProps.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="perProps.pageSize"
        :total="perProps.total"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    activeName: {
      type: String,
      default: () => ''
    },
    isMulilt: { // 是否多选
      type: Boolean,
      default: () => false
    },
    deviceType: { // 弹窗类型 pc端： pc , 移动:mobile
      type: String,
      default: () => 'pc'
    },
    customLinkArr: { // 自定义链接回显数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      searchForm: {},
      tableList: [], // 列表数据
      perProps: { // 分页
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      multipleSelection: [], // 表格选中的数据
      pageLoading: false, // 页面loading
      showEchData: [], // 回显数据
      flag: false // 处理table回显触发selection-change
    }
  },
  methods: {
    // 这里拿到取消选中的哪项
    handleCancelSelected (rows, row) {
      let selected = rows.length && rows.indexOf(row) != -1
      // 如果当前是取消勾选的情况
      if (!selected) {
        this.multipleSelection = []
        setTimeout(() => {
          this.multipleSelection.push(row)
          this.$refs.multipTable.toggleRowSelection(row, true)
        }, 100)
      }
    },
    // 选中
    selectChange (rows) {
      if (this.flag) return
      this.multipleSelection = rows
      if (this.multipleSelection.length > 1) {
        let del_show = this.multipleSelection.shift()
        this.tableList.forEach(item => {
          if (del_show.renovationId == item.renovationId) {
            this.$refs.multipTable.toggleRowSelection(item, false)
          }
        })
      }
      this.$emit('handleGoodsSelect', { type: 'smallPageItem', value: this.multipleSelection[0]})
    },
    // 移除重复
    removeDuplicCateObj (arr) {
      let obj = {}
      arr = arr.reduce((newArr, next) => {
        obj[next.renovationId] ? '' : (obj[next.renovationId] = true && newArr.push(next))
        return newArr
      }, [])
      return arr
    },
    // 获取微页面
    getSmallPage (val) {
      let { pageNum, pageSize} = this.perProps
      this.pageLoading = true
      let url = ''
      let type = 0
      if (this.deviceType === 'pc') {
        url = '/platform/shopRenovation/pagePC'
        type = 1
      } else if (this.deviceType === 'mobile') {
        url = '/platform/shopRenovation/pageMove'
        type = 2
      }
      this.$http({
        url: this.$http.adornUrl(url),
        methods: 'get',
        params: this.$http.adornParams({
          current: pageNum, // 当前页
          size: pageSize, // 每页显示多少条
          renovationType: type // 1表示pc端，2表示移动端
        })
      }).then(({ data }) => {
        this.pageLoading = false
        this.tableList = data.records
        this.perProps.total = data.total
        this.setDataShow(val)
      }).catch((error) => {
        this.pageLoading = false
      })
    },
    // 查看
    hanldeClick (item) {
      let newPage = this.$router.resolve({
        path: '/platform-decorate/create/select-decorate/index',
        query: {
          renovationId: item.renovationId
        }
      })
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    },
    sizeChangeHandle (val) {
      this.perProps.pageSize = val
      this.showEchData = this.multipleSelection
      this.getSmallPage()
    },
    currentChangeHandle (val) {
      this.perProps.pageNum = val
      this.showEchData = this.multipleSelection
      this.getSmallPage()
    },
    // 数据回显
    setDataShow (val) {
      this.flag = true
      let arr = []
      let otherArr = []
      let userArr = []
      this.$nextTick(() => {
        if (val === 'search') {
          this.$refs.multipTable && this.$refs.multipTable.clearSelection()
        }
        this.tableList.forEach(item => {
          this.showEchData.forEach(v => {
            if (item.renovationId == v.renovationId) {
              arr.push(item)
              this.$refs.multipTable && this.$refs.multipTable.toggleRowSelection(item, true)
            } else if (item.renovationId != v.renovationId) {
              otherArr.push(v)
              otherArr = this.removeDuplicCateObj(otherArr)
            }
          })
        })
        userArr = [...arr, ...otherArr]
        userArr = this.removeDuplicCateObj(userArr)
        // 回显的时候，需要emit通知父组件这次是回显，可以直接点击确定
        if (this.isShowData() || !this.isMulilt) { // 单选回显
          this.$emit('handleGoodsSelect', { type: 'smallPageItem', value: userArr[0]})
        }
        setTimeout(() => {
          this.flag = false
        }, 200)
      })
    },
    // 判断当前是否是多选回显还是单选回显
    isShowData () {
      return this.customLinkArr && this.customLinkArr.type != '' && this.customLinkArr.type === '5'
    }
  },
  watch: {
    activeName (val) {
      if (val === '5') {
        // 回显数据
        if (this.isShowData()) {
          let arr = []
          let obj = {
            name: this.customLinkArr.title,
            renovationId: Array.isArray(this.customLinkArr.link) ? this.customLinkArr.link[0] : this.customLinkArr.link
          }
          arr.push(obj)
          this.showEchData = arr
          this.multipleSelection = this.showEchData
        }
        // 获取微页面
        this.getSmallPage()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.small-modal-content {
  min-height: 450px;
  max-height: 450px;
  height: 450px;
  overflow-y: auto;
  .tables {
    width: 93%;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}

</style>
<style lang="scss">
.small-modal-content {
  .table-header {
    &:nth-child(1) {
      .cell {
        display: none;
      }
    }
  }
}
.tables-checkedbox {
  .el-checkbox {
    .el-checkbox__inner {
      position: relative;
      &:after {
        border: 0;
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .el-checkbox__inner {
      border-radius: 50%;
    }
    &.is-checked {
      .el-checkbox__inner {
        position: relative;
        &:after {
          border: 0;
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fff;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}
</style>