<template>
  <div class="mod-distribution-user">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="userMobile" label="分销员手机号" class="search-form-item">
            <el-input type="text" v-model="searchForm.userMobile" placeholder="分销员手机号"></el-input>
          </el-form-item>
        </div>
        <div class="default-btn primary-btn" @click="searchChange">{{$t('product.search')}}</div>
        <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con prod-table">
        <el-table
          ref="prodListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%">
          <el-table-column
            fixed
            align="center"
            prop="nickName"
            label="分销员昵称"
            width="auto">
            <template slot-scope="scope">
              {{scope.row.distributionUser.nickName}}
            </template>
          </el-table-column>
          <el-table-column
            fixed
            align="center"
            prop="userMobile"
            label="分销员手机号"
            width="auto">
            <template slot-scope="scope">
              {{scope.row.distributionUser.userMobile}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="lastIp"
            label="最后登陆IP"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="lastTime"
            sortable
            label="最后登陆时间"
            width="auto">
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

  </div>
</template>

<script>
export default {
  data () {
    return {
      createdateRange: [],
      dataForm: {
        userMobile: null
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      searchForm: {
        userMobile: ''
      }
    }
  },
  components: {
  },
  methods: {
    // 刷新回调
    refreshChange () {
      this.getDataList(this.page)
    },
    // 点击查询
    searchChange () {
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUserActive/page/anduser'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : 1,
          size: page ? page.pageSize : 20
        }, this.searchForm))
      }).then(({ data }) => {
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current

        this.dataList = data.records
        this.dataListLoading = false
      })
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.prodName = ''
      this.isTop = ''
      this.categoryId = null
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
