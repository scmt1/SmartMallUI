<template>
  <el-dialog
    :title="!dataForm.cardProdId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible.sync="visibles"
  >
    <el-table
      :data="dataForm"
      :page="page"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column prop="couponId" label="优惠券id" width="180"></el-table-column>
      <el-table-column prop="couponName" label="优惠券名称" width="180"></el-table-column>
      <el-table-column prop="startTime" label="起始时间"></el-table-column>
      <el-table-column prop="endTime" label="截止时间"></el-table-column>
      <el-table-column prop="stocks" label="优惠券库存"></el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visibles = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
import AddUpdate from './scoreCoupon-add-or-update'
export default {
  data () {
    return {
      visibles: false,
      dataForm: [],
      datas: {},
      currentRow: null,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  mounted () {
    this.createCoupod()
  },
  components: {
    ProdsSelect,
    AddUpdate
  },
  methods: {
    handleCurrentChange (val) {
      this.currentRow = val
    },
    createCoupod () {
      this.visibles = true
      this.$http({
        url: this.$http.adornUrl('/platform/coupon/pageByPlatform'),
        method: 'get'
      }).then(({ data }) => {
        this.datas = data
        this.dataForm = this.datas.records
      })
    },
    init () {
      this.visibles = true
    },
    // init (cardProdId) {

    //   this.dataForm.cardProdId = cardProdId || 0
    //   this.visible = true
    //   this.couponSelectVisible = false
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].resetFields()
    //     if (this.dataForm.cardProdId) {
    //       this.$http({
    //         url: this.$http.adornUrl('/platform/coupon/pageByPlatform'),
    //         method: 'get'
    //       }).then(({ data }) => {
    //         this.dataForm = data
    //       })
    //     }
    //   })
    // },
    // 表单提交
    dataFormSubmit () {
      this.visibles = false
      // console.log(this.currentRow)
      this.$emit('getMessage', this.currentRow)
    }
  }
}
</script>
