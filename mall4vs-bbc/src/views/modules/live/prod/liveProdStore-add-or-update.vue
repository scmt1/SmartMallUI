<template>
  <div>
    <el-dialog
      :title="type"
      :close-on-click-modal="false"
      :visible.sync="visible"
      :before-close="handleDialogClose"
      width="810px"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        :label-width="$t('language') === 'English' ? '110px' : '80px'"
      >
        <!-- <el-form-item
          :label="this.$i18n.t('live.updateReminder')"
          prop="pic"
          v-if="dataForm.liveProdStoreId && dataForm.status === 2"
        >
          <span style="color: red"></span>
          <span style="color: red" v-if="dataForm.liveProdStoreId"
            >{{ $t("live.numOfNewLiveProdRem") }}：{{ shopNum
            }}{{ $t("live.times") }},{{ $t("live.subPlatRemLimi") }}{{ totalNum
            }}{{ $t("live.times") }}</span
          >
        </el-form-item> -->
        <el-form-item :label="this.$i18n.t('live.prodCover')" prop="pic" class="livePic">
          <img-upload
            v-model="dataForm.coverPic"
            :maxSize="0.08"
            :disabled="dataForm.status !== 0 && dataForm.liveProdStoreId !== 0"
            :imgSizeLimit="true"
          ></img-upload>
          <span
            >{{ $t("live.recommendedSize") }}：300{{ $t("live.pixel") }} * 300{{
              $t("live.pixel")
            }}，{{ $t("live.imageSizeCannot") }}80K</span
          >
        </el-form-item>
        <el-form-item :label="this.$i18n.t('product.prodName')" class="liveName" prop="name">
          <el-input
            size="small"
            v-model="dataForm.name"
            maxlength="14"
            show-word-limit
            :disabled="dataForm.status !== 0 && dataForm.liveProdStoreId !== 0"
          ></el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('live.priceForm')" prop="priceType">
          <el-radio-group
            v-model="dataForm.priceType"
            :disabled="dataForm.status !== 0 && dataForm.liveProdStoreId !== 0"
          >
            <el-radio :label="1">{{ $t("live.onePrice") }}</el-radio>
            <el-radio :label="2">{{ $t("live.thePriceRange") }}</el-radio>
            <el-radio :label="3">{{ $t("live.showDiscountedPrice") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataForm.priceType === 1"
          :label="this.$i18n.t('groups.enterPrice')"
          class="livePrice"
        >
          <el-input-number
            :precision="2"
            :min="0"
            :max="100000000"
            v-model="dataForm.price"
            type="number"
            size="small"
            :disabled="dataForm.status !== 0 && dataForm.liveProdStoreId !== 0"
            style="width: 25%"
          ></el-input-number>
          <span class="tips">{{ $t("admin.dollar") }}</span>
        </el-form-item>
        <el-form-item
          v-if="dataForm.priceType === 2"
          :label="this.$i18n.t('groups.enterPrice')"
          class="livePrice"
        >
          <span class="input-tips"></span>
          <el-input-number
            :precision="2"
            :min="0"
            :max="100000000"
            v-model.number="dataForm.price"
            style="width: 180px"
            size="small"
            :disabled="dataForm.status !== 0 && dataForm.liveProdStoreId !== 0"
          ></el-input-number>
          <span class="input-tips">-</span>
          <el-input-number
            :precision="2"
            :min="0"
            :max="100000000"
            v-model.number="dataForm.price2"
            style="width: 180px"
            size="small"
            :disabled="dataForm.status !== 0 && dataForm.liveProdStoreId !== 0"
          ></el-input-number>
          <span class="tips">{{ $t("admin.dollar") }}</span>
        </el-form-item>
        <el-form-item
          v-if="dataForm.priceType === 3"
          :label="this.$i18n.t('groups.enterPrice')"
          class="livePrice"
        >
          &nbsp;&nbsp;&nbsp;
          <span class="input-tips">{{ $t("live.marketPrice") }}</span>
          <el-input-number
            v-model.number="dataForm.price"
            style="width: 180px"
            :precision="2"
            :min="0"
            :max="100000000"
            size="small"
            :disabled="dataForm.status !== 0 && dataForm.liveProdStoreId !== 0"
          ></el-input-number
          >
          <span class="tips">{{ $t("admin.dollar") }}</span>
          &nbsp;&nbsp;&nbsp;
          <span class="input-tips">{{ $t("live.currentPrice") }}</span>
          <el-input-number
            :precision="2"
            :min="0"
            :max="100000000"
            v-model.number="dataForm.price2"
            style="width: 180px"
            size="small"
            :disabled="dataForm.status !== 0 && dataForm.liveProdStoreId !== 0"
          ></el-input-number>
          <span class="tips">{{ $t("admin.dollar") }}</span>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('live.commodityPath')" prop="url" class="liveUrl">
          <div v-if="dataForm.prodId != null">
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px; width: 120px"
            >
              <!-- <img :src="card.pic" style="height: 104px; width: 100%" /> -->
              <prod-pic
                  height="104px"
                  width="100%"
                  :pic="card.pic"
                ></prod-pic>
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{ card.name }}</span>
                <div
                  :class="[dataForm.status !== 0 && dataForm.liveProdStoreId !== 0 ? 'disabled-btn':'','default-btn text-btn card-prod-name-button']"
                  @click="deleteSelectProd"
                  >{{ $t("text.delBtn") }}</div
                >
              </div>
            </el-card>
          </div>
          <div v-if="dataForm.prodId == null">
            <div
              @click="addProd"
              :class="[dataForm.status !== 0 && dataForm.liveProdStoreId !== 0 ? 'disabled-btn':'', 'default-btn']"
              >{{ $t("product.select") }}</div
            >
          </div>
          <div v-if="dataForm.prodId != null">
            <div>{{ $t("live.jumpToDetailsPage") }}</div>
            <el-radio-group
              v-model="dataForm.prodType"
              :disabled="
                dataForm.status === 2 || dataForm.liveProdStoreId !== 0
              "
            >
              <el-radio :label="0">{{
                $t("live.generalMerchandise")
              }}</el-radio>
              <el-radio :label="1" :disabled="groupDisabled">{{
                $t("live.joinAGroup")
              }}</el-radio>
              <el-radio :label="2" :disabled="sekilledDisabled">{{
                $t("live.spike")
              }}</el-radio>
              <!-- <el-radio :label="3">积分</el-radio> -->
            </el-radio-group>
          </div>
          <div v-if="dataForm.prodId != null">
            <el-input size="small" v-model="dataForm.url" disabled></el-input>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div
          class="default-btn" @click="closeData">{{
          $t("crud.filter.cancelBtn")
        }}</div>
        <div
          class="default-btn primary-btn"
          v-if="dataForm.liveProdStoreId === 0 || dataForm.status === 0"
          @click="dataFormSubmit()"
          >{{ $t("crud.filter.submitBtn") }}</div
        >
        <div
          class="default-btn primary-btn"
          v-if="dataForm.liveProdStoreId !== 0 && dataForm.status !== 0"
          @click="onCloseInfo()"
          >{{ $t("crud.filter.submitBtn") }}</div
        >
        <!-- <el-button type="primary" @click="test()">测试上传微信mediaId</el-button> -->
      </span>
    </el-dialog>
    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      :isSingle="true"
      @refreshSelectProds="selectIndexProd"
    ></prods-select>
  </div>
</template>

<script>
import ImgUpload from '@/components/live-img-upload'
import ProdsSelect from '@/components/prods-select'
import ProdPic from '@/components/prod-pic'

export default {
  components: {
    ImgUpload,
    ProdsSelect,
    ProdPic
  },
  data () {
    var validate = (rule, value, callback) => {
      if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value)) {
        callback(new Error(this.$i18n.t('live.pleaseEnteThan0')))
      } else {
        callback()
      }
    }
    var valiname = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      prodsSelectVisible: false,
      groupDisabled: false,
      sekilledDisabled: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      priceType: 1,
      type: null,
      isSubmit: false,
      dataForm: {
        liveProdStoreId: null,
        shopId: null,
        prodId: null,
        coverPic: null,
        pic: '',
        converImgUrl: null,
        name: null,
        prodName: null,
        priceType: 1,
        price: 0,
        price2: 0,
        url: null,
        prodType: 0,
        oriProdType: 0,
        activityId: null,
        status: null,
        createTime: null,
        verifyTime: null,
        successTime: null,
        failTime: null,
        shelfTime: null,
        cancelTime: null,
        deleteTime: null,
        version: null,
        updateTime: null
      },
      // 关联数据
      card: {
        id: 0,
        pic: '',
        name: '',
        realData: {
          prod: [],
          shop: [],
          activity: []
        }
      },
      dataRule: {
        coverPic: [
          { required: true, message: this.$i18n.t('live.productBeEmpty'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$i18n.t('live.productNameEmpty'), trigger: 'blur' },
          {validator: valiname, trigger: 'blur'}
        ],
        price: [
          { required: true, message: this.$i18n.t('live.priceCannotBeEmpty'), trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        price2: [
          { required: true, message: this.$i18n.t('live.priceCannotBeEmpty'), trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ]
        // url: [
        //   { required: true, message: '请选择商品', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    init (liveProdStoreId, type) {
      this.dataForm.status = null
      this.dataForm.price2 = 0
      this.dataForm.price = 0
      this.dataForm.coverPic = ''
      this.dataForm.pic = ''
      this.dataForm.prodId = null
      this.priceType = 1
      this.isSubmit = false
      switch (type) {
        case 1:
          this.type = this.$i18n.t('crud.addTitle')
          break
        case 2:
          this.type = this.$i18n.t('temp.modify')
          break
        case 3:
          this.type = this.$i18n.t('live.view')
          break
      }
      this.dataForm.liveProdStoreId = liveProdStoreId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.liveProdStoreId) {
          this.$http({
            url: this.$http.adornUrl('/live/liveProdStore/info/' + this.dataForm.liveProdStoreId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            this.priceType = this.dataForm.priceType
            if (data) {
              this.card.pic = data.pic
              this.card.name = data.prodName
              this.card.id = data.prodId
              this.disableProdTypeSelect(data.oriProdType)
            }
          })
          this.getAddProdNum()
        }
      })
    },
    // 打开选择商品
    addProd () {
      if (this.dataForm.status !== 0 && this.dataForm.liveProdStoreId !== 0) {
        return
      }
      this.prodsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.prodsSelect.init(this.card.realData.prod)
      })
    },
    // 获取剩余可新增得数量
    getAddProdNum () {
      this.$http({
        url: this.$http.adornUrl('/live/liveProdStore/getUpdateProdNum'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.shopNum = data.shopNum
        this.totalNum = data.totalNum
      })
    },
    // 添加指定商品
    selectIndexProd (prods) {
      this.card.realData.prods = [prods]
      if (prods) {
        this.dataForm.prodId = prods.prodId
        this.dataForm.prodType = prods.prodType
        this.card.pic = prods.pic
        this.card.name = prods.prodName
        this.card.id = prods.prodId
        this.dataForm.url = 'pages/prod/prod?prodId=' + this.dataForm.prodId
        if (this.dataForm.prodType === 0 || this.dataForm.prodType === 4) {
          this.sekilledDisabled = true
          this.groupDisabled = true
        } else if (this.dataForm.prodType === 1) {
          this.sekilledDisabled = true
        } else if (this.dataForm.prodType === 2) {
          this.groupDisabled = true
        }
      } else {
        this.card = {}
        this.dataForm.prodId = null
      }
    },
    /**
     * 禁用商品类型单选
     */
    disableProdTypeSelect (prodType) {
      if (prodType === 0 || prodType === 4) {
        this.sekilledDisabled = true
        this.groupDisabled = true
      } else if (prodType === 1) {
        this.sekilledDisabled = true
      } else if (prodType === 2) {
        this.groupDisabled = true
      }
    },
    deleteSelectProd () {
      if (this.dataForm.status !== 0 && this.dataForm.liveProdStoreId !== 0) {
        return
      }
      this.dataForm.prodId = null
      this.dataForm.url = null
      this.prodType = 0
      this.groupDisabled = false
      this.sekilledDisabled = false
    },
    /**
     * 点击 X 关闭对话框的回调
     */
    handleDialogClose () {
      this.closeData()
    },
    /**
     * 关闭弹窗清空数据
     */
    closeData () {
      this.visible = false
      // this.$refs[this.dataForm].resetFields()
      // this.$refs[this.card].resetFields()
      this.dataForm.coverPic = null
      this.dataForm.price = 0
      this.dataForm.price2 = 0
      this.dataForm.prodId = null
      this.groupDisabled = false
      this.sekilledDisabled = false
    },
    onCloseInfo () {
      console.log('关闭')
      this.visible = false
      this.$emit('refreshDataList')
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.name === null || this.dataForm.name === '') {
            return this.$message.error(this.$i18n.t('live.productNameEmpty'))
          }
          if (this.dataForm.coverPic === null || this.dataForm.coverPic === '') {
            return this.$message.error(this.$i18n.t('live.productBeEmpty'))
          }
          if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(this.dataForm.price)) {
            return this.$message.error(this.$i18n.t('live.pleaseEnteThan0'))
          }
          if (this.dataForm.priceType !== 1) {
            if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(this.dataForm.price2)) {
              return this.$message.error(this.$i18n.t('live.pleaseEnteThan0'))
            }
            console.log(this.dataForm.priceType)
            console.log(this.dataForm.price2)
            if (this.dataForm.priceType === 3 && this.dataForm.price < this.dataForm.price2) {
              return this.$message.error(this.$i18n.t('live.notLessThanPrice'))
            }
            if (this.dataForm.priceType === 2 && this.dataForm.price > this.dataForm.price2) {
              return this.$message.error(this.$i18n.t('live.cannotBePrice'))
            }
            if (this.dataForm.prodId === null) {
              return this.$message.error('请选择商品')
            }
          }
          if (this.isSubmit) {
            return
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/live/liveProdStore'),
            method: this.dataForm.liveProdStoreId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.isSubmit = true
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => {
            console.log('boom')
            this.isSubmit = false
          })
        }
      })
    },
    test () {
      this.$nextTick(() => {
        if (this.dataForm.liveProdStoreId) {
          this.$http({
            url: this.$http.adornUrl('/live/liveProdStore/getMediaId/' + this.dataForm.liveProdStoreId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data) {
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.livePic >>> .el-form-item__label:before{
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
.liveName >>> .el-form-item__label:before{
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
.liveUrl >>> .el-form-item__label:before{
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
.livePrice >>> .el-form-item__label:before{
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
</style>
