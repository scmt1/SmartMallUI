<template>
  <div class="mod-webConfig-webConfig">
    <div class="main-container">
      <!-- 操作栏 -->
      <div class="operation-bar">
        <div
          v-if="isAuth('sys:webConfig:save')"
          class="default-btn primary-btn"
          @click="addOrUpdateHandle(configType)"
        >
          {{ $t("brand.add") }}
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-con webConfig-station-table">
        <el-table
          ref="webConfigStationTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
        >
          <!-- 序号 -->
          <el-table-column
            fixed
            type="index"
            :label="$t('formData.serialNumber')"
            width="80">
          </el-table-column>
          <!-- 登录logo -->
          <el-table-column
            prop="stationLoginLogoImg"
            :label="$t('webInfoConfig.loginLogo')"
          >
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img v-if="scope.row.stationLoginLogoImg" :src="scope.row.stationLoginLogoImg" />
              </div>
            </template>
          </el-table-column>
          <!-- 激活状态 -->
          <el-table-column
            prop="isActivity"
            :label="$t('webInfoConfig.activationStatus')"
            >
            <template slot-scope="scope">
              <span class="tag-text" v-if="scope.row.isActivity === 0">{{
                $t("webInfoConfig.close")
              }}</span>
              <span class="tag-text" v-if="scope.row.isActivity === 1">{{
                $t("webInfoConfig.open")
              }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="150"
          >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('sys:webConfig:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(configType, scope.row.id)"
                >
                  {{$t('brand.revise')}}
                </div>
                <div
                  v-if="isAuth('sys:webConfig:delete') && scope.row.isActivity === 0"
                  class="default-btn text-btn"
                  @click="deleteHandle(scope.row.id)"
                >
                  {{$t('brand.delete')}}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <el-pagination
        v-if="dataList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './webConfig-add-or-update'

export default {
  data () {
    return {
      dataList: [],
      aa: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {}, // 搜索
      dataListLoading: false,
      addOrUpdateVisible: false,
      configType: 5 // 配置类型（1:平台端 2:PC端 3:h5端 4:商家端 5:自提点端）
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/webConfig/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
              configType: this.configType
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (configType, id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(configType, id)
      })
    },
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('remindPop.operation'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/webConfig/operate/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.succeeded'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      }).catch(() => {
      })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    searchChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
    },

    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-webConfig-webConfig {
  .operation-bar {
    margin-top: 5px;
  }
}
</style>
