<template>
  <div class="category-modal-content">
    <div class="category-form">
      <el-form inline ref="searchForm" :model="searchForm" label-width="150px">
        <el-form-item :label="$t('pcdecorate.commonModal.storeName')+'：'">
          <el-input v-model.trim="searchForm.shopName" style="width: 200px" :placeholder="$t('pcdecorate.shopMessage.shopNameTips')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="searchbtn" @click="handleSearch">{{$t('pcdecorate.commonModal.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table
        ref="multipTable"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        row-key="shopId"
        :data="tableList"
        height="320"
        v-loading="tableLoading"
        :class="{'tables-checkedbox': !isMulilt}"
        @select="handleCancelSelected"
        @selection-change="handleSelectChange">
        <el-table-column type="selection" :reserve-selection="true" align="center" width="55"></el-table-column>
        <el-table-column prop="shopName" :label="$t('pcdecorate.shopMessage.storeMessage')" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="shopName-content">
              <el-image :src="scope.row.shopLogo" fit="fill">
                <div slot="error" class="image-slot">
                  <img src="@/assets/img/def.png">
                </div>
              </el-image>
              <span style="width: calc(100% - 65px);overflow:hidden;text-overflow: ellipsis;white-space: nowrap">{{scope.row.shopName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="type" 
          width="200px" 
          :label="$t('pcdecorate.shopMessage.shopType')" 
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 0" class="noraml-store">
              <span>{{storeType(scope.row.type)}}</span>
            </div>
            <div v-else-if="scope.row.type === 1" class="pre-store">
              <span>{{storeType(scope.row.type)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="shopStatus" 
          width="150" 
          :label="$t('pcdecorate.shopMessage.shopStatus')" 
          align="center" 
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.shopStatus === -1" class="tag-text">{{$t('shop.nonactivated')}}</span>
            <span v-else-if="scope.row.shopStatus === 0" class="tag-text">{{$t('shop.closed')}}</span>
            <span v-else-if="scope.row.shopStatus === 1" class="tag-text active">{{$t('shop.inOperation')}}</span>
            <span v-else-if="scope.row.shopStatus === 2" class="tag-text">
                {{$t('groups.offlineViolation')}}
            </span>
            <span v-else-if="scope.row.shopStatus === 4" class="tag-text">
                {{$t('distributionMsg.applying')}}
            </span>
            <span v-else-if="scope.row.shopStatus === 3 || scope.row.shopStatus === 5" class="tag-text">
                {{$t('product.pendingReview')}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 12px; text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="perProps.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="perProps.perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="perProps.total">
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
    isMulilt: { // 是否支持多选
      type: Boolean,
      default: () => false
    },
    echoDataList: { // 回显数据
      type: Array,
      default: () => []
    },
    customLinkArr: { // 自定义链接回显数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      searchForm: {},
      tableList: [], // 店铺列表
      multipleSelection: [], // 表格选中的数据
      tableLoading: false, // 表格loading
      perProps: { // 分页
        page: 1,
        perPage: 10,
        total: 0
      },
      showEchData: [], // 回显数据
      flag: false // 用来处理table 方法被触发的问题
    }
  },
  computed: {
    // 店铺类型
    storeType () {
      return (type) => {
        if (type === 0) {
          return this.$t('pcdecorate.shopMessage.ordinaryShops')
        } else if (type === 1) {
          return this.$t('pcdecorate.shopMessage.preferShops')
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    // 这里拿到取消选中的哪项
    handleCancelSelected (rows, row) {
      let selected = rows.length && rows.indexOf(row) != -1
      if (this.isMulilt) { // 如果当前是多选
        // 如果当前是取消勾选的情况
        if (!selected) {
          this.showEchData.forEach((item, index) => {
            if (item.shopId == row.shopId) {
              this.showEchData.splice(index, 1)
            }
          })
        }
      } else { // 否则就是单选
        if (!selected) {
          this.multipleSelection = []
          setTimeout(() => {
            this.multipleSelection.push(row)
            this.$refs.multipTable.toggleRowSelection(row, true)
          }, 100)
        }
      }
    },
    handleSelectChange (rows) {
      if (this.flag) return
      if (this.isMulilt) { // 当前支持多选
        this.multipleSelection = this.removeDuplicCateObj([...this.showEchData, ...rows])
        this.$emit('handleGoodsSelect', { type: 'storeItem', value: this.multipleSelection})
      } else { // 否则就是单选
        this.multipleSelection = rows
        if (this.multipleSelection.length > 1) {
          let del_show = this.multipleSelection.shift()
          this.tableList.forEach(item => {
            if (del_show.shopId == item.shopId) {
              this.$refs.multipTable.toggleRowSelection(item, false)
            }
          })
        }
        this.$emit('handleGoodsSelect', { type: 'storeItem', value: this.multipleSelection[0]})
      }
    },
    // 移除重复
    removeDuplicCateObj (arr) {
      let obj = {}
      arr = arr.reduce((newArr, next) => {
        obj[next.shopId] ? '' : (obj[next.shopId] = true && newArr.push(next))
        return newArr
      }, [])
      return arr
    },
    // 搜索
    handleSearch () {
      this.getStoreList('search')
    },
    // 获取店铺列表
    getStoreList (val) {
      if (val === 'search') {
        this.perProps.page = 1
      }
      let { page, perPage} = this.perProps
      this.tableLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/shopDetail/searchShops'),
        method: 'get',
        params: this.$http.adornParams({
          current: page,
          size: perPage,
          shopName: this.searchForm.shopName
        })
      }).then(({data}) => {
        this.tableList = data.records
        this.perProps.total = data.total
        this.tableLoading = false
        this.setDataShow(val) // 回显表格
      }).catch((err) => {
        this.tableLoading = false
      })
    },
    // 分页每页显示多少条
    handleSizeChange (val) {
      this.perProps.perPage = val
      this.showEchData = this.multipleSelection
      this.getStoreList()
    },
    // 分页显示第几页
    handleCurrentChange (val) {
      this.perProps.page = val
      this.showEchData = this.multipleSelection
      this.getStoreList()
    },
    // 数据回显
    setDataShow (val) {
      this.flag = true
      let arr = []
      let otherArr = []
      let userArr = []
      this.$nextTick(() => {
        if (val === 'search') {
          this.$refs.multipTable && this.$refs.multipTable.clearSelection() // 清除上一次回显内容
        }
        this.tableList.forEach(item => {
          this.showEchData.forEach(v => {
            if (item.shopId == v.shopId) {
              arr.push(item)
              this.$refs.multipTable && this.$refs.multipTable.toggleRowSelection(item, true)
            } else if (item.shopId != v.shopId) {
              otherArr.push(v)
              otherArr = this.removeDuplicCateObj(otherArr)
            }
          })
        })
        userArr = [...arr, ...otherArr]
        userArr = this.removeDuplicCateObj(userArr)
        // 回显的时候，需要emit通知父组件这次是回显，可以直接点击确定
        if (this.isShowData() || !this.isMulilt) { // 单选通知
          this.$emit('handleGoodsSelect', { type: 'storeItem', value: userArr[0] })
        } else { // 多选通知
          this.$emit('handleGoodsSelect', { type: 'storeItem', value: userArr })
        }
        setTimeout(() => {
          this.flag = false
        }, 200)
      })
    },
    // 判断当前是否是多选回显还是单选回显
    isShowData () {
      return this.customLinkArr && this.customLinkArr.type != '' && this.customLinkArr.type === '3'
    }
  },
  watch: {
    activeName (val) {
      if (val === '3') {
        this.$set(this.searchForm, 'shopName', '')
        // 回显数据
        if (this.isShowData()) {
          let arr = []
          let obj = {
            shopId: this.customLinkArr.link,
            shopName: this.customLinkArr.title
          }
          arr.push(obj)
          this.showEchData = arr
          this.multipleSelection = this.showEchData
        } else {
          // 回显数据
          this.showEchData = JSON.parse(JSON.stringify(this.echoDataList))
        }
        // 获取店铺列表
        this.getStoreList('search')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.category-modal-content {
    .category-form {
        .searchbtn {
            width: 68px;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #155BD4;
            border-radius: 2px;
            margin: 4px 0 0 10px;
        }
        
    }
    .tables {
        width: 93%;
        margin: 0 auto;
        margin-bottom: 20px;
        .shopName-content {
            display: flex;
            align-items: center;
            .el-image {
                width: 48px;
                height: 48px;
                margin-right: 15px;
            }
        }
    }
    .noraml-store {
        display: flex;
        justify-content: center;
        span {
            min-width: 66px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333333;
            font-size: 12px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 3px;
        }
        
    }
    .pre-store {
        display: flex;
        justify-content: center;
        span {
            min-width: 66px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #155BD4;
            color: #155BD4 ;
            font-size: 12px;
            border-radius: 3px;
        }
    }
    .tag-text {
        height: 24px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 3px;
        display: inline-block;
        font-size: 12px;
        padding: 0px 8px;
        line-height: 24px;
        &.active {
            border: 1px solid #155BD4;
            color: #155BD4 ;
        }
    }
}

</style>
<style lang="scss">
.category-modal-content {
    min-height: 450px;
    max-height: 450px;
    height: 450px;
    overflow-y: auto;
    .el-input__inner {
        height: 32px;
    }
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