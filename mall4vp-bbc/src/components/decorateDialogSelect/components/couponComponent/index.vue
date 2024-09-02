<template>
  <div class="coupon-modal-content">
    <div class="coupon-form">
      <el-form inline ref="searchForm" :model="searchForm" label-width="108px">
      <el-form-item :label="$t('coupon.couponName') + '：'">
        <el-input v-model.trim="searchForm.couponName" clearable :placeholder="$t('coupon.couponName')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.deliveryStatus') + ':'" class="search-form-item">
          <el-select v-model="searchForm.putonStatus" clearable :placeholder="$t('coupon.deliveryStatus')">
              <el-option
                      v-for="item in putonStatuList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
          </el-select>
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
        row-key="prodId"
        :data="tableList"
        height="320"
        v-loading="tableLoading"
        :class="{'tables-checkedbox': !isMulilt}"
        @select="handleCancelSelected"
        @selection-change="handleSelectChange">
          <el-table-column type="selection" :reserve-selection="true"></el-table-column>
          <el-table-column
            prop="couponName"
            min-width="200px"
            :label="$t('coupon.couponName')"
            align="left"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="shopName"
              min-width="150px"
              label="来源"
              align="left"
              show-overflow-tooltip>
              <template slot-scope="scope">
                  <span v-if="scope.row.shopName" class="tag-text">{{ scope.row.shopName }}</span>
                  <span v-else class="tag-text">平台</span>
              </template>
          </el-table-column>
          <el-table-column
                  prop="getWay"
                  :label="$t('coupon.getWay')"
                  width="auto">
              <template slot-scope="scope">
                  <span class="tag-text">{{ [$t('coupon.receiveDirectly'), $t('coupon.exchangeOrSystemIssue')][scope.row.getWay] }}</span>
              </template>
          </el-table-column>
          <el-table-column
                  prop="startTime"
                  :label="$t('coupon.startTime')"
                  width="160">
          </el-table-column>
          <el-table-column
                  prop="endTime"
                  :label="$t('coupon.endTime')"
                  width="160">
          </el-table-column>
          <el-table-column
            prop="putonStatus"
            min-width="100px"
            :label="$t('coupon.deliveryStatus')"
            align="left"
            show-overflow-tooltip>
              <template slot-scope="scope">
                  <span v-if="scope.row.putonStatus === 1" class="tag-text">{{ $t('coupon.launched') }}</span>
                  <span
                          v-else-if="scope.row.putonStatus === 0"
                          class="tag-text"
                  >{{ $t('coupon.waitAutoLaunch') }}</span>
                  <span
                          v-else-if="scope.row.putonStatus === -1"
                          class="tag-text"
                  >{{ $t('coupon.cancelLaunch') }}</span>
                  <span
                          v-else-if="scope.row.putonStatus ===2"
                          class="tag-text"
                  >{{ $t('coupon.violationOffShelf') }}</span>
                  <span
                          v-else-if="scope.row.putonStatus ===3"
                          class="tag-text"
                  >{{ $t('coupon.waitingForReview') }}</span>
                  <span
                          v-else-if="scope.row.putonStatus ===4"
                          class="tag-text"
                  >{{ $t('coupon.waitLaunch') }}</span>
              </template>
          </el-table-column>
          <el-table-column
              prop="stocks"
              width="140px"
              :label="$t('coupon.stock')"
              align="center"
              show-overflow-tooltip>
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
import { treeDataTranslate } from '@/utils'
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
      searchForm: {}, //  查询条件
      tableList: [], // 优惠券列表
      multipleSelection: [], // 表格选中的数据
      tableLoading: false, // 表格的loading
      perProps: { // 分页
        perPage: 10,
        page: 1,
        total: 0
      },
      showEchData: [], // 回显数据
      flag: false,
      singleSelected: {}, // 单选选中的
      putonStatuList: [
        {
          value: -1,
          label: this.$i18n.t('coupon.cancelLaunch')
        },
        {
          value: 0,
          label: this.$i18n.t('coupon.waitAutoLaunch')
        },
        {
          value: 1,
          label: this.$i18n.t('coupon.launched')
        },
        {
          value: 2,
          label: this.$i18n.t('coupon.violationOffShelf')
        },
        {
          value: 3,
          label: this.$i18n.t('coupon.waitingForReview')
        },
        {
          value: 4,
          label: this.$i18n.t('coupon.waitLaunch')
        }
      ],
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
            if (item.couponId == row.couponId) {
              this.showEchData.splice(index, 1)
            }
          })
          this.multipleSelection.forEach((item, index) => {
            if (item.couponId == row.couponId) {
              this.multipleSelection.splice(index, 1)
            }
          })
        }
        this.$emit('handleGoodsSelect', { type: 'couponItem', value: this.multipleSelection})
      } else { // 单选
        if (!selected) { // 取消选中
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
        this.multipleSelection = this.removeDuplicCateObj([...this.multipleSelection, ...rows])
        this.$emit('handleGoodsSelect', { type: 'couponItem', value: this.multipleSelection})
      } else { // 否则就是单选
        this.multipleSelection = rows
        if (this.multipleSelection.length > 1) {
          let del_row = this.multipleSelection.shift()
          this.tableList.forEach(item => {
            if (del_row.couponId == item.couponId) {
              this.$refs.multipTable.toggleRowSelection(item, false)
            }
          })
        }
        this.$emit('handleGoodsSelect', { type: 'couponItem', value: this.multipleSelection[0]})
      }
    },
      // 移除重复
    removeDuplicCateObj (arr) {
      let obj = {}
      arr = arr.reduce((newArr, next) => {
        obj[next.couponId] ? '' : (obj[next.couponId] = true && newArr.push(next))
        return newArr
      }, [])
      return arr
    },
      // 获取优惠券信息
    getCouponsListMessage (val) {
      if (val === 'search') {
        this.perProps.page = 1
      }
      let { page, perPage} = this.perProps
      this.tableLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/coupon/couponsPage'),
        method: 'get',
        params: this.$http.adornParams({
          current: page,
          size: perPage,
          couponName: this.searchForm.couponName, // 商品名称
          overdueStatus: 1, //过期状态(未过期)
          putonStatus: this.searchForm.putonStatus, // 投放状态
          getWay:0 //获取方式
        })
      }).then(({data}) => {
          this.tableList = data.records
          this.perProps.total = data.total
          this.tableLoading = false
          this.setDataShow(val)
        }).catch(err => {
          this.tableLoading = false
      })
    },
      // 分页每页多少条
    handleSizeChange (val) {
      this.perProps.perPage = val
      this.showEchData = this.multipleSelection
      this.getCouponsListMessage()
    },
      // 分页当前第几页
    handleCurrentChange (val) {
      this.perProps.page = val
      this.showEchData = this.multipleSelection
      this.getCouponsListMessage()
    },
      // 搜索
    handleSearch () {
      this.getCouponsListMessage('search')
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
            if (item.couponId === v.couponId) { // 设置当前页的选中
              arr.push(item)
              this.$refs.multipTable && this.$refs.multipTable.toggleRowSelection(item, true)
            } else if (item.couponId !== v.couponId) { // 不是当前页的也要记录下来
              otherArr.push(v)
              otherArr = this.removeDuplicCateObj(otherArr)
            }
          })
        })
        userArr = [...arr, ...otherArr]
        userArr = this.removeDuplicCateObj(userArr)
          // 回显的时候，需要emit通知父组件这次是回显，可以直接点击确定
        if (this.isShowData() || !this.isMulilt) { // 单选通知
          this.$emit('handleGoodsSelect', { type: 'couponItem', value: userArr[0]})
        } else { // 多选通知
          this.$emit('handleGoodsSelect', { type: 'couponItem', value: userArr})
        }
        setTimeout(() => {
          this.flag = false
        }, 200)
      })
    },
      // 判断当前是否是多选回显还是单选回显
    isShowData () {
      return this.customLinkArr && this.customLinkArr.type != '' && this.customLinkArr.type === '7'
    },
  },
  watch: {
    async activeName (val) { // 监听当前激活的是
      if (val === '7') { // 当前是选择商品
        this.$set(this.searchForm, 'conpouName', '')
          // 回显数据
        if (this.isShowData()) { // 判断如果在操作热区
          let obj = {
            couponName: this.customLinkArr.title,
            couponId: this.customLinkArr.link,
          }
          let arr = []
          arr.push(obj)
          this.showEchData = JSON.parse(JSON.stringify(arr))
          this.multipleSelection = this.showEchData
        } else {
          this.showEchData = JSON.parse(JSON.stringify(this.echoDataList))
          this.multipleSelection = this.showEchData
        }
          // 获取优惠券列表
        await this.getCouponsListMessage('search')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.coupon-modal-content {
  .coupon-form {
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
  }
}
</style>
<style lang="scss">
.coupon-modal-content {
  min-height: 450px;
  max-height: 450px;
  height: 450px;
  overflow-y: auto;
  .coupon-form {
    .el-input__inner {
      height: 32px;
    }
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
