<template>
  <div class="mod-api-userBalance">
    <div class="main-container">
      <div class="operation-bar">
        <div
          v-if="isAuth('user:userBalance:save') && dataList.length < 10"
          class="default-btn primary-btn"
          @click="addOrUpdateHandle()"
        >{{$t('crud.addTitle')}}</div>
      </div>
      <div class="table-con">
        <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row"
            style="width: 100%"
            ref="hotTable"
        >
          <el-table-column
            :label="$t('distributionMsg.title')"
            prop="balanceTitle"
            width="500">
          </el-table-column>
          <el-table-column
            prop="rechargeAmount"
            :label="$t('user.rechargeAmount')"
          >
          </el-table-column>
          <!-- <el-table-column
            :label="$t('user.bgImg')"
          >
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img :src="resourcesUrl + scope.row.img" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="seq"
            :label="$t('brand.sequence')"
          >
          </el-table-column> -->
          <el-table-column
            align="center"
            :label="$t('crud.menu')"
            width="220"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('user:userBalance:update')"
                  class="default-btn text-btn btn-itm"
                  @click="addOrUpdateHandle(scope.row.balanceId)"
                >{{$t('crud.updateBtn')}}</div>
                <div
                  v-if="isAuth('user:userBalance:delete')"
                  class="default-btn text-btn btn-itm"
                  @click="deleteHandle(scope.row.balanceId)"
                >{{$t('crud.delBtn')}}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './userBalance-add-or-update'
export default {
  data () {
    return {
      dataList: [],
      searchForm: {}, // 搜索
      dataListLoading: false,
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
  },
  mounted () {
    this.getDataList(this.page)
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/userBalance/getList'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataList = data
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (id) {
      this.$confirm(this.$t('seckill.isDeleOper'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/user/userBalance/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('groups.successfulOperation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      }).catch(() => { })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange () {
      this.getDataList(this.page)
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-api-userBalance {
  .main-container {
		margin: 0;
		padding: 0;
	}
}
</style>
