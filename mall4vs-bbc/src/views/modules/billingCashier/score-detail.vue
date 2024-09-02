<template>
    <el-dialog
            title="积分明细"
            :close-on-click-modal="false"
            :visible.sync="visible"
            width="900px"
    >
        <div>
            <el-table :data="dataList"
                      header-cell-class-name="table-header"
                      row-class-name="table-row-low"
                      class="user-edit-table"
                      v-loading="dataListLoading"
                      style="width: 100%">
                <el-table-column prop="createTime" :label="$t('user.changeTime')"></el-table-column>
                <el-table-column prop="source" :label="$t('user.changeReason')">
                    <template slot-scope="scope">
                        <span v-if="scope.row.source===4 && scope.row.ioType === 1">{{$t('user.refundRetrunScore')}}</span>
                        <span v-else>{{[$t('user.registerScore'),$t('user.shopping'),$t('user.levelUp'),$t('user.signIn'),$t('user.shoppingDeducteScore'),$t('user.scoreExpired'),$t('user.rechargeBalance'),$t('user.sysChangeScore')][scope.row.source]}}</span>
                        <span v-if="scope.row.isLock">{{$t('user.lockScore')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="score" :label="$t('user.changeScoreNum')"></el-table-column>
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
                    :page-size="page.pageSize"
                    :total="page.total"
                    layout="total, prev, pager, next, jumper"
            ></el-pagination>
            <!-- /分页 -->
        </div>
    </el-dialog>
</template>

<script>
  export default {
    components: {},
    created () {
      this.getData()
    },
    data () {
      return {
        visible: false,
        index: 0,
        addOrUpdateVisible: false,
        resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        dataList: [],
        maxLength: 0,
        dataListLoading: false
      }
    },
    methods: {
      init (id) {
        this.visible = true
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
          url: this.$http.adornUrl('/multishop/user/userScoreLog/pageByUserId'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                current: page == null ? this.page.currentPage : page.currentPage,
                size: page == null ? this.page.pageSize : page.pageSize
              },
              {userId: this.userId}
            )
          )
        }).then(({data}) => {
          this.dataListLoading = false
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

    .user-edit-table {
        margin-bottom: 20px;
    }

    .table-row-low {
        height: 60px;
    }
</style>
