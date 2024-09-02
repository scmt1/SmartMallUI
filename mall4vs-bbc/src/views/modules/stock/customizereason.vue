<template>
  <div class="mod-supplier-supplier">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row margin-bottom-none">
          <el-form-item prop="reason" :label="$t('stock.stockBillReason')+':'">
            <el-input v-model="searchForm.reason" type="text" clearable :placeholder="$t('stock.stockBillReasonInputTips')"/>
          </el-form-item>
          <el-form-item :label="$t('stock.stockType')+':'" prop="type">
            <el-select clearable v-model="searchForm.type">
              <el-option :label="$t('stock.sendStock')" :value="1" />
              <el-option :label="$t('stock.receiveStock')" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('stock.sysSet')+':'" prop="sysSet">
            <el-select clearable v-model="searchForm.sysSet">
              <el-option :label="$t('publics.yes')" :value="1" />
              <el-option :label="$t('publics.no')" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('coupon.expStatus')+':'" prop="status">
            <el-select clearable v-model="searchForm.status">
              <el-option :label="$t('shop.ena')" :value="1" />
              <el-option :label="$t('publics.disable')" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item >
            <div class="text-btn-con">
              <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
              <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div v-if="isAuth('multishop:stockReason:add')" class="default-btn primary-btn" @click="addOrUpdateHandle()">{{ $t("crud.addTitle") }}</div>
      </div>
      <div class="table-con">
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('stock.stockBillReason')"
            prop="reason"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.reason}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.stockType')"
            prop="type"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.type === 1 ? $t('stock.sendStock') : $t('stock.receiveStock')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.sysSet')"
            prop="sysSet"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.sysSet ? $t('publics.yes') : $t('publics.no')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('coupon.expStatus')"
            prop="status"
          >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.status === 1 ? $t('shop.ena') : $t('publics.disable')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.remark')"
            prop="remark"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.remark}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('crud.menu')"
            fixed="right"
            width="300"
          >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div v-if="isAuth('multishop:stockReason:edit') && !scope.row.sysSet" class="default-btn text-btn" @click="addOrUpdateHandle(scope.row.stockChangeReasonId)">{{ $t('crud.editTitle') }}</div>
                <div v-if="isAuth('multishop:stockReason:enable') && scope.row.status === 0" class="default-btn text-btn" @click="changeStatus(scope.row.stockChangeReasonId, 1)">{{$t('shop.ena')}}</div>
                <div v-if="isAuth('multishop:stockReason:disable') && scope.row.status === 1" class="default-btn text-btn" @click="changeStatus(scope.row.stockChangeReasonId, 0)">{{$t('publics.disable')}}</div>
                <div v-if="isAuth('multishop:stockReason:delete') && !scope.row.sysSet" class="default-btn text-btn" @click="deleteHandle(scope.row.stockChangeReasonId, -1)">{{ $t('text.delBtn') }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './components/customizereason-add-or-update'

export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        reason: '', // 原因
        type: '', // 出入库类型
        sysSet: '', // 是否系统内置
        status: '' // 状态
      }, // 搜索
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  mounted () {
    this.getDataList(this.page)
  },
  methods: {
    getDataList (page, newData = false) {
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/shop/stockChangeReason/page'),
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
      }).then(({data}) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, null)
      })
    },
    changeStatus (id, status) {
      this.$http({
        url: this.$http.adornUrl('/shop/stockChangeReason/changeStatus'),
        method: 'put',
        params: this.$http.adornParams({
          stockChangeReasonId: id,
          status: status
        })
      }).then(({data}) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.refreshChange()
          }
        })
      })
    },
    deleteHandle (id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.stockChangeReasonId
      })
      this.$confirm(this.$i18n.t('admin.isDeleOper') + '?', this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.changeStatus(id, -1)
        this.page.total = this.page.total - ids.length
      }).catch(() => {
      })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.resetForm('searchForm')
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.getDataList(this.page, newData)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
