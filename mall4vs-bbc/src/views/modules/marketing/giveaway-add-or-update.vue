<template>
  <div class="mod-coupon-add-or-update">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          dataForm.giveawayId
            ? (pageType === 1 ? this.$i18n.t('giveaway.editGiveaway') : this.$i18n.t('giveaway.viewGiveaway'))
            : this.$i18n.t('giveaway.addGiveaway')
        }}
      </div>
    </div>
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      class="form-box"
      label-width="auto"
    >
      <!--套餐名称-->
      <el-form-item
        :label="this.$i18n.t('group.actName')"
        prop="name"
      >
        <el-input
          :disabled="pageType === 2"
          v-model="dataForm.name"
          maxlength="20"
          show-word-limit
          size="small"
          class="coupon-input"
          :placeholder="this.$i18n.t('group.actName')"
        ></el-input>
      </el-form-item>
      <!--活动时间-->
      <el-form-item :label="this.$i18n.t('marketing.activTime')+':'" :required="true">
        <div class="date-picker">
          <!--开始时间-->
          <el-form-item prop="startTime">
            <el-date-picker
              :disabled="pageType === 2"
              v-model="dataForm.startTime"
              type="datetime"
              size="small"
              :placeholder="this.$i18n.t('live.chooseStartDate')"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <span style="margin: 0 10px">{{ this.$i18n.t('time.tip') }}</span>
          <!--结束时间-->
          <el-form-item prop="endTime">
            <el-date-picker
              :disabled="pageType === 2"
              v-model="dataForm.endTime"
              type="datetime"
              size="small"
              :placeholder="this.$i18n.t('live.chooseEndDate')"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </div>
      </el-form-item>
      <!--套餐主商品-->
      <el-form-item
        :label="this.$i18n.t('giveaway.giveawayMainProd')"
        size="mini"
        :required="true"
      >
        <div v-if="dataForm.prodId != null" class="prodItem-table">
          <el-table
            :data="[dataForm]"
            header-cell-class-name="table-header"
            row-class-name="table-row"
            :style="{width: dataForm.status ? '820px' : '680px'}"
          >
            <el-table-column
              :label="this.$i18n.t('group.prodInfo')"
              prop="reason"
              fixed="left"
              align="center"
              width="320px"
            >
              <template slot-scope="scope">
                <div class="prod-info-container">
                  <div class="prod-image">
                    <prod-pic
                    :pic="scope.row.pic"
                  ></prod-pic>
                  </div>
                  <div class="prod-name">
                    <div class="prod-name-txt">
                      {{scope.row.prodName}}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('product.price')"
              align="center"
              prop="price"
              width="200px"
            >
            </el-table-column>
            <el-table-column
              prop="giveawayNum"
              :label="$t('giveaway.buyNum')"
              align="center"
              width="160px"
            >
              <template slot="header" slot-scope="scope">
                {{$t('giveaway.buyNum')}}
                <el-tooltip class="item" effect="dark" :content="$t('giveaway.buyNumTips')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <div class="custom-rate">
                  <input
                    :disabled="pageType === 2"
                    v-model="scope.row.buyNum"
                    type="number"
                    :precision="0"
                    :min="1"
                    :max="99999999"
                    :step="1"
                    size="small"
                    style="width: 80%;"
                    class="tag-input-width"
                    @keyup="
                    scope.row.buyNum = String(scope.row.buyNum).match(/[^0-9]/) ? 1 : scope.row.buyNum
                  "
                    @blur="inputBuyNum(scope.row.buyNum, 1, 99999999)"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('crud.menu')"
              fixed="right"
              width="140px"
              v-if="dataForm.status"
            >
              <template slot-scope="scope">
                <!-- <div v-if="dataForm.status" class="text-btn-con"> -->
                <div class="text-btn-con" v-if="dataForm.status">
                  <div class="default-btn text-btn" @click="deleteMainProd">{{ $t('text.delBtn') }}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="dataForm.prodId == null">
          <div
            @click="addProd"
            :class="['default-btn']"
          >{{ $t("product.select") }}</div
          >
        </div>
        <div v-if="!verifyProdFlag" class="error-tips">{{ this.$i18n.t('giveaway.mainProdErrorTips') }}</div>
      </el-form-item>
      <!--套餐搭配商品-->
      <el-form-item
        :label="this.$i18n.t('giveaway.giveawayMatchingProd')"
        size="mini"
        :required="true"
      >
        <!--搭配商品表格-->
        <giveawayProdTable
          :pageType="pageType"
          ref="giveAwayProdTable"
          :type="2"
          :limit="15"
          @refreshSelectProds="selectMatchingProds"
        ></giveawayProdTable>
      </el-form-item>
      <el-form-item>
        <div class="default-btn" @click="back()">{{
            $t("shopFeature.edit.back")
          }}</div>
        <div v-if="pageType === 1" class="default-btn primary-btn" @click="dataFormSubmit()">{{
            $t("crud.filter.submitBtn")
          }}</div>
      </el-form-item>
    </el-form>
    <!-- 主商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      :isSingle="true"
      :giveawayId="dataForm.giveawayId"
      dataUrl="/shop/giveawayProd/mainProdPage"
      @refreshSelectProds="selectMainProd"
    ></prods-select>
  </div>
</template>

<script>
import giveawayProdTable from './giveaway-prod-table'
import ImgUpload from '@/components/img-upload'
import ProdsSelect from '@/components/prods-select'
import ProdPic from '@/components/prod-pic'
export default {
  data () {
    var validName = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('seckill.evenBeEmpty')))
      } else {
        callback()
      }
    }
    var validateTime = (rule, value, callback) => {
      if (Date.parse(this.dataForm.startTime) >= Date.parse(this.dataForm.endTime)) {
        callback(new Error(this.$i18n.t('marketing.timeCanThanOrEqualTo')))
      }
      if ((this.dataForm.giveawayId === 0 || this.dataForm.status === 1) && rule.field === 'endTime' && new Date() > Date.parse(value)) {
        callback(new Error(this.$i18n.t('groups.endTime')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        giveawayId: 0,
        name: '',
        startTime: '',
        endTime: '',
        prodId: null,
        pic: null,
        prodName: null,
        giveawayProds: []
      },
      pageType: 1, // 1：新增/编辑 2：查看
      verifyProdFlag: true, // 主商品校验标志
      mainSkuIds: [], // 主商品skuId列表
      matchingSkuIds: [], // 搭配商品skuId列表
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
        name: [
          { required: true, message: this.$i18n.t('seckill.evenBeEmpty'), trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        activityDate: [
          { required: true, message: this.$i18n.t('shop.titCanNoBlank'), trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: this.$i18n.t('formData.startTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$i18n.t('formData.endTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    ImgUpload,
    giveawayProdTable,
    ProdsSelect,
    ProdPic
  },
  mounted () {
    const giveawayId = Number(this.$route.query.giveawayId) ? Number(this.$route.query.giveawayId) : 0
    const pageType = this.$route.query.pageType ? this.$route.query.pageType : 1
    this.init(giveawayId)
    this.pageType = parseInt(pageType || 0)
    let title = giveawayId ? (this.pageType === 1 ? this.$i18n.t('giveaway.editGiveaway') : this.$i18n.t('giveaway.viewGiveaway')) : this.$i18n.t('giveaway.addGiveaway')
    this.$store.commit('common/replaceSelectMenu', title)
  },
  methods: {
    // 获取数据列表
    init (giveawayId) {
      this.dataForm.giveawayId = Number(giveawayId) || 0
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (this.dataForm.giveawayId && this.dataForm.giveawayId !== '0') {
        this.getDataInfo()
      }
    },
    // 获取套餐信息
    getDataInfo () {
      this.$http({
        url: this.$http.adornUrl(`/shop/giveaway/info/${this.dataForm.giveawayId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
        this.$refs.giveAwayProdTable.init(data.giveawayProds)
      })
    },
    // 主商品选择更新回调
    selectMainProd (prodItems) {
      let prodObj = prodItems
      if (prodObj) {
        this.dataForm.prodId = prodObj.prodId
        this.dataForm.pic = prodObj.pic
        this.dataForm.prodName = prodObj.prodName
        this.dataForm.price = prodObj.price
        this.dataForm.buyNum = 1
        this.verifyProdFlag = true
        this.dataForm.status = 1
      }
      // this.mainSkuIds = []
      // prodItems.forEach(sku => {
      //   this.mainSkuIds.push(sku.skuId)
      // })
    },
    // 搭配商品选择更新回调
    selectMatchingProds (prodItems) {
      // this.matchingSkuIds = []
      // prodItems.forEach(sku => {
      //   this.matchingSkuIds.push(sku.skuId)
      // })
    },
    // 表单提交
    dataFormSubmit () {
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      this.$refs['dataForm'].validate((valid) => {
        let giveawayProds = this.$refs.giveAwayProdTable.verifyDataForm()
        if (!this.dataForm.prodId) {
          this.verifyProdFlag = false
          this.isSubmit = false
          return
        }
        if (!giveawayProds) {
          this.isSubmit = false
          return
        }
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/shop/giveaway`),
            method: this.dataForm.giveawayId && this.dataForm.giveawayId !== '0' ? 'put' : 'post',
            data: this.$http.adornData({
              'giveawayId': this.dataForm.giveawayId || undefined,
              'name': this.dataForm.name,
              'startTime': this.dataForm.startTime,
              'endTime': this.dataForm.endTime,
              'prodId': this.dataForm.prodId,
              'status': this.dataForm.status,
              'buyNum': this.dataForm.buyNum,
              'giveawayProds': giveawayProds
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.isSubmit = false
                this.back()
              }
            })
          }).catch(({ e }) => {
            this.isSubmit = false
          })
        } else {
          this.isSubmit = false
        }
      })
    },
    // 打开选择主商品
    addProd () {
      this.prodsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.prodsSelect.init(this.dataForm.prod)
      })
    },
    // 输入值校验
    inputBuyNum (val, min, max) {
      if (val > max) {
        this.$set(this.dataForm, 'buyNum', max)
      }
      if (val < min || !val) {
        this.$set(this.dataForm, 'buyNum', min)
      }
    },
    deleteMainProd () {
      this.dataForm.prodId = null
      this.dataForm.buyNum = 1
    },
    back () {
      this.$router.push('/marketing-giveaway')
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-coupon-add-or-update {
  .el-col{
    width: 130px;
  }
  .coupon-input {
    width: 220px;
  }
  .coupon-input1 {
    width: 220px;
  }
  .form-box {
    margin-left: 40px;
  }
}
.date-picker {
  display: flex;
  .el-form-item.el-form-item--small {
    margin-bottom: 0;
  }
}
.error-tips {
  color: #f56c6c;
  font-size: 12px;
  padding-bottom: 4px;
}
.prodItem-table {
  .prod-info-container {
    height: 100%;
    display: flex;
    justify-content: space-between;
    .prod-image {
      margin-right: 20px;
      width: 80px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .prod-name {
      flex: 1;
      height: 80px;
      display: flex;
      flex-direction: column;
      text-align: start;
      justify-content: center;
      .prod-name-txt {
        font-size: 14px;
        color: #333333;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }
  // 表格输入框
  .tag-input-width {
    width: 100%;
    padding-left: 5px;
    padding-right: 0;
    border: 1px solid #DCDCDC;
    border-radius: 2px;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    &:focus {
      outline: 0;
    }
  }
}
</style>
