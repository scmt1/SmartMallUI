<template>
  <div class="new-supplier-mod">
    <div class="new-page-title">
      <div class="line"/>
      <div class="text">{{$t('shop.editSupplierProd')}}</div>
    </div>
    <div class="info-title">{{ $t('shopProcess.basicInfo') }}</div>
    <el-form
      :model="dataForm"
      ref="dataForm"
      class="form-box"
      label-width="auto"
      @keyup.enter.native="dataFormSubmit()">
      <el-form-item :label="$t('shop.supplierName')" prop="supplierName">
        <span class="table-cell-text line-clamp-one">{{dataForm.supplierName}}</span>
      </el-form-item>
    </el-form>
    <div class="info-title">{{ $t('shop.supplierProd') }}</div>
    <div style="float: left;margin: 8px 0 12px 10px">
      <div v-if="isAuth('multishop:supplierProd:select')" plain class="default-btn primary-btn" @click="selectSupplierProd">
        {{ $t("shop.addProd") }}</div>
      <div v-if="isAuth('multishop:supplierProd:export')" class="default-btn" @click="getExportExcel()">
        {{ $t("formData.export") }}
      </div>
      <el-tooltip class="item" :disabled="supplierProds.length === 0" effect="dark" :content="$t('shop.supplierProdImportTip')" placement="top">
      <div class="default-btn" :class="{'disabled-btn': supplierProds.length > 0}" @click.stop="getUpload()">{{ $t("product.importGoods") }}</div>
      </el-tooltip>
    </div>

    <div class="main-container">
      <div class="table-con">
        <el-table
          :data="supplierProds.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          :row-style="{ height:'70px'}"
          style="width: 100%;margin-left: 10px">
          <el-table-column :label="$t('product.prodName')" prop="prodName" width="300" align="left">
            <template slot-scope="scope">
              <div class="df prod-info">
                <img v-if="scope.row.pic"
                     :src="scope.row.pic.indexOf('http')===-1 && scope.row.pic.indexOf('https')=== -1 ? resourcesUrl + scope.row.pic : scope.row.pic"
                     width="60" height="60">
                <img v-else src="../../../assets/img/def.png" width="60" height="60">
                <div class="text">
                  <span class="name">{{ scope.row.prodName }}</span>
                  <span class="name">{{ scope.row.skuName }}</span>
                  <span class="name">{{ scope.row.partyCode }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('shop.minOrderQuantity')" prop="minOrderQuantity" align="left">
            <template slot-scope="scope">
              <el-input type="number" size="small" style="width: 150px"
                        oninput="if(value<1 || value >1000000000)value=1"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        @keydown.native="channelInputLimit"
                        v-model="scope.row.minOrderQuantity"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchase.order.purchasePrice')" prop="purchasePrice" align="left">
            <template slot-scope="scope">
              <el-input type="number"
                        size="small"
                        style="width: 150px"
                        :min="0.01"
                        :step="0.01"
                        :precision="2"
                        :max="100000000000"
                        v-model="scope.row.purchasePrice"
                        @blur="vaildPrice(scope)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('crud.menu')" width="220">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div class="default-btn text-btn" @click="deleteHandle(scope.$index)">{{ $t('crud.delBtn') }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="supplierProds.length"></el-pagination>
    </div>
    <div class="footer" style="z-index: 1">
      <div class="btn">
        <div @click="back()" class="default-btn">{{ $t("shopFeature.edit.back") }}</div>
        <div v-if="isAuth('multishop:supplierProd:update')" type="primary" class="default-btn primary-btn" @click="confirm()">
          {{ $t("crud.filter.submitBtn") }}</div>
      </div>
    </div>
    <!-- 供应商商品选择弹窗-->
    <supplier-prod-select
      v-if="supplierProdSelectVisible"
      ref="supplierProdSelect"
      @refreshSelectSupplier="supplierProdSelectHandle"
    ></supplier-prod-select>
    <!--供应商商品导入弹窗-->
    <supplier-prod-upload
      v-if="uploadVisible"
      ref="supplierProdUpload"
      @refreshDataList="getWaitingExcel"></supplier-prod-upload>
  </div>
</template>

<script>
import SupplierProdSelect from '@/components/supplier-prod-select'
import SupplierProdUpload from './components/supplier-prod-upload'
export default {
  data () {
    return {
      that: this,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      prodsSelectVisible: false,
      uploadVisible: false,
      supplierProdSelectVisible: false,
      retailProdSelectVisible: false,
      isEdit: false,
      lang: localStorage.getItem('lang'),
      supplierProds: [], // 选择的商品
      skuIds: [],
      dataForm: {
        supplierId: null,
        supplierName: null,
        prodName: null,
        minOrderQuantity: 1,
        purchasePrice: 0.01,
        supplierProdId: null,
        skuId: null,
        type: null
      },
      supplierProd: {
        supplierId: null
      },
      page: {
        currentPage: 1, // 初始页
        pageSize: 10 // 每页数据大小
      },
      dataListLoading: false,
      value: ''
    }
  },
  components: {
    SupplierProdUpload,
    SupplierProdSelect
  },
  mounted () {
    if (this.$route.query.supplierId) {
      this.supplierProd.supplierId = this.$route.query.supplierId
    }
    if (this.$route.query.supplierName) {
      this.dataForm.supplierName = this.$route.query.supplierName
    }
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/supplier/supplierProd/listSupplierProd'),
        method: 'get',
        params: this.$http.adornParams({
          supplierId: this.supplierProd.supplierId
        })
      }).then(({data}) => {
        this.supplierProds = data
        if (this.supplierProds) {
          this.supplierProds.forEach(row => {
            this.skuIds.push(row.skuId)
          })
        }
        this.dataListLoading = false
      })
    },

    /**
     * 校验采购价输入框
     */
    vaildPrice (scope) {
      const {row, $index} = scope
      const purchasePrice = row.purchasePrice
      if (!purchasePrice || purchasePrice <= 0) {
        this.$set(this.supplierProds[$index], 'purchasePrice', 0.01)
        return
      }
      if (purchasePrice > 100000000000) {
        this.$set(this.supplierProds[$index], 'purchasePrice', 100000000000)
        return
      }
      this.$set(this.supplierProds[$index], 'purchasePrice', this.constrainNum(purchasePrice))
    },
    // 四舍五入保留2位小数
    constrainNum (num) {
      let result = parseFloat(num)
      result = Math.round(num * 100) / 100
      let temp = result.toString()
      const i = temp.indexOf('.')
      if (i !== -1 && temp.length <= i + 2) {
        temp += '0'
      }
      return temp
    },

    // 表单提交
    dataFormSubmit (status) {
    },
    // 选择供应商商品
    selectSupplierProd () {
      let data = {
        supplierId: this.supplierProd.supplierId,
        skuIds: this.skuIds
      }
      this.supplierProdSelectVisible = true
      this.$nextTick(() => {
        this.$refs.supplierProdSelect.init(data)
      })
    },
    supplierProdSelectHandle (prod) {
      prod.forEach(item => {
        const param = {
          supplierId: this.supplierProd.supplierId,
          supplierProdId: null,
          prodId: item.prodId,
          skuId: item.skuId,
          prodName: item.prodName,
          skuName: item.skuName,
          partyCode: item.partyCode,
          pic: item.pic,
          minOrderQuantity: 1,
          purchasePrice: 0.01
        }
        this.supplierProds.push(param)
        this.skuIds.push(item.skuId)
      })
    },
    countChange (newValue) {
    },
    getWaitingExcel () {
      this.getDataList(this.page)
    },
    // 跳转至导入选择
    getUpload () {
      if (this.supplierProds.length > 0) {
        return
      }
      this.uploadVisible = true
      let id = this.supplierProd.supplierId
      this.$nextTick(() => {
        this.$refs.supplierProdUpload.init(id)
      })
    },
    getExportExcel () {
      this.$confirm(`${this.$i18n.t('shop.exportProdTip')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/supplier/supplierProd/exportSupplierProd'),
          method: 'get',
          params: this.$http.adornParams({
            supplierId: this.supplierProd.supplierId
          }),
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$i18n.t('shop.exProdFileName')
          const elink = document.createElement('a')
          if ('download' in elink) { // 非IE下载
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
      })
    },
    confirm: function () {
      this.$http({
        url: this.$http.adornUrl('/supplier/supplierProd'),
        method: 'put',
        data: this.supplierProds,
        params: {
          supplierId: this.supplierProd.supplierId
        }
      }).then(() => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1000
        })
        this.refreshChange()
      })
    },
    /**
     * 删除已选择的商品项
     * @param index 当前商品项在当前页的位置
     */
    deleteHandle (index) {
      // 页码-1 * 页面大小 + index = 当前删除项在数组中的位置
      this.supplierProds.splice(((this.page.currentPage - 1) * this.page.pageSize) + index, 1)
      // 判断当前页码是否超过删除后的页码大小
      if (this.page.currentPage > ((this.supplierProds.length - 1) / this.page.pageSize + 1)) {
        this.page.currentPage = --this.page.currentPage || 1
      }
      this.skuIds = []
      if (this.supplierProds) {
        this.supplierProds.forEach(row => {
          this.skuIds.push(row.skuId)
        })
      }
    },
    back () {
      // this.$router.push('/stock-supplierProd')
      this.$router.go(-1)
    },
    refreshChange () {
      this.skuIds = []
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
    },
    channelInputLimit (e) {
      const key = e.key
      if (key === '.') {
        e.returnValue = false
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
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
.new-supplier-mod::after{
  content: '';
  display: block;
  width: 100%;
  height:52px ;
}
.new-supplier-mod .footer {
  height: 52px;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  box-shadow: 0 -3px 5px #eee;
  background: #FFF;
}
.new-supplier-mod .footer .btn {
  width: 80%;
  display: flex;
  justify-content: center;
}
.info-title {
  border-bottom: solid 1px #ebedf0;
  margin: 8px 0 12px 10px;
  line-height: 25px;
  color: #606266;
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
.new-supplier-mod .footer .default-btn {
  height: 32px;
  line-height: 32px;
}
@media (max-width: 1440px){
  .el-card__body {
    padding-bottom: 40px !important;
  }
}
</style>
