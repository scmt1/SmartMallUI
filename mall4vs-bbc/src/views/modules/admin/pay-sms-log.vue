<template>
  <el-dialog :title="this.$i18n.t('admin.smsRecord')" :close-on-click-modal="false" :visible.sync="visible" :width="dialogWidth">
    <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="任务ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="findByJobId()">查询</el-button>
      </el-form-item>
    </el-form>-->
    <div class="table-con">
      <el-table
      :data="dataList"
      v-loading="dataListLoading"
      height="460"
      header-cell-class-name="table-header"
      row-class-name="table-row"
      style="width: 100%;"
    >
      <el-table-column prop="smsNum" header-align="center" align="center" :label="this.$i18n.t('admin.rechargeNum')"></el-table-column>
      <el-table-column prop="costAmount" header-align="center" align="center" :label="this.$i18n.t('admin.amountSpent')"></el-table-column>
      <el-table-column prop="payType" header-align="center" align="center" :label="this.$i18n.t('admin.rechargeSource')">
        <template slot-scope="scope">
          <span v-if="scope.row.payType === 1" size="small">{{$t("admin.weChatPay")}}</span>
          <span v-if="scope.row.payType === 3" size="small">{{$t("admin.weChatPay")}}</span>
          <span v-if="scope.row.payType === 4" size="small">{{$t("admin.weChatPay")}}</span>
          <span v-if="scope.row.payType === 2" size="small" type="success">{{$t("admin.aliPay")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="chargeTime" header-align="center" align="center" :label="this.$i18n.t('admin.rechargeTime')"></el-table-column>
    </el-table>
    </div>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dialogWidth: '',
      defWidth: 1400
    }
  },
  created () {
    this.dialogWidth = setDialogWidth(this.defWidth)
  },
  mounted () {
    widthChange(this, this.defWidth)
  },
  methods: {
    init () {
      this.visible = true
      this.getDataList()
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/multishop/smsRechargeLog/page'),
        method: 'get',
        params: this.$http.adornParams({
          'current': this.pageIndex,
          'size': this.pageSize,
          'jobId': this.dataForm.id
        })
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
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
    // 失败信息
    showErrorInfo (error) {
      this.$alert(error)
    },
    // 条件查询
    findByJobId () {
      this.pageIndex = 1
      this.getDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
.table-con {
  margin-bottom: 20px;
}
</style>
