<template>
  <div class="mod-admin-groupProd">
    <el-dialog :title="$t('groups.viewActivityMerchandise')"
               :visible.sync="visible">
    <!-- 新版规范 -->
    <div class="seckill-list-mod">
      <!-- 搜索栏end -->
      <!-- 表格主体 -->
      <div class="main-container">
        <!-- 表格 -->
        <div class="table-con seckill-table">
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row"
            style="width: 100%">

            <el-table-column
              prop="prodName"
              :label="$t('groups.activityProductName')"
              >
              <template slot-scope="scope">
                <span class="table-cell-text">{{ scope.row.prodName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="pic"
              :label="$t('group.proImg')"
              >
              <template slot-scope="scope">
                <prod-pic
                  height="60"
                  width="60"
                  :pic="scope.row.pic"
                ></prod-pic>
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

            <el-table-column align="center" :label="$i18n.t('crud.menu')" class="">
              <template slot-scope="scope">
                <div class="text-btn-con">
                    <div
                      type="text"
                      class="default-btn text-btn"
                      @click="editSkuhandle(scope.row.groupProdId)">{{$t('groups.viewActivitySpec')}}
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
      <!-- 表格主体end -->
    </div>
    </el-dialog>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>

    <!-- 商品选择弹窗-->
    <prods-select v-if="selectGroupProdVisible"
                  ref='ProdsSelect'
                  dataUrl='/group/prod/getNotGroupProdPage'
                  @refreshSelectProds="selectGroupProds"></prods-select>
    <!-- 活动商品规格属性设置 -->
    <GroupProdSetting v-if="groupProdSettingVisible"
                      ref='GroupProdSetting'>
    </groupProdSetting>
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
      visible: false,
      groupActivity: {},
      selectGroupProdVisible: false,
      groupProdSettingVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      groupActivityId: '',
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    ProdsSelect,
    GroupProdSetting,
    ProdPic
  },
  created () {

  },
  mounted () {
    this.getDataList()
  },
  methods: {
    init (groupActivityId) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.page.total = 0
      this.groupActivityId = groupActivityId || null
      this.visible = true
      this.getDataList()
    },
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/group/prod/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
              groupActivityId: this.groupActivityId
            }
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
      if (!this.dataList.records) {
        this.$http({
          url: this.$http.adornUrl('/group/activity/info/' + this.$route.query.activityId),
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
    deleteHandle (row) {
      this.$confirm('确定对【' + row.prodName + '】活动商品进行删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/group/prod/' + row.groupProdId),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
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
    },
    // 选择商品操作
    selectProdHandle () {
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
    },
    // 保存活动商品
    saveGroupProds (prodIds) {
      this.$http({
        url: this.$http.adornUrl('/group/prod/saveByProdIds'),
        method: 'post',
        data: this.$http.adornData({
          'groupActivityId': this.$route.query.activityId,
          'prodIds': prodIds
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('remindPop.success'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.getDataList(this.page)
          }
        })
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
      this.$confirm('确定对【' + row.prodName + '】活动商品进行失效吗？如果活动开启了失效后仍要对', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/group/prod/invalid/' + row.groupProdId),
          method: 'PUT',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.page)
            }
          })
        })
      }).catch(() => { })
    },
        // 每页数量变更
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    // 页数变更
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    }
  }
}
</script>
<style lang="scss">
.mod-admin-groupProd {
  .seckill-table {
    margin-top: 0;
  }
}
</style>
