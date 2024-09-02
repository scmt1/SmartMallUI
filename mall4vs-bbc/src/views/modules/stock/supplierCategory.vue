<template>
  <div class="mod-supplier-supplier">
    <div class="main-container">
      <div class="operation-bar">
        <div v-if="isAuth('multishop:supplierCategory:save')" class="default-btn primary-btn" @click="addOrUpdateHandle()">
          {{ $t("crud.addTitle") }}</div>
      </div>
      <div class="table-con">
        <el-table :data="dataList" header-cell-class-name="table-header" row-class-name="table-row" :row-style="{ height:'70px'}" style="width: 100%">
          <el-table-column :label="$t('shop.supplierCategoryName')" prop="name" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('publics.remark')" prop="remark" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.remark}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('product.status')" prop="statusName" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('crud.menu')" width="220">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div v-if="isAuth('multishop:supplierCategory:update')" class="default-btn text-btn" @click="addOrUpdateHandle(scope.row.supplierCategoryId)">{{ $t('temp.modify') }}</div>
                <div class="default-btn text-btn" @click="disableStatus(scope.row.supplierCategoryId)"
                  v-if="scope.row.status === 1 && isAuth('multishop:supplierCategory:change')">{{$t("publics.disable")}}</div>
                <div v-if="scope.row.status === 0 && isAuth('multishop:supplierCategory:change')" class="default-btn text-btn"
                  @click="changeStatus(scope.row.supplierCategoryId)">{{$t("shop.ena")}}</div>
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
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './supplierCategory-add-or-update'

  export default {
    data () {
      return {
        dataList: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
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
      getDataList (page) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/supplier/supplierCategory/page'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                current: page == null ? this.page.currentPage : page.currentPage,
                size: page == null ? this.page.pageSize : page.pageSize
              }
            )
          )
        }).then(({data}) => {
          data.records.forEach(row => {
            row.statusName = row.status === 1 ? this.$i18n.t('shop.ena') : this.$i18n.t('publics.disable')
          })

          this.dataList = data.records
          this.page.total = data.total
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
      disableStatus (id) {
        this.$confirm(this.$i18n.t('shop.disableCategoryTip'), this.$i18n.t('text.tips'), {
          confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
          cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
          type: 'warning'
        }).then(() => {
          this.changeStatus(id)
        }).catch(() => {
        })
      },
      changeStatus (id) {
        this.$http({
          url: this.$http.adornUrl('/supplier/supplierCategory/changeCategoryStatus'),
          method: 'put',
          params: {
            supplierCategoryId: id
          }
        }).then(() => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
          this.getDataList(this.page)
        })
      },
      /**
       * 刷新回调
       */
      refreshChange () {
        this.getDataList(this.page)
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
