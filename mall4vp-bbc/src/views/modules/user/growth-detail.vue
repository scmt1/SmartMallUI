<template>
  <div>
    <el-table :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      class="user-edit-table"
      style="width: 100%"
    >
      <el-table-column prop="createTime" :label="$t('user.changeTime')" width="180"></el-table-column>
      <el-table-column prop="bizId" :label="$t('order.number')"></el-table-column>
      <el-table-column prop="changeGrowth" :label="$t('user.changeGrowthValue')"></el-table-column>
      <el-table-column prop="remarks" :label="$t('publics.remark')">
        <template slot-scope="scope">
        <span>
          <span v-if="scope.row.remarkNum === 1">
            {{$t("user.growthValueObtainedFromOrderConfirmationOfReceipt")}}
          </span>
          <span v-if="scope.row.remarkNum === 2">
            {{$t("user.systemModificationOfUserGrowthValue")}}
          </span>
          <span v-if="scope.row.remarkNum === 3">
            {{$t("user.growthValueObtainedFromUserTopUpBalance")}}
          </span>
          <span v-if="scope.row.remarkNum === 4">
            {{$t("user.RefundOfGrowthValueForOrderRefund")}}
          </span>
        </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="dataList.length"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- /分页 -->
  </div>
</template>

<script>
export default {
  components: {
  },
  created () {
    this.getData()
  },
  data () {
    return {
      index: 0,
      remarkNum: 0, // 0:无 1:订单确认收货获取的成长值 2:系统修改用户成长值 3:用户充值余额获取的成长值
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataList: [],
      maxLength: 0
    }
  },
  methods: {
    init (id) {
      this.userId = id
      Object.assign(this.page, this.$options.data().page)
      this.getData(this.page)
    },
    // 获取数据
    getData (page) {
      if (!this.userId) {
        return
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/userGrowthLog/pageByUserId'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            { userId: this.userId }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataList.forEach(temp => {
          if (temp.remarks === '订单确认收货获取的成长值') {
            temp.remarkNum = 1
          } else if (temp.remarks === '系统修改用户成长值') {
            temp.remarkNum = 2
          } else if (temp.remarks === '用户充值余额获取的成长值') {
            temp.remarkNum = 3
          } else if (temp.remarks === '订单退款退回成长值') {
            temp.remarkNum = 4
          }
        })
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (index) {
      this.addOrUpdateVisible = true
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getData(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getData(this.page)
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="scss">
.distribution-level-set {
  .el-input__inner {
    padding: 2px;
    border-radius: 3px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
  .award-box {
    input {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      padding: 0 10px;
    }
  }
}
.level-table-box {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-top: 10px;
  padding: 5px;
}
.elTable th {
  padding: 10px 0 !important;
}
.elTable td {
  padding: 2px 0 !important;
}
.table-input-box {
  margin-top: 20px;
  width: 75px !important;
}
.table-template {
  text-align: center;
}
.table-template > * {
  display: inline-block;
  margin: auto;
}
.card-prod-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
