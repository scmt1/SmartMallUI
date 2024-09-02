<template>
  <div class="mod-admin-groupProd">
    <div class="main-container">
      <div class="operation-bar">
        <div
          class="default-btn primary-btn"
         @click="goBackHandle()"
          >{{ $t("live.returnment") }}
        </div>
        <div
          :class="[status !== '102' ? 'disabled-btn':'','default-btn primary-btn']"
          @click="selectProdHandle()"
          >{{ $t("live.addLicts") }}
        </div>
        <span style="color: red"
          >{{ $t("live.numNewLiveProsRem") }}：{{ shopNum }}{{ $t("live.times")
          }}，{{ $t("live.subPlatRemLimi") }}{{ totalNum
          }}{{ $t("live.times") }}</span
        >
      </div>
      <div class="table-con live-room-pord-table">
        <el-table
          ref="liveRoomPordTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          >
          <el-table-column
            type="index"
            width="100"
            :label="$t('retailProd.number')">
          </el-table-column>

          <el-table-column
            prop="name"
            :label="$t('group.actProName')"
            >
            <template slot-scope="scope">
              <span class="prod-name">{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="coverPic"
            :label="$t('group.proImg')"
            >
          <template slot-scope="scope">
            <img class="prod-pic" :src="scope.row.coverPic" />
          </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="status"
            :label="$t('group.proActStatus')"
            >
            <template slot-scope="scope">
              <span class="tag-text" v-if="scope.row.status === 2">{{
                $t("publics.normal")
              }}</span>
              <span class="tag-text" v-if="scope.row.status === 4">{{
                $t("coupon.illOff")
              }}</span>
              <span class="tag-text" v-if="scope.row.status === 5">{{
                $t("live.platfor")
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
    <import-prod
      v-if="importProdVisible"
      ref="importProd"
      @refreshDataList="refreshChange"
    ></import-prod>
    <!-- 商品选择弹窗-->
    <!-- 如果要更改dataUrl，在商品选择组件选择商品后的判断处也要更改一下 -->
    <prods-select
      v-if="selectGroupProdVisible"
      ref="ProdsSelect"
      :prodType="0"
      @refreshSelectProds="selectGroupProds"
    ></prods-select>
    <!-- 活动商品规格属性设置 -->
    <GroupProdSetting v-if="groupProdSettingVisible" ref="GroupProdSetting">
    </GroupProdSetting>
  </div>
</template>

<script>
import importProd from './liveRoom-import-prod'

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
      importProdVisible: false,
      shopNum: 0,
      totalNum: 0,
      id: null,
      status: null,
      addOrUpdateVisible: false
    }
  },
  components: {
    importProd
  },
  activated () {
    this.id = this.$route.query.id
    this.status = this.$route.query.status
    this.getDataList()
  },
  mounted () {
    this.id = this.$route.query.id
    this.status = this.$route.query.status
    this.getDataList()
  },
  methods: {
    // 获取剩余可新增得数量
    getAddRoomNum () {
      this.$http({
        url: this.$http.adornUrl('/live/liveRoomProd/getAddRoomProdNum'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.shopNum = data.shopNum
        this.totalNum = data.totalNum
      })
    },
    getDataList () {
      this.dataForm = {}
      this.id = this.$route.query.id || null
      this.getAddRoomNum()
      this.$http({
        url: this.$http.adornUrl('/live/liveProdStore/pageProdsByRoomId'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize,
              name: this.name ? this.name : null,
              id: this.id ? this.id : null
            }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
        if (this.selectProds) {
          this.$nextTick(() => {
            this.selectProds.forEach(row => {
              let index = this.dataList.findIndex((prodItem) => prodItem.prodId === row.prodId)
              this.$refs.prodTable.toggleRowSelection(this.dataList[index])
            })
          })
        }
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 返回路由跳转
    goBackHandle () {
      this.$router.go(-1)
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },

    // 选择商品操作
    selectProdHandle () {
      if (this.status !== '102') {
        return
      }
      this.importProdVisible = true
      this.$nextTick(() => {
        this.$refs.importProd.init(this.id)
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
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.getDataList(this.page)
          }
        })
      })
    },
    // 分页
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
.mod-admin-groupProd {
  .main-container {
    margin-top: 0;
    padding-top: 0;
    .operation-bar {
      margin-bottom: 20px;
    }
    .table-con {
      padding-bottom: 30px;
      .prod-name {
        flex: 1;
        margin-left: 10px;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        -webkit-text-overflow: ellipsis;
        -moz-text-overflow: ellipsis;
        word-break: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .prod-pic {
        object-fit: contain;
        width: 60px;
        height: 60px;
      }
    }
  }

}
</style>
