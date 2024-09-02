<template>
  <div class="mod-distribution-user">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('distributionBind.customer') + ':'">
            <el-input type="text" v-model="searchForm.nickName" :placeholder="$t('distributionBind.customer')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('distributionProdLog.distributor') + ':'">
            <el-input type="text" v-model="searchForm.parentNickName" :placeholder="$t('distributionProdLog.distributor')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('distributionBind.userMobile') + ':'">
            <el-input type="text" v-model="searchForm.cUserMobile" :placeholder="$t('distributionBind.userMobile')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('distributionProdLog.userMobile') + ':'">
            <el-input type="text" v-model="searchForm.dUserMobile" :placeholder="$t('distributionProdLog.userMobile')"></el-input>
          </el-form-item>
          <el-form-item prop="state" :label="$t('distributionBind.currentRelationship') + ':'">
            <el-select v-model="searchForm.state" :placeholder="$t('distributionBind.currentRelationship')" clearable>
              <el-option :label="$t('seckill.loseEffectiveness')" :value="-1"></el-option>
              <el-option :label="$t('distributionBind.binding')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-container">
      <!-- 表格 -->
      <div class="table-con distribution-bind-table">
        <el-table
          ref="distributionBindTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 序号 -->
          <el-table-column
            type="index"
            width="100"
            :label="$t('formData.serialNumber')">
          </el-table-column>
          <!-- 客户 -->
          <el-table-column
            prop="nickName"
            :label="$t('distributionBind.customer')"
          >
            <template slot-scope="scope">
              {{scope.row.user.nickName}}
            </template>
          </el-table-column>
<!--          客户号码-->
          <el-table-column
            prop="userMobile"
            :label="$t('distributionBind.userMobile')"
          >
            <template slot-scope="scope">
              {{scope.row.user.userMobile}}
            </template>

          </el-table-column>
          <!-- 分销员 -->
          <el-table-column
            prop="parentNickName"
            :label="$t('distributionProdLog.distributor')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.distributionUser">{{scope.row.distributionUser.nickName}}</span>
            </template>
          </el-table-column>
          <!--          分销员号码-->
          <el-table-column
            prop="userMobile"
            :label="$t('distributionProdLog.userMobile')"
          >
            <template slot-scope="scope">
              {{scope.row.distributionUser.userMobile}}
            </template>

          </el-table-column>

          <!-- 绑定时间 -->
          <el-table-column
            prop="bindTime"
            :label="$t('distribution.bindingTime')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.bindTime }}
            </template>
          </el-table-column>
          <!-- 失效时间 -->
          <el-table-column
            prop="invalidTime"
            :label="$t('distribution.invalidTime')"
            sortable
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.invalidTime">无</span>
              <span v-else>{{ scope.row.invalidTime }}</span>
            </template>
          </el-table-column>
          <!-- 当前关系 -->
          <el-table-column
            align="center"
            prop="state"
            :label="$t('distributionBind.currentRelationship')"
            width="180"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.state === -1">{{ $t("seckill.loseEffectiveness") }}</div>
              <div class="tag-text" v-if="scope.row.state === 1">{{ $t("distributionBind.binding") }}</div>
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

      dataForm: {
        userName: '',
        parentName: '',
        state: '',
        invalidReason: '',
        bindTime: [],
        invalidTime: [],
        cUserMobile: '',
        dUserMobile: ''
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
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
    // 点击查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUserBind/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : this.page.currentPage,
          size: page ? page.pageSize : this.page.pageSize
        }, this.theData))
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
