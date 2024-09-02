<template>
  <div class="mod-user-userScoreLog">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="nickName" :label="$t('users.name')" class="search-form-item">
            <el-input type="text" v-model="searchForm.nickName" :placeholder="$t('users.name')"></el-input>
          </el-form-item>
          <el-form-item prop="source" :label="$t('user.source')" class="search-form-item">
            <el-select v-model="searchForm.source" :placeholder="$t('user.source')">
              <el-option :label="$t('user.order')" :value="1"></el-option>
              <el-option :label="$t('user.levelUp')" :value="2"></el-option>
              <el-option :label="$t('user.signIn')" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="orderNumber" :label="$t('order.number')" class="search-form-item">
            <el-input type="text" v-model="searchForm.orderNumber" :placeholder="$t('order.number')"></el-input>
          </el-form-item>
          <el-form-item prop="ioType" :label="$t('shop.ioType')" class="search-form-item">
            <el-select v-model="searchForm.ioType" :placeholder="$t('shop.ioType')">
              <el-option :label="$t('shop.pay')" :value="0"></el-option>
              <el-option :label="$t('shop.income')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <div class="default-btn primary-btn" @click="searchChange">{{$t('product.search')}}</div>
          <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div
          class="default-btn primary-btn"
          v-if="isAuth('user:userScoreLog:save')"
          @click="addOrUpdateHandle()">
          {{$t('crud.addTitle')}}
        </div>
        <div
          :class="[dataListSelections.length <= 0 ? 'disabled-btn' : '', 'default-btn']"
          @click="deleteHandle()"
          v-if="isAuth('platform:indexImg:delete')"
        >{{$t('sys.batchDelete')}}
        </div>
      </div>
      <div class="table-con banner-table">
        <el-table
          ref="bannerListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="nickName"
            :label="$t('users.name')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="source"
            :label="$t('user.source')"
            width="auto">
            <template slot-scope="scope" slot="source">
              <span class="tag-text" v-if="scope.row.source === 1">订单</span>
              <span class="tag-text" v-else-if="scope.row.source === 2">等级提升</span>
              <span class="tag-text" v-else>签到</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="score"
            :label="$t('order.score')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="orderNumber"
            :label="$t('order.number')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="ioType"
            :label="$t('shop.ioType')"
            width="auto">
           <template slot-scope="scope">
              <span v-if="scope.row.ioType === 0" class="tag-text">支出</span>
              <span v-else class="tag-text">收入</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            :label="$t('sys.creationTime')"
            width="auto">
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="250">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('user:userScoreLog:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.logId)"
                >{{$t('user.editBtn')}}</div>
                <div
                  v-if="isAuth('user:userScoreLog:delete')"
                  class="default-btn text-btn"
                  @click="deleteHandle(scope.row.logId)"
                >{{$t('user.deleteBtn')}}</div>
              </div>
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
    
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './userScoreLog-add-or-update'
export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        orderNumber: '',
        ioType: '',
        nickName: '',
        source: ''
      }, // 搜索
      dataListLoading: false,
      addOrUpdateVisible: false
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
        url: this.$http.adornUrl('/user/userScoreLog/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
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
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (id) {
      this.$confirm('确定进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/user/userScoreLog/' + id),
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
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
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
<style lang="scss">
.mod-user-userScoreLog {
}
</style>
