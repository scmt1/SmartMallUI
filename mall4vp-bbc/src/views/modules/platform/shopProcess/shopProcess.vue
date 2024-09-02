<template>
    <div class="shop-process-container">
        <div class="sp-wrapper">

            <div v-if="applyStep > 0" class="info-frame">
                <div class="sbi-title title">{{ $t('shop.createStore') }}</div>

                <div class="sbi-content content">

                    <!-- 步骤 -->
                    <div class="progress-bar" :class="lang === 'en' ? 'en-progress-bar' : 'zh-progress-bar'">
                        <div class="first-step step" :class="{'active-step':applyStep>0}">
                            <div class="step-item">
                                <div class="si-wrapper">
                                    <div class="step-num">1</div>
                                    <div class="step-text">{{ $t('shopProcess.basicInfo') }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="second-step step" :class="{'active-step':applyStep>1}">
                            <div class="step-item">
                                <div class="si-wrapper">
                                    <div class="step-num">2</div>
                                    <div class="step-text">{{ $t('shopProcess.businessInfo') }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="third-step step" :class="{'active-step':applyStep>2}">
                            <div class="step-item">
                                <div class="si-wrapper">
                                    <div class="step-num">3</div>
                                    <div class="step-text">{{ $t('shopProcess.signUpInfo') }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="fourth-step step" :class="{'active-step':applyStep>3}">
                            <div class="step-item">
                                <div class="si-wrapper">
                                    <div class="step-num">4</div>
                                    <div class="step-text">{{ $t('shopProcess.financeInfo') }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="fourth-step step" :class="{'active-step':applyStep>4}">
                            <div class="step-item">
                                <div class="si-wrapper">
                                    <div class="step-num">5</div>
                                    <div class="step-text">{{ $t('shopProcess.registerInfo') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 第一步 基本信息 -->
                    <div v-if="applyStep === 1" class="shop-base-info"
                         :class="lang === 'en' ? 'en-base-info' : 'zh-base-info'">
                        <div class="company-info">
                            <el-form
                                    ref="shopDetail"
                                    :model="shopDetail"
                                    :rules="shopDetailRule"
                                    class="base-info"
                                    label-width="120px"
                                    size="small"
                            >
                                <div class="ci-wrapper">
                                    <div class="left-info">
                                        <el-form-item :label="this.$i18n.t('shopProcess.merchantName')"
                                                      prop="merchantName">
                                            <el-input
                                                    v-model="shopDetail.merchantName"
                                                    :placeholder="this.$i18n.t('shopProcess.merchantNameInputTips')"
                                                    maxlength="10"
                                                    @blur="
                          shopDetail.merchantName =
                          shopDetail.merchantName ?
                          removeHeadAndTailSpaces(shopDetail.merchantName) :
                          shopDetail.merchantName
                        "
                                            />
                                        </el-form-item>
                                        <el-form-item :label="this.$i18n.t('shopProcess.shopName')" prop="shopName">
                                            <el-input
                                                    v-model="shopDetail.shopName"
                                                    :placeholder="this.$i18n.t('shopProcess.shopNameInputTips')"
                                                    maxlength="20"
                                                    @blur="
                          shopDetail.shopName =
                          shopDetail.shopName ?
                          removeHeadAndTailSpaces(shopDetail.shopName) :
                          shopDetail.shopName
                        "
                                            />
                                        </el-form-item>
                                        <el-form-item label="行业类型" prop="industryType">
                                            <el-select style="width: 100%;" v-model="shopDetail.industryType"
                                                       placeholder="请选择行业类型">
                                                <el-option v-for="(item,index) in industryTypeList"
                                                           :key="index"
                                                           :label="item.title"
                                                           :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="店铺类型" prop="storeType">
                                            <el-select style="width: 100%;" v-model="shopTypes" @change="storeTypeChange" multiple placeholder="请选择店铺类型">
                                                <el-option
                                                        v-for="(item,index) in shopTypeList"
                                                        :key="index"
                                                        :label="item.title"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- <el-form-item label="联系人" prop="contactName">
                                          <el-input v-model="shopDetail.contactName" placeholder="请输入常用联系人姓名" maxlength="10" />
                                        </el-form-item> -->
                                        <el-form-item :label="this.$i18n.t('shopProcess.tel')" prop="tel">
                                            <el-input v-model="shopDetail.tel"
                                                      :placeholder="this.$i18n.t('shopProcess.telInputTips')"
                                                      maxlength="11"/>
                                        </el-form-item>
                                        <el-form-item :label="this.$i18n.t('shopProcess.email')" prop="email">
                                            <el-input v-model="shopDetail.email"
                                                      :placeholder="this.$i18n.t('shopProcess.emailInputTips')"
                                                      maxlength="30"/>
                                        </el-form-item>
                                        <el-form-item :label="this.$i18n.t('shopProcess.addr')" prop="currentAddr">
                                            <el-cascader
                                                    ref="cascaderAddr"
                                                    v-model="shopDetail.currentAddr"
                                                    :options="addrList"
                                                    :props="addrListTreeProps"
                                                    :placeholder="this.$i18n.t('shopProcess.addrInputTips')"
                                                    @change="handleAddrChange"
                                            />
                                        </el-form-item>
                                        <!-- <el-form-item label="详细地址" prop="detailAddress">
                                          <el-input v-model="shopDetail.detailAddress" placeholder="请输入50字以内的详细地址" maxlength="50" />
                                        </el-form-item> -->
                                        <el-form-item :label="this.$i18n.t('shopProcess.detailAddr')"
                                                      prop="shopAddress">
                                            <el-input
                                                    v-model="shopDetail.shopAddress"
                                                    :placeholder="this.$i18n.t('shopProcess.detailAddrInputTips')"
                                                    maxlength="50"
                                                    :disabled="isNotEdit"
                                                    @blur="
                          shopDetail.shopAddress =
                          shopDetail.shopAddress ?
                          removeHeadAndTailSpaces(shopDetail.shopAddress) :
                          shopDetail.shopAddress; shopAddressChange()
                        "
                                            >
                                                <el-button slot="append" icon="el-icon-location" @click="mapLocation">{{
                                                    $t('platform.location') }}
                                                </el-button>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="楼层" prop="floor">
                                            <el-input
                                                    v-model="shopDetail.floor"
                                                    placeholder="请输入楼层"
                                                    maxlength="50"
                                            >
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="房号" prop="roomNumber">
                                            <el-input
                                                    v-model="shopDetail.roomNumber"
                                                    placeholder="请输入房号"
                                                    maxlength="50"
                                            >
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="排序" prop="sort">
                                            <el-input-number
                                                    v-model="shopDetail.sort"
                                                    placeholder="请输入排序"
                                                    maxlength="50"
                                                    style="width: 400px;"
                                            >
                                            </el-input-number>
                                        </el-form-item>
                                        <el-form-item>
                                            <baidu-map
                                                    class="map"
                                                    :scroll-wheel-zoom="false"
                                                    :center="center"
                                                    @moving="syncCenterAndZoom"
                                                    @moveend="syncCenterAndZoom"
                                                    @zoomend="syncCenterAndZoom"
                                                    :zoom="zoom"
                                            >
                                                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                                                <bm-marker :position="center" :dragging="false" @click="infoWindowOpen">
                                                    <bm-info-window :show="show" @close="infoWindowClose"
                                                                    @open="infoWindowOpen">{{ $t('shop.storeLocation')
                                                        }}
                                                    </bm-info-window>
                                                </bm-marker>
                                            </baidu-map>
                                        </el-form-item>
                                        <el-form-item :label="this.$i18n.t('shopProcess.intro')" prop="intro">
                                            <div class="business-license-box">
                                                <div class="license-content">
                                                    <el-input
                                                            v-model="shopDetail.intro"
                                                            type="textarea"
                                                            :rows="4"
                                                            maxlength="200"
                                                            :placeholder="this.$i18n.t('shopProcess.introInput')"
                                                            @blur="
                              shopDetail.intro =
                              shopDetail.intro ?
                              removeHeadAndTailSpaces(shopDetail.intro) :
                              shopDetail.intro
                            "
                                                    />
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </div>

                                    <div class="right-info">
                                        <el-form-item :label="this.$i18n.t('shopProcess.logo')" prop="shopLogo">
                                            <div class="business-license-box">
                                                <div class="license-content">
                                                    <img-upload v-model="shopDetail.shopLogo"
                                                                @input="imgChange(shopDetail.shopLogo, 'shopLogo', 'shopDetail')"/>
                                                </div>
                                                <div class="upload-tips">{{ $t('shopProcess.logoTips') }}</div>
                                            </div>
                                        </el-form-item>
                                        <!-- 背景图 -->
                                        <!-- <div class="bg-img">
                                          <div class="business-license-box">
                                            <el-form-item :label="this.$i18n.t('shopProcess.backgroundPic')" prop="mobileBackgroundPic">
                                              <div class="license-content">
                                                <img-upload v-model="shopDetail.mobileBackgroundPic" />
                                              </div>
                                              <div class="img-tips">
                                                <p>{{ $t('shopProcess.mobileBackgroundPic') }}</p>
                                                <p>{{ $t('shopProcess.mobilePicTips') }}</p>
                                              </div>
                                            </el-form-item>
                                          </div>
                                          <div class="business-license-box">
                                            <el-form-item label-width="0" prop="pcBackgroundPic">
                                              <div class="license-content">
                                                <img-upload v-model="shopDetail.pcBackgroundPic" />
                                              </div>
                                              <div class="img-tips">
                                                <p>{{ $t('shopProcess.pcBackgroundPic') }}</p>
                                                <p>{{ $t('shopProcess.pcPicTips') }}</p>
                                              </div>
                                            </el-form-item>
                                          </div>
                                        </div> -->
                                        <!-- 工商信息 -->
                                        <!-- <el-form-item :label="this.$i18n.t('shopProcess.businessLicense')" prop="businessLicense">
                                          <div class="business-license-box">
                                            <div class="license-content">
                                              <img-upload
                                                v-model="shopDetail.businessLicense"
                                                @input="imgChange(shopDetail.businessLicense, 'businessLicense')"
                                              />
                                              <div class="example-box">
                                                <img src="~@/assets/img/example-img/Business-license.png">
                                                <div class="tips">{{ $t('shopProcess.example') }}</div>
                                              </div>
                                            </div>
                                            <div class="upload-tips">{{ $t('shopProcess.logoTips') }}</div>
                                          </div>
                                        </el-form-item> -->
                                        <!-- <div class="id-box">
                                          <div class="upload-content">
                                            <div class="upload-img">
                                              <el-form-item class="idcard" :label="this.$i18n.t('shopProcess.corporateIdentityCard')" prop="identityCardFront">
                                                <img-upload
                                                  v-model="shopDetail.identityCardFront"
                                                  @input="imgChange(shopDetail.identityCardFront, 'identityCardFront')"
                                                />
                                              </el-form-item>
                                              <el-form-item class="idcard" label-width="0" prop="identityCardLater">
                                                <img-upload
                                                  v-model="shopDetail.identityCardLater"
                                                  @input="imgChange(shopDetail.identityCardLater, 'identityCardLater')"
                                                />
                                              </el-form-item>
                                            </div>
                                            <div class="upload-example">
                                              <div class="example-box">
                                                <img src="~@/assets/img/example-img/idcard1.png">
                                                <div class="tips">{{ $t('shopProcess.identityCardFront') }}</div>
                                              </div>
                                              <div class="example-box">
                                                <img src="~@/assets/img/example-img/idcard2.png">
                                                <div class="tips">{{ $t('shopProcess.identityCardLater') }}</div>
                                              </div>
                                            </div>
                                            <div class="upload-tips">{{ $t('shopProcess.identityCardTips') }}</div>
                                          </div>
                                        </div> -->
                                    </div>
                                </div>
                            </el-form>
                        </div>
                    </div>

                    <!-- 第二步 工商信息 -->
                    <div v-if="applyStep === 2" class="company-info">
                        <el-form
                                ref="shopCompany"
                                :model="shopCompany"
                                :rules="shopCompanyRule"
                                label-width="150px"
                                size="small"
                        >
                            <div class="ci-wrapper">
                                <div class="left-info">
                                    <el-form-item :label="this.$i18n.t('shopProcess.creditCode')" prop="creditCode">
                                        <el-input v-model="shopCompany.creditCode" maxlength="20"
                                                  :placeholder="this.$i18n.t('shopProcess.creditCodeInputTips')"/>
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.firmName')" prop="firmName">
                                        <el-input
                                                v-model="shopCompany.firmName"
                                                maxlength="50"
                                                :placeholder="this.$i18n.t('shopProcess.firmNameInputTips')"
                                                @blur="
                        shopCompany.firmName =
                        shopCompany.firmName ?
                        removeHeadAndTailSpaces(shopCompany.firmName) :
                        shopCompany.firmName
                      "
                                        />
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.residence')">
                                        <el-input
                                                v-model="shopCompany.residence"
                                                prop="residence"
                                                maxlength="50"
                                                :placeholder="this.$i18n.t('shopProcess.residenceInputTips')"
                                                @blur="
                        shopCompany.residence =
                        shopCompany.residence ?
                        removeHeadAndTailSpaces(shopCompany.residence) :
                        shopCompany.residence
                      "
                                        />
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.representative')"
                                                  prop="representative">
                                        <el-input
                                                v-model="shopCompany.representative"
                                                prop="representative" maxlength="20"
                                                :placeholder="this.$i18n.t('shopProcess.representativeInputTips')"
                                                @blur="
                        shopCompany.representative =
                        shopCompany.representative ?
                        removeHeadAndTailSpaces(shopCompany.representative) :
                        shopCompany.representative
                      "
                                        />
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.capital')" class="capital-int">
                                        <el-input
                                                v-model="shopCompany.capital"
                                                prop="capital"
                                                type="number"
                                                style="width:200px"
                                                :min="0"
                                                :max="99999999"
                                                @blur="changeNum"
                                                @keydown.native="channelInputLimit"
                                        />
                                        <span class="price-unit-text">{{ $t('shopProcess.tenThousandYuan') }}</span>
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.fountTime')" prop="foundTime">
                                        <el-date-picker
                                                v-model="shopCompany.foundTime"
                                                style="width:200px"
                                                type="date"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                :placeholder="this.$i18n.t('platform.seleData')"
                                                :picker-options="pickerOptions"
                                        />
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.businessTime')" prop="timeRange">
                                        <el-date-picker
                                                v-model="shopCompany.timeRange"
                                                type="daterange"
                                                :range-separator="this.$i18n.t('date.tip')"
                                                :start-placeholder="this.$i18n.t('shopProcess.startTime')"
                                                :end-placeholder="this.$i18n.t('shopProcess.endTime')"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                class="business-term"
                                                :clearable="false"
                                                @change="handleTimeData"
                                        />
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.businessScope')"
                                                  prop="businessScope" style="margin-bottom:30px;">
                                        <el-input
                                                v-model="shopCompany.businessScope"
                                                type="textarea"
                                                resize="none"
                                                :rows="4"
                                                :placeholder="this.$i18n.t('shopProcess.businessScopeInputTips')"
                                                maxlength="500"
                                                @blur="
                        shopCompany.businessScope =
                        shopCompany.businessScope ?
                        removeHeadAndTailSpaces(shopCompany.businessScope) :
                        shopCompany.businessScope
                      "
                                        />
                                    </el-form-item>
                                </div>
                                <div class="right-info">
                                    <!-- 工商信息 -->
                                    <el-form-item :label="this.$i18n.t('shopProcess.businessLicense')"
                                                  prop="businessLicense">
                                        <div class="business-license-box">
                                            <div class="license-content">
                                                <img-upload
                                                        v-model="shopCompany.businessLicense"
                                                        @input="imgChange(shopCompany.businessLicense, 'businessLicense', 'shopCompany')"
                                                />
                                                <div class="example-box">
                                                    <img src="~@/assets/img/example-img/Business-license.png">
                                                    <div class="tips">{{ $t('shopProcess.example') }}</div>
                                                </div>
                                            </div>
                                            <div class="upload-tips">{{ $t('shopProcess.logoTips') }}</div>
                                        </div>
                                    </el-form-item>
                                    <div class="id-box">
                                        <div class="upload-content">
                                            <div class="upload-img">
                                                <el-form-item class="idcard"
                                                              :label="this.$i18n.t('shopProcess.corporateIdentityCard')"
                                                              prop="identityCardFront">
                                                    <img-upload
                                                            v-model="shopCompany.identityCardFront"
                                                            @input="imgChange(shopCompany.identityCardFront, 'identityCardFront', 'shopCompany')"
                                                    />
                                                </el-form-item>
                                                <el-form-item class="idcard" label-width="0" prop="identityCardLater">
                                                    <img-upload
                                                            v-model="shopCompany.identityCardLater"
                                                            @input="imgChange(shopCompany.identityCardLater, 'identityCardLater', 'shopCompany')"
                                                    />
                                                </el-form-item>
                                            </div>
                                            <el-form-item>
                                                <div class="upload-example">
                                                    <div class="example-box">
                                                        <img src="~@/assets/img/example-img/idcard1.png">
                                                        <div class="tips">{{ $t('shopProcess.identityCardFront') }}
                                                        </div>
                                                    </div>
                                                    <div class="example-box">
                                                        <img src="~@/assets/img/example-img/idcard2.png">
                                                        <div class="tips">{{ $t('shopProcess.identityCardLater') }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="upload-tips">{{ $t('shopProcess.identityCardTips') }}</div>
                                            </el-form-item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-form>
                    </div>

                    <!-- 第三步 签约信息 -->
                    <div v-if="applyStep === 3" class="content-wrapper signing-content">
                        <!-- 签约类目 -->
                        <div class="s-category-item s-item">
                            <div class="table-data-title">
                                <div class="text"><span class="stress">*</span>{{ $t('shopProcess.signingCategory') }}
                                </div>
                                <div class="tips">
                                    {{ $t('shopProcess.chosen') }}
                                    <span class="txt-bold">{{ signCategoryList.length }}</span>
                                    {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}，{{
                                    $t('shopProcess.mostAdd') }}
                                    <span class="txt-bold">200</span>
                                    {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}
                                </div>
                            </div>
                            <div class="si-content">
                                <category-add-or-update
                                        ref="cateAddOrUpdate"
                                        :sign-category-list="signCategoryList"
                                        @getSignCategoryList="getSignCategoryList"
                                />
                            </div>
                        </div>
                        <!-- 签约品牌 -->
                        <div class="s-brand-item s-item">
                            <div class="table-data-title">
                                <div class="text">{{ $t('shopProcess.signingBrand') }}</div>
                                <div class="tips">
                                    {{ $t('shopProcess.chosen') }}
                                    <span class="txt-bold">{{ signBrandList.length }}</span>
                                    {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}，{{
                                    $t('shopProcess.mostAdd') }}
                                    <span class="txt-bold">50</span>
                                    {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}
                                </div>
                            </div>
                            <div class="si-content">
                                <brand-add-or-update
                                        ref="brandAddOrUpdate"
                                        :brand-signing-list="signBrandList"
                                        @getSignBrandList="getSignBrandList"
                                />
                            </div>
                        </div>

                        <!-- 签约信息 -->
                        <div class="contract-info s-item">
                            <el-form
                                    ref="contractInfo"
                                    :model="contractInfo"
                                    :rules="contractInfoRule"
                                    class="base-info"
                                    label-width="auto"
                                    size="small"
                            >
                                <!-- 签约有效期 -->
                                <el-form-item :label="this.$i18n.t('shopProcess.validityPeriodOfContract')"
                                              prop="contractTimeRange">
                                    <div>
                                        <el-date-picker
                                                v-model="contractInfo.contractTimeRange"
                                                type="daterange"
                                                :range-separator="this.$i18n.t('date.tip')"
                                                :start-placeholder="this.$i18n.t('shopProcess.startTime')"
                                                :end-placeholder="this.$i18n.t('shopProcess.endTime')"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                @change="getContractTimeRange"
                                        />
                                    </div>
                                </el-form-item>
                                <!-- 店铺类型 -->
                                <el-form-item :label="this.$i18n.t('shopProcess.shopType')" prop="type">
                                    <el-radio-group v-model="contractInfo.type">
                                        <el-radio :label="0">{{ $t('shopProcess.ordinaryShop') }}</el-radio>
                                        <el-radio :label="1">{{ $t('shopProcess.preferredGoodShop') }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>

                    <!-- 第四步 财务信息 -->
                    <div v-if="applyStep === 4" class="content-wrapper finance-info">
                        <el-form ref="financialInfo" label-width="140px" :model="financialInfo"
                                 :rules="financialInfoRules" size="small">
                            <el-form-item label="商户号" prop="mchNo">
                                <el-input
                                        v-model="financialInfo.mchNo"
                                        type="textarea"
                                        class="store-intro"
                                        maxlength="200"
                                        placeholder="请输入商户号"/>
                            </el-form-item>
                            <el-form-item label="应用id" prop="appId">
                                <el-input
                                        v-model="financialInfo.appId"
                                        type="textarea"
                                        class="store-intro"
                                        maxlength="200"
                                        placeholder="请输入应用id"/>
                            </el-form-item>
                            <el-form-item label="应用秘钥" prop="apiKey">
                                <el-input
                                        v-model="financialInfo.apiKey"
                                        type="textarea"
                                        :rows="4"
                                        class="store-intro"
                                        maxlength="200"
                                        placeholder="请输入应用秘钥"/>
                            </el-form-item>
                        </el-form>
                    </div>

                    <!-- 第五步 注册信息 -->
                    <div v-if="applyStep === 5" class="content-wrapper">
                        <div class="register-info">
                            <el-form
                                    ref="shopUserRegisterInfo"
                                    :model="shopUserRegisterInfo"
                                    :rules="shopUserRegisterRule"
                                    label-width="auto"
                                    size="small"
                            >
                                <el-form-item :label="this.$i18n.t('sys.userName')" prop="username">
                                    <el-input v-model="shopUserRegisterInfo.username" maxlength="16"
                                              :placeholder="this.$i18n.t('shopProcess.userNameRule')"/>
                                </el-form-item>
                                <el-form-item :label="this.$i18n.t('sys.password')" prop="password">
                                    <el-input v-model="shopUserRegisterInfo.password" type="password" maxlength="16"
                                              :placeholder="this.$i18n.t('shopProcess.passwordRule')" show-password/>
                                </el-form-item>
                                <el-form-item :label="this.$i18n.t('users.phoneNumber')" prop="mobile">
                                    <div class="mobile-box">
                                        <el-input v-model="shopUserRegisterInfo.mobile" class="mobile-int"
                                                  maxlength="11"
                                                  :placeholder="this.$i18n.t('shopProcess.mobileRule')">
                                            <div slot="append" class="mobile-btn" @click="getRegisterCode">
                                                {{ showGetCodeBtn ? $t('shop.getVerificationCode') : count + ' s' }}
                                            </div>
                                        </el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item :label="this.$i18n.t('home.verificationCode')" prop="validCode">
                                    <el-input v-model="shopUserRegisterInfo.validCode"
                                              :placeholder="this.$i18n.t('shop.pleaseEnteCode')"/>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>

                    <div class="footer-box btn-row">
                        <div v-if="applyStep !== 1" class="default-btn" @click="toPrevStep">{{
                            $t('shopProcess.previousStep') }}
                        </div>
                        <div v-if="applyStep !== 5" class="default-btn primary-btn" @click="toNextStep">{{
                            $t('shopProcess.nextStep') }}
                        </div>
                        <div v-if="applyStep === 5" class="default-btn primary-btn" @click="toNextStep">{{
                            $t('shop.createStore') }}
                        </div>

                        <!-- <el-button v-if="applyStep !== 1" plain @click="toPrevStep">上一步</el-button> -->
                        <!-- <el-button v-if="applyStep !== 5" type="primary" @click="toNextStep">下一步</el-button> -->
                        <!-- <el-button v-if="applyStep === 5" type="primary" @click="toNextStep">创建店铺</el-button> -->
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  import imgUpload from '@/components/img-upload'
  import CategoryAddOrUpdate from './category-add-or-update'
  import BrandAddOrUpdate from './brand-add-or-update'
  // import * as addrApi from '@/api/delivery/transport'
  // import * as api from '@/api/platform/audit-shop'
  import {
    isCreditCode,
    isMobile,
    isUserName,
    removeHeadAndTailSpaces,
    validEmail,
    validNoEmptySpace
  } from '@/utils/validate'
  import moment from 'moment'
  import {encrypt} from '@/utils/crypto'

  export default {
    components: {
      CategoryAddOrUpdate,
      BrandAddOrUpdate,
      imgUpload
    },
    data () {
      const validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error(this.$i18n.t('shopProcess.telErrorTips')))
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        if (!validEmail(value) || value.indexOf(' ') !== -1) {
          callback(new Error(this.$i18n.t('shopProcess.emailErrorTips')))
        } else {
          callback()
        }
      }
      const vaildCreditCode = (rule, value, callback) => {
        if (!isCreditCode(value)) {
          callback(new Error(this.$i18n.t('shopProcess.creditCodeErrorTips')))
        } else {
          // 检查统一信用码是否已存在
          this.$http({
            url: this.$http.adornUrl('/platform/shopCompany/checkCreditCode'),
            method: 'GET',
            params: this.$http.adornParams({
              creditCode: value
            })
          }).then(({data}) => {
            if (data) {
              callback(new Error(this.$t('shopProcess.creditCodeRule')))
            } else {
              callback()
            }
          }).catch(({e}) => {
            callback()
          })
        }
      }
      const vaildUserName = (rule, value, callback) => {
        if (!isUserName(value)) {
          callback(new Error(this.$t('shopProcess.userNameRule2')))
        } else {
          callback()
        }
      }
      // 密码
      const validatePassword = (rule, value, callback) => {
        var reg = /[^\w]/
        if (reg.test(value)) {
          callback(new Error(this.$i18n.t('shop.addShopErrorTip7')))
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
      var validateCardNo = (rule, value, callback) => {
        if (!(/^([0-9]{1})(\d{12,18})$/).test(value)) {
          callback(new Error(this.$i18n.t('shopProcess.cardNoErrorTips')))
        } else if (this.currentCardNoRepeatable) {
          callback(new Error(this.$i18n.t('shopProcess.cardNoDuplicates')))
        } else {
          callback()
        }
      }
      // 检查店铺名称是否已存在
      var validShopName = (rule, value, callback) => {
        if (validNoEmptySpace(value)) {
          callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
        } else {
          this.$http({
            url: this.$http.adornUrl('/platform/shopDetail/checkShopName'),
            method: 'GET',
            params: this.$http.adornParams({
              shopName: value
            })
          }).then(({data}) => {
            if (data) {
              callback(new Error(this.$t('shopProcess.shopNameRule')))
            } else {
              callback()
            }
          }).catch(({e}) => {
            callback()
          })
        }
      }
      return {
        removeHeadAndTailSpaces: removeHeadAndTailSpaces,

        // 语言
        lang: localStorage.getItem('lang'),

        // 步骤: 1基本信息 2工商信息 3签约信息 4财务信息 5商家注册信息
        applyStep: 1,

        shopId: this.$route.query.shopId || 0,
        // 图片资源地址（前缀）
        resourcesUrl: process.env.VUE_APP_RESOURCES_URL,

        currentAddr: [], // 选中地址
        addrOpts: [], // 地址数据
        picturePreviewVisible: false, // 预览图片弹窗

        // 分类弹窗显隐
        cateAddOrUpdateVisible: false,
        // 品牌弹窗显隐
        brandAddOrUpdateVisible: false,

        applyStatus: 0, // 店铺申请状态 0：未审核 1：已通过 -1：未通过 -2：未提交过申请
        isNotEdit: false, // 是否不可以编辑信息, 当申请状态为待审核时不能编辑
        auditingInfo: '', // 审核信息
        mapLocationType: 'map', // 定位方式

        // 第一步---基本信息
        addrList: [],
        addrListTreeProps: {
          value: 'areaId',
          label: 'areaName',
          children: 'areas'
        },
        shopDetail: {
          sort: '',
          industryType: '',
          storeType: '',
          floor: '',
          roomNumber: '',
          merchantName: '',
          shopName: '',
          // contactName: '',
          tel: '',
          email: '',
          province: '',
          provinceId: '',
          city: '',
          cityId: '',
          area: '',
          areaId: '',
          currentAddr: '',
          shopAddress: '',
          shopLogo: '',
          intro: '',
          // 签约有效期起始日期
          contractTimeRange: [],
          type: ''
          // businessLicense: '',
          // identityCardFront: '',
          // identityCardLater: ''
        },
        // 基础信息验证
        shopDetailRule: {
          merchantName: [
            {required: true, message: this.$i18n.t('shopProcess.merchantNameNotEmpty'), trigger: 'blur'},
            {min: 2, max: 10, message: this.$i18n.t('shopProcess.merchantNameErrorTips'), trigger: 'blur'},
            {validator: validEmptyTab, trigger: 'blur'}
          ],
          shopName: [
            {required: true, message: this.$i18n.t('shopProcess.shopNameNotEmpty'), trigger: 'blur'},
            {min: 2, max: 20, message: this.$i18n.t('shopProcess.shopNameInputTips'), trigger: 'blur'},
            {validator: validShopName, trigger: 'blur'}
          ],
          // contactName: [
          //   { required: true, message: '联系人不能为空', trigger: 'blur' },
          //   { min: 2, max: 10, message: '联系人长度在2-10个字符之间', trigger: 'blur' },
          //   { validator: validEmptyTab, trigger: 'blur' }
          // ],
          tel: [
            {required: true, message: this.$i18n.t('shopProcess.telNotEmpty'), trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          email: [
            {required: true, message: this.$i18n.t('shopProcess.emailInputTips'), trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
          ],
          currentAddr: [
            {required: true, message: this.$i18n.t('shopProcess.addrInputTips'), trigger: ['blur', 'change']}
          ],
          shopAddress: [
            {required: true, message: this.$i18n.t('shopProcess.detailAddrNotEmpty'), trigger: 'blur'},
            {validator: validEmptyTab, trigger: 'blur'}
          ],
          floor: [
            {required: true, message: '楼层不能为空', trigger: 'blur'},
            {min: 1, max: 50, message: '长度不能超过50', trigger: 'blur'}
          ],
          roomNumber: [
            {required: true, message: '房号不能为空', trigger: 'blur'},
            {min: 1, max: 50, message: '长度不能超过50', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '请输入排序', trigger: 'blur'},
          ],
          industryType: [
            {required: true, message: '请选择行业类型', trigger: 'change'}
          ],
          storeType: [
            {required: true, message: '请选择店铺类型', trigger: 'change'}
          ],
          // contractTimeRange: [
          //   { required: true, message: '签约有效期不能为空', trigger: 'change' }
          // ],
          // type: [
          //   { required: true, message: '请选择店铺类型', trigger: 'change' }
          // ],
          shopLogo: [
            {required: true, message: this.$i18n.t('shopProcess.logoNotEmpty'), trigger: ['blur', 'change']}
          ]
          // mobileBackgroundPic: [
          //   { required: true, message: this.$i18n.t('shopProcess.mobilePicNotEmpty'), trigger: 'change' }
          // ],
          // pcBackgroundPic: [
          //   { required: true, message: this.$i18n.t('shopProcess.pcPicNotEmpty'), trigger: 'change' }
          // ],
          // businessLicense: [
          //   { required: true, message: this.$i18n.t('shopProcess.businessLicenseNotEmpty'), trigger: 'change' }
          // ],
          // identityCardFront: [
          //   { required: true, message: this.$i18n.t('shopProcess.identityCardFrontNotEmpty'), trigger: 'change' }
          // ],
          // identityCardLater: [
          //   { required: true, message: this.$i18n.t('shopProcess.identityCardLaterNotEmpty'), trigger: 'change' }
          // ]
        },

        // 第二步---工商信息
        shopCompany: {
          creditCode: '',
          firmName: '',
          residence: '',
          representative: '',
          capital: '',
          foundTime: '',
          startTime: '',
          endTime: '',
          businessScope: '',
          businessLicense: '',
          identityCardFront: '',
          identityCardLater: '',
          timeRange: []
        },
        // 成立日期：今日之前可选
        pickerOptions: {
          disabledDate (time) {
            const date = moment().add(0, 'days').startOf('days')
            return (
              time.getTime() >= date.valueOf()
            )
          }
        },
        // 工商信息校验
        shopCompanyRule: {
          creditCode: [
            {required: true, message: this.$i18n.t('shopProcess.creditCodeInputTips'), trigger: 'blur'},
            {validator: vaildCreditCode, trigger: 'blur'}
          ],
          firmName: [
            {required: true, message: this.$i18n.t('shopProcess.firmNameNotEmpty'), trigger: 'blur'},
            {validator: validEmptyTab, trigger: 'blur'}
          ],
          businessScope: [
            {required: true, message: this.$i18n.t('shopProcess.businessScopeNotEmpty'), trigger: 'blur'}
          ],
          timeRange: [
            {required: true, message: this.$i18n.t('shopProcess.businessTimeNotEmpty'), trigger: 'change'}
          ],
          representative: [
            {required: true, message: this.$i18n.t('shopProcess.representativeNotEmpty'), trigger: 'blur'},
            {validator: validEmptyTab, trigger: 'blur'}
          ],
          businessLicense: [
            {required: true, message: this.$i18n.t('shopProcess.businessLicenseNotEmpty'), trigger: 'change'}
          ],
          identityCardFront: [
            {required: true, message: this.$i18n.t('shopProcess.identityCardFrontNotEmpty'), trigger: 'change'}
          ],
          identityCardLater: [
            {required: true, message: this.$i18n.t('shopProcess.identityCardLaterNotEmpty'), trigger: 'change'}
          ]
        },

        // 第三步---签约信息
        signCategoryList: [], // 选中的分类列表
        signBrandList: [], // 选中的品牌列表
        categorySigningList: [], // 签约分类列表
        brandSigningList: [], // 签约品牌列表
        // 签约信息
        contractInfo: {
          // 签约有效期起始日期
          contractTimeRange: [],
          type: 0
        },
        // 基础信息验证
        contractInfoRule: {
          contractTimeRange: [
            {required: true, message: this.$i18n.t('shopProcess.contractValidityNotEmpty'), trigger: 'change'}
          ],
          type: [
            {required: true, message: this.$i18n.t('shopProcess.selectShopType'), trigger: 'change'}
          ]
        },

        // 第四步---财务信息
        bankCartInfoForm: {
          data: [
            {
              bankName: '',
              recipientName: '',
              cardNo: '',
              openingBank: ''
            }
          ],
          rule: {
            bankName: [
              {required: true, message: this.$i18n.t('shopProcess.brandNameNotEmpty'), trigger: 'blur'},
              {min: 2, max: 20, message: this.$i18n.t('shopProcess.brandNameErrorTips'), trigger: 'blur'},
              {validator: validEmptyTab, trigger: 'blur'}
            ],
            recipientName: [
              {required: true, message: this.$i18n.t('shopProcess.recipientNameNotEmpty'), trigger: 'blur'},
              {min: 2, max: 20, message: this.$i18n.t('shopProcess.recipientNameInputTips'), trigger: 'blur'},
              {validator: validEmptyTab, trigger: 'blur'}
            ],
            cardNo: [
              {required: true, message: this.$i18n.t('shopProcess.accountNotEmpty'), trigger: 'blur'},
              // { min: 1, max: 50, message: '账号长度在50个字符以内', trigger: 'blur' },
              {validator: validEmptyTab, trigger: 'blur'},
              {validator: validateCardNo, trigger: 'blur'}
            ],
            openingBank: [
              {required: true, message: this.$i18n.t('shopProcess.openingBankNotEmpty'), trigger: 'blur'},
              {min: 2, max: 20, message: this.$i18n.t('shopProcess.openingBankErrorTips'), trigger: 'blur'},
              {validator: validEmptyTab, trigger: 'blur'}
            ]
          }
        },
        currentCardNoRepeatable: false,

        // 第五步---商家注册信息
        shopUserRegisterInfo: {
          username: '',
          password: '',
          mobile: '',
          validCode: ''
        },
        // 正在获取验证码
        waitingReceive: false,
        // 展示获取验证码按钮
        showGetCodeBtn: true,
        // 验证码倒计时
        count: '',
        timer: '',
        // 商家注册信息校验
        shopUserRegisterRule: {
          username: [
            {required: true, message: this.$i18n.t('sys.usernameNotEmpty'), trigger: 'blur'},
            {validator: vaildUserName, trigger: 'blur'}
          ],
          password: [
            {required: true, message: this.$i18n.t('shopProcess.passwordNotEmpty'), trigger: 'blur'},
            {min: 6, max: 16, message: this.$i18n.t('shopProcess.passwordRule2'), trigger: 'blur'},
            {validator: validatePassword, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: this.$i18n.t('sys.mobilePhoneNoNull'), trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          validCode: [
            {required: true, message: this.$i18n.t('home.capNoNull'), trigger: 'blur'},
            {validator: validEmptyTab, trigger: 'blur'}
          ]
        },

        // 定位
        show: false,
        center: {
          lng: 113.327955,
          lat: 23.136783
        },
        zoom: 18,

        financialInfo: {
          mchNo: '',
          appId: '',
          apiKey: ''
        },
        financialInfoRules: {
          mchNo: [{required: true, message: '商户号不能为空', trigger: 'blur'}],
          appId: [{required: true, message: '应用id不能为空', trigger: 'blur'}],
          apiKey: [{required: true, message: '应用秘钥不能为空', trigger: 'blur'}],
        },
        industryTypeList: [], // 行业类型
        shopTypes: [], // 选中的店铺类型
        shopTypeList: [] // 店铺类型
      }
    },

    mounted () {
      this.show = false
      this.setCenter()
      // 请求地址列表
      this.queryAddressList()
      // 行业类型
      this.getIndustryType()
      // 店铺类型
      this.getShopTypeList()
      //获取所有营业店铺
      this.getShopList()
    },

    methods: {
      // 获取所有营业店铺
      getShopList() {
        this.$http({
          url: this.$http.adornUrl("/platform/shopDetail/getAllShop"),
          method: "get",
          params: this.$http.adornParams(),
        }).then(({ data }) => {
          if(data){
            this.shopDetail.sort = data.length + 1;
          }
        });
      },
      //店铺类型改变
      storeTypeChange(e){
        this.shopDetail.storeType = e.join(',')
      },
      /**
       * 请求地址列表
       */
      queryAddressList () {
        // addrApi.listAreaOfEnable({}).then(data => {
        //   this.addrList = treeDataTranslate(data, 'areaId', 'parentId')
        // })
        this.$http({
          url: this.$http.adornUrl('/admin/area/listAreaOfEnable'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.addrList = data
        })
      },

      /**
       * 监听地址改变
       */
      handleAddrChange (value) {
        if (value.length > 0) {
          const labels = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
          this.shopDetail.province = labels[0]
          this.shopDetail.provinceId = value[0]
          this.shopDetail.city = labels[1]
          this.shopDetail.cityId = value[1]
          this.shopDetail.area = labels[2]
          this.shopDetail.areaId = value[2]
          this.mapLocation(true)
        }
      },

      shopAddressChange () {
        this.mapLocationType = 'address'
      },

      // 获取行业类型
      getIndustryType () {
        let type = 'industry_Type'
        this.$http({
          url: this.$http.adornUrl(`/sys/dictData/getByType/${type}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.industryTypeList = data
        })
      },
      // 获取店铺类型
      getShopTypeList () {
        let type = 'shop_type'
        this.$http({
          url: this.$http.adornUrl(`/sys/dictData/getByType/${type}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.shopTypeList = data
        })
      },

      /** *************** 地图 start *****************/
      /**
       * 初始化地图数据
       */
      setCenter () {
        this.center = null
        this.center = {
          lng: 113.327955,
          lat: 23.136783
        }
        this.zoom = 18
      },
      /**
       * 获取地图移动后回调的位置参数
       */
      syncCenterAndZoom (e) {
        this.mapLocationType = 'map'
        this.setCenter()
        const {lng, lat} = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.shopDetail.shopLng = lng
        this.shopDetail.shopLat = lat
        this.zoom = e.target.getZoom()
        this.isEditAddr = false
      },
      /**
       * 关闭地图说明标签
       */
      infoWindowClose () {
        this.show = false
      },
      /**
       * 打开地图说明标签
       */
      infoWindowOpen () {
        this.show = true
      },
      // 定位地图
      mapLocation (isTrue) {
        let area = ''
        const that = this
        if (isTrue === true) {
          // 选择省市区时，定位地图
          if (this.shopDetail.provinceId) {
            area = this.shopDetail.province
            this.zoom = 6
            if (this.shopDetail.cityId) {
              area = area + this.shopDetail.city
              this.zoom = 10
              if (this.shopDetail.areaId) {
                area = area + this.shopDetail.area
                this.zoom = 14
                if (this.shopDetail.shopAddress !== null) {
                  // 详细地址
                  area = this.shopDetail.province + this.shopDetail.city + this.shopDetail.area + this.shopDetail.shopAddress
                  this.zoom = 18
                }
              }
            }
          }
          this.center = area
        } else {
          // this.center = null
          if (!this.shopDetail.provinceId || !this.shopDetail.cityId || !this.shopDetail.areaId) {
            this.shopDetail.shopAddress = null
            this.$message({
              message: this.$i18n.t('platform.selePCD'),
              type: 'error',
              duration: 1000
            })
            return
          }
          let point = new BMap.Point(this.center.lng, this.center.lat)
          let gc = new BMap.Geocoder()
          if (this.mapLocationType === 'map') {
            gc.getLocation(point, function (rs) {
              that.shopDetail.shopAddress = rs.address.replace(that.shopDetail.province + that.shopDetail.city + that.shopDetail.area, '')
            })
          }

          area = this.shopDetail.province + this.shopDetail.city + this.shopDetail.area + this.shopDetail.shopAddress
          this.center = this.mapLocationType === 'address' ? area : this.center
          this.zoom = 18
        }

        this.isEditAddr = true
      },
      /** *************** 地图 end *****************/

      // 获取签约有效期
      getContractTimeRange (date) {
        this.shopDetail.contractStartTime = date[0]
        this.shopDetail.contractEndTime = date[1]
      },

      /**
       * 营业时间赋值
       */
      handleTimeData (value) {
        this.shopCompany.startTime = value[0]
        this.shopCompany.endTime = value[1]
      },

      /**
       * 注册资本输入框校验
       */
      changeNum () {
        const capital = this.shopCompany.capital
        this.shopCompany.capital = this.checkInput(capital)
        if (Number.parseFloat(this.shopCompany.capital) === 0) {
          this.shopCompany.capital = 0
        }
        if (Number.parseFloat(this.shopCompany.capital) > 99999999) {
          this.shopCompany.capital = 99999999
        }
      },
      /**
       * input输入框只允许输入正数和小数(保留小数点后两位)
       */
      checkInput (num) {
        if (num) {
          var tmpVal = num.replace(/[^\d^\\.]/g, '')
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
       * 输入框不允许输入'-'或'+'
       */
      channelInputLimit (e) {
        const key = e.key
        if (key === '-' || key === '+') {
          e.returnValue = false
          return false
        }
        return true
      },

      /**
       * 获取签约分类列表
       */
      getSignCategoryList (categories) {
        this.signCategoryList = categories
      },

      /**
       * 获取签约品牌列表
       */
      getSignBrandList (brands) {
        this.signBrandList = brands
      },

      /**
       * 增加银行信息项
       */
      addBankInfo () {
        this.$refs['bankCartInfoForm'].validate((valid) => {
          if (!valid) {
            return
          }
          if (this.bankCartInfoForm.data.length < 5) {
            this.bankCartInfoForm.data.push(
              {
                bankName: '',
                recipientName: '',
                cardNo: '',
                openingBank: ''
              }
            )
          } else {
            this.$message({
              message: this.$i18n.t('shopProcess.cardMaxLimitTips'),
              type: 'error',
              duration: 1000
            })
            // this.$message.error('最多可添加5个结算账户')
          }
        })
      },

      /**
       * 删除银行信息项
       * @param {Number} index 索引
       */
      deleteBankInfoItem (index) {
        this.bankCartInfoForm.data.splice(index, 1)
      },

      /**
       * 图片的值发生改变，重新校验对应表单字段
       * @param {*} value 图片地址
       * @param {*} prop 检验字段(规则)
       * @param {*} formName 表单名
       */
      imgChange (value, prop, formName) {
        if (value) {
          // this.$refs['shopDetail'].validateField(prop)
          this.$refs[formName].validateField(prop)
        }
      },

      /**
       * 上一步
       */
      toPrevStep () {
        this.applyStep -= 1
      },

      /**
       * 下一步
       */
      toNextStep () {
        if (this.applyStep === 1) {
          this.shopDetail.storeType = this.shopTypes.join(',')
          // 第一步 基本信息
          this.$refs['shopDetail'].validate((valid) => {
            if (valid) {
              this.applyStep += 1
            }
          })
          return
        }
        if (this.applyStep === 2) {
          // 第二步 工商信息
          this.$refs['shopCompany'].validate((valid) => {
            if (valid) {
              if (!this.shopCompany.businessScope.trim()) {
                this.$message({
                  message: this.$i18n.t('shopProcess.businessScopeNotEmpty'),
                  type: 'error',
                  duration: 1000
                })
                return
              }
              this.applyStep += 1
            }
          })
          return
        }
        if (this.applyStep === 3) {
          // 第三步 签约信息
          this.handleSignedDate()
          return
        }
        if (this.applyStep === 4) {
          // 第四步 财务信息
          this.$refs['financialInfo'].validate((valid) => {
            if (valid) {
              this.applyStep += 1
            }
          })
          return
        }
        if (this.applyStep === 5) {
          // 第五步 注册信息
          this.$refs['shopUserRegisterInfo'].validate((valid) => {
            if (valid) {
              this.createStore()
            }
          })
        }
      },

      /**
       * 校验财务账号是否重复
       */
      verifyDuplicates (row, index) {
        const bankAccounts = this.bankCartInfoForm.data
        if (bankAccounts.find((el, idx) => el.cardNo &&
          row.cardNo &&
          el.cardNo === row.cardNo &&
          idx !== index)) {
          this.currentCardNoRepeatable = true
          this.$refs.bankCartInfoForm.validateField('cardNo')
        } else {
          this.currentCardNoRepeatable = false
          this.$refs.bankCartInfoForm.validateField('cardNo')
        }
      },

      /**
       * 签约数据处理
       */
      handleSignedDate () {
        if (!this.signCategoryList.length) {
          this.$message({
            message: this.$i18n.t('shopProcess.selectCategoryTips'),
            type: 'error',
            duration: 1000
          })
          return
        }
        if (this.signBrandList.length) {
          if (this.signBrandList.find(el => !el.qualifications)) {
            this.$message({
              message: this.$i18n.t('shopProcess.brandAuthorizationNotEmpty'),
              type: 'error',
              duration: 1000
            })
            return
          }
        }
        // 签约信息
        let validContractInfo = true
        this.$refs['contractInfo'].validate((valid) => {
          if (!valid) {
            this.$message({
              message: this.$i18n.t('shopProcess.completeTheContractInfo'),
              type: 'error',
              duration: 1000
            })
            validContractInfo = false
            return
          }
          this.shopDetail.contractTimeRange = this.contractInfo.contractTimeRange
          this.shopDetail.type = this.contractInfo.type
          validContractInfo = true
        })
        if (!validContractInfo) {
          return
        }

        // 分类
        const categories = []
        this.signCategoryList.forEach(el => {
          categories.push({
            categoryId: el.categoryId,
            qualifications: el.qualifications,
            rate: el.customizeRate || '',
            categoryName: el.categoryName,
            parentId: el.parentId
          })
        })
        this.categorySigningList = categories
        // 品牌
        this.signBrandList.forEach(el => {
          el.type = 0 // 类型 0：平台品牌，1：店铺自定义品牌
        })
        this.brandSigningList = this.signBrandList

        this.applyStep += 1
      },

      /**
       * 获取注册验证码
       */
      getRegisterCode () {
        if (this.shopUserRegisterInfo.mobile == null || this.shopUserRegisterInfo.mobile.length === 0) {
          this.$message({
            message: this.$i18n.t('sys.mobilePhoneNoNull'),
            type: 'error',
            duration: 1000
          })
          return
        }
        if (!isMobile(this.shopUserRegisterInfo.mobile)) {
          this.$message({
            message: this.$i18n.t('shopProcess.enterCorrectMobile'),
            type: 'error',
            duration: 1000
          })
          return
        }
        if (this.waitingReceive) {
          return
        }
        this.waitingReceive = true
        this.$http({
          url: this.$http.adornUrl(`/platform/shopDetail/sendCode`),
          method: 'POST',
          data: this.$http.adornData({
            mobile: this.shopUserRegisterInfo.mobile,
            shopAccount: 1 // 是否店铺账号，1是
          })
        }).then(({data}) => {
          this.waitingReceive = false
          const timeCount = 60
          if (!this.timer) {
            this.count = timeCount
            this.showGetCodeBtn = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= timeCount) {
                this.count--
              } else {
                clearInterval(this.timer)
                this.timer = null
                this.showGetCodeBtn = true
              }
            }, 1000)
          }
        }).catch((e) => {
          this.waitingReceive = false
        })
      },

      /**
       * 创建店铺
       */
      createStore () {
        this.$refs['shopUserRegisterInfo'].validate((valid) => {
          if (!valid) {
            return
          }
          let data = {}
          // 去除密码头尾空格

          const shopUserRegisterInfo = JSON.parse(JSON.stringify(this.shopUserRegisterInfo))
          shopUserRegisterInfo.password = encrypt(shopUserRegisterInfo.password.trim())
          data = {
            // 店铺基本信息
            shopDetail: this.shopDetail,
            // 店铺工商信息
            shopCompany: this.shopCompany,
            // 签约分类列表
            categorySigningList: this.categorySigningList,
            // 签约品牌列表
            brandSigningList: this.brandSigningList,
            // 店铺银行卡列表
            // shopBankCardList: this.bankCartInfoForm.data,
            shopMch: this.financialInfo,
            // 商家注册信息
            shopUserRegisterInfo: shopUserRegisterInfo
          }
          this.$http({
            url: this.$http.adornUrl('/platform/shopDetail/createShop'),
            method: 'POST',
            data: data
          }).then(({data}) => {
            this.$message({
              message: this.$i18n.t('shopProcess.shopCreatedSuccessfully'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$router.push('/platform-auditShop')
              }
            })
          })
        })
      }

    }
  }
</script>

<style lang="scss" scoped>
    .shop-process-container {
        width: 100%;
        // height: 100%;
        // min-height: 100vh;
        max-height: auto;
        background: #fff;
        // padding-bottom: 50px;
        .sp-wrapper {
            // width: 1270px;
            width: 100%;
            margin: 0 auto;

            /****** 当前页通用样式 ******/
            .title {
                width: 100%;
                font-size: 22px;
                text-align: center;
                padding: 30px 0 15px;
            }

            .content {
                width: 100%;
                min-width: 1000px;
                // border: 1px solid #EAEAEA;
            }

            .sbi-content.content {
                .footer-box {
                    margin-top: 30px;
                    margin-bottom: 50px;
                    text-align: center;
                }
            }

            // 店铺申请状态
            .status-tips {
                width: 100%;
                height: 38px;
                line-height: 36px;
                padding-left: 15px;
                box-sizing: border-box;

                .text {
                    font-size: 14px;
                    color: #666;
                    padding-left: 10px;
                }
            }

            .submit-status-tips {
                background: #FFF7DD;
                border: 1px solid #FFD888;
                margin-top: 20px;

                .text-icon {
                    color: #ffa900;
                }
            }

            // 失败提示
            .fail-status-tips {
                background: rgba(255, 33, 32, 0.05);
                border: 1px solid #FF2120;
                margin-top: 20px;

                .text-icon {
                    color: #FF2120;
                }
            }

            // 等待审核状态
            .pedding-status-tips {
                background: rgba(24, 144, 255, 0.08);
                border: 1px solid #155bd4;
                margin-top: 20px;

                .text-icon {
                    color: #155bd4;
                }
            }

            // 内容包裹
            .content-wrapper {
                display: block;
                width: 90%;
                margin: 50px auto;
            }

            // 进度条
            .progress-bar {
                display: flex;
                align-items: center;
                justify-content: center;
                // width: 930px;
                width: auto;
                overflow: hidden;
                margin: 30px auto 0;

                .step {
                    position: relative;
                    // width: 315px;
                    width: 200px;

                    .step-item {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 64px;

                        .step-num {
                            position: relative;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 34px;
                            height: 34px;
                            font-size: 14px;
                            font-weight: bold;
                            color: #fff;
                            background: #D2D2D2;
                            text-align: center;
                            border: 4px solid #EFEFEF;
                            border-radius: 50%;
                            margin: 0 auto;
                            z-index: 1;
                        }

                        .step-text {
                            width: 64px;
                            font-size: 16px;
                            color: #999;
                            margin-top: 18px;
                        }
                    }

                    &::after {
                        position: absolute;
                        top: 15px;
                        // left: -190px;
                        left: -178px;
                        content: '';
                        display: block;
                        // width: 260px;
                        width: 210px;
                        height: 6px;
                        background: #F2F2F2;
                    }

                    &:nth-child(1) {
                        &::after {
                            display: none;
                        }
                    }

                    &:nth-child(5) {
                        width: 64px;
                    }
                }

                .active-step {
                    .step-item {
                        .step-text {
                            color: #155bd4;
                        }

                        .step-num {
                            background: #155bd4;
                            border: 4px solid #DEEFFF;
                        }
                    }

                    &::after {
                        background: #C1E1FF;
                    }
                }
            }

            // 国际化 -English
            .progress-bar.en-progress-bar {
                .step {
                    width: 185px;

                    &::after {
                        left: -105px;
                        width: 190px;
                    }

                    .step-item {
                        width: 150px;

                        .step-text {
                            width: 150px;
                            text-align: center;
                        }
                    }
                }

                .step:last-child {
                    .step-item {
                        width: 180px;

                        .step-text {
                            width: 180px;
                        }
                    }
                }
            }

            // 表格上的标题
            .table-data-title {
                display: flex;
                align-items: center;

                .text {
                    font-size: 16px;

                    .stress {
                        color: #FF2120;
                        padding-right: 5px;
                    }
                }

                .tips {
                    font-size: 12px;
                    color: #999;
                    margin-left: 10px;

                    .txt-bold {
                        color: #333;
                    }
                }

                .edit-btn {
                    margin-left: auto;
                    cursor: pointer;
                }
            }

            // 表格
            table {
                border-collapse: collapse;
                width: 100%;
                font-size: 14px;

                .table-title {
                    height: 50px;
                    line-height: 50px;
                    background: #F5F5F5;

                    td {
                        width: 25%;
                        max-width: 0;
                        padding: 0;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;

                        &:nth-child(1) {
                            padding-left: 25px;
                        }
                    }
                }

                .table-item {
                    height: 49px;
                    line-height: 49px;
                    border-bottom: 1px solid #EAEAEA;

                    td {
                        width: 25%;
                        padding: 0;
                        max-width: 0;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;

                        &:nth-child(1) {
                            padding-left: 25px;
                        }
                    }

                    &:nth-child(2n+1) {
                        background: #FAFAFA;
                    }
                }
            }

            // 上一步
            .prev-btn {
                width: 120px;
                height: 40px;
                line-height: 38px;
                font-size: 14px;
                text-align: center;
                border: 1px solid #E8E9EC;
                border-radius: 4px;
                box-sizing: border-box;
                cursor: pointer;
            }

            // 下一步
            .next-btn {
                width: 120px;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color: #fff;
                background: #155bd4;
                text-align: center;
                border-radius: 4px;
                cursor: pointer;
            }

            /****** /当前页通用样式 ******/

            // 0-协议部分
            .shop-agreement {
                .sa-title {
                    width: 100%;
                    font-size: 22px;
                    text-align: center;
                    margin: 30px 0 0;
                }

                .sa-content {
                    width: 100%;
                    height: 517px;
                    padding: 30px 33px 25px;
                    border: 1px solid #EAEAEA;
                    box-sizing: border-box;
                    overflow-y: scroll;
                    margin-top: 30px;
                    /* 谷歌隐藏滚动条 */
                    &::-webkit-scrollbar {
                        display: none;
                    }

                    /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
                    /* IE隐藏滚动条 */
                    -ms-overflow-style: none;
                    /* 火狐隐藏滚动条 */
                    overflow: -moz-scrollbars-none;
                }

                .sa-checkbox {
                    display: flex;
                    justify-content: center;
                    margin-top: 30px;
                    cursor: pointer;

                    .text {
                        font-size: 14px;
                        color: #000;

                        .flag {
                            color: #57A3E9;
                        }
                    }
                }

                .next-btn {
                    height: 45px;
                    line-height: 45px;
                    font-size: 16px;
                    margin: 50px auto 0;
                }
            }

            // 1-填写基本信息
            .shop-base-info {
                .ci-wrapper {
                    .left-info {
                        & > > > .el-date-editor--daterange.el-input,
                        .el-date-editor--daterange.el-input__inner,
                        .el-date-editor--timerange.el-input,
                        .el-date-editor--timerange.el-input__inner,
                        .el-cascader {
                            width: 100%;
                        }
                    }
                }
            }

            .shop-base-info.en-base-info {
                .upload-img {
                    & > > > .el-form-item.is-error {
                        margin-bottom: 45px;
                    }
                }
            }

            .btn {
                display: block;
                text-align: center;
                margin-bottom: 30px;
                margin-top: 20px;

                .next-btn {
                    display: inline-block;
                }
            }

            // 2-填写营业信息
            .company-info {
                // display: flex;
                margin-top: 50px;

                .ci-wrapper {
                    display: flex;
                    justify-content: center;
                    // 营业期限
                    & > > > .business-term.el-range-editor.el-input__inner {
                        width: 100%;

                        .el-range-separator {
                            width: 8%;
                        }
                    }

                    .left-info {
                        width: 40%;
                        min-width: 450px;

                        .price-unit-text {
                            font-size: 14px;
                            color: #666;
                            margin-left: 15px;
                        }

                        .capital-int {
                            & > > > .el-input__inner {
                                padding-right: 0;
                            }
                        }
                    }

                    .right-info {
                        width: 40%;
                        min-width: 450px;
                        margin-left: 30px;

                        .business-license-box {
                            .license-content {
                                display: flex;

                                & .single-image-upload {
                                    height: 130px;

                                    & > > > .el-upload-list--picture-card .el-upload-list__item {
                                        width: 130px;
                                        height: 130px;
                                        margin: 0;
                                    }
                                }
                            }
                        }

                        .id-box {
                            .upload-content {
                                .upload-img {
                                    display: flex;

                                    div {
                                        &:nth-child(2) {
                                            margin-left: 20px;
                                        }
                                    }

                                    .disabled-upload {
                                        & > > > .el-upload {
                                            background: #f5f7fa;
                                        }
                                    }

                                    & .single-image-upload {
                                        height: 130px;

                                        & > > > .el-upload-list--picture-card .el-upload-list__item {
                                            width: 130px;
                                            height: 130px;
                                            margin: 0;
                                        }
                                    }
                                }

                                .upload-example {
                                    display: flex;
                                    // margin-top: 15px;
                                    // margin-left: 120px;
                                    .example-box {
                                        margin-left: 0;

                                        &:nth-child(2) {
                                            margin-left: 20px;
                                        }
                                    }
                                }

                                .upload-tips {
                                    // margin-left: 120px;
                                }
                            }
                        }

                        .img-static {
                            display: block;
                            width: 130px;
                            height: 130px;
                            cursor: pointer;
                        }

                        .img-static:not(:first-child) {
                            margin-left: 20px;
                        }

                        // 示例框
                        .example-box {
                            position: relative;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 130px;
                            height: 130px;
                            background: #FFFFFF;
                            border: 1px solid #EAEAEA;
                            border-radius: 3px;
                            box-sizing: border-box;
                            margin-left: 20px;

                            img {
                                display: block;
                                width: auto;
                                max-width: 100%;
                                height: auto;
                                max-height: 100%;
                            }

                            .tips {
                                position: absolute;
                                left: -1px;
                                bottom: 0;
                                width: 130px;
                                height: 20px;
                                line-height: 20px;
                                font-size: 12px;
                                color: #fff;
                                background: rgba(51, 51, 51, 0.5);
                                text-align: center;
                                border-radius: 0px 0px 3px 3px;
                            }
                        }

                        .upload-tips {
                            font-size: 12px;
                            color: #999;
                            height: 16px;
                            line-height: 20px;
                            margin-top: 5px;
                            margin-bottom: 5px;
                        }

                        // 图片上传框样式修改
                        & > > > .el-upload {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 130px;
                            height: 130px;
                            background: #FFFFFF;
                            border: 1px solid #EAEAEA;
                            border-radius: 3px;
                            box-sizing: border-box;

                            img {
                                width: 100%;
                            }

                            .el-icon-plus {
                                font-size: 22px;
                                color: #EAEAEA;
                            }
                        }

                        // 背景图
                        .bg-img {
                            display: flex;
                            justify-content: flex-start;

                            .business-license-box {
                                margin-right: 20px;

                                .img-tips {
                                    display: block;
                                    text-align: center;
                                    font-size: 12px;
                                    color: #666;
                                    line-height: 1.5em;
                                    margin-top: 8px;

                                    p {
                                        margin: 0;
                                        padding: 0;
                                    }
                                }
                            }
                        }
                    }
                }

                .footer {
                    display: block;
                    width: 100%;

                    .btn-box {
                        display: flex;
                        justify-content: center;
                        // margin-left: 134px;
                        margin-bottom: 30px;
                        margin-top: 10px;

                        .prev-btn {
                            margin-right: 13px;
                        }
                    }
                }
            }

            // 3-选择签约信息
            .signing-content {
                .s-category-item {
                    margin-bottom: 30px;
                }

                .s-item {
                    .si-content {
                        margin-top: 12px;
                    }
                }

                .contract-info.s-item {
                    margin-top: 40px;
                }
            }

            // 4-财务信息
            .finance-info {
                .edit-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 80px;
                    box-sizing: border-box;

                    .plus {
                        font-size: 23px;
                        padding-right: 5px;
                    }
                }

                .fi-content {
                    position: relative;
                    // min-height: 500px;
                    margin-top: 12px;

                    .add-bank-info-table {
                        // 去除表格线
                        & > > > .el-table__row > td {
                            border: none;
                        }

                        & > > > td.el-table_1_column_6 {
                            i {
                                font-size: 22px;
                                cursor: pointer;
                            }
                        }

                        & > > > .el-form-item {
                            margin-top: 15px;
                            margin-bottom: 15px;
                        }
                    }

                    // 去除表格下边框
                    & > > > .el-table::before {
                        height: 0;
                    }

                    .show-table {
                        tr {
                            border-bottom: 1px solid #EAEAEA;
                        }

                        .table-title,
                        .table-item {
                            td {
                                &:nth-child(1) {
                                    width: 170px;
                                }

                                &:nth-child(2) {
                                    width: 250px;
                                }

                                &:nth-child(3) {
                                    width: 320px;
                                }

                                &:nth-child(4) {
                                    width: 270px;
                                }

                                &:nth-child(5) {
                                    width: 160px;
                                    padding-right: 40px;
                                    text-align: right;
                                }
                            }
                        }
                    }

                    .btn-box {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: -20px;
                        display: flex;
                        justify-content: center;
                        // margin-left: -126px;
                        .prev-btn:not(:last-child) {
                            margin-right: 15px;
                        }
                    }
                }

                & > > > .el-table th {
                    background: #F5F5F5;
                    height: 50px;
                }

                // 移除icon
                .el-icon-remove-outline::before {
                    font-size: 20px;
                    cursor: pointer;
                }
            }

            // 注册信息
            .register-info {
                display: block;
                width: 450px;
                // height: 300px;
                margin: 0 auto;
                margin-top: 80px;

                .mobile-box {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    color: #606266;

                    .mobile-int {
                        & > > > .el-input__inner {
                            border-radius: 4px 0 0 4px;
                        }
                    }

                    .mobile-btn {
                        cursor: pointer;
                    }
                }
            }

        }

        .map {
            width: 100%;
            height: 300px;
        }
    }
</style>
