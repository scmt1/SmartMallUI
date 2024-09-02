<template>
    <el-dialog class="batchCardList" title="批次提货卡(券)明细" :close-on-click-modal="false" :visible.sync="visible" width="65%">
        <!-- 搜索栏 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item label="卡号" class="search-form-item">
                        <el-input type="text" v-model="searchForm.cardCode" placeholder="请输入卡号"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" class="search-form-item">
                        <el-select filterable v-model="searchForm.status" placeholder="请选择" style="width: 100%">
                            <el-option label="未制卡(券)" :value="0"></el-option>
                            <el-option label="未出售" :value="1"></el-option>
                            <el-option label="已出售" :value="2"></el-option>
                            <el-option label="已绑定" :value="3"></el-option>
                            <el-option label="已冻结" :value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间" label-width="70px">
                        <el-date-picker
                                v-model="launchDateRange"
                                type="datetimerange"
                                :range-separator="$t('time.tip')"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :start-placeholder="$t('time.start')"
                                :end-placeholder="$t('time.end')"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
                        <div class="default-btn" @click="resetSearchForm('searchForm')">重置</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="main-container">
            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table ref="activityTable" v-loading="tableLoading" :data="dataList" header-cell-class-name="table-header" row-class-name="table-row-low" style="width: 100%">
                    <el-table-column prop="cardTitle" label="名称" min-width="150">
                    </el-table-column>
                    <el-table-column prop="batchNumber" label="批次号" min-width="150">
                    </el-table-column>
                    <el-table-column prop="cardNumber" label="编号" min-width="100">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" min-width="100">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status === 0" type="info" effect="dark">未制卡(券)</el-tag>
                            <el-tag v-if="scope.row.status === 1" type="" effect="dark">未出售</el-tag>
                            <el-tag v-if="scope.row.status === 2" type="danger" effect="dark">已出售</el-tag>
                            <el-tag v-if="scope.row.status === 3" type="success" effect="dark">已绑定</el-tag>
                            <el-tag v-if="scope.row.status === 4" type="warning" effect="dark">已冻结</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="balance" label="卡余额(元)" min-width="80">
                    </el-table-column>
                    <el-table-column prop="cardCode" label="卡号" min-width="150">
                    </el-table-column>
                    <el-table-column prop="password" label="卡密" min-width="70">
                    </el-table-column>
                    <el-table-column prop="cardType" label="卡类别" min-width="80">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.cardType === 1 ? 'success' : ''" effect="dark" v-for="(item,index) in cardTypeList" v-if="item.value == scope.row.cardType" :key="index">{{item.title}}</el-tag>
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
        <div slot="footer">
            <el-button type="default" @click="visible=false">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'batchCardList',
    data() {
        return {
          visible: false,
          dataList: [],
          searchForm: {},
          batchNumber: "",
          page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
          },
          tableLoading: false,
          cardTypeList: [],
          launchDateRange: null,
          batchNumList:[],
        }
    },
    methods: {
      // 获取类型
      getTypeData () {
        let type = 'card_type'
        this.$http({
          url: this.$http.adornUrl(`/multishop/sys/dictData/getByType/${type}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.cardTypeList = data
        })
      },
      handleSizeChange (val) {
        this.page.pageSize = val
        this.getDataList(this.page)
      },
      handleCurrentChange (val) {
        this.page.currentPage = val
        this.getDataList(this.page)
      },
      // 刷新回调用
      refreshChange () {
        this.page.currentPage = 1
        this.getDataList(this.page)
      },
      // 获取数据列表
      getDataList (page, newData = false) {
        this.tableLoading = true
        if (newData || !this.theData) {
          this.theData = JSON.parse(JSON.stringify(this.searchForm))
          this.theData.startTime = this.launchDateRange === null ? null : this.launchDateRange[0]
          this.theData.endTime = this.launchDateRange === null ? null : this.launchDateRange[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/admin/card/page'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                current: page == null ? this.page.currentPage : page.currentPage,
                size: page == null ? this.page.pageSize : page.pageSize,
                shopId: 0,
                batchNumber: this.batchNumber
              },
              this.theData
            )
          )
        }).then(({data}) => {
          this.dataList = data.records
          this.page.total = data.total
          this.dataListLoading = false
        }).finally(() => {
          this.tableLoading = false
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
        this.launchDateRange = null
        this.searchForm = {}
      },
      init (batchNumber) {
        this.batchNumber = batchNumber || 0;
        this.visible = true
        this.getTypeData();
        this.getDataList();
      },
    }
}
</script>

<style scoped lang="scss">
.cardUseList {

}
</style>
