<template>
  <div class="container">
    <div class="content-container">
      <div class="new-page-title">
        <div class="line" />
        <div class="text">
          {{this.$i18n.t('stock.newOutboundDetails')}}
        </div>
      </div>
      <basicInfo :type="dataForm.type" :stockBillLogId="stockBillLogId" ref="basicInfo"></basicInfo>
      <skuListInfo :type="dataForm.type" :stockBillLogId="stockBillLogId" ref="skuListInfo"></skuListInfo>
    </div>
    <div class="foot-btn">
      <div class="default-btn primary-btn" @click="confirmSave(1)">{{this.$i18n.t('stock.confirmDelivery')}}</div>
      <div class="default-btn" @click="confirmSave(2)">{{this.$i18n.t('stock.saveDraft')}}</div>
    </div>
  </div>
</template>

<script>
import basicInfo from './components/stock-bill-basic-info'
import skuListInfo from './components/stock-bill-sku-info'
export default {
  components: {
    basicInfo,
    skuListInfo
  },
  data () {
    return {
      isSubmit: false,
      addProdVisible: false, // 添加商品弹窗是否可见
      batchImportVisible: false, // 批量导入商品弹窗是否可见
      stockBillLogId: 0, // 出入明细id
      dataForm: {
        businessTime: '', // 出库时间
        stockChangeReasonId: '', // 出库原因
        remark: '', // 备注
        qualifications: '', // 出库凭证
        stockBillLogItems: [], // 商品项
        type: 1, // 1 出库 2 入库
        stockBillType: 6
      },
      type: 1, // 1：出库 2：入库
      reasonList: [] // 入库原因列表
    }
  },
  created () {
    this.stockBillLogId = this.$route.query.stockBillLogId
  },
  mounted () {

  },
  methods: {
    init (stockBillLogId) {
    },
    confirmSave (status) {
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      let dataForm = this.$refs.basicInfo.verifyDataForm()
      let stockBillLogItems = this.$refs.skuListInfo.verifyDataForm()
      if (!dataForm || !stockBillLogItems) {
        this.isSubmit = false
        return
      }
      dataForm.stockBillLogItems = stockBillLogItems
      dataForm.status = status
      dataForm.type = this.type
      dataForm.stockBillLogId = this.stockBillLogId
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLog'),
        method: dataForm.stockBillLogId ? 'put' : 'post',
        data: this.$http.adornData(dataForm)
      }).then(({data}) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.isSubmit = false
            this.$router.push({
              path: '/stock-send-list'
            })
          }
        })
      }).catch(() => {
        this.isSubmit = false
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  height: 100%;
  .content-container {
    padding-bottom: 60px;
  }
  /* 脚部按钮 */
  .foot-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 15px 0;
    display: flex;
    justify-content: center;
    background: #fff;
    // border-top: 1px solid #ddd;
    box-shadow: 0 -2px 3px rgba(139, 139, 139, 0.1);
    z-index: 1999;
  }
}

</style>
