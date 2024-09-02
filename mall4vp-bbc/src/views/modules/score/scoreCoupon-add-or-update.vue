<template>
  <el-dialog :title="dataForm.couponId ? '修改优惠券' : '新增优惠券'"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-form-item label="优惠券名称"
                    prop="couponName">
        <el-input :disabled="true"
                  v-model="this.dataForm.couponName"></el-input>
        <el-button plain
                   @click="selectCoupon()">请选择优惠券</el-button>
      </el-form-item>
      <el-form-item label="积分价格"
                    prop="scorePrice">
        <el-input v-model="dataForm.scorePrice"
                  placeholder="积分价格"
                  type="number"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 优惠券选择弹窗-->
    <Coupon v-if="couponVisible"
            ref="Coupon"
            @getMessage="showCouponId"></Coupon>
  </el-dialog>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
import Coupon from './couponProd-coupon'
export default {
  data () {
    var validate = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('需大于0'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        couponId: 0,
        couponName: '',
        scorePrice: 0
      },
      couponVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      errorTip: false,
      dataListSelections: [],
      prodsSelectVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataRule: {
        couponName: [
          { required: true, message: '请选择优惠券', trigger: 'blur' }
        ],
        scorePrice: [
          { required: true, message: '积分价格不能为空', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    ProdsSelect,
    Coupon
  },
  watch: {
    visible: function () {
      if (this.visible === false) {
        this.prodsSelectVisible = false
      }
    }
  },
  methods: {
    // 获取数据列表
    init (couponId) {
      this.dataForm.couponId = couponId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (this.dataForm.couponId) {
        this.getDataList()
      }
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(`/platform/coupon/info/${this.dataForm.couponId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
      })
    },
    // 选择点击事件
    // selectChangeHandle (selection) {
    //   this.dataList.forEach((tableItem) => {
    //     let selectedProdIndex = selection.findIndex((selectedProd) => {
    //       if (!selectedProd) {
    //         return false
    //       }
    //       return selectedProd.prodId === tableItem.prodId
    //     })
    //     let dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedProd) => dataSelectedProd.prodId === tableItem.prodId)
    //     if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
    //       this.dataListSelections.push(tableItem)
    //     } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
    //       this.dataListSelections.splice(dataSelectedProdIndex, 1)
    //     }
    //   })
    // },
    // 显示添加指定商品弹框
    prodsSelectHandle () {
      this.prodsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.prodsSelect.init(this.dataForm.couponProds)
      })
    },
    // 删除指定商品
    deleteProd (index) {
      this.dataForm.couponProds.splice(index, 1)
    },
    // 添加指定商品
    selectCouponProds (prods) {
      if (prods) {
        this.dataForm.couponProds = prods
      }
    },
    // 优惠券更改
    selectCoupon () {
      this.couponVisible = true
      this.$nextTick(() => {
        this.$refs.Coupon.init()
      })
    },
    showCouponId (coupon) {
      // console.log('1111111111')
      this.coupon = coupon
      this.dataForm.couponName = coupon.couponName
      this.dataForm.couponId = coupon.couponId
    },
    // 表单提交
    dataFormSubmit () {
      if (this.errorTip) {
        this.$message({
          message: '数量不能小于0',
          type: 'error',
          duration: 1500
        })
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/platform/coupon/couponByScore`),
            method: this.dataForm.couponId ? 'put' : 'post',
            data: this.$http.adornData({
              'couponId': this.dataForm.couponId || undefined,
              'scorePrice': this.dataForm.scorePrice
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dataForm.couponProds = []
                this.$emit('refreshDataList', this.page)
                this.visible = false
              }
            })
          })
        }
      })
    },
    /**
    * 刷新回调
    */
    refreshChange () {
      this.getDataList(this.page)
    }
  }
}
</script>
<style lang="scss">
.mod-coupon-add-or-update {
}
</style>
