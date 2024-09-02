<template>
  <div class="new-supplier-mod">
    <div class="new-page-title">
      <div class="line"/>
      <div class="text">{{ $t('takeStock.editInventory') }}</div>
    </div>
    <div class="info-title">{{ $t('shopProcess.basicInfo') }}</div>
    <el-divider/>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="form-box" label-width="auto" @keyup.enter.native="dataFormSubmit()">
      <el-form-item :label="$t('takeStock.InventoryNo')" prop="takeStockNo">
        <span class="table-cell-text line-clamp-one">{{dataForm.takeStockNo}}</span>
      </el-form-item>
      <el-form-item :label="$t('takeStock.createTime')" prop="createTime">
        <span class="table-cell-text line-clamp-one">{{dataForm.createTime}}</span>
      </el-form-item>
      <el-form-item :label="$t('takeStock.regionName')" prop="stockRegionName">
        <el-input style="width: 320px" size="small" type="text" show-word-limit maxlength="20" v-model="dataForm.stockRegionName" :placeholder="$t('takeStock.regionName')"/>
        <el-tooltip class="item" effect="dark" :content="$t('takeStock.regionNameTip')" placement="top">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('publics.remark')" prop="remark">
        <el-input style="width: 200px" type="textarea" size="small" show-word-limit maxlength="200" :autosize="{ minRows: 2, maxRows: 5 }"
          :placeholder="$t('product.content')" v-model="dataForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <!--sku列表-->
    <skuListInfo v-if="dataForm.takeStockId" :take-stock-id="dataForm.takeStockId" ref="skuListInfo"></skuListInfo>
    <div class="footer" style="z-index: 3">
      <div @click="back()" class="default-btn">{{ $t("shopFeature.edit.back") }}</div>
      <div v-if="isAuth('multishop:takeStockProd:update')" type="primary" class="default-btn primary-btn" @click="updateStock()">
        {{ $t('takeStock.saveDraft') }}</div>
      <div v-if="isAuth('multishop:takeStockProd:finish')" type="primary" class="default-btn primary-btn" @click="finishStock()">
        {{ $t('takeStock.finishInventory') }}</div>
    </div>
  </div>
</template>

<script>
import skuListInfo from './components/take-stock-sku-info'
import { validNoEmptySpace } from '@/utils/validate'
export default {
  components: {
    skuListInfo
  },
  data () {
    let validateStockRegionName = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    let validateRemark = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    return {
      prodsSelectVisible: false,
      uploadVisible: false,
      supplierProdSelectVisible: false,
      isEdit: false,
      lang: localStorage.getItem('lang'),
      dataList: [],
      skuIds: [],
      dataForm: {
        takeStockId: null,
        takeStockNo: null,
        billStatus: null,
        createTime: null,
        stockRegionName: null,
        remark: null,
        shopId: null,
        takeStockProdList: []
      },
      takeStockProds: [],
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataListLoading: false,
      value: '',
      dataRule: {
        stockRegionName: [
          { validator: validateStockRegionName, trigger: 'blur' }
        ],
        remark: [
          { validator: validateRemark, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    if (this.$route.query.takeStockId) {
      this.dataForm.takeStockId = this.$route.query.takeStockId
    }
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/stock/takeStock/info/' + this.dataForm.takeStockId),
        method: 'get',
        params: this.$http.adornParams({
          takeStockId: this.dataForm.takeStockId
        })
      }).then(({data}) => {
        this.dataForm = data
      })
    },
    // 表单提交
    dataFormSubmit (status) {
    },
    getWaitingExcel () {
      this.getDataList(this.page)
    },
    updateStock () {
      let flag = this.checkInfo()
      if (!flag) {
        return
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/stock/takeStock'),
            method: 'put',
            data: this.dataForm
          }).then(() => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1000
            })
            this.$refs.skuListInfo.getSkuList()
            this.refreshChange()
          })
        }
      })
    },
    finishStock () {
      let flag = this.checkInfo()
      if (!flag) {
        return
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/stock/takeStock/finishInventory'),
            method: 'put',
            data: this.dataForm
          }).then(() => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1000
            })
            this.$router.push({
              path: 'stock-takeStock',
              query: {
              }
            })
          })
        }
      })
    },
    back () {
      this.$router.push('/stock-takeStock')
    },
    refreshChange () {
      this.skuIds = []
      this.getDataList()
    },
    checkInfo () {
      this.dataForm.takeStockProdList = this.$refs.skuListInfo.verifyDataForm()
      if (!this.dataForm.takeStockProdList) {
        this.$message({
          message: this.$i18n.t('takeStock.prodNotNull'),
          type: 'error',
          duration: 1500
        })
        return false
      }
      if (this.dataForm.takeStockProdList && this.dataForm.takeStockProdList.find(el => !el.totalStock && el.totalStock !== 0)) {
        this.$message({
          message: this.$i18n.t('takeStock.prodStockNotNull'),
          type: 'error',
          duration: 1500
        })
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
div >>>.is-always-shadow {
  margin-bottom:20px !important;
}
div >>>.is-success .el-input-number__decrease,
div >>>.is-success .el-input-number__increase,
div >>>.is-error .el-input-number__decrease,
div >>>.is-error .el-input-number__increase {
  right: 1px !important;
}
div >>>.el-date-editor .el-range-separator {
  width: 8%;
}
.form-box {
  margin-left: 10px;
}
.new-supplier-mod .footer {
  height: 50px;
  position: fixed;
  bottom: 0;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -3px 5px #eee;
  background: #FFF;
}
.info-title {
  color: #333333;
  font-size: 16px;
  font-weight: bold;
}
.prod-info {
  display: flex;
  align-items: center;
}
.prod-info .text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 10px;
  width: 170px;
}
.prod-info .text .name{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.new-supplier-mod {
  padding-bottom: 40px;
}
>>> .el-input__count {
  bottom: -40px;
}
>>>.el-table__row .el-input__suffix {
  right: -42px;
}
/* @media (max-width: 1440px) {

} */
</style>
