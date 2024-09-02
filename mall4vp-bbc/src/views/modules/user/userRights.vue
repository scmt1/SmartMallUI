<template>
  <div class="mod-user-userLevelCategory">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="rightsName" :label="$t('userRights.rightsName') + ':'">
            <el-input v-model="searchForm.rightsName" type="text" clearable  :placeholder="$t('userRights.rightsName')"></el-input>
          </el-form-item>
          <el-form-item prop="serviceType" :label="$t('user.rightsType') + ':'">
            <el-select v-model="searchForm.serviceType" clearable  :placeholder="$t('user.rightsType')">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('product.reset') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
   <div class="main-container">
      <div class="operation-bar">
        <div
            v-if="isAuth('user:userRights:update')"
            class="default-btn primary-btn"
            @click="addOrUpdateHandle()"
          >{{$t('userRights.customBenefits')}}</div>
      </div>
      <div class="table-con">
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row"
            style="width: 100%"
          >
            <el-table-column
              :label="$t('brand.serialNumber')"
              type="index"
              width="80"
            />
            <el-table-column
              :label="$t('userRights.rightsName')"
              prop="rightsName"
            />
            <el-table-column
              prop="icon"
              :label="$t('userRights.rightsIcon')"
            >
              <template slot-scope="scope">
                <div class="table-cell-image">
                  <img :src="resourcesUrl+scope.row.icon" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              :label="$t('userRights.rightsIntroduce')"
            />
            <el-table-column
              prop="serviceType"
              :label="$t('user.rightsType')"
            >
              <template slot-scope="scope">
                <span>{{[$t('userRights.systemRights'),$t('userRights.customBenefits')][scope.row.serviceType]}}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              :label="$t('crud.menu')"
              width="250"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div
                    v-if="isAuth('user:userRights:update')"
                    class="default-btn text-btn"
                    @click="addOrUpdateHandle(scope.row.rightsId)"
                  >{{$t('brand.revise')}}</div>
                  <div
                    v-if="scope.row.serviceType === 1"
                    class="default-btn text-btn"
                    @click="deleteHandle(scope.row.rightsId)"
                  >{{$t('brand.delete')}}</div>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <!-- <update-system v-if="updateSystemVisible" ref="updateSystem" @refreshDataList="refreshChange"></update-system> -->
  </div>
</template>

<script>
import AddOrUpdate from './userRights-add-or-update'
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
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      searchForm: {
        rightsName: '',
        serviceType: null
      }, // 搜索
      dataListLoading: false,
      addOrUpdateVisible: false,
      status: [
        {
          label: this.$i18n.t('userRights.systemRights'),
          value: 0
        }, {
          label: this.$i18n.t('userRights.customBenefits'),
          value: 1
        }
      ]
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
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/user/userRights'),
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/user/userRights/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          if (this.dataList.length === 1) {
            this.page.currentPage = this.page.currentPage === 1 ? 1 : this.page.currentPage - 1
          }
          this.$message({
            message: this.$i18n.t('remindPop.succeeded'),
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
    searchChange (newData = false) {
      this.page.currentPage = 1
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
.mod-user-userLevelCategory {

}
</style>
