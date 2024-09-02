<template>
  <div class="mod-prod-sku-table">
    <el-form-item>
      <!--      批量设置-->
      <div>
        <div
            class="default-btn text-btn"
            @click="switchSet"
          >{{$t("groups.batchSettings")}}</div>
          <el-form :inline="true" class="demo-form-inline" v-if="isEdit" size="small">
            <el-form-item :label="this.$i18n.t('prodList.marketValue')">
              <el-input-number v-model="dataFrom.oriPrice"
                              size="small"
                              :precision="2"
                              :max="1000000000"
                              :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item :label="this.$i18n.t('prodList.salesPrice')">
              <el-input-number v-model="dataFrom.price"
                              size="small"
                              :precision="2"
                              :max="1000000000"
                              :min="0"
              ></el-input-number>
            </el-form-item>

            <el-form-item :label="this.$i18n.t('product.scorePrice')">
              <el-input-number v-model="dataFrom.skuScore"
                              size="small"
                              :precision="0"
                              :max="1000000000"
                              :min="1"
              ></el-input-number>
            </el-form-item>

            <el-form-item :label="this.$i18n.t('product.stocks')">
              <el-input-number v-model="dataFrom.stocks"
                              size="small"
                              :precision="0"
                              :max="1000000000"
                              :min="0"
              ></el-input-number>
            </el-form-item>

            <el-form-item :label="this.$i18n.t('prodList.prodWeight')">
              <el-input-number v-model="dataFrom.weight"
                              size="small"
                              :precision="2"
                              :max="1000000000"
                              :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item :label="this.$i18n.t('prodList.prodVolume')">
              <el-input-number v-model="dataFrom.volume"
                              size="small"
                              :precision="2"
                              :max="1000000000"
                              :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item>
              <div class="default-btn primary-btn" @click="batchSet">{{$t("crud.filter.submitBtn")}}</div>
            </el-form-item>
            <el-form-item>
              <div class="default-btn primary-btn" style="background-color:#F56C6C;border:#F56C6C;" @click="switchSet">{{$t("crud.filter.cancelBtn")}}</div>
            </el-form-item>
          </el-form>
      </div>
      <el-table
        :data="value"
        style="width: 100%;"
        header-cell-class-name="table-header"
        row-class-name="table-row"
        :span-method="tableSpanMethod"
      >
        <el-table-column
          v-for="(leftTitle, index) in tableLeftTitles"
          :key="index"
          :label="leftTitle"
        >
          <template slot-scope="scope">{{scope.row.properties.split(';')[index].split(':')[1]}}</template>
        </el-table-column>
        <el-table-column v-if="tableLeftTitles.length" prop="pic" :label="this.$i18n.t('prodSku.skuPic')" width="180">
          <template slot-scope="scope">
            <img-upload v-model="scope.row.pic"></img-upload>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="prodName" label="商品名称" width="160" v-if="tableLeftTitles.length">
          <template slot-scope="scope">
            <el-input v-model="scope.row.prodName" type="textarea" :disabled="!scope.row.status"></el-input>
          </template>
        </el-table-column>-->
        <el-table-column prop="prodNameCn" :label="this.$i18n.t('prodSku.chineseName')" width="250" v-if="tableLeftTitles.length">
          <template slot-scope="scope">
            <el-input v-model="scope.row.prodNameCn" type="textarea" :disabled="!scope.row.status" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="prodNameEn" :label="this.$i18n.t('prodSku.englishName')" width="250" v-if="tableLeftTitles.length">
          <template slot-scope="scope">
            <el-input v-model="scope.row.prodNameEn" type="textarea" :disabled="!scope.row.status" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="oriPrice" :label="this.$i18n.t('prodList.marketValue')" width="160">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              v-model="scope.row.oriPrice"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0.00"
              :disabled="!scope.row.status"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="this.$i18n.t('prodList.salesPrice')" width="160">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              v-model="scope.row.price"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0.00"
              :disabled="!scope.row.status"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="skuScore" :label="this.$i18n.t('product.scorePrice')" width="160">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              v-model="scope.row.skuScore"
              controls-position="right"
              :precision="0"
              :max="1000000000"
              :min="1"
              @blur="changeScorePrice(scope)"
              :disabled="!scope.row.status"
            ></el-input-number>
          </template>
        </el-table-column>

        <el-table-column prop="stocks" :label="this.$i18n.t('product.stocks')" width="160">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              v-model="scope.row.stocks"
              controls-position="right"
              :precision="0"
              :max="1000000000"
              :min="0"
              :disabled="!scope.row.status"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="partyCode" :label="this.$i18n.t('product.prodCode')" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.partyCode" maxlength="36" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="weight" :label="this.$i18n.t('prodList.prodWeight')" width="160">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              v-model="scope.row.weight"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0"
              :disabled="!scope.row.status"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="volume" :label="this.$i18n.t('prodList.prodVolume')" width="160">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              v-model="scope.row.volume"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0"
              :disabled="!scope.row.status"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column :label="this.$i18n.t('remindPop.operation')">
          <template slot-scope="scope">
            <div
              class="default-btn text-btn"
              @click="changeSkuStatus(`${scope.$index}`)"
              v-if="scope.row.status"
            >{{$t('brand.disable')}}</div>
            <div
              class="default-btn text-btn"
              @click="changeSkuStatus(`${scope.$index}`)"
              v-else
            >{{$t('brand.enAble')}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
// import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
export default {
  data () {
    return {
      // 数据库中的规格
      dbSpecs: [],
      // 根据选定的规格所查询出来的规格值
      dbSpecValues: [],
      specs: [], // 使用的规格
      initing: false,
      isEdit: false,
      dataFrom: {
        oriPrice: null,
        price: null,
        skuScore: null,
        stocks: null,
        weight: null,
        volume: null
      }
    }
  },
  components: {
    ImgUpload
  },
  props: {
    value: {
      default: [],
      type: Array
    },
    prodNameCn: {
      default: ''
    },
    prodNameEn: {
      default: ''
    }
  },
  watch: {
    prodNameCn: function () {
      this.skuAddProdName()
    },
    prodNameEn: function () {
      this.skuAddProdName()
    }
  },
  created: function () {
    this.isEdit = false
    this.$http({
      url: this.$http.adornUrl(`/prod/spec/list`),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({ data }) => {
      this.dbSpecs = data
    })
  },
  computed: {
    tableLeftTitles () {
      let res = []
      for (let i = 0; i < this.skuTags.length; i++) {
        const skuTag = this.skuTags[i]
        res.push(skuTag.tagName)
      }
      return res
    },
    skuTags: {
      get () { return this.$store.state.prod.skuTags }
    },
    defalutSku () {
      return this.$store.state.prod.defalutSku
    }
  },
  methods: {
    init () {
      this.initing = true
    },
    getTableSpecData () {
      return this.value
    },
    tableSpanMethod ({ row, column, rowIndex, columnIndex }) {

    },
    changeSkuStatus (tagIndex) {
      this.value[tagIndex].status = this.value[tagIndex].status ? 0 : 1
    },
    skuAddProdName () {
      if (this.initing) {
        return
      }
      let skuList = []
      for (let i = 0; i < this.value.length; i++) {
        const sku = Object.assign({}, this.value[i])
        if (!sku.properties) {
          return
        }
        sku.skuName = ''
        let properties = sku.properties.split(';')
        for (const propertiesKey in properties) {
          sku.skuName += properties[propertiesKey].split(':')[1] + ' '
        }
        sku.prodNameCn = this.prodNameCn + ' ' + sku.skuName
        sku.prodName = this.prodNameCn + ' ' + sku.skuName
        sku.prodNameEn = this.prodNameEn + ' ' + sku.skuName
        skuList.push(sku)
      }
      this.$emit('input', skuList)
    },
    switchSet () {
      this.isEdit = !this.isEdit
      if (!this.isEdit) {
        this.dataFrom.oriPrice = 0
        this.dataFrom.price = 0
        this.dataFrom.skuScore = 1
        this.dataFrom.stocks = 0
        this.dataFrom.weight = 0
        this.dataFrom.volume = 0
      }
    },
    changeScorePrice(row) {
      let obj = row.row
      if(!row.row.skuScore) {
        obj['skuScore'] = 1
        this.$set(this.value, row.$index, obj)
        this.value[row.$index].skuScore = 1
      }
    },
    batchSet () {
      this.value.forEach(sku => {
        if (this.dataFrom.oriPrice) {
          sku.oriPrice = this.dataFrom.oriPrice
        }
        if (this.dataFrom.price) {
          sku.price = this.dataFrom.price
        }
        if (this.dataFrom.skuScore) {
          sku.skuScore = this.dataFrom.skuScore
        }
        if (this.dataFrom.stocks) {
          sku.stocks = this.dataFrom.stocks
        }
        if (this.dataFrom.weight) {
          sku.weight = this.dataFrom.weight
        }
        if (this.dataFrom.volume) {
          sku.volume = this.dataFrom.volume
        }
      })
      this.isEdit = false
    }
  }
}
</script>

<style lang="scss">
.mod-prod-sku-table {
  .pic-uploader-component .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
    .pic {
      width: 120px;
      height: 120px;
      display: block;
    }
  }
  .pic-uploader-component .el-upload:hover {
    border-color: #409eff;
  }
  .el-upload--picture-card{
  background: #ffffff;
}
}
</style>
