<template>
  <div class="mod-admin-groupProd">
    <!-- 表格主体 -->
    <div class="main-container">
      <div class="operation-bar">
        <!-- <div
          class="default-btn primary-btn"
          v-if="isAuth('group:activity:save')"
          @click="goBackHandle()"
        >
          {{ $t("groups.returnToJoinGroupActivities") }}
        </div> -->
        <div
          :class="[groupActivity.activityStatus !== 1 && groupActivity.activityStatus !== 5?'disabled-btn':'','default-btn primary-btn']"
          @click="selectProdHandle()"
          >{{ $t("groups.newEventProduct") }}</div
        >
      </div>
      <!-- 表格 -->
      <div class="table-con prod-table">
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
        >
          <el-table-column type="index" :label="$i18n.t('number')" width="85">
          </el-table-column>

          <el-table-column prop="prodName" :label="$i18n.t('group.actProName')">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.prodName }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="pic" :label="$i18n.t('group.proImg')">
            <template slot-scope="scope">
              <div class="table-cell-image">
                <prod-pic
                  :pic="scope.row.pic"
                ></prod-pic>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="groupProdStatus" :label="$i18n.t('group.proActStatus')">
            <template slot-scope="scope">
              <div class="tag-text">
                {{
                  ["", $t("publics.normal"), $t("groups.expired")][
                    scope.row.groupProdStatus
                  ]
                }}
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$i18n.t('crud.menu')">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  @click="editSkuhandle(scope.row.groupProdId)"
                  >{{ $t("groups.sku") }}
                </div>
                <div
                  :class="[scope.row.activityStatus !== 2 || scope.row.groupProdStatus === 2?'disabled-btn':'','default-btn text-btn']"
                  @click="invalidGroupProdHandle(scope.row)"
                  >{{ $t("groups.invalidActivity") }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('groups.failureTip')"
                    placement="right"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <div
                  :class="[(scope.row.activityStatus === 2 || scope.row.activityStatus > 5) &&
                  scope.row.groupProdStatus === 1?'disabled-btn':'','default-btn text-btn']"
                  @click="deleteHandle(scope.row,(scope.row.activityStatus === 2 || scope.row.activityStatus > 5) &&
                  scope.row.groupProdStatus === 1)"
                  >{{ $t("text.delBtn") }}
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
        :total="page.total"
      >
      </el-pagination>
    </div>
    <!-- 表格主体end -->

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>

    <!-- 商品选择弹窗-->
    <!-- 如果要更改dataUrl，在商品选择组件选择商品后的判断处也要更改一下 -->
    <prods-select
      v-if="selectGroupProdVisible"
      ref="ProdsSelect"
      :group-activity-id="groupActivityId"
      :prodType="0"
      @refreshSelectProds="selectGroupProds"
      @closeProdsSelect="closeProdsSelect"
    ></prods-select>
    <!-- 活动商品规格属性设置 -->
    <GroupProdSetting v-if="groupProdSettingVisible" ref="GroupProdSetting">
    </GroupProdSetting>
  </div>
</template>

<script>
import GroupProdSetting from './groupProdSkuSetting'
import ProdsSelect from '@/components/prods-select'
import AddOrUpdate from './groupProd-add-or-update'
import ProdPic from '@/components/prod-pic'

export default {
  data () {
    return {
      dataList: [],
      groupActivity: {},
      selectGroupProdVisible: false,
      groupProdSettingVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      addOrUpdateVisible: false,
      groupActivityId: this.$route.query.activityId
    }
  },
  components: {
    AddOrUpdate,
    ProdsSelect,
    GroupProdSetting,
    ProdPic
  },
  created () {
    this.getDataList()
  },
  mounted () {},
  methods: {
    getDataList (page, params) {
      this.dataListLoading = true
      this.getActivityInfo()
      this.$http({
        url: this.$http.adornUrl('/group/prod/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
              groupActivityId: this.groupActivityId
            },
            params
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 获取活动设置
    getActivityInfo () {
      if (!this.dataList.records && this.groupActivityId) {
        this.$http({
          url: this.$http.adornUrl(
            '/group/activity/info/' + this.groupActivityId
          ),
          method: 'GET',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.groupActivity = data
        })
      }
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (row, status) {
      if (status) {
        return
      }
      this.$confirm(
        this.$i18n.t('groups.isSuer') + row.prodName + this.$i18n.t('groups.isDele'),
        this.$i18n.t('text.tips'),
        {
          confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
          cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/group/prod/' + row.groupProdId),
            method: 'delete',
            data: this.$http.adornData({})
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.refreshChange()
              }
            })
          })
        })
        .catch(() => {})
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    searchChange (params) {
      this.getDataList(this.page, params)
    },
    // 选择商品操作
    selectProdHandle () {
      if (this.groupActivity.activityStatus !== 1 && this.groupActivity.activityStatus !== 5) {
        return
      }
      this.selectGroupProdVisible = true
      this.$nextTick(() => {
        this.$refs.ProdsSelect.init()
      })
    },
    // 选择商品回调
    selectGroupProds (prods) {
      if (prods) {
        // 获取所有的商品
        let prodIds = []
        for (let index = 0; index < prods.length; index++) {
          prodIds.push(prods[index].prodId)
        }
        this.saveGroupProds(prodIds)
      }
      this.selectGroupProdVisible = false
    },
    // 关闭选择商品回调
    closeProdsSelect () {
      this.selectGroupProdVisible = false
    },
    // 保存活动商品
    saveGroupProds (prodIds) {
      this.$http({
        url: this.$http.adornUrl('/group/prod/saveByProdIds'),
        method: 'post',
        data: this.$http.adornData({
          groupActivityId: this.groupActivityId,
          prodIds: prodIds
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.getDataList(this.page)
          }
        })
      })
    },
    /**
     * 查询商品是否在参与秒杀活动
     */
    prodIsSeckill (prodIds) {
      this.$http({
        url: this.$http.adornUrl('/admin/discount/prodIsSeckill'),
        method: 'GET',
        data: this.$http.adornData({
          prodIds: prodIds
        })
      }).then(({ data }) => {
        return data
      })
    },
    // 编辑活动sku
    editSkuhandle (groupProdId) {
      this.groupProdSettingVisible = true
      this.$nextTick(() => {
        this.$refs.GroupProdSetting.init(groupProdId)
      })
    },
    // 返回路由跳转
    goBackHandle () {
      this.$router.go(-1)
    },
    // 失效活动商品
    invalidGroupProdHandle (row) {
      if (row.activityStatus !== 2 || row.groupProdStatus === 2) {
        return
      }
      this.$confirm(
        this.$t('groups.invalidatePrductPre') +
          row.prodName +
          this.$t('groups.invalidatePrductSuf'),
        this.$t('text.tips'),
        {
          confirmButtonText: this.$t('crud.filter.submitBtn'),
          cancelButtonText: this.$t('crud.filter.cancelBtn'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/group/prod/invalid/' + row.groupProdId),
            method: 'PUT',
            data: this.$http.adornData({})
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(this.page)
              }
            })
          })
        })
        .catch(() => {})
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>
.group-list-mod {
}
@media (max-width: 1440px) {
  .disabled-btn {
    margin-left: 11px;
  }
}
</style>
