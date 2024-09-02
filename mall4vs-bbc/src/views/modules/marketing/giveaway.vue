<template>
  <div class="mod-discount">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item :label="$t('group.actName')+':'" class="search-form-item">
            <el-input v-model="searchForm.name" :placeholder="$t('group.actName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('giveaway.mainProdName')+':'" class="search-form-item">
            <el-input v-model="searchForm.prodName" :placeholder="$t('giveaway.mainProdName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('giveaway.name')+':'" class="search-form-item">
            <el-input v-model="searchForm.giveawayProdName" :placeholder="$t('giveaway.name')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('combo.comboStatus')+':'" class="search-form-item">
            <el-select v-model="searchForm.status" :placeholder="$t('combo.comboStatus')">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('shopFeature.searchBar.search')}}</div>
            <div class="default-btn" @click="clearSearch">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 搜索栏end -->
    <!-- 表格主体 -->
    <div class="main-container">
      <div class="operation-bar">
        <div
          class="default-btn primary-btn"
          v-if="isAuth('giveaway:giveaway:add')"
          @click="addOrUpdateHandle(0, 1)"
        >{{ $t("crud.addTitle") }}
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-con seckill-table">
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">

          <el-table-column
            prop="name"
            :label="$t('group.actName')"
          >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="this.$i18n.t('giveaway.mainProdInfo')"
            prop="reason"
            width="320px"
          >
            <template slot-scope="scope">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <prod-pic
                    :pic="scope.row.pic"
                  ></prod-pic>
                </div>
                <span class="table-cell-text">{{scope.row.prodName}}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="status"
            :label="$t('combo.comboStatus')"
          >
            <template slot-scope="scope">
              <div class="tag-text">
                {{[$t("group.expired"), $t("groups.processing"), $t('groups.notOpen')]
                [scope.row.status]}}</div>
            </template>
          </el-table-column>

          <el-table-column
            prop="startTime"
            :label="$t('coupon.startTime')"
          >
          </el-table-column>

          <el-table-column
            prop="endTime"
            :label="$t('coupon.endTime')"
          >
          </el-table-column>

          <el-table-column align="center" :label="$i18n.t('crud.menu')" width="250">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div class="default-btn text-btn">
                  <div
                    type="text"
                    v-if="isAuth('giveaway:giveaway:edit') && scope.row.status === 1 || scope.row.status === 2"
                    class="default-btn text-btn"
                    @click="addOrUpdateHandle(scope.row.giveawayId, 1)"
                  >{{$t("groups.editEvent")}}
                  </div>
                </div>
                <div
                  v-if="scope.row.status === 0"
                  type="text"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.giveawayId, 2)"
                >{{$t("crud.viewTitle")}}
                </div>
                <div v-if="scope.row.status === 1" class="default-btn text-btn">
                  <div
                    type="text"
                    v-if="isAuth('giveaway:giveaway:close')"
                    class="default-btn text-btn"
                    @click="changeStatus(scope.row.giveawayId, $i18n.t('groups.invalidActivity'), 0)"
                  >{{$t("groups.invalidActivity")}}
                  </div>
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('giveaway:giveaway:delete')"
                  @click="changeStatus(scope.row.giveawayId, $i18n.t('combo.delete'), -1)"
                >{{$t("text.delBtn")}}</div>
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
</template>

<script>
import ProdPic from '@/components/prod-pic'
export default {
  name: 'marketing-giveaway',
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 头部搜索表单
      searchForm: {
        name: null,
        prodName: null,
        status: null
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      statusList: [
        {
          value: 0,
          label: this.$i18n.t('groups.expired')
        },
        {
          value: 1,
          label: this.$i18n.t('groups.processing')
        },
        {
          value: 2,
          label: this.$i18n.t('groups.notOpen')
        }
      ],
      dataListLoading: false,
      offlineEventHandleVisible: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    ProdPic
  },
  created () {

  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/shop/giveaway/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.theData
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (giveawayId, pageType) {
      this.$router.push({
        path: '/marketing-giveaway-add-or-update',
        query: {
          giveawayId: giveawayId,
          pageType: pageType
        }
      })
    },
    // 查看商品
    showProds (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.showProdInit(id, 1)
      })
    },
    // 改变套餐状态
    changeStatus (giveawayId, operDesc, status) {
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[` + operDesc + `]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      })
      .then(() => {
        this.$http({
          url: this.$http.adornUrl('/shop/giveaway/changeStatus'),
          method: 'put',
          params: this.$http.adornParams({
            status: status,
            giveawayId: giveawayId
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
      })
      .catch(() => {

      })
    },
    // 删除
    deleteHandle (id, status) {
      if (status === 2) {
        return
      }
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${this.$i18n.t('text.delBtn')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/admin/discount/' + id),
            method: 'delete',
            data: this.$http.adornData({}, false)
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
        .catch(() => { })
    },
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 下线管理
    offlineEventHandle (id) {
      this.offlineEventHandleVisible = true
      this.$nextTick(() => {
        this.$refs.offlineEventHandle.init(id)
      })
    },
    clearSearch () {
      this.searchForm.name = null
      this.searchForm.prodName = null
      this.searchForm.status = null
      this.searchForm.giveawayProdName = null
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
    },
    /**
     * 刷新数据
     */
    refreshChange () {
      this.getDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
.prod-info-container {
  display: flex;
  flex-direction: row;
  .prod-image {
    margin-right: 10px;
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .prod-name {
    flex: 1;
    height: 80px;
    display: flex;
    flex-direction: column;
    text-align: start;
    justify-content: center;
    .prod-name-txt {
      font-size: 10px;
      color: #333333;
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>
