<template>
<!-- 02、编辑商品信息 -->
  <div class="posting-edit-product">
    <el-form
      :model="dataForm"
      ref="dataForm"
      :label-width="lang === 'en'? '150px':'130px'"
      :rules="dataRule"
      size="small"
    >

      <!-- 基本信息 -->
      <div class="edit-prod-content prod-basic-info">
        <div class="prod-title-row">
          <span>{{ $t("shopProcess.basicInfo") }}</span>
        </div>
        <div class="basic-info-content prod-con">
            <!-- 已选分类 -->
            <el-form-item
              :label="this.$i18n.t('product.selectedCategories')"
              class="selected-category"
            >
              <div class="category-sel">
                <div class="category-con">
                  <div class="cur-sel">
                    <span class="weak-text">{{ $t("product.platformCategories") }}：</span>
                    <span>{{ platCategoryName }}</span>
                  </div>
                  <div class="default-btn text-btn" @click="changeCategory(1)">{{ $t("resource.update") }}</div>
                </div>
                <div v-show="!editShopCategorySelect" class="category-con">
                  <div class="cur-sel">
                    <span class="weak-text">{{ $t("product.shopCategories") }}：</span>
                    <span>{{ storeCategoryName }}</span>
                  </div>
                  <div class="default-btn text-btn update-btn" @click="changeCategory(2)">{{ $t("resource.update") }}</div>
                </div>
                <el-select
                  v-show="editShopCategorySelect"
                  v-model="currentShopCategoryObj.firstCat.id"
                  :placeholder="this.$i18n.t('tip.select')"
                  ref="shopCategorySelect"
                  class="category-select"
                  filterable
                  :automatic-dropdown="true"
                  @change="selectShopCategory"
                  @visible-change="categorySelectChange($event, 2)"
                >
                  <el-option
                    v-for="item in currentShopCategoryObj.firstCat.dataList"
                    :key="item.categoryId"
                    :label="$t('language') === 'English' ? item.categoryNameEn : item.categoryName"
                    :value="item.categoryId">
                  </el-option>
                </el-select>
                <div class="el-form-item-tips">{{ $t("product.postProductTips1") }}</div>
              </div>
            </el-form-item>
            <!-- 选择语言 -->
            <el-form-item
              :label="this.$i18n.t('product.selectLanguage')"
            >
              <el-select
                v-model="curLang"
                multiple
                :placeholder="this.$i18n.t('tip.select')"
                class="select-lang"
                @change="selectLang"
              >
                <el-option
                  v-for="item in langOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="el-form-item-tips">{{ $t("product.postProductTips2") }}</div>
            </el-form-item>
            <!-- 商品名称 -->
            <div class="prod-name-box">
              <el-form-item
                :label="this.$i18n.t('product.prodName')"
                prop="prodNameCn"
                class="prod-name-con"
              >
                <el-input v-model="dataForm.prodNameCn" maxlength="60" />
                <!-- <div class="el-form-item-tips">{{ $t("product.postProductTips3") }}</div> -->
                <div class="el-form-item-tips">商品名称建议：商品描述+属性，长度不超过60个字符</div>
              </el-form-item>
              <el-form-item
                v-if="curLang.includes(2)"
                label-width="0"
                prop="prodNameEn"
                class="prod-name-con"
              >
                <el-input v-model="dataForm.prodNameEn" maxlength="60" />
                <div class="el-form-item-tips">The suggestion: description + attribute, length cannot exceed 60</div>
              </el-form-item>
            </div>
            <!-- 商品卖点 -->
            <div class="prod-name-box">
              <el-form-item
                :label="this.$i18n.t('product.productSellingPoints')"
                prop="briefCn"
                class="prod-name-con"
              >
                <el-input v-model="dataForm.briefCn" maxlength="100" />
                <!-- <div class="el-form-item-tips">{{ $t("product.postProductTips4") }}</div> -->
                <div class="el-form-item-tips">商品卖点展示在商品详情标题下面，长度不超过100个字符</div>
              </el-form-item>
              <el-form-item
                v-if="curLang.includes(2)"
                label-width="0"
                prop="briefEn"
                class="prod-name-con"
              >
                <el-input v-model="dataForm.briefEn" maxlength="100" />
                <div class="el-form-item-tips">Displayed under the title, the length cannot exceed 100</div>
              </el-form-item>
            </div>
            <!-- 商品图片 -->
            <el-form-item
              :label="this.$i18n.t('product.pic')"
              prop="imgs"
              class="prod-img-box"
            >
              <imgs-upload v-model="dataForm.imgs" :limit="9" :prompt="false" @input="imgsChange" />
              <div class="el-form-item-tips">{{ $t("product.postProductTips5") }}</div>
            </el-form-item>
            <!-- 商品视频 -->
            <el-form-item
              :label="this.$i18n.t('product.productVideo')"
            >
              <div v-if="!dataForm.video" class="prod-video-box">
                <video-upload v-model="dataForm.video" />
              </div>
              <div v-if="dataForm.video" class="prod-video-box2">
                <video-upload v-model="dataForm.video" />
              </div>
              <div class="el-form-item-tips">{{ $t("product.postProductTips6") }}</div>
            </el-form-item>
            <!-- 商品品牌 + 商品排序 -->
            <div class="prod-brand-sort">
              <el-form-item
                :label="this.$i18n.t('product.productBrands')"
              >
                <div class="select-prod-brand">
                  <div class="brand">
                    <span class="brand-name">{{ dataForm.brandName }}</span>
                    <span v-if="dataForm.brandName" class="el-icon-close del-brand" @click="deleteSelectedBrand"></span>
                  </div>
                  <div class="default-btn text-btn" @click="selectBrand">{{ $t("product.selectText") }}</div>
                </div>
              </el-form-item>
              <el-form-item
                :label="this.$i18n.t('product.productSort')"
                :label-width="lang === 'en'? '110px':'70px'"
              >
                <div class="select-prod-sort">
                  <el-input
                    v-model="dataForm.seq"
                    type="number"
                    :max="32767"
                    :min="0"
                    :step="1"
                    @keyup="
                        dataForm.seq = String(dataForm.seq).match(/[^0-9]/) ? 0 : dataForm.seq
                      "
                    @blur="handleSortValue"
                  />
                </div>
              </el-form-item>
            </div>
            <!-- 是否活动商品 -->
            <el-form-item v-if="dataForm.mold!==1" :label="this.$i18n.t('product.activeProd')">
              <el-tooltip :disabled="!dataForm.prodId || dataForm.prodId === ''" class="item" effect="light" :content="this.$i18n.t('product.postProductTips22')" placement="top">
                <el-radio-group :disabled="dataForm.prodId && dataForm.prodId !== ''" v-model="dataForm.prodType" @change="handleProdTpyeChange">
                  <el-radio :label="dataForm.prodType>0&&dataForm.prodType!==5?dataForm.prodType:0">{{ $t("publics.no") }}</el-radio>
                  <el-radio :label="5">{{ $t("publics.yes") }}</el-radio>
                </el-radio-group>
              </el-tooltip>
              <div class="el-form-item-tips">{{ $t("product.notAvailableSeparatePurchase") }}</div>
            </el-form-item>
            <!-- 是否开启预售 -->
            <el-form-item v-if="dataForm.prodType !== 5 && dataForm.mold !== 1" :label="this.$i18n.t('product.whetPreSale')">
              <el-radio-group v-model="dataForm.preSellStatus">
                <el-radio :label="0">{{ $t("station.close") }}</el-radio>
                <el-radio :label="1">{{ $t("groups.turnOn") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 预售发货时间 -->
            <el-form-item
              v-if="dataForm.preSellStatus === 1 && dataForm.prodType !== 5"
              :label="this.$i18n.t('product.preSaleTime')"
              prop="preSellTime"
            >
              <el-date-picker
                v-model="dataForm.preSellTime"
                type="datetime"
                :placeholder="this.$i18n.t('product.choosengDate')"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
        </div>
      </div>

      <!-- 规格库存 -->
      <div class="edit-prod-content">
        <div class="prod-title-row">
          <span>{{ $t("product.specStock") }}</span>
        </div>
        <div class="spec-stock-content prod-con">
          <sku-tag
            ref="skuTag"
            @change="skuTagChangeSkuHandler"
            @changeSkuImg="changeSkuImgHandler"
            @clearSkuImg="clearSkuImg"
            :skuList="dataForm.skuList"
          ></sku-tag>

          <sku-table
            ref="skuTable"
            v-model="dataForm.skuList"
            :prodNameCn.sync="dataForm.prodNameCn"
            :prodNameEn.sync="dataForm.prodNameEn"
            :mold="dataForm.mold"
            @input="skuListHandler"
          ></sku-table>
            <!-- :isCompose="dataForm.isCompose" -->

          <div class="total-stock">
            <el-form-item
              :label="this.$i18n.t('product.totalInventory')"
            >
              <input v-model="totalStocks" disabled>
              <div class="el-form-item-tips">{{ $t("product.postProductTips7") }}</div>
            </el-form-item>
          </div>
        </div>
      </div>

      <!-- 运费设置 -->
      <div v-if="dataForm.mold !== 1 && dataForm.prodType !== 5" class="edit-prod-content">
        <div class="prod-title-row">
          <span>{{ $t("product.shippinngs") }}</span>
        </div>
        <div class="shipping-setup prod-con">
          <!-- 配送方式 -->
          <el-form-item
            :label-width="this.$i18n.t('language')=='English'?'180px':''"
            :label="this.$i18n.t('order.delType')"
            class="options-box"
            prop="deliveryMode"
          >
            <el-checkbox v-model="dataForm.deliveryMode.hasShopDelivery">{{
              $t("product.ExpressDistribution")
            }}</el-checkbox>
            <el-checkbox v-model="dataForm.deliveryMode.hasUserPickUp" disabled class="delType-text">{{
              $t("product.userMention")
            }}</el-checkbox>
            <el-checkbox
              v-model="dataForm.deliveryMode.hasCityDelivery"
              :disabled="sameCityStatus === 0"
              class="delType-text"
              >{{ $t("order.sameCityDelivery") }}</el-checkbox
            >
            <!-- <div class="el-form-item-tips">“用户自提”和“同城配送”需在配送管理设置后才能生效</div> -->
            <div class="el-form-item-tips">{{ $t("product.postProductTips8") }}</div>
          </el-form-item>
          <!-- 运费模板 -->
          <el-form-item
            :label-width="this.$i18n.t('language')=='English'?'180px':''"

            :label="this.$i18n.t('product.shippinngs')"
          >
            <el-radio v-model="dataForm.tableRate" :label="0">{{$t('product.freeShipping')}}</el-radio>
            <el-radio @change="freight" v-model="dataForm.tableRate" :label="-1">{{$t('product.fixedFreight')}}</el-radio>
            <el-radio v-model="dataForm.tableRate" :label="1">{{$t('product.freTempl')}}</el-radio>
          </el-form-item>

          <!-- 运费模板 -->
          <el-form-item
            v-if="dataForm.tableRate>0"
            :label-width="this.$i18n.t('language')=='English'?'180px':''"
            :label="this.$i18n.t('product.freTempl')"
            prop="deliveryTemplateId"
          >
            <el-select
              v-model="dataForm.deliveryTemplateId"
              :placeholder="this.$i18n.t('tip.select')"
            >
              <!-- <el-option
                :key="0"
                :label="this.$i18n.t('product.unifiedPackageMail')"
                :value="0"
              ></el-option>
              <el-option
                :key="-1"
                :label="this.$i18n.t('product.uniformDeliveredPricing')"
                :value="-1"
              ></el-option> -->
              <el-option
                v-for="transport in transportList"
                :key="transport.transportId"
                :label="transport.transName"
                :value="transport.transportId"
              ></el-option>
            </el-select>
            <!--新建/刷新-->
            <div class="create-refresh-btn">
              <div class="default-btn text-btn"
                        @click="getTransportList">{{$t('admin.refresh')}}</div>
              <el-divider direction="vertical"></el-divider>
              <div class="default-btn text-btn"
                        @click.stop="createTransportTemplate()">{{$t('admin.newConstruction')}}</div>
            </div>
            <div class="el-form-item-tips">{{ $t("product.postProductTips9") }}</div>
          </el-form-item>
          <el-form-item
            v-if="dataForm.tableRate===-1"
            :label-width="this.$i18n.t('language')=='English'?'180px':''"
            :label="this.$i18n.t('product.fixedFreight')"
            prop="deliveryAmount"
          >
            <div class="freight">
                <el-input type="number" :min="0.01" v-model="dataForm.deliveryAmount" @blur="handleInputValue(dataForm.deliveryAmount,'deliveryAmount',0.01,9999)" maxlength="10" :placeholder="this.$i18n.t('product.pleaseEnterTheAmount')"></el-input>
            </div>
          </el-form-item>
        </div>
      </div>

      <!-- 参数设置 -->
      <div class="edit-prod-content">
        <div class="prod-title-row">
          <span>{{ $t('product.parameterSetting') }}</span>
        </div>
        <div class="params-box prod-con">
          <el-form-item :label="$t('product.parameter')+ (index+1)" v-for="(item,index) in dataForm.prodParameterList" :key="index">
            <div class="zh-input">
              <el-input class="input" maxlength="10" v-model="item.parameterKey">
                <!-- <template slot="prepend">{{$t('sys.parameteName')}}</template> -->
                <template slot="prepend">参数名</template>
              </el-input>
              <el-input class="input" maxlength="20" v-model="item.parameterValue">
                <!-- <template slot="prepend">{{$t('sys.parameterValue')}}</template> -->
                <template slot="prepend">参数值</template>
              </el-input>
              <!-- <div class="params-tips">{{$t('sys.parameteNameAndParameterValue')}}</div> -->
              <div class="params-tips">参数名和参数值显示在商品详情开头，参数名不超过10字，参数值不超过20字</div>
            </div>
            <div class="en-input" v-if="curLang.includes(2)">
              <el-input class="input" maxlength="10" v-model="item.parameterKeyEn">
                <template slot="prepend">Parameter</template>
              </el-input>
              <el-input class="input" maxlength="20" v-model="item.parameterValueEn">
                <template slot="prepend">Value</template>
              </el-input>
              <div class="params-tips">The parameter name shall not exceed 10 words and the parameter value shall not exceed 20 words</div>
            </div>
            <div class="btn-box">
              <div class="default-btn text-btn" @click="parameterDeltete(index)" >{{$t('text.delBtn')}}</div>
              <div class="line" v-if="index === dataForm.prodParameterList.length-1"></div>
              <div class="default-btn text-btn" v-if="index === dataForm.prodParameterList.length-1" @click="parameterInsert">{{ $t('shopProcess.add') }}</div>
            </div>
          </el-form-item>
          <el-form-item v-if="!dataForm.prodParameterList.length">
            <div class="default-btn text-btn" @click="parameterInsert">{{ $t('shopProcess.add') }}</div>
          </el-form-item>
        </div>
      </div>
      <!-- 参数设置end -->

      <!-- 其他设置（虚拟商品才显示这个其他设置） -->
      <!-- v-if="dataForm.mold === 1" -->
      <div v-if="dataForm.mold === 1" class="edit-prod-content">
        <div class="prod-title-row">
            <span>{{ $t("product.otherSettings") }}</span>
        </div>
        <div class="other-settings prod-con">
          <!-- 核销次数 -->
          <el-form-item
            :label="this.$i18n.t('product.numberOfWriteOffs')"
            class="options-box"
          >
            <!-- -1.多次核销 0.无需核销 1.单次核销 -->
            <el-radio-group v-model="dataForm.writeOffNum">
              <el-radio :label="0">{{ $t("product.noWriteOffRequired") }}</el-radio>
              <el-radio :label="1">{{ $t("product.singleWriteOff") }}</el-radio>
              <el-radio :label="-1">{{ $t("product.multipleWriteOffs") }}</el-radio>
            </el-radio-group>
            <div class="el-form-item-tips">{{ $t("product.postProductTips10") }}</div>
          </el-form-item>
          <el-form-item
            v-if="dataForm.writeOffNum === -1"
            :label="this.$i18n.t('product.expiryNumberOfWriteOffs')"
            class="options-box expiry-date"
            prop="writeOffEnd"
          >
            <el-radio-group v-model="writeOffMultipleCountSelect" @change="changeWriteOffMultipleCount">
                <!-- 长期有效 -->
                <el-radio :label="-1">{{$t("product.unlimitedTime")}}</el-radio>
                <!-- N天内有效 -->
                <el-radio :label="2">
                  {{$t("product.mostWriteOffs")}}
                  <input
                    v-model="writeOffMultipleCount"
                    type="number"
                    class="native-input-style"
                    :disabled="writeOffMultipleCountSelect === -1"
                    :max="9999"
                    :min="2"
                    @change="changeWriteOffMultipleCountIn()"
                  />
                  {{$t("live.times")}}
                </el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- writeOffTime核销有效期（选择“无需核销”，不需要选择核销有效期） -1.长期有效 0.自定义 1.当天 x.x天内 -->
          <el-form-item
            v-if="dataForm.writeOffNum !== 0"
            :label="this.$i18n.t('product.expiryDate')"
            class="options-box expiry-date"
            prop="writeOffEnd"
          >
            <el-radio-group v-model="dataForm.writeOffTime" @change="changeWriteOffTime">
              <div class="radio-item">
                <!-- 长期有效 -->
                <el-radio :label="-1">{{$t("product.longTermValidity")}}</el-radio>
              </div>
              <div class="radio-item">
                <!-- 当天有效 -->
                <el-radio :label="1">{{$t("product.validOnTheSameDay")}}<span class="weak-text">{{$t("product.beforeTime")}}</span></el-radio>
              </div>
              <div class="radio-item">
                <!-- N天内有效 -->
                <el-radio :label="2">
                  {{$t("product.afterPurchase")}}
                  <input
                    v-model="validDays"
                    type="number"
                    class="native-input-style"
                    :disabled="dataForm.writeOffTime !== 2"
                    :max="9999"
                    :min="2"
                    @blur="getValidDays(validDays)"
                  />
                  {{$t("product.validDays")}}
                </el-radio>
              </div>
              <div class="radio-item date-picker">
                <!-- 自定义（N 至 M 内有效） -->
                <el-radio :label="0">
                  {{$t("product.validFrom")}}
                  <el-date-picker
                    v-model="dataForm.writeOffStart"
                    type="datetime"
                    :placeholder="this.$i18n.t('product.startDate')"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="PickerOptions"
                    :disabled="dataForm.writeOffTime !== 0"
                    @change="changeDate(dataForm.writeOffStart, 0)"
                  >
                  </el-date-picker>
                  {{$t("product.to")}}
                  <el-date-picker
                    v-model="dataForm.writeOffEnd"
                    type="datetime"
                    :placeholder="this.$i18n.t('product.endDate')"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="PickerOptions"
                    :disabled="dataForm.writeOffTime !== 0"
                    @change="changeDate(dataForm.writeOffStart, 1)"
                  >
                  </el-date-picker>
                  <span v-if="lang === 'zh_CN'">内有效</span>
                </el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <!-- 用户留言 -->
          <el-form-item
            :label="this.$i18n.t('product.userMessage')"
            class="user-message"
          >
            <div
              v-for="(item, index) in dataForm.virtualRemark"
              class="msg-int-box" :key="index"
            >
              <input class="native-input-style" type="text" v-model="dataForm.virtualRemark[index].name" maxlength="10" @blur="changeMsgInput(item.name, index)" />
              <el-checkbox v-model="item.isRequired" class="required-checkbox">{{$t("product.requiredField")}}</el-checkbox>
              <!--删除/添加-->
              <div class="create-refresh-btn">
                <div class="default-btn text-btn"
                          @click="deleteUserMessage(index)">{{$t('resource.Delete')}}</div>
                <!-- <el-divider direction="vertical"></el-divider> -->
                <!-- <div class="default-btn text-btn"
                          @click.stop="addUserMessage()">{{$t('admin.add')}}</div> -->
              </div>
            </div>
            <div
              v-if="dataForm.virtualRemark.length < 10"
              class="add-field default-btn text-btn"
              @click="addUserMessage()"
            >
              <i class="el-icon-plus"></i>{{$t("product.addField")}}
            </div>
            <div class="el-form-item-tips">{{$t('product.msgFieldTips')}}</div>
          </el-form-item>
          <!-- 售后服务 -->
          <el-form-item
            :label="this.$i18n.t('product.afterSalesService')"
            class="options-box"
          >
            <el-radio-group v-model="dataForm.isRefund">
              <el-radio :label="1">{{$t('product.supportApplyRefund')}}</el-radio>
              <el-radio :label="0">{{$t('product.doNotSupportApplyRefund')}}</el-radio>
            </el-radio-group>
            <div v-if="dataForm.isRefund === 0" class="el-form-item-tips">{{$t('product.afterSalesServiceTips')}}</div>
          </el-form-item>
        </div>
      </div>

    </el-form>

    <!-- 平台分类弹窗 -->
    <category-select v-show="editPlatformCategoriesSelect" ref="categorySelect" @getCategorySelected="getCategorySelected"></category-select>
    <!-- 选择品牌弹窗 -->
    <BrandSelect
      v-if="visibleBrandPopUp"
      ref="selectBrand"
      :isSingle="true"
      @refreshSelectBrand="refreshSelectBrand"
    />
    <!-- 新建运费模板 -->
    <transportAddOrUpdate v-if="visibleTransportTemplate"
                   ref="transportAddOrUpdate"
                   @close="transportAddOrUpdateClose"
                   @refreshTransportList="getTransportList" />
  </div>
</template>

<script>
import { validNoEmptySpace } from '@/utils/validate'
import ImgsUpload from '@/components/imgs-upload'
import VideoUpload from '@/components/video-upload'
import BrandSelect from '@/components/brand-select'
import SkuTag from '../sku-tag'
import SkuTable from '../sku-table'
import transportAddOrUpdate from '../../shop/transport-add-or-update'
import CategorySelect from '@/components/category-select'
import moment from 'moment'
export default {
  components: {
    ImgsUpload,
    VideoUpload,
    BrandSelect,
    SkuTag,
    SkuTable,
    transportAddOrUpdate,
    CategorySelect
  },
  props: {
    value: {
      type: Object,
      default: {}
    },
    platCategoryName: {
      type: String,
      default: ''
    },
    storeCategoryName: {
      type: String,
      default: ''
    }
  },
  data () {
    const validateTime = (rule, value, callback) => {
      // console.log(1)
      if (rule.field === 'preSellTime' && new Date() > Date.parse(value)) {
        callback(new Error(this.$i18n.t('groups.deliveryTime')))
      } else if (rule.field === 'writeOffEnd' && new Date() >= Date.parse(value)) {
        callback(new Error(this.$i18n.t('product.dateErrTips2')))
      } else {
        callback()
      }
    }
    const validEmptyTab = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    return {
      lang: window.localStorage.getItem('lang'),

      writeOffMultipleCountSelect: -1,
      writeOffMultipleCount: '',
      dataForm: {
        tableRate: 0, // 0 包邮 -1 固定运费 大于0运费模板id

        // 商品类型(0普通商品 1拼团 2秒杀 3积分 5活动商品)
        prodType: 0,
        prodNameEn: '',
        prodNameCn: '',
        contentEn: '',
        contentCn: '',
        briefEn: '',
        briefCn: '',
        video: '',
        pic: '',
        imgs: '',
        seq: 0,
        // 组合商品
        // isCompose: 0,
        preSellStatus: 0,
        preSellTime: null,
        prodId: 0,
        brandId: 0,
        skuList: [],
        categoryId: '',
        shopCategoryId: '',
        prodLangList: [],
        brandName: '',
        deliveryMode: {
          hasShopDelivery: false,
          hasUserPickUp: true,
          hasCityDelivery: false
        },
        deliveryAmount: 0.01, // 统一运费的金额

        // 运费模板id
        deliveryTemplateId: null,
        // 库存总和
        totalStocks: 0,

        /* 其他设置(虚拟商品时出现) */
        // 留言
        virtualRemark: [],
        // 核销次数 -1.多次核销 0.无需核销 1.单次核销
        writeOffNum: 0,
        // 核销有效期 -1.长期有效 0.自定义 1.当天24点前 x.x天内有效
        writeOffTime: -1,
        writeOffMultipleCount: -1,
        writeOffStart: null,
        writeOffEnd: null,
        // 售后服务 0不支持卖家申请退款 1支持卖家申请退款
        isRefund: 0,
        // 参数
        prodParameterList: [
          // {
          //   parameterKey: '',
          //   parameterValue: '',
          //   parameterKeyEn: '',
          //   parameterValueEn: ''
          // }
        ]

      },
      dataRule: {
        prodNameCn: [
          { required: true, message: this.$i18n.t('product.postProductTips17'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        prodNameEn: [
          { required: true, message: this.$i18n.t('product.postProductTips18'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        briefCn: [
          // { required: true, message: this.$i18n.t('product.postProductTips19'), trigger: 'blur' },
          { required: false, validator: validEmptyTab, trigger: 'blur' }
        ],
        briefEn: [
          // { required: true, message: this.$i18n.t('product.postProductTips20'), trigger: 'blur' },
          { required: false, validator: validEmptyTab, trigger: 'blur' }
        ],
        imgs: [
          { required: true, message: this.$i18n.t('product.postProductTips21'), trigger: ['blur', 'change'] }
        ],
        preSellTime: [
          { required: true, message: this.$i18n.t('product.thePreSaleDtBeEmpty'), trigger: 'blur' },
          { required: true, validator: validateTime, trigger: 'blur' }
        ],
        writeOffEnd: [
          { validator: validateTime, trigger: 'blur' }
        ],
        deliveryMode: [
          { required: true }
        ],
        deliveryTemplateId: [
          { required: true, message: this.$i18n.t('product.shippingtBeEmpty'), trigger: ['blur', 'change'] }
        ],
        deliveryAmount: [
          { required: true, message: this.$i18n.t('product.pleaseEnterTheAmount'), trigger: 'blur' }
        ]

      },
      // 控制平台分类选择下拉框
      editPlatformCategoriesSelect: false,
      // 控制店铺分类选择下拉框
      editShopCategorySelect: false,
      // 店铺分类列表
      shopCategoryList: [],
      // 当前选中的店铺分类对象
      currentShopCategoryObj: null,
      // 当前选中的平台分类对象
      platformCategoryObj: null,
      // 当前语言 1中文 2英文
      curLang: [1],
      // 语言选项
      langOptions: [{
        value: 1,
        label: '简体中文'
      }, {
        value: 2,
        label: 'English'
      }],
      // 是否展示英文信息
      enInfoVisible: false,
      // 品牌选择弹窗显隐
      visibleBrandPopUp: false,

      // 同城配送(是否开启)
      sameCityStatus: 0,
      transportList: [{
        transportId: null,
        transName: ''
      }],
      // 创建运费模板弹窗显隐
      visibleTransportTemplate: false,

      // 购买后有效天数
      validDays: null,

      skuTags: [],

      // 总库存
      totalStocks: 0,

      // 限制日期
      PickerOptions: {
        disabledDate (time) {
          var date = moment().add(-1, 'days').startOf('days')
          return (
            time.getTime() <= date.valueOf()
          )
        }
      }
    }
  },

  watch: {
    curLang (newVal, oldVal) {
      // useLang 0中文 1中英文
      const lang = newVal.includes(2) ? 1 : 0
      this.$set(this.dataForm, 'useLang', lang)
      this.$emit('updataProdDataForm', this.dataForm)
    },
    dataForm: {
      handler (nv) {
        if (nv.writeOffNum) {
          // 核销次数 -1.多次核销 0.无需核销 1.单次核销
          // this.validDays = 2
          this.$emit('changeWriteOffTime', this.validDays)
        }
      },
      deep: true
    }
  },

  created () {
    const dataForm = Object.assign(this.dataForm, this.value)
    this.dataForm = dataForm
    this.writeOffMultipleCountSelect = dataForm.writeOffMultipleCount === -1 ? -1 : 2
    this.writeOffMultipleCount = dataForm.writeOffMultipleCount > -1 ? dataForm.writeOffMultipleCount : ''
    if (this.value.useLang === 1) {
      this.curLang = [1, 2]
    } else {
      this.curLang = [1]
    }
    this.selectLang(this.curLang)
    this.totalStocks = this.dataForm.totalStocks || 0

    // 虚拟商品
    if (this.value.mold === 1) {
      if (this.value.virtualRemark && this.value.virtualRemark.length) {
        const isStr = Object.prototype.toString.call(this.value.virtualRemark) === '[object String]'
        if (isStr) {
          this.dataForm.virtualRemark = JSON.parse(this.value.virtualRemark)
        }
      } else {
        this.dataForm.virtualRemark = []
      }
      const writeOffTime = this.value.writeOffTime
      if (writeOffTime !== -1 && writeOffTime !== 0 && writeOffTime !== 1) {
        this.validDays = writeOffTime
        this.dataForm.writeOffTime = 2
      }
      if (writeOffTime !== 0) {
        this.dataForm.writeOffStart = null
        this.dataForm.writeOffEnd = null
      }
    }
    // 活动商品
    if (this.value.prodType === 5) {
      this.handleProdTpyeChange(this.value.prodType)
    }
    this.initSkuTag(this.value.skuList)
    this.initSkuTable(this.value.skuList)

    // 获取分类信息
    this.getCategoryInfo()
    // 同城配送设置
    this.getSameCityDetail()
    // 运费模板
    this.getTransportList()
  },

  methods: {
    transportAddOrUpdateClose () {
      console.log('123')
      this.visibleTransportTemplate = false
    },

    freight (index) {
      this.dataForm.deliveryAmount < 0.01 ? this.dataForm.deliveryAmount = 0.01 : null
    },

    /**
     * 处理输入框数据
     * @param data
     * @param dataFields
     * @param min 最小值
     * @param max 最大值
     */
    handleInputValue (data, dataFields, min, max) {
      this.$set(this.dataForm, dataFields, this.checkInput(data))
      if (data || data === 0) {
        // 保留两位小数
        if (data > max) {
          this.$set(this.dataForm, dataFields, max)
        }
        if (data < min) {
          this.$set(this.dataForm, dataFields, min)
        }
      }
    },

    /**
     * 只允许输入正数和小数(保留小数点后两位)
     */
    checkInput (num) {
      if (num) {
        var tmpVal = String(num).replace(/[^\d^\\.]/g, '')
        var reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
        if (!reg.test(tmpVal)) {
          tmpVal = tmpVal + ''
          tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
          var n = (tmpVal.split('.')).length - 1
          if (n > 1) {
            tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
          }
        }
        return tmpVal
      } else {
        return ''
      }
    },
    /**
     * 商品类型切换
     */
    handleProdTpyeChange (val) {
      // 活动商品则支持所有配送类型
      if (val === 5) {
        for (const key in this.dataForm.deliveryMode) {
          if (Object.hasOwnProperty.call(this.dataForm.deliveryMode, key)) {
            this.dataForm.deliveryMode[key] = true
          }
        }
      }
    },

    /**
     * 初始化sku表格
     */
    initSkuTag (data) {
      this.$nextTick(() => {
        this.$refs.skuTag.init(data)
      })
    },
    initSkuTable (data) {
      this.$nextTick(() => {
        this.$refs.skuTable.init(data)
      })
    },

    selectShopCategory (event) {
      const shopCategory = this.shopCategoryList.find(item => item.categoryId === event)
      this.dataForm.shopCategoryId = event
      this.currentShopCategoryObj.firstCat.categoryName = this.$i18n.t('language') === 'English' ? shopCategory.categoryNameEn : shopCategory.categoryName
      this.$store.commit('prod/updateStoreProdCategory',
        { storeProdCategory: JSON.parse(JSON.stringify(this.currentShopCategoryObj)), selectUpdate: true }
      )
      // 发送店铺分类变化事件,通知父组件改变分类id与分类名称
      this.$emit('changeCategory', 2)
    },

    /**
     * 获取分类信息
     */
    getCategoryInfo () {
      // 店铺分类
      this.currentShopCategoryObj = JSON.parse(JSON.stringify(this.$store.state.prod.storeProdCategory))
      // console.log(this.currentShopCategoryObj.firstCat, 'currentShopCategoryObj.firstCat')
      this.shopCategoryList = this.$store.state.prod.storeProdCategory.firstCat.dataList
    },

    /**
     * 修改分类信息
     */
    changeCategory (type) {
      switch (type) {
        case 1:
          // 获取平台分类初始化数据
          let selectedCategories = []
          selectedCategories.push(Object.assign({}, this.$store.state.prod.platProdCategory.firstCat))
          selectedCategories.push(Object.assign({}, this.$store.state.prod.platProdCategory.secondCat))
          selectedCategories.push(Object.assign({}, this.$store.state.prod.platProdCategory.threeCat))
          // 显示平台分类选择框
          this.editPlatformCategoriesSelect = true
          this.$refs.categorySelect.init(0, selectedCategories)
          break
        case 2:
          // 显示下拉框
          this.editShopCategorySelect = true
          // 更新店铺分类
          this.$nextTick(() => {
            // 重新请求店铺分类
            this.$http({
              url: this.$http.adornUrl('/prod/category/listCategory'),
              method: 'get',
              params: this.$http.adornParams({ status: 1 })
            }).then(({ data }) => {
              this.currentShopCategoryObj.firstCat.dataList = data
              this.shopCategoryList = data
              this.$refs.shopCategorySelect.$refs.reference.$refs.input.focus()
            })
          })
          break
        default:
          this.editPlatformCategoriesSelect = false
          this.editShopCategorySelect = false
      }
    },

    /**
     * 获取分类选择组件返回数据
     */
    getCategorySelected (selectedCategories) {
      this.editPlatformCategoriesSelect = false
      this.dataForm.categoryId = selectedCategories[2].id
      this.$store.commit('prod/updatePlatProdCategory',
        {
          platProdCategory: {
            firstCat: selectedCategories[0],
            secondCat: selectedCategories[1],
            threeCat: selectedCategories[2]
          },
          selectUpdate: true
        }
      )
      // 发送平台分类变化事件,通知父组件改变分类id与分类名称
      this.$emit('changeCategory', 1)
    },

    categorySelectChange (event, type) {
      if (!event) {
        switch (type) {
          case 1:
            this.editPlatformCategoriesSelect = false
            return
          case 2:
            this.editShopCategorySelect = false
        }
      }
      this.$nextTick(() => {
        this.currentShopCategoryObj.firstCat.id = ''
      })
    },

    /**
     * 保存信息
     */
    upadteProdInfo () {
      this.$emit('updataProdDataForm', this.dataForm)
    },

    /**
     * 选择语言(中文信息必填)
     */
    selectLang (value) {
      if (!value.length) {
        this.curLang = [1]
        return
      }
      this.curLang = JSON.parse(JSON.stringify(value))
      if (this.curLang.find(el => el === 2)) {
        this.enInfoVisible = true
      } else {
        this.dataForm.prodLangList.forEach((el, index) => {
          if (el.lang === 1) {
            el.prodNameEn = ''
            el.briefEn = ''
            this.$set(this.dataForm, 'briefEn', '')
            this.$set(this.dataForm, 'prodNameEn', '')
          }
        })
        this.enInfoVisible = false
      }
      if (!this.curLang.find(el => el === 1)) {
        this.curLang.unshift(1)
      }
    },

    /**
     * 图片的值发生改变，重新校验该表单项
     */
    imgsChange () {
      if (this.dataForm.imgs) {
        this.$refs.dataForm.validateField('imgs')
      }
    },

    /**
     * 选择品牌
     */
    selectBrand () {
      this.visibleBrandPopUp = true
      this.$nextTick(() => {
        this.$refs.selectBrand.init(null, this.dataForm.brandId)
      })
    },
    /**
     * 添加指定品牌
     */
    refreshSelectBrand (brands) {
      if (brands && brands.length) {
        this.$set(this.dataForm, 'brandId', brands[0].brandId)
        this.$set(this.dataForm, 'brandName', brands[0].brandName)
      }
    },
    /**
     * 删除已添加品牌
     */
    deleteSelectedBrand () {
      this.$set(this.dataForm, 'brandId', '')
      this.$set(this.dataForm, 'brandName', '')
    },

    /**
     * 处理商品排序输入框失焦
     */
    handleSortValue () {
      if (this.dataForm.seq > 32767) {
        this.$set(this.dataForm, 'seq', 32767)
        return
      }
      if (this.dataForm.seq <= 0 || !this.dataForm.seq || this.dataForm.seq === '') {
        this.$set(this.dataForm, 'seq', 0)
      }
    },

    /**
     * 规格
     */
    skuTagChangeSkuHandler (skuList, skuTags, type) {
      if (type === 5) {
        this.dataForm.skuList = skuList
        this.skuTags = skuTags
        return
      }
      const prodNameCn = this.dataForm.prodNameCn
      const prodNameEn = this.dataForm.prodNameEn
      let stocks = 0
      skuList.forEach(sku => {
        let stock = parseInt(sku.stocks)
        stocks += isNaN(stock) ? 0 : stock
        if (sku.properties) {
          sku.skuName = ''
          sku.skuNameEn = ''
          let properties = sku.properties.split(';')
          let propertiesEn = sku.propertiesEn.split(';')
          for (const propertiesKey in properties) {
            sku.skuName += properties[propertiesKey].split(':')[1] + ' '
          }
          for (const propertiesKey in propertiesEn) {
            sku.skuNameEn += propertiesEn[propertiesKey].split(':')[1] + ' '
          }
          sku.prodNameCn = prodNameCn + ' ' + sku.skuName
          // 不存在英文名称拼接中文名称
          sku.prodNameEn = prodNameEn ? prodNameEn + ' ' + sku.skuNameEn : prodNameCn + ' ' + sku.skuNameEn
        }
      })
      this.totalStocks = stocks
      this.dataForm.skuList = skuList
      this.skuTags = skuTags
    },
    changeSkuImgHandler (propValue, img) {
      this.$nextTick(() => {
        this.$refs.skuTable.changeSkuImg(propValue, img)
      })
    },
    clearSkuImg () {
      this.$nextTick(() => {
        this.$refs.skuTable.clearSkuImg()
      })
    },

    skuListHandler (skuList) {
      let temp = 0
      skuList.forEach(el => {
        let stock = parseInt(el.stocks)
        temp += isNaN(stock) ? 0 : stock
      })
      this.totalStocks = temp
      this.dataForm.totalStocks = temp
    },

    /**
     * 获取店铺同城配送的配置
     */
    getSameCityDetail () {
      this.$http({
        url: this.$http.adornUrl(`/delivery/sameCity/getSameCityInfo`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          this.sameCityStatus = data.status
        }
      })
    },

    /**
     * 运费模板
     */
    getTransportList () {
      this.$http({
        url: this.$http.adornUrl('/shop/transport/list'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.transportList = data
      })
    },
    /**
     * 新建运费模板
     */
    createTransportTemplate (id) {
      this.visibleTransportTemplate = true
      this.$nextTick(() => {
        this.$refs.transportAddOrUpdate.init(id)
      })
    },

    /**
     * 虚拟商品 - 核销有效期
     */
    changeWriteOffTime (value) {
      if (value !== 2) { this.validDays = '' }
      if (value !== 0 && this.dataForm.writeOffStart && this.dataForm.writeOffEnd) {
        this.dataForm.writeOffStart = null
        this.dataForm.writeOffEnd = null
      }
    },

    changeWriteOffMultipleCount (value) {
      if (value === -1) {
        this.writeOffMultipleCount = ''
      } else {
        this.writeOffMultipleCount = 2
      }
    },

    // 自定义核销有效期天数
    getValidDays (validDays) {
      const num = parseInt(validDays)
      this.validDays = num
      if (num > 9999) {
        this.validDays = 9999
      }
      if (num < 2) {
        this.validDays = 2
      }
      this.$emit('changeWriteOffTime', this.validDays)
    },

    changeWriteOffMultipleCountIn () {
      if (this.writeOffMultipleCount === '' || this.writeOffMultipleCount < 2) {
        this.writeOffMultipleCount = 2
      }
    },

    // 校验自定义核销有效期日期
    changeDate (value, sts) {
      // 校验开始时间
      if (sts === 0) {
        if (Date.parse(this.dataForm.writeOffStart) >= Date.parse(this.dataForm.writeOffEnd)) {
          this.$message({
            message: this.$i18n.t('product.dateErrTips1'),
            type: 'error',
            duration: 1500
          })
          this.dataForm.writeOffStart = ''
          return
        }
      }
      // 校验结束时间
      if (sts === 1) {
        if (new Date() >= Date.parse(this.dataForm.writeOffEnd)) {
          this.$message({
            message: this.$i18n.t('product.dateErrTips2'),
            type: 'error',
            duration: 1500
          })
          this.dataForm.writeOffEnd = ''
          return
        }
        if (Date.parse(this.dataForm.writeOffStart) >= Date.parse(this.dataForm.writeOffEnd)) {
          this.$message({
            message: this.$i18n.t('product.dateErrTips3'),
            type: 'error',
            duration: 1500
          })
          this.dataForm.writeOffEnd = ''
        }
      }
    },

    /**
     * 用户留言-添加字段
     */
    addUserMessage () {
      if (this.dataForm.virtualRemark.length >= 10) {
        this.$message({
          message: this.$i18n.t('product.msgMaxLength'),
          type: 'error',
          duration: 1000
        })
        return
      }
      const data = {
        name: '',
        isRequired: false
      }
      this.dataForm.virtualRemark.push(data)
      // console.log(this.dataForm.virtualRemark)
    },
    /**
     * 用户留言-删除字段
     */
    deleteUserMessage (index) {
      this.dataForm.virtualRemark.splice(index, 1)
    },

    /**
     * 留言输入框失焦校验
     */
    changeMsgInput (name, index) {
      // console.log(name)
      this.$set(this.dataForm.virtualRemark[index], 'name', name.trim())

      // if (!name) {
      //   return
      // }

      // if (!name.trim()) {
      //   // 不能为纯空格
      //   this.$message({
      //     message: this.$i18n.t('product.msgCannotBePlainSpace'),
      //     type: 'warning',
      //     duration: 1200
      //   })
      //   this.$set(this.dataForm.virtualRemark[index], 'name', name.trim())
      // }
    },
        /**
     * 错误提示框
     */
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    },

    /**
     * 表单验证
     */
    dataFormValidation () {
      // 获取sku-table的最新数据
      this.dataForm.skuList = this.$refs.skuTable.getDataList()
      const prodNameCn = this.dataForm.prodNameCn
      const prodNameEn = this.dataForm.prodNameEn
      if (this.writeOffMultipleCountSelect !== -1) {
        this.dataForm.writeOffMultipleCount = this.writeOffMultipleCount || 2
      } else {
        this.dataForm.writeOffMultipleCount = -1
      }
      // 拼接商品sku名称
      this.dataForm.skuList.forEach(sku => {
        if (sku.properties) {
          sku.skuName = ''
          sku.skuNameEn = ''
          let properties = sku.properties.split(';')
          let propertiesEn = sku.propertiesEn.split(';')
          for (const propertiesKey in properties) {
            sku.skuName += properties[propertiesKey].split(':')[1] + ' '
          }
          for (const propertiesKey in propertiesEn) {
            sku.skuNameEn += propertiesEn[propertiesKey].split(':')[1] + ' '
          }
          sku.prodNameCn = prodNameCn + ' ' + sku.skuName
          // 不存在英文名称拼接中文名称
          sku.prodNameEn = prodNameEn ? prodNameEn + ' ' + sku.skuNameEn : prodNameCn + ' ' + sku.skuNameEn
        }
      })

      this.$emit('updataProdDataForm', this.dataForm)
      let isValid = true
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          this.errorMsg(this.$i18n.t('product.fillInTheNecessaryInfo'))
          // document.body.scrollTop = document.documentElement.scrollTop = 0
          isValid = false
          return
        }
        if (!this.dataForm.imgs) {
          // 请选择图片上传
          this.errorMsg(this.$i18n.t('product.plePictureToUpload'))
          isValid = false
          return
        }
        if (this.dataForm.mold !== 1 && this.dataForm.prodType !== 5 && !this.dataForm.deliveryMode) {
          // 请选择配送方式
          this.errorMsg(this.$i18n.t('product.pleeliveryMethod'))
          isValid = false
          return
        }
        // if (this.dataForm.deliveryMode.hasCityDelivery && !this.dataForm.deliveryMode.hasShopDelivery) {
        //   // 请选择运费模板
        //   this.errorMsg("选择了同城配送必须选择快递配送！")
        //   isValid = false
        //   return
        // }
        if (this.dataForm.mold !== 1 && this.dataForm.prodType !== 5 && this.dataForm.deliveryMode.hasShopDelivery && this.dataForm.tableRate > 0 && this.dataForm.deliveryTemplateId === null) {
          // 请选择运费模板
          this.errorMsg(this.$i18n.t('product.pleShgTlate'))
          isValid = false
          return
        }

        if (this.dataForm.prodParameterList.length && !this.validParameter()) {
          isValid = false
          return
        }
        // 虚拟商品校验
        if (this.dataForm.mold === 1) {
          // 自定义核销有效天数
          if (this.dataForm.writeOffNum !== 0 && this.dataForm.writeOffTime === 2) {
            if (!this.validDays) {
              this.$message({
                message: this.$i18n.t('product.validDaysEmptyTips'),
                type: 'error',
                duration: 1000
              })
              isValid = false
              return
            }
          }
          // 自定义核销有效天数
          if (this.dataForm.writeOffNum !== 0 && this.dataForm.writeOffTime === 0 && (!this.dataForm.writeOffStart || !this.dataForm.writeOffEnd)) {
            if (!this.validDays) {
              this.$message({
                message: this.$i18n.t('product.validDateEmptyTips'),
                type: 'error',
                duration: 1000
              })
              isValid = false
              return
            }
          }
          if (this.dataForm.virtualRemark.length && this.dataForm.virtualRemark.find(el => !el.name)) {
            this.$message({
              message: this.$i18n.t('product.msgEmptyTips'),
              type: 'error',
              duration: 1000
            })
            isValid = false
            return
          }
        }
        if (!this.dataForm.prodNameCn) {
          // 请完善中文名称名称
          this.errorMsg(this.$i18n.t('product.zhpleComAndEnName'))
          isValid = false
          return
        }
        // 编码是否重复
        // const partyCodes = this.dataForm.skuList.filter(el => el.partyCode).map(el => el.partyCode) || []
        // if (partyCodes.length && new Set(partyCodes).size !== partyCodes.length) {
        //   this.$message({
        //     message: this.$i18n.t('product.postProductTips16'),
        //     type: 'error',
        //     duration: 1500
        //   })
        //   isValid = false
        //   return
        // }

        // 校验是否含有空规格值
        if (!this.$refs.skuTag.vaildSkuTag()) {
          isValid = false
          return
        }
        if (!this.dataForm.prodNameEn) {
          this.$set(this.value, 'prodNameEn', this.dataForm.prodNameCn)
        }
        if (!this.dataForm.briefEn) {
          this.$set(this.value, 'briefEn', this.dataForm.briefCn)
        }
        isValid = true
      })
      return isValid
    },

    /** 添加参数 */
    parameterInsert () {
      this.dataForm.prodParameterList.push({
        parameterKey: '',
        parameterValue: '',
        parameterKeyEn: '',
        parameterValueEn: ''
      })
    },
    parameterDeltete (index) {
      this.dataForm.prodParameterList.splice(index, 1)
    },
    validParameter () {
      const data = this.dataForm.prodParameterList
      for (let i = data.length - 1; i >= 0; i--) {
        data[i]['parameterKey'] = String(data[i]['parameterKey']).trim()
        data[i]['parameterValue'] = String(data[i]['parameterValue']).trim()
        data[i]['parameterKeyEn'] = String(data[i]['parameterKeyEn']).trim()
        data[i]['parameterValueEn'] = String(data[i]['parameterValueEn']).trim()
        if (!data[i]['parameterKey'] && !data[i]['parameterValue'] && !data[i]['parameterKeyEn'] && !data[i]['parameterValueEn']) {
          this.parameterDeltete(i)
        }
      }
      for (let i = 0; i < data.length; i++) {
        // debugger
        if (this.curLang.includes(2)) {
          if (!String(data[i]['parameterKey']).trim() && !String(data[i]['parameterValue']).trim() && !String(data[i]['parameterKeyEn']).trim() && !String(data[i]['parameterValueEn']).trim()) {
            return true
          }
        } else {
          if (!String(data[i]['parameterKey']).trim() && !String(data[i]['parameterValue']).trim()) {
            return true
          }
        }
        if (!String(data[i]['parameterKey']).trim() || !String(data[i]['parameterValue']).trim()) {
          this.$message.error(this.$i18n.t('product.parameterTips'))
          return false
        }
        if (this.curLang.includes(2)) {
          if (!String(data[i]['parameterKeyEn']).trim() || !String(data[i]['parameterValueEn']).trim()) {
            this.$message.error(this.$i18n.t('product.parameterTips'))
            return false
          }
        }
      }
      return true
    }

  }
}
</script>

<style lang="scss" scoped>
.posting-edit-product {
  .edit-prod-content {
    /***** 公共样式 *****/
    & >>> .el-input__inner {
      border-radius: 2px;
    }
    // .prod-con {
    //   padding: 10px 30px;
    // }
    .weak-text {
      color: #999;
    }
    .el-form-item-tips {
      font-size: 12px;
      color: #999;
      line-height: 1em;
      padding-top: 8px;
      padding-bottom: 5px;
    }
    .options-box {
      .el-form-item-tips {
        line-height: 1.5em;
      }
    }
    // 输入框样式
    .native-input-style {
      height: 32px;
      line-height: 32px;
      border: 1px solid #DCDCDC;
      border-radius: 2px;
      padding: 0 5px;
      color: #333;
      box-sizing: border-box;
      &:focus {
        outline: 0;
        border-radius: 2px;
      }
    }
    // 刷新 | 新建
    .create-refresh-btn {
      display: inline-block;
      margin-left: 10px;
      & >>> .el-divider--vertical {
        margin: 0 2px;
      }
    }

    /***** 基本信息 *****/
    .basic-info-content {
      // 表单错误提示
      & >>> .el-form-item {
        margin-bottom: 22px;
      }
      // 已选分类
      .selected-category {
        & >>> .el-form-item__content {
          line-height: 1em;
        }
        .category-sel {
          display: inline-block;
          .category-con {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: auto;
            min-width: 400px;
            border: 1px solid #DCDCDC;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 2px;
            .update-btn {
              margin-left: 10px;
            }
            .cur-sel {
              margin-right: 5px;
            }
          }
          .category-con:not(:first-child) {
            margin-top: 10px;
          }
          .category-select {
            min-width: 400px;
            width: auto;
            margin-top: 10px;
          }
          // .el-form-item-tips {
          //   margin-top: 10px;
          // }
        }
      }
      // 选择语言
      .select-lang {
        display: block;
        width: 400px;
      }
      // 商品名称
      .prod-name-box {
        & >>> .el-input__inner {
          width: 400px;
          padding: 0 8px!important;
        }
        .prod-name-con {
          display: inline-block;
          margin-right: 15px;
        }
      }
      // 商品图片
      .prod-img-box {
        & >>> img {
          vertical-align: top;
        }
        & >>> .el-upload-list__item,
        & >>> .el-upload--picture-card {
          width: 80px;
          height: 80px;
          line-height: 82px;
          border-radius: 2px;
          color: #DCDCDC;
          border-color: #DCDCDC;
          box-sizing: border-box;
          background: #fff;
          .el-icon-plus::before {
            font-size: 24px;
            color: #999;
          }
        }
        .el-form-item-tips {
          line-height: 1em;
          padding-top: 0;
        }
      }
      // 商品视频
      .prod-video-box {
        & >>> .plugin-video {
          .el-upload {
            width: 80px;
            min-width: auto;
            height: 80px;
            min-height: auto;
            border: 1px solid #DCDCDC;
            border-radius: 2px;
            .el-icon-plus::before {
              font-size: 24px;
              color: #999;
            }
            .video {
              width: 100%;
            }
          }
        }
        // .el-form-item-tips {
        //   line-height: 1em;
        //   margin-bottom: 5px;
        // }
      }
      .prod-video-box2 {
        & >>> .plugin-video {
          .el-upload {
            width: auto;
            min-width: 80px;
            max-width: 300px;
            height: auto;
            min-width: 80px;
            max-height: 250px;
            border: 1px solid #DCDCDC;
            border-radius: 2px;
            .el-icon-plus::before {
              font-size: 24px;
              color: #999;
            }
            .video {
              width: 100%;
            }
          }
        }
      }
      // 商品品牌 + 商品排序
      .prod-brand-sort {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        // 品牌
        .select-prod-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: auto;
          min-width: 214px;
          border: 1px solid #DCDCDC;
          border-radius: 2px;
          padding: 0 10px;
          margin-right: 20px;
          .brand {
            margin-right: 20px;
            .brand-name {
              display: inline-block;
              max-width: 400px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              vertical-align: middle;
            }
            .del-brand {
              color: #155bd4;
              vertical-align: middle;
            }
            .del-brand:hover {
              cursor: pointer;
            }
          }
        }
        // 排序
        .select-prod-sort {
          & >>> input {
            width: 100px;
            height: 32px;
            line-height: 32px;
            border: 1px solid #DCDCDC;
            border-radius: 2px;
            padding-left: 10px;
            padding-right: 0;
            color: #333;
            box-sizing: border-box;
            &:focus {
              outline: 0;
              border-radius: 2px;
            }
          }
        }
      }

    }

    /***** 规格库存 *****/
    .spec-stock-content {
      .total-stock {
        input {
          width: auto;
          min-width: 280px;
          height: 32px;
          line-height: 32px;
          padding: 0 10px;
          color: #999999;
          border: 1px solid #DCDCDC;
        }
      }
    }

    /***** 运费设置 *****/
    .shipping-setup {
      & >>> .el-select {
        width: 280px;
        box-sizing: border-box;
      }
    }
    /**参数设置 */
    .params-box {
      .btn-box {
        display: flex;
        align-items: center;
        .line {
          display: inline-block;
          width: 1px;
          background-color: #999;
          height: 14px;
          margin: 0 5px;
        }
      }
      .input {
        width: 270px;
        margin-right: 20px;
        & >>> .el-input-group__prepend {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          padding: 0 18px;
        }
      }
      .params-tips {
        font-size: 12px;
        color: #999999;
      }
      .default-btn+.default-btn{
        margin-left: 0;
      }
    }

    /***** 其他设置 *****/
    .other-settings {
      // 有效期
      .expiry-date {
        & >>> .el-radio__label {
          color: #333;
        }
        .radio-item {
          display: block;
          height: 32px;
          line-height: 32px;
          .el-radio {
            display: inline-block;
            vertical-align: middle;
          }
        }
        .radio-item.date-picker {
          margin-top: 10px;
          & >>> .el-date-editor.el-input {
            width: 160px;
          }
          & >>> .el-date-editor .el-input__inner {
            padding-left: 10px !important;
            height: 30px;
            line-height: 30px;
            border-radius: 2px;
          }
          & >>> .el-input.is-disabled .el-input__inner {
            background: #fafafa;
          }
          & >>> .el-input__icon {
            display: none;
          }
        }
        .native-input-style {
          width: 70px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          padding-right: 0;
        }
      }
      // 用户留言
      .user-message {
        .msg-int-box:not(:last-child),
        .msg-int-box:not(:first-child) {
          margin-bottom: 10px;
        }
        .required-checkbox {
          margin-left: 15px;
          margin-right: 5px;
        }
        .native-input-style {
          width: 280px;
          padding: 0 10px;
        }
        .el-form-item-tips {
          line-height: 1.5em;
        }
      }
    }

  }
  .freight{
    width: 175px;
  }
}
</style>
