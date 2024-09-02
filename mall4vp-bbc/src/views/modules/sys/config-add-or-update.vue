<template>
  <el-dialog
    :title="!dataForm.id ? this.$i18n.t('sysManagement.add') : this.$i18n.t('sysManagement.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" size="small" label-width="80px">
      <el-form-item :label="$t('sys.parameteName')" prop="paramKey">
        <el-input v-model="dataForm.paramKey" :placeholder="$t('sys.parameteName')" maxlength="48" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.parameterValue')" prop="paramValue">
        <el-input v-model="dataForm.paramValue" type="textarea" :placeholder="$t('sys.parameterValue')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('publics.remark')" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" :placeholder="$t('publics.remark')" maxlength="480" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <div class="default-btn" @click="shopsSelectHandle()">店铺选择</div>
        <div class="default-btn" @click="prodsSelectHandle()">商品选择</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('coupon.cancel')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('coupon.confirm')}}</div>
    </span>
    <!-- 商品选择弹窗-->
    <prods-select
            v-if="prodsSelectVisible"
            ref="prodsSelect"
            @refreshSelectProds="selectCouponProds"
    ></prods-select>

    <shop-select v-if="shopsSelectVisible" ref="shopsSelect" @refreshSelectShops="selectCouponShops"></shop-select>
  </el-dialog>
</template>

<script>
  import ProdsSelect from '@/components/prods-reserve-selection'
  import ShopSelect from '@/components/shop-selection'
  export default {
    components: {
      ProdsSelect,
      ShopSelect
    },
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          paramKey: '',
          paramValue: '',
          remark: ''
        },
        dataRule: {
          paramKey: [
            { required: true, message: this.$i18n.t('sys.parameteNameNoNull'), trigger: 'blur' }
          ],
          paramValue: [
            { required: true, message: this.$i18n.t('sys.parameterValuenoNull'), trigger: 'blur' }
          ],
          remark: [
            { required: true, message: this.$i18n.t('sys.remarkNotNull'), trigger: 'blur' }
          ]
        },
        prodsSelectVisible: false,
        shopsSelectVisible: false,
      }
    },
    methods: {
      // 添加指定商品
      selectCouponProds (prods) {
        if (prods) {
          let prodIds = prods.map(item => { return item.prodId })
          this.dataForm.paramValue = prodIds.join(",")
        }
      },
      // 添加指定店铺
      selectCouponShops (shops) {
        if (shops) {
          let shopIds = shops.map(item => { return item.shopId })
          this.dataForm.paramValue = shopIds.join(",")
          this.$forceUpdate();
        }
      },
      // 显示添加指定商品弹框
      prodsSelectHandle () {
        this.prodsSelectVisible = true
        let prodIds = this.dataForm.paramValue.split(",")
        prodIds = prodIds.map(item => { return { prodId: Number(item) }})
        this.$nextTick(() => {
          this.$refs.prodsSelect.init(prodIds)
        })
      },
      // 显示添加指定商品弹框
      shopsSelectHandle () {
        this.shopsSelectVisible= true
        let shopIds = this.dataForm.paramValue.split(",")
        shopIds = shopIds.map(item => { return { shopId: Number(item) }})
        this.$nextTick(() => {
          this.$refs.shopsSelect.init(shopIds)
        })
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.dataForm.paramKey = data.paramKey
              this.dataForm.paramValue = data.paramValue
              this.dataForm.remark = data.remark
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/config`),
              method: this.dataForm.id ? 'put' : 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'paramKey': this.dataForm.paramKey,
                'paramValue': this.dataForm.paramValue,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              this.$message({
                message: this.$i18n.t('publics.operation'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            })
          }
        })
      }
    }
  }
</script>
