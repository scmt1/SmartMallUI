<template>
  <div class="mod-log">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row margin-bottom-none">
          <el-form-item :label="$t('sys.userName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.username" :placeholder="$t('sys.userName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sys.userAction')" class="search-form-item">
            <el-input type="text" v-model="searchForm.operation" :placeholder="$t('sys.userAction')"></el-input>
          </el-form-item>
          <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
          <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
        </div>
      </el-form>
    </div>

    <div class="main-container">
      <!-- 表格 -->
      <div class="table-con sys-log-table">
        <el-table
          ref="sysLogTable"
          :data="dataList"
          header-cell-class-name="table-header"
          style="width: 100%"
        >
          <el-table-column
            fixed
            type="index"
            :label="$t('sysManagement.serialNumber')"
            width="80">
          </el-table-column>
          <!-- 用户名 -->
          <el-table-column
            prop="username"
            :label="$t('sys.userName')"
          >
            <template slot-scope="scope">
              {{scope.row.username}}
            </template>
          </el-table-column>
          <!-- 用户操作 -->
          <el-table-column
            prop="operation"
            :label="$t('sys.userAction')"
          >
            <template slot-scope="scope">
              {{scope.row.operation}}
            </template>
          </el-table-column>
          <!-- 请求方法 -->
          <el-table-column
            prop="method"
            :label="$t('sys.requestMerthod')"
          >
            <template slot-scope="scope">
              {{scope.row.method}}
            </template>
          </el-table-column>
          <!-- 请求参数 -->
          <el-table-column
            prop="params"
            :label="$t('sys.requestParameter')"
          >
            <template slot-scope="scope">
              {{scope.row.params}}
            </template>
          </el-table-column>
          <!-- 执行时长 -->
          <el-table-column
            prop="time"
            :label="$t('sys.executionTime')"
          >
            <template slot-scope="scope">
              {{scope.row.time}}
            </template>
          </el-table-column>
          <!-- IP地址 -->
          <el-table-column
            prop="ip"
            :label="$t('sys.ipAddress')"
          >
            <template slot-scope="scope">
              {{scope.row.ip}}
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            prop="createDate"
            :label="$t('sys.creationTime')"
          >
            <template slot-scope="scope">
              {{scope.row.createDate}}
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      dataListLoading: false,
      selectionDataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {}
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 刷新回调
    refreshChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/sys/log/page'),
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
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.searchForm = {}
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

</style>
