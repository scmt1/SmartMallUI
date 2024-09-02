<template>
  <div>
    <el-table :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      class="user-edit-table"
      style="width: 100%"
    >
      <el-table-column prop="createTime" :label="$t('user.changeTime')"></el-table-column>
      <el-table-column prop="type" :label="$t('user.changeType')">
        <template slot-scope="scope">
          <span>{{['',$t('user.recharge'),$t('user.reward'),$t('user.payment'),$t('user.refund'),$t('user.platformChange'),$t('user.rechargeMember'),"线下使用"][scope.row.type]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="changeBalance" :label="$t('user.changeBalance')"></el-table-column>
      <el-table-column prop="ioType" :label="$t('shop.ioType')">
        <template slot-scope="scope">
          <span>{{[$t('shop.pay'),$t('shop.income')][scope.row.ioType]}}</span>
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
        url: this.$http.adornUrl('/user/userBalance/getPageByUserId'),
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
