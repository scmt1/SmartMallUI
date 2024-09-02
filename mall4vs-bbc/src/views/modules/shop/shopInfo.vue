<template>
    <div class="app-container shop-detail">
        <!-- <div class="head-title">{{$t('shopProcess.merchantDetail')}}</div> -->
        <!-- 导航栏 -->
        <div class="nav-box">
            <div class="nav">
                <div :class="['nav-item', navStatus === 0 ? 'active' : '']" @click="switchNav(0)">{{ $t('shopProcess.basicInfo') }}</div>
                <div :class="['nav-item', navStatus === 1 ? 'active' : '']" @click="switchNav(1)">{{ $t('shopProcess.businessInfo') }}</div>
                <div :class="['nav-item', navStatus === 2 ? 'active' : '']" @click="switchNav(2)">{{ $t('shopProcess.signUpInfo') }}</div>
                <div :class="['nav-item', navStatus === 3 ? 'active' : '']" @click="switchNav(3)">{{ $t('shopProcess.financeInfo') }}</div>
            </div>
        </div>
        <!-- 模块 -->
        <div class="shop-info-box">
            <!-- 基本信息 -->
            <div v-if="navStatus === 0" class="basic-info-mod">

                <!-- 店铺审核状态 -->
                <div class="audit-status">
                    <!-- status 0 未审核 1已通过 -1未通过 2平台下线 3 平台下线待审核 -->
                    <!-- shopStatus 店铺状态(-1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:店铺申请中 5.审核失败) -->
                    <div v-if="shopAuditStatus" class="audit-item">
                        <span>{{ $t('shopProcess.auditStatus') }}：</span>
                        <span v-if="shopAuditStatus.status === -1">{{ $t('shop.failed') }}</span>
                        <span v-if="shopAuditStatus.status === 0">{{ $t('shop.unreviewed') }}</span>
                        <span v-if="shopAuditStatus.status === 1">{{ $t('shop.passed') }}</span>
                        <span v-if="shopAuditStatus.status === 2">{{ $t('shop.platformOffline') }}</span>
                    </div>
                    <div v-if="shopBasicInfo" class="audit-item">
                        <span>{{ $t('shopProcess.accountStatus') }}：</span>
                        <span v-if="shopBasicInfo.accountStatus === 0">{{ $t('shopProcess.disable') }}</span>
                        <span v-if="shopBasicInfo.accountStatus === 1">{{ $t('shopProcess.enable') }}</span>
                        <span v-if="shopBasicInfo.accountStatus === -1">{{ $t('shopProcess.delete') }}</span>
                    </div>
                    <div v-if="shopBasicInfo" class="audit-item">
                        <span>{{ $t('shopProcess.shopStatus') }}：</span>
                        <span v-if="shopBasicInfo.shopStatus === -1">{{ $t('shopProcess.deleted') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 0">{{ $t('shopProcess.closed') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 1">{{ $t('shopProcess.inOperation') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 2">{{ $t('shop.platformOffline') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 3">{{ $t('shopProcess.onlinePendingReview') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 4">{{ $t('shopProcess.shopApplication') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 5">{{ $t('shopProcess.storeOpenPendingReview') }}</span>
                    </div>
                    <div
                        v-if="isAuth('shop:shopDetail:applyOnline') && shopBasicInfo.shopStatus === 2"
                        class="default-btn primary-btn"
                        @click="offlineManageHandle"
                    >
                        {{ $t('shopProcess.applyOnline') }}
                    </div>
                    <!-- <el-button v-if="shopBasicInfo.shopStatus === 2 " size="medium" type="primary" @click="offlineManageHandle">申请上线</el-button> -->
                </div>

                <!-- 基本信息浏览页面 -->
                <shopInfo-browsing
                    v-if="isShopInfoBrowsing"
                    @closeBrowse="isShopInfoBrowsing = !isShopInfoBrowsing"
                >
                </shopInfo-browsing>
                <!-- 基本信息 -->
                <div class="business-info-mod-wrap" v-if="!isShopInfoBrowsing">
                    <div class="business-info-mod">
                        <el-form ref="shopBasicInfo" label-width="140px" :model="shopBasicInfo" :rules="shopBasicInfoRules" size="small">
                            <div class="ci-wrapper">
                                <div class="left-info">
                                    <!-- 店铺logo -->
                                    <el-form-item :label="this.$i18n.t('shopProcess.logo')" prop="shopLogo">
                                        <div class="business-license-box">
                                            <div class="license-content">
                                                <img-upload v-model="shopBasicInfo.shopLogo"/>
                                            </div>
                                            <div class="upload-tips">仅限jpg、png大小不超过2M，仅限上传1张，建议图片尺寸为800*800</div>
                                        </div>
                                    </el-form-item>
                                    <!-- 店铺顶部图 -->
                                    <el-form-item label="店铺顶部图">
                                        <div class="business-license-box">
                                            <div class="license-content">
                                                <img-upload v-model="shopBasicInfo.shopTopImg"/>
                                            </div>
                                            <div class="upload-tips">仅限jpg、png大小不超过2M，仅限上传1张，建议图片尺寸为1126*410</div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.merchantName')" prop="merchantName">
                                        <p class="txt">
                                            <el-input
                                                v-model="shopBasicInfo.merchantName"
                                                :placeholder="this.$i18n.t('shopProcess.merchantNameInputTips')"
                                                maxlength="10"
                                                @blur="
                          shopBasicInfo.merchantName =
                          shopBasicInfo.merchantName ?
                          removeHeadAndTailSpaces(shopBasicInfo.merchantName) :
                          shopBasicInfo.merchantName
                        "
                                            />
                                        </p>
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.shopName')" prop="shopName">
                                        <p class="txt">
                                            <el-input
                                                v-model="shopBasicInfo.shopName"
                                                :placeholder="this.$i18n.t('shopProcess.shopNameInputTips')"
                                                maxlength="20"
                                                @blur="
                          shopBasicInfo.shopName =
                          shopBasicInfo.shopName ?
                          removeHeadAndTailSpaces(shopBasicInfo.shopName) :
                          shopBasicInfo.shopName
                        "
                                            />
                                        </p>
                                    </el-form-item>
                                    <el-form-item label="行业类型" prop="industryType">
                                        <el-select style="width: 100%;" disabled v-model="shopBasicInfo.industryType"
                                                   placeholder="请选择行业类型">
                                            <el-option v-for="(item,index) in industryTypeList"
                                                       :key="index"
                                                       :label="item.title"
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="店铺类型" prop="storeType">
                                        <el-select style="width: 100%;" v-model="shopTypes" multiple placeholder="请选择店铺类型">
                                            <el-option
                                                    v-for="(item,index) in shopTypeList"
                                                    :key="index"
                                                    :label="item.title"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- <el-form-item label="联系人" prop="contactName">
                                      <p class="txt">
                                        <el-input v-model="shopBasicInfo.contactName" placeholder="请输入常用联系人姓名" maxlength="10" />
                                      </p>
                                    </el-form-item> -->
                                    <el-form-item :label="this.$i18n.t('shopProcess.tel')" prop="tel">
                                        <p class="txt">
                                            <el-input v-model="shopBasicInfo.tel" :placeholder="this.$i18n.t('shopProcess.telInputTips')"/>
                                        </p>
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.receiveMobile')" prop="receiveMobile">
                                        <p class="txt">
                                            <el-input v-model="shopBasicInfo.receiveMobile" :placeholder="this.$i18n.t('shopProcess.receiveMobileTips')" maxlength="11"/>
                                        </p>
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.email')" prop="email">
                                        <p class="txt">
                                            <el-input v-model="shopBasicInfo.email" :placeholder="this.$i18n.t('shopProcess.emailInputTips')" maxlength="30"/>
                                        </p>
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.addr')" prop="currentAddr">
                                        <p class="txt">
                                            <el-cascader
                                                ref="cascaderAddr"
                                                v-model="shopBasicInfo.currentAddr"
                                                :options="addrList"
                                                :props="addrListTreeProps"
                                                :placeholder="this.$i18n.t('shopProcess.addrInputTips')"
                                                @change="handleAddrChange"
                                            />
                                        </p>
                                    </el-form-item>
                                    <el-form-item :label="this.$i18n.t('shopProcess.detailAddr')" prop="shopAddress">
                                        <el-input
                                            v-model="shopBasicInfo.shopAddress"
                                            :placeholder="this.$i18n.t('shopProcess.detailAddrInputTips')"
                                            maxlength="50"
                                            @blur="
                        shopBasicInfo.shopAddress =
                        shopBasicInfo.shopAddress ?
                        removeHeadAndTailSpaces(shopBasicInfo.shopAddress) :
                        shopBasicInfo.shopAddress; shopAddressChange()
                      "
                                        >
                                            <el-button slot="append" icon="el-icon-location" @click="mapLocation">{{ $t('admin.location') }}</el-button>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="楼层" prop="floor">
                                        <el-input
                                            v-model="shopBasicInfo.floor"
                                            placeholder="请输入楼层"
                                            maxlength="50"
                                        >
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="房号" prop="roomNumber">
                                        <el-input
                                            v-model="shopBasicInfo.roomNumber"
                                            placeholder="请输入房号"
                                            maxlength="50"
                                        >
                                        </el-input>
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
                                            @ready="handler"
                                        >
                                            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                                            <bm-marker :position="center" :dragging="false" @click="infoWindowOpen">
                                                <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen">{{ $t('shop.storeLocation') }}
                                                </bm-info-window>
                                            </bm-marker>
                                        </baidu-map>
                                    </el-form-item>

                                    <el-form-item :label="this.$i18n.t('shopProcess.intro')" prop="intro">
                                        <el-input
                                            v-model="shopBasicInfo.intro"
                                            type="textarea"
                                            :rows="4"
                                            class="store-intro"
                                            maxlength="200"
                                            :placeholder="this.$i18n.t('shopProcess.introInput')"
                                            @blur="
                        shopBasicInfo.intro =
                        shopBasicInfo.intro ?
                        removeHeadAndTailSpaces(shopBasicInfo.intro) :
                        shopBasicInfo.intro
                      "
                                        />
                                    </el-form-item>
                                    <el-form-item label="是否开启小票积分">
                                        <el-switch
                                            v-model="shopBasicInfo.isTicketScore"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            :active-value="1"
                                            :inactive-value="0"
                                            :disabled="!shopBasicInfo.ticketField"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </div>

                                <div class="right-info">
                                    <!-- 背景图 -->
                                    <!-- <div class="bg-img">
                                      <div class="business-license-box">
                                        <el-form-item :label="this.$i18n.t('shopProcess.backgroundPic')" prop="mobileBackgroundPic">
                                          <div class="license-content">
                                            <img-upload v-model="shopBasicInfo.mobileBackgroundPic" />
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
                                            <img-upload v-model="shopBasicInfo.pcBackgroundPic" />
                                          </div>
                                          <div class="img-tips">
                                            <p>{{ $t('shopProcess.pcBackgroundPic') }}</p>
                                            <p>{{ $t('shopProcess.pcPicTips') }}</p>
                                          </div>
                                        </el-form-item>
                                      </div>
                                    </div> -->
                                    <!-- 营业执照电子版 -->
                                    <!-- <el-form-item :label="this.$i18n.t('shopProcess.businessLicense')" prop="businessLicense">
                                      <div class="business-license-box">
                                        <div class="license-content">
                                          <img-upload v-model="shopBasicInfo.businessLicense" />
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
                                            <img-upload v-model="shopBasicInfo.identityCardFront" />
                                          </el-form-item>
                                          <el-form-item class="idcard" label-width="0" prop="identityCardLater">
                                            <img-upload v-model="shopBasicInof.identityCardLater" />
                                          </el-form-item>
                                        </div>
                                        <div :class="lang === 'en' ? 'en-left' : 'zh-left'">
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
                                      </div>
                                    </div> -->
                                </div>
                            </div>
                        </el-form>
                    </div>
                    <div class="footer">
                        <div class="foot-box">
                            <div v-if="isAuth('shop:shopDetail:save')" class="btn default-btn primary-btn" @click="validationShopBasicInfo">
                                {{ $t('shopProcess.saveBasicInfo') }}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- /基本信息 -->

            <!-- 工商信息 -->
            <business-information-browse
                v-if="navStatus === 1 && isbusinessInformationBrowse"
                @closeBusinessBrowse="closeBusinessBrowse"
            >
            </business-information-browse>
            <!-- 编辑页 -->
            <div v-if="navStatus === 1 && !isbusinessInformationBrowse">
                <div class="business-info-mod">
                    <el-form
                        ref="companyInfoForm"
                        :model="companyInfoForm"
                        :rules="companyInfoRule"
                        label-width="140px"
                        size="small"
                    >
                        <div class="ci-wrapper">
                            <div class="left-info">
                                <el-form-item :label="this.$i18n.t('shopProcess.creditCode')" prop="creditCode">
                                    <el-input v-model="companyInfoForm.creditCode" maxlength="20" :placeholder="this.$i18n.t('shopProcess.creditCodeInputTips')"/>
                                </el-form-item>
                                <el-form-item :label="this.$i18n.t('shopProcess.firmName')" prop="firmName">
                                    <el-input
                                        v-model="companyInfoForm.firmName"
                                        maxlength="50"
                                        :placeholder="this.$i18n.t('shopProcess.firmNameInputTips')"
                                        @blur="
                      companyInfoForm.firmName =
                      companyInfoForm.firmName ?
                      removeHeadAndTailSpaces(companyInfoForm.firmName) :
                      companyInfoForm.firmName
                    "
                                    />
                                </el-form-item>
                                <el-form-item :label="this.$i18n.t('shopProcess.residence')" prop="residence">
                                    <el-input
                                        v-model="companyInfoForm.residence"
                                        maxlength="50"
                                        :placeholder="this.$i18n.t('shopProcess.residenceInputTips')"
                                        @blur="
                      companyInfoForm.residence =
                      companyInfoForm.residence ?
                      removeHeadAndTailSpaces(companyInfoForm.residence) :
                      companyInfoForm.residence
                    "
                                    />
                                </el-form-item>
                                <el-form-item :label="this.$i18n.t('shopProcess.representative')" prop="representative">
                                    <el-input
                                        v-model="companyInfoForm.representative"
                                        maxlength="20"
                                        :placeholder="this.$i18n.t('shopProcess.representativeInputTips')"
                                        @blur="
                      companyInfoForm.representative =
                      companyInfoForm.representative ?
                      removeHeadAndTailSpaces(companyInfoForm.representative) :
                      companyInfoForm.representative
                    "
                                    />
                                </el-form-item>
                                <el-form-item :label="this.$i18n.t('shopProcess.capital')" class="capital-int">
                                    <el-input
                                        v-model="companyInfoForm.capital"
                                        prop="capital"
                                        type="number"
                                        :min="0"
                                        :max="99999999"
                                        @blur="changeNum"
                                        @keydown.native="channelInputLimit"
                                    >
                                        <el-button slot="append">{{ $t('shopProcess.tenThousandYuan') }}</el-button>
                                    </el-input>
                                    <!-- <span class="price-unit-text">{{$t("shopProcess.tenThousandYuan")}}</span> -->
                                </el-form-item>
                                <el-form-item :label="this.$i18n.t('shopProcess.fountTime')" prop="foundTime">
                                    <el-date-picker
                                        v-model="companyInfoForm.foundTime"
                                        type="date"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        :placeholder="this.$i18n.t('admin.seleData')"
                                        :picker-options="pickerOptions"
                                    />
                                </el-form-item>
                                <el-form-item :label="this.$i18n.t('shopProcess.businessTime')" prop="timeRange">
                                    <el-date-picker
                                        v-model="companyInfoForm.timeRange"
                                        type="daterange"
                                        :range-separator="this.$i18n.t('time.tip')"
                                        :start-placeholder="this.$i18n.t('shopProcess.startTime')"
                                        :end-placeholder="this.$i18n.t('shopProcess.endTime')"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        @change="handleTimeData"
                                        :clearable="false"
                                    />
                                </el-form-item>
                                <el-form-item :label="this.$i18n.t('shopProcess.businessScope')" prop="businessScope" style="margin-bottom:30px;">
                                    <el-input
                                        v-model="companyInfoForm.businessScope"
                                        type="textarea"
                                        resize="none"
                                        :rows="4"
                                        :placeholder="this.$i18n.t('shopProcess.businessScopeInputTips')"
                                        maxlength="500"
                                        @blur="
                      companyInfoForm.businessScope =
                      companyInfoForm.businessScope ?
                      removeHeadAndTailSpaces(companyInfoForm.businessScope) :
                      companyInfoForm.businessScope
                    "
                                    />
                                </el-form-item>
                            </div>
                            <div class="right-info">
                                <!-- 还没添加数据 -->
                                <!-- 营业执照电子版 -->
                                <el-form-item :label="this.$i18n.t('shopProcess.businessLicense')" prop="businessLicense">
                                    <div class="business-license-box">
                                        <div class="license-content">
                                            <img-upload v-model="companyInfoForm.businessLicense"/>
                                            <div class="example-box">
                                                <img src="~@/assets/img/example-img/Business-license.png">
                                                <div class="tips">{{ $t('shopProcess.example') }}</div>
                                            </div>
                                        </div>
                                        <div class="upload-tips">{{ $t('shopProcess.logoTips') }}</div>
                                    </div>
                                </el-form-item>
                                <!-- 法人身份证 -->
                                <div class="id-box">
                                    <div class="upload-content">
                                        <div class="upload-img">
                                            <el-form-item class="idcard" :label="this.$i18n.t('shopProcess.corporateIdentityCard')" prop="identityCardFront">
                                                <img-upload v-model="companyInfoForm.identityCardFront"/>
                                            </el-form-item>
                                            <el-form-item class="idcard" label-width="0" prop="identityCardLater">
                                                <img-upload v-model="companyInfoForm.identityCardLater"/>
                                            </el-form-item>
                                        </div>
                                        <div :class="lang === 'en' ? 'en-left' : 'zh-left'">
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
                                    </div>
                                </div>

                            </div>

                        </div>
                    </el-form>
                </div>
                <div v-if="navStatus === 1" class="footer">
                    <div class="foot-box">
                        <div
                            v-if="isAuth('shop:shopCompany:save')"
                            class="btn default-btn primary-btn"
                            @click="submitBusinessReview"
                        >{{ $t('shopProcess.saveSubmit') }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- /工商信息 -->

            <!-- 签约信息 -->
            <div v-if="navStatus === 2" class="contract-info table-box">
                <!-- 签约类目 -->
                <div class="s-category-item s-item">
                    <div class="apply-sign">
                        <div class="table-data-title">
                            <div class="text"><span class="stress">*</span>{{ $t('shopProcess.signingCategory') }}</div>
                            <div class="tips">
                                {{ $t('shopProcess.preSigned') }}
                                <span class="txt-bold">{{ signCategoryList.length }}</span>
                                {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}，
                                {{ $t('shopProcess.application') }}
                                <span class="txt-bold">{{ applyingCategoryNum }}</span>
                                {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}，
                                {{ $t('shopProcess.mostAdd') }}
                                <span class="txt-bold">200</span>
                                {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}
                            </div>
                        </div>
                        <div>
                            <div
                                v-if="showSignCategoriesBtn && isAuth('shop:shopCategory:apply')"
                                class="default-btn primary-btn apply-btn"
                                @click="addOrUpdateHandle(1)"
                            >{{ $t('shopProcess.applySigningCategory') }}
                            </div>
                            <div
                                v-if="signCategoriesApplyInfo && (signCategoriesApplyInfo.status === 0 || signCategoriesApplyInfo.status === -1)"
                                class="default-btn apply-btn"
                                @click="viewSignApply(1, signCategoriesApplyInfo)"
                            >{{ $t('shopProcess.seeApplySigningCategory') }}
                            </div>
                        </div>
                    </div>
                    <div class="si-content">
                        <el-table
                            :data="signCategoryList"
                            header-cell-class-name="table-header"
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="name"
                                :label="this.$i18n.t('shopProcess.categoryName')"
                            />
                            <el-table-column
                                prop="parentName"
                                :label="this.$i18n.t('shopProcess.parentCategoryName')"
                            />
                            <el-table-column
                                prop="platformRate"
                                :label="this.$i18n.t('shopProcess.categoryRate')"
                            >
                                <template slot-scope="{ row }">
                                    <div v-if="row.customizeRate || row.customizeRate === 0 || row.platformRate || row.platformRate === 0">
                                        <span v-if="row.customizeRate === null">{{ row.platformRate }} %</span>
                                        <span v-else>{{ row.customizeRate }} %</span>
                                    </div>
                                    <div v-else>--</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="qualifications"
                                :label="this.$i18n.t('shopProcess.categoryQualifications')"
                            >
                                <template slot-scope="{row}">
                                    <div v-if="row.imgs.length" class="img-box">
                                        <el-image
                                            v-for="(img,index) in row.imgs"
                                            :key="index"
                                            class="rotating-img"
                                            :src="img"
                                            :preview-src-list="row.imgs"
                                        />
                                        <!-- <img
                                          v-for="(item, index) in row.imgs"
                                          :key="index"
                                          :src="item.indexOf('http')===-1 ? resourcesUrl + item : item"
                                          @click="picturePreview(item)"
                                        > -->
                                    </div>
                                    <span v-else>--</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="categoryStatus"
                                :label="this.$i18n.t('shopProcess.categoryStatus')"
                            >
                                <template slot-scope="scope">
                                    <div v-if="scope.row.categoryStatus === 1" class="tag-txt">{{ $t('publics.normal') }}</div>
                                    <div v-if="scope.row.categoryStatus === 0" class="tag-txt red-tag-txt">{{ $t('publics.LowerShelf') }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$i18n.t('crud.menu')"
                                width="100"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button type="text" @click="categoryDelete(scope.row)">{{ $i18n.t('crud.delBtn') }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <!-- 签约品牌 -->
                <div class="s-brand-item s-item">
                    <div class="apply-sign">
                        <div class="table-data-title">
                            <div class="text">{{ $t('shopProcess.signingBrand') }}</div>
                            <div class="tips">
                                {{ $t('shopProcess.preSigned') }}
                                <span class="txt-bold">{{ signedBrands.length }}</span>
                                {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}，
                                {{ $t('shopProcess.application') }}
                                <span class="txt-bold">{{ applyingBrandNum }}</span>
                                {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}，
                                {{ $t('shopProcess.mostAdd') }}
                                <span class="txt-bold">50</span>
                                {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}
                            </div>
                        </div>
                        <div>
                            <div
                                v-if="showSignBrandsBtn && isAuth('shop:shopBrand:apply')"
                                class="default-btn primary-btn apply-btn"
                                @click="addOrUpdateHandle(2)"
                            >{{ $t('shopProcess.applySigningBrand') }}
                            </div>
                            <div
                                v-if="signBrandsApplyInfo && (signBrandsApplyInfo.status === 0 || signBrandsApplyInfo.status === -1)"
                                class="default-btn apply-btn"
                                @click="viewSignApply(2, signBrandsApplyInfo)"
                            >{{ $t('shopProcess.seeApplySigningBrand') }}
                            </div>
                        </div>
                    </div>
                    <div class="si-content main-container">
                        <div class="table-con">
                            <el-table
                                :data="signedBrands"
                                header-cell-class-name="table-header"
                                style="width: 100%"
                            >
                                <!-- height="284" -->
                                <el-table-column
                                    prop="name"
                                    :label="this.$i18n.t('shopProcess.brandName')"
                                >
                                    <template slot-scope="scope">
                                        <span class="table-cell-text">{{ scope.row.name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="firstLetter"
                                    :label="this.$i18n.t('shopProcess.firstLetter')"
                                />
                                <el-table-column
                                    prop="platformRate"
                                    :label="this.$i18n.t('shopProcess.brandLogo')"
                                >
                                    <template slot-scope="scope">
                                        <div class="brand-logo">
                                            <el-image
                                                v-if="scope.row.imgUrl"
                                                class="rotating-img"
                                                :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"
                                                :preview-src-list="[scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl]"
                                            />
                                            <!-- <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"> -->
                                            <span v-else>--</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="imgs"
                                    :label="this.$i18n.t('shopProcess.brandQualifications')"
                                >
                                    <template slot-scope="{row}">
                                        <div v-if="row.imgs.length" class="brand-logo">
                                            <el-image
                                                v-for="(img,index) in row.imgs"
                                                :key="index"
                                                class="rotating-img"
                                                :src="img"
                                                :preview-src-list="row.imgs"
                                            />
                                        </div>
                                        <div v-if="!row.imgs.length">--</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="brandStatus"
                                    :label="this.$i18n.t('shopProcess.brandStatus')"
                                >
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.brandStatus === 1" class="tag-txt">{{ $t('publics.normal') }}</div>
                                        <div v-if="scope.row.brandStatus === 0" class="tag-txt red-tag-txt">{{ $t('publics.LowerShelf') }}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    :label="$i18n.t('crud.menu')"
                                    width="100"
                                    align="center"
                                >
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="brandDelete(scope.row)">{{ $i18n.t('crud.delBtn') }}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <!-- 签约有效期 -->
                <div v-if="contractTimeRange.length" class="s-sign-item s-item">
                    <div class="table-data-title">
                        <div class="text"><span class="stress">*</span>{{ $t('shopProcess.validityPeriodOfContract') }}</div>
                        <div class="tips">{{ $t('shopProcess.validPeriod') }}</div>
                    </div>
                    <div class="si-content">
                        <div>
                            <el-date-picker
                                v-model="contractTimeRange"
                                disabled
                                type="daterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :range-separator="this.$i18n.t('time.tip')"
                                :start-placeholder="this.$i18n.t('shopProcess.startTime')"
                                :end-placeholder="this.$i18n.t('shopProcess.endTime')"
                                size="small"
                            />
                        </div>
                    </div>
                </div>
                <!-- 商家类型 -->
                <div class="s-sign-item s-item">
                    <div class="table-data-title">
                        <div class="text"><span class="stress">*</span>{{ $t('shopProcess.shopType') }}</div>
                    </div>
                    <div class="si-content">
                        <div>
                            <el-radio v-model="shopBasicInfo.type" disabled :label="0">{{ $t('shopProcess.ordinaryShop') }}</el-radio>
                            <el-radio v-model="shopBasicInfo.type" disabled :label="1">{{ $t('shopProcess.preferredGoodShop') }}</el-radio>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /签约信息 -->

            <!-- 财务信息 -->
            <div v-if="navStatus === 3" class="financial-info">
                <el-form ref="financialInfo" label-width="140px" :model="financialInfo" :rules="financialInfoRules" size="small">
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
                <div class="footer">
                    <div class="foot-box">
                        <div class="btn default-btn primary-btn" @click="validationShopMchInfo">{{ $t('shopProcess.saveBasicInfo') }}</div>
                    </div>
                </div>
            </div>
            <!-- /财务信息 -->

        </div>

        <account-manage v-if="dialogVisible" ref="accountManage" @refreshDataList="queryShopFinancialInfo"/>
        <!-- 下架管理 -->
        <!-- <OfflineEventHandle
          v-if="offlineManageVisible"
          ref="offlineData"
          selectUrl="/shop/shopDetail/getOfflineHandleEvent"
          applyUrl="/shop/shopDetail/auditApply"
          @rereapplyDataSubmit="reReapplyDataSubmit" /> -->
        <offline-manage v-if="offlineManageVisible" ref="offlineData" @rereapplyDataSubmit="reReapplyDataSubmit"/>

        <!-- 类目签约弹窗 -->
        <category-add-or-update
            v-if="cateAddOrUpdateVisible"
            ref="cateAddOrUpdate"
            :applyForSign="true"
            :signingCount="signCategoryList.length"
            @closePopup="closePopup"
        />
        <!-- 品牌签约弹窗 -->
        <brand-add-or-update
            v-if="brandAddOrUpdateVisible"
            ref="brandAddOrUpdate"
            :applyForSign="true"
            :signingCount="signedBrands.length"
            @closePopup="closePopup"
        />

        <!-- 查看签约申请信息 -->
        <sign-apply v-if="signApplyVisible" ref="signApply" @refreshChange="refreshChange"></sign-apply>

    </div>
</template>

<script>
import moment from 'moment'
import {treeDataTranslate} from '@/utils'
import {validEmail, isCreditCode, validNoEmptySpace, removeHeadAndTailSpaces} from '@/utils/validate'
import ImgUpload from '@/components/img-upload'
import accountManage from './shopInfo-account-manage'
import offlineManage from './shopInfo-offline-manage'
import categoryAddOrUpdate from '../shopProcess/category-add-or-update'
import brandAddOrUpdate from '../shopProcess/brand-add-or-update'
import signApply from './shopInfo-sign-apply'
import shopInfoBrowsing from './shopInfo-browsing.vue'
import businessInformationBrowse from './business-information-browse.vue'

export default {
    components: {
        ImgUpload,
        accountManage,
        // OfflineEventHandle
        offlineManage,
        categoryAddOrUpdate,
        brandAddOrUpdate,
        signApply,
        shopInfoBrowsing,
        businessInformationBrowse
    },
    data () {
        const validateMobile = (rule, value, callback) => {
            let phoneReg = /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/
            let mobile = /^(?:(?:\+|00)86)?1\d{10}$/
            if (phoneReg.test(value) || mobile.test(value)) {
                callback()
            } else {
                callback(new Error(this.$i18n.t('shopProcess.telErrorTips')))
            }
        }
        const validateMerchantName = (rule, value, callback) => {
            if (!value.trim()) {
                callback(new Error(this.$i18n.t('shopProcess.merchantNameNotEmpty')))
            } else {
                callback()
            }
        }
        const validateShopName = (rule, value, callback) => {
            if (!value.trim()) {
                callback(new Error(this.$i18n.t('shopProcess.shopNameNotEmpty')))
            } else {
                callback()
            }
        }
        const validateBusinessScope = (rule, value, callback) => {
            if (!value.trim()) {
                callback(new Error(this.$i18n.t('shopProcess.businessScopeNotEmpty')))
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
        const validRepresentative = (rule, value, callback) => {
            this.companyInfoForm.representative = this.companyInfoForm.representative.trim()
            if (this.companyInfoForm.representative.indexOf(' ') !== -1) {
                callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
            } else {
                callback()
            }
        }
        const vaildCreditCode = (rule, value, callback) => {
            if (!isCreditCode(value)) {
                callback(new Error(this.$i18n.t('shopProcess.creditCodeErrorTips')))
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
            isShopInfoBrowsing: true,
            isbusinessInformationBrowse: true,
            removeHeadAndTailSpaces: removeHeadAndTailSpaces,
            // 语言
            lang: window.localStorage.getItem('lang'),
            resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
            // 下线对话框
            offlineManageVisible: false,
            shopId: this.$route.query.shopId || 0,
            // 步骤
            navStatus: 0,
            // 签约有效期
            value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
            // 商家类型
            shopType: '1',
            // 店铺审核状态
            shopAuditStatus: {},
            // 签约的时间范围
            contractTimeRange: [],
            // 店铺基本信息
            shopBasicInfo: {},
            shopBasicInfoRules: {
                merchantName: [
                    {required: true, message: this.$i18n.t('shopProcess.merchantNameNotEmpty'), trigger: 'blur'},
                    {validator: validateMerchantName, trigger: 'blur'},
                    {min: 2, max: 10, message: this.$i18n.t('shopProcess.merchantNameErrorTips'), trigger: 'blur'}
                ],
                shopName: [
                    {required: true, message: this.$i18n.t('shopProcess.shopNameNotEmpty'), trigger: 'blur'},
                    {validator: validateShopName, trigger: 'blur'},
                    {min: 2, max: 20, message: this.$i18n.t('shopProcess.shopNameInputTips'), trigger: 'blur'}
                ],
                industryType: [
                    {required: true, message: '请选择行业类型', trigger: 'change'}
                ],
                storeType: [
                    {required: true, message: '请选择店铺类型', trigger: 'change'}
                ],
                // contactName: [
                //   { required: true, message: '联系人不能为空', trigger: 'blur' },
                //   { min: 2, max: 10, message: '联系人长度在2-10个字符之间', trigger: 'blur' }
                // ],
                tel: [
                    {required: true, message: this.$i18n.t('shopProcess.telNotEmpty'), trigger: 'blur'},
                    {validator: validateMobile, trigger: 'blur'}
                ],
                receiveMobile: [
                    {required: true, message: this.$i18n.t('shopProcess.receiveMobileNotEmpty'), trigger: 'blur'},
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
                    {required: true, message: this.$i18n.t('shopProcess.detailAddrNotEmpty'), trigger: 'blur'}
                ],
                floor: [
                    {required: true, message: '请输入楼层', trigger: 'blur'}
                ],
                roomNumber: [
                    {required: true, message: '请输入房号', trigger: 'blur'}
                ],
                shopLogo: [
                    {required: true, message: this.$i18n.t('shopProcess.logoNotEmpty'), trigger: 'change'}
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
            // 地址-省市区
            addrList: [],
            // 选中地址
            currentAddr: [],
            addrListTreeProps: {
                value: 'areaId',
                label: 'areaName'
            },

            // 店铺工商信息
            companyInfoForm: {
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
            companyInfoRule: {
                creditCode: [
                    {required: true, message: this.$i18n.t('shopProcess.creditCodeInputTips'), trigger: 'blur'},
                    {validator: vaildCreditCode, trigger: 'blur'}
                ],
                firmName: [
                    {required: true, message: this.$i18n.t('shopProcess.firmNameNotEmpty'), trigger: 'blur'},
                    {validator: validEmptyTab, trigger: 'blur'}
                ],
                businessScope: [
                    {required: true, message: this.$i18n.t('shopProcess.businessScopeNotEmpty'), trigger: 'blur'},
                    {validator: validateBusinessScope, trigger: 'blur'}
                ],
                timeRange: [
                    {required: true, message: this.$i18n.t('shopProcess.businessTimeNotEmpty'), trigger: 'change'}
                ],
                representative: [
                    {required: true, message: this.$i18n.t('shopProcess.representativeNotEmpty'), trigger: 'blur'},
                    {validator: validRepresentative, trigger: 'blur'}
                ],
                businessLicense: [
                    {required: true, message: '营业执照需要上传', trigger: 'change'}
                ],
                identityCardFront: [
                    {required: true, message: '上传法人身份证人像面', trigger: 'change'}
                ],
                identityCardLater: [
                    {required: true, message: '上传法人身份证国徽面', trigger: 'change'}
                ]
            },

            // 店铺分类签约信息
            signCategoryList: [],
            // 平台品牌签约信息
            signedBrands: [], // 平台品牌+自定义品牌
            // 自增签约品牌信息
            customizeBrandList: [],
            // 类目签约弹窗显隐
            cateAddOrUpdateVisible: false,
            // 品牌签约弹窗显隐
            brandAddOrUpdateVisible: false,
            // 申请签约审核状态
            applySigningCategoryStatus: null,
            applySigningBrandStatus: null,
            // 申请签约按钮显隐
            showSignCategoriesBtn: true,
            showSignBrandsBtn: true,
            // 签约申请审核信息
            signCategoriesApplyInfo: {},
            signBrandsApplyInfo: {},
            // 查看签约申请弹窗显隐
            signApplyVisible: false,

            // 店铺财务信息
            settlementAccounts: [],
            dialogVisible: false,

            // 定位
            show: false,
            center: {
                lng: 113.327955,
                lat: 23.136783
            },
            center2: {
                lng: 113.327955,
                lat: 23.136783
            },
            baiduIndex: false,
            zoom: 18,

            applyingCategoryNum: 0, // 申请中类目数量
            applyingBrandNum: 0, // 申请中品牌数量

            mapLocationType: 'map', // 定位方式

            financialInfo: {
                mchNo: '',
                appId: '',
                apiKey: ''
            },
            financialInfoRules: {
                mchNo: [{required: true, message: '商户号不能为空', trigger: 'blur'},],
                appId: [{required: true, message: '应用id不能为空', trigger: 'blur'},],
                apiKey: [{required: true, message: '应用秘钥不能为空', trigger: 'blur'},],
            },
            industryTypeList: [],
            shopTypes: [],
            shopTypeList: []
        }
    },

    mounted () {
        this.show = false
        this.setCenter()

        this.navStatus = parseInt(this.$route.query.navStatus) || 0

        // 查询基本信息
        this.switchNav(this.navStatus)
        this.getAddrList()
        // 店铺审核状态
        this.queryShopAuditStatus()
        // 行业类型
        this.getIndustryType()
        // 店铺类型
        this.getShopTypeList()
    },

    methods: {
        // 获取行业类型
        getIndustryType () {
            let type = 'industry_Type'
            this.$http({
                url: this.$http.adornUrl(`/multishop/sys/dictData/getByType/${type}`),
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
                url: this.$http.adornUrl(`/multishop/sys/dictData/getByType/${type}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.shopTypeList = data
            })
        },
        handler ({BMap, map}) {
            this.baiduIndex = true
            this.center = {...this.center2}
        },
        switchNav (value) {
            this.navStatus = value
            if (value === 1) {
                // 查询工商信息
                this.queryShopBusinessInfo()
            } else if (value === 2) {
                // 查询分类签约信息
                this.getSignCategoryList()
                // 查询分类申请信息
                this.getSignCategoryList(0)

                // 查询品牌签约信息
                this.getSignBrandList()
                // 查询品牌申请信息
                this.getSignBrandList(0)
            } else if (value === 3) {
                // 查询财务信息
                this.queryShopFinancialInfo()
            } else {
                // 查询基本信息
                this.queryShopBasicInfo()
            }
        },

        /**
         * 店铺审核状态
         */
        queryShopAuditStatus () {
            this.$http({
                url: this.$http.adornUrl(`/shop/shopDetail/getAuditingInfo`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.shopAuditStatus = data
            })
            this.queryShopBasicInfo()
        },

        /**
         * 店铺违规下线操作
         */
        offlineManageHandle () {
            this.offlineManageVisible = true
            // 获取最新的店铺违规下线事件信息
            this.$http({
                url: this.$http.adornUrl(`/shop/shopDetail/getOfflineHandleEvent`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.offlineDetail = data
                this.$nextTick(() => {
                    this.$refs.offlineData.init(data)
                })
            })
        },

        /**
         * 提交上线申请
         */
        reReapplyDataSubmit (value) {
            const param = {
                eventId: value.eventId,
                reapplyReason: value.reapplyReason // 申请理由
            }
            if (this.isSubmit) {
                return
            }
            this.isSubmit = true
            this.$http({
                url: this.$http.adornUrl(`/shop/shopDetail/auditApply`),
                method: 'POST',
                data: param
            }).then(({data}) => {
                this.offlineManageVisible = false
                this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000,
                    onClose: () => this.queryShopAuditStatus()
                })
                this.isSubmit = false
            }).catch(e => {
                this.isSubmit = false
            })
        },

        /**
         * 查询基本信息
         */
        queryShopBasicInfo () {
            this.$http({
                url: this.$http.adornUrl(`/shop/shopDetail/info`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                if (data) {
                    this.shopBasicInfo = data
                    if(this.shopBasicInfo.storeType){
                        this.shopTypes = this.shopBasicInfo.storeType.split(',')
                    }
                    if (data.contractStartTime && data.contractEndTime) {
                        this.contractTimeRange = [data.contractStartTime, data.contractEndTime]
                    }
                    this.shopBasicInfo.currentAddr = [
                        data.provinceId,
                        data.cityId,
                        data.areaId
                    ]
                    if (data.shopLat && data.shopLng) {
                        if (this.baiduIndex) {
                            this.center = {
                                lng: Number.parseFloat(data.shopLng),
                                lat: Number.parseFloat(data.shopLat)
                            }
                        } else {
                            this.center2 = {
                                lng: Number.parseFloat(data.shopLng),
                                lat: Number.parseFloat(data.shopLat)
                            }
                        }
                    }
                }
            })
        },
        /**
         * 关闭工商信息浏览页
         */
        closeBusinessBrowse () {
            this.isbusinessInformationBrowse = false
            this.$nextTick(() => {
                this.queryShopBusinessInfo()
            })
        },
        /**
         * 地址
         */
        getAddrList () {
            this.$http({
                url: this.$http.adornUrl(`/admin/area/list`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.addrList = treeDataTranslate(data, 'areaId', 'parentId')
                this.addrList = this.removeNotThirdCategoryItem(this.addrList)
            })
        },

        removeNotThirdCategoryItem (treeData) {
            if (treeData[0] && treeData[0].level === 3) {
                // 当为三级分类时，不需要再判断
                return treeData
            }

            const firstCategory = treeData
            let length = firstCategory.length
            for (let i = 0, index = 0; i < length; i++) {
                if (firstCategory[index].children && firstCategory[index].children !== undefined && (firstCategory[index].children.some(item => item.children) || firstCategory[index].level !== 1)) {
                    const secondCategory = firstCategory[index].children
                    firstCategory[index].children = this.removeNotThirdCategoryItem(secondCategory)
                } else {
                    firstCategory.splice(index, 1)

                    // 当前位置的元素已经被删除，当前位置索引不用++
                    continue
                }
                index++
            }
            return firstCategory
        },
        /**
         * 监听地址改变
         */
        handleAddrChange (value) {
            if (value.length > 0) {
                const labels = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
                this.shopBasicInfo.province = labels[0]
                this.shopBasicInfo.provinceId = value[0]
                this.shopBasicInfo.city = labels[1]
                this.shopBasicInfo.cityId = value[1]
                this.shopBasicInfo.area = labels[2]
                this.shopBasicInfo.areaId = value[2]
                this.mapLocation(true)
            }
        },

        /**
         * 查询工商信息
         */
        queryShopBusinessInfo () {
            this.$http({
                url: this.$http.adornUrl(`/shop/shopCompany`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                if (data) {
                    this.companyInfoForm = data
                    if (data.startTime && data.endTime) {
                        this.$set(this.companyInfoForm, 'timeRange', [data.startTime, data.endTime])
                    } else {
                        this.$set(this.companyInfoForm, 'timeRange', [])
                    }
                }
            })
        },
        /**
         * 营业时间赋值
         */
        handleTimeData (value) {
            this.companyInfoForm.startTime = value[0]
            this.companyInfoForm.endTime = value[1]
        },

        /**
         * 注册资本输入框校验
         */
        changeNum () {
            const capital = this.companyInfoForm.capital
            this.companyInfoForm.capital = this.checkInput(capital)
            if (Number.parseFloat(this.companyInfoForm.capital) === 0) {
                this.companyInfoForm.capital = 0
            }
            if (Number.parseFloat(this.companyInfoForm.capital) > 99999999) {
                this.companyInfoForm.capital = 99999999
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
         * 获取签约审核信息
         * @param type 类型：1：分类 2：品牌
         */
        getAuditInfo (type) {
            this.$http({
                url: this.$http.adornUrl(`/shop/signingAuditing/auditInfo`),
                method: 'get',
                params: this.$http.adornParams({
                    type: type
                })
            }).then(({data}) => {
                // status 0 未审核 1已通过 -1未通过
                if (type === 1) {
                    this.showSignCategoriesBtn = !data || (data && data.status !== 0)
                    if (data) {
                        this.applySigningCategoryStatus = data.status
                        this.signCategoriesApplyInfo = data
                    } else {
                        this.signCategoriesApplyInfo = null
                    }
                }
                if (type === 2) {
                    this.showSignBrandsBtn = !data || (data && data.status !== 0)
                    if (data) {
                        this.applySigningBrandStatus = data.status
                        this.signBrandsApplyInfo = data
                    } else {
                        this.signBrandsApplyInfo = null
                    }
                }
            })
        },

        /**
         * 查看签约申请
         */
        viewSignApply (type, data) {
            this.signApplyVisible = true
            this.$nextTick(() => {
                this.$refs.signApply.init(type, data)
            })
        },
        /**
         * 回调
         */
        refreshChange (type) {
            if (type === 1) {
                // 查询分类申请信息
                this.getSignCategoryList(0)
            } else {
                // 查询品牌申请信息
                this.getSignBrandList(0)
            }
            // this.getAuditInfo(type)
            this.getSignCategoryList()
            this.getSignBrandList()
        },

        /**
         * 签约类目列表
         */
        getSignCategoryList (status = 1) {
            this.$http({
                url: this.$http.adornUrl(`/prod/category/listSigningCategory`),
                method: 'get',
                params: this.$http.adornParams({
                    status: status // 签约审核 0 未审核 1已通过 -1未通过
                })
            }).then(({data}) => {
                if (data) {
                    if (status === 1) {
                        this.signCategoryList = data
                        this.signCategoryList.forEach(item => {
                            const imgUrls = item.qualifications ? item.qualifications.split(',') : []
                            if (imgUrls.length) {
                                item.imgs = this.handleImgUrl(imgUrls)
                            } else {
                                item.imgs = []
                            }
                            // item.imgs = item.qualifications ? item.qualifications.split(',') : []
                        })
                    } else if (status === 0) {
                        this.applyingCategoryNum = data.length
                    }
                }
                if (status === 1) {
                    // this.getAuditInfo(1)
                }
            })
        },

        /**
         * 获取签约品牌列表
         */
        getSignBrandList (status = 1) {
            this.$http({
                url: this.$http.adornUrl(`/admin/brand/listSigningBrand`),
                method: 'get',
                params: this.$http.adornParams({
                    status: status // 签约审核 0 未审核 1已通过 -1未通过
                })
            }).then(({data}) => {
                // data.platformBrandList.length ? this.signedBrands.push(...data.platformBrandList) : this.signedBrands = []
                if (status === 1) {
                    this.signedBrands = data.platformBrandList
                    this.signedBrands.forEach(el => {
                        // el.imgs = el.qualifications ? el.qualifications.split(',') : []
                        const imgUrls = el.qualifications ? el.qualifications.split(',') : []
                        if (imgUrls.length) {
                            el.imgs = this.handleImgUrl(imgUrls)
                        } else {
                            el.imgs = []
                        }
                    })
                    // this.getAuditInfo(2)
                } else if (status === 0) {
                    this.applyingBrandNum = data.platformBrandList.length
                }
            })
        },

        handleImgUrl (imgUrls) {
            const imgs = []
            imgUrls.forEach((img, index) => {
                if (img.indexOf('http') === -1 && img.indexOf('https') === -1) {
                    const image = this.resourcesUrl + img
                    imgs.push(image)
                } else {
                    imgs.push(img)
                }
            })
            return imgs
        },

        /**
         * 编辑签约信息弹窗
         */
        addOrUpdateHandle (type) {
            if (type === 1) {
                this.cateAddOrUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.cateAddOrUpdate.init()
                })
                return
            }
            if (type === 2) {
                this.brandAddOrUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.brandAddOrUpdate.init('editor')
                })
            }
        },
        /**
         * 关闭弹窗
         */
        closePopup (val) {
            if (val === 'category') {
                this.cateAddOrUpdateVisible = false
                this.getSignCategoryList()
                // 查询分类申请信息
                this.getSignCategoryList(0)
            } else if (val === 'brand') {
                this.brandAddOrUpdateVisible = false
                this.getSignBrandList()
                // 查询品牌申请信息
                this.getSignBrandList(0)
            }
        },

        /**
         * 查询商户信息
         */
        queryShopFinancialInfo () {
            this.$http({
                url: this.$http.adornUrl(`/shop/shopMch/queryByShopId`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                if (data) {
                    this.financialInfo = data
                }
            })
        },

        /**
         * 更新基本信息
         */
        validationShopBasicInfo () {
            this.shopBasicInfo.storeType = this.shopTypes.join(',')
            this.$refs['shopBasicInfo'].validate((valid) => {
                if (!valid) {
                    return
                }
                this.$http({
                    url: this.$http.adornUrl('/shop/shopDetail'),
                    method: 'PUT',
                    data: this.$http.adornData(this.shopBasicInfo)
                })
                    .then(({data}) => {
                        this.$message({
                            message: this.$i18n.t('shopProcess.baseSaveSuccess'),
                            type: 'success',
                            duration: 1000,
                            onClose: () => {
                                this.isShopInfoBrowsing = true
                            }
                        })
                        this.$store.dispatch('user/login')
                    }).catch(() => {
                    this.isShopInfoBrowsing = true
                })
            })
        },

        /**
         * 提交工商信息审核
         */
        submitBusinessReview () {
            this.$refs['companyInfoForm'].validate((valid) => {
                if (!valid) {
                    return
                }
                this.$http({
                    url: this.$http.adornUrl('/shop/companyAuditing/applyChangeCompanyInfo'),
                    method: 'post',
                    data: this.$http.adornData(this.companyInfoForm)
                }).then(({data}) => {
                    this.$message({
                        message: this.$i18n.t('shopProcess.auditTip1'),
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.isbusinessInformationBrowse = true
                        }
                    })
                }).catch(() => {
                    this.isbusinessInformationBrowse = true
                })
            })
        },
        /**
         * 储存工商信息
         */
        validationCompanyInfoForm () {
            this.$refs['companyInfoForm'].validate((valid) => {
                if (!valid) {
                    return
                }
                this.companyInfoForm.shopId = this.shopId
                this.$http({
                    url: this.$http.adornUrl('/shop/shopCompany/storage'),
                    method: 'post',
                    data: this.$http.adornData(this.companyInfoForm)
                }).then(({data}) => {
                    this.isbusinessInformationBrowse = true
                    this.$message({
                        message: this.$i18n.t('shopProcess.saveCompanyInfoSuccess'),
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                        }
                    })
                })
            })
        },

        /**
         * 新增/修改账号
         */
        showDialog (shopBankCardId) {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.accountManage.init(shopBankCardId)
            })
        },

        /**
         * 删除银行卡
         */
        deleteBankCartById (cardNo, shopBankCardId) {
            const tailNumber = cardNo.substring(cardNo.length - 4)
            this.$confirm(this.$i18n.t('shopProcess.shopBankCardDeletePre') + ' ' + `${tailNumber}` + ' ' + this.$i18n.t('shopProcess.shopBankCardDeleteAfter'), this.$i18n.t('text.tips'), {
                confirmButtonText: this.$i18n.t('order.confirm'),
                cancelButtonText: this.$i18n.t('order.cancel'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl(`/shop/shopBankCard/${shopBankCardId}`),
                    method: 'DELETE',
                    params: this.$http.adornParams()
                }).then(({data}) => {
                    this.$message({
                        message: this.$i18n.t('shopProcess.deleteSuccessfully'),
                        type: 'success',
                        duration: 1000
                    })
                    this.queryShopFinancialInfo()
                })
            }).catch(() => {
            })
        },

        // 设置主账号
        setMainAccountById (shopBankCardId) {
            this.$http({
                url: this.$http.adornUrl(`/shop/shopBankCard/setDefault`),
                method: 'PUT',
                data: this.$http.adornData({
                    shopBankCardId
                })
            }).then(({data}) => {
                this.$message({
                    message: this.$i18n.t('shopProcess.setSuccess'),
                    type: 'success',
                    duration: 1000
                })
                this.queryShopFinancialInfo()
            })
        },

        // 取消主账号
        setNotMainAccountById (shopBankCardId) {
            this.$http({
                url: this.$http.adornUrl(`/shop/shopBankCard/setNotDefault`),
                method: 'PUT',
                params: this.$http.adornParams({
                    shopBankCardId
                })
            }).then(({data}) => {
                this.$message({
                    message: this.$i18n.t('shopProcess.cancelMainAccountSuccess'),
                    type: 'success',
                    duration: 1000
                })
                this.queryShopFinancialInfo()
            })
        },

        /** **************** 地图相关 ****************/
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
            this.shopBasicInfo.shopLng = lng
            this.shopBasicInfo.shopLat = lat
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

        shopAddressChange () {
            this.mapLocationType = 'address'
            this.mapLocation(true)
        },
        // 定位地图
        mapLocation (isTrue) {
            let area = ''
            const that = this
            if (isTrue === true) {
                // 选择省市区时，定位地图
                if (this.shopBasicInfo.provinceId) {
                    area = this.shopBasicInfo.province
                    this.zoom = 6
                    if (this.shopBasicInfo.cityId) {
                        area = area + this.shopBasicInfo.city
                        this.zoom = 10
                        if (this.shopBasicInfo.areaId) {
                            area = area + this.shopBasicInfo.area
                            this.zoom = 14
                            if (this.shopBasicInfo.addr !== null) {
                                // 详细地址
                                area = this.shopBasicInfo.province + this.shopBasicInfo.city + this.shopBasicInfo.area + this.shopBasicInfo.shopAddress
                                this.zoom = 18
                            }
                        }
                    }
                }
                this.center = area
            } else {
                // this.center = null
                if (!this.shopBasicInfo.provinceId || !this.shopBasicInfo.cityId || !this.shopBasicInfo.areaId) {
                    this.shopBasicInfo.shopAddress = null
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
                        that.shopBasicInfo.shopAddress = rs.address.replace(that.shopBasicInfo.province + that.shopBasicInfo.city + that.shopBasicInfo.area, '')
                    })
                }
                area = this.shopBasicInfo.province + this.shopBasicInfo.city + this.shopBasicInfo.area + this.shopBasicInfo.shopAddress
                this.center = this.mapLocationType === 'address' ? area : this.center
                this.zoom = 18
            }
            this.isEditAddr = true
        },
        /** **************** 地图相关 end*************/
        categoryDelete (row) {
            const obj = {
                categoryId: row.categoryId
            }
            this.$confirm(this.$i18n.t('publics.deletes'), this.$i18n.t('text.tips'), {
                confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
                cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl(`/shop/signingAuditing/deleteSigningCategory`),
                    method: 'delete',
                    params: this.$http.adornParams(obj)
                }).then(({data}) => {
                    this.$message({
                        message: this.$t('shopProcess.deleteSuccessfully'),
                        type: 'success',
                        duration: 1500,
                        onClose: () => this.getSignCategoryList()
                    })
                })
            }).catch(() => {
            })
        },
        brandDelete (row) {
            const obj = {
                brandShopId: row.brandShopId
            }
            this.$confirm(this.$i18n.t('publics.deletes'), this.$i18n.t('text.tips'), {
                confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
                cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl(`/shop/signingAuditing/deleteSigningBrand`),
                    method: 'delete',
                    params: this.$http.adornParams(obj)
                }).then(({data}) => {
                    this.$message({
                        message: this.$t('shopProcess.deleteSuccessfully'),
                        type: 'success',
                        duration: 1500,
                        onClose: () => this.getSignBrandList()
                    })
                })
            }).catch(() => {
            })
        },
        validationShopMchInfo () {
            this.$refs['financialInfo'].validate((valid) => {
                if (!valid) {
                    return
                }
                this.$http({
                    url: this.$http.adornUrl('/shop/shopMch/update'),
                    method: 'PUT',
                    data: this.$http.adornData(this.financialInfo)
                }).then(({data}) => {
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                        }
                    })
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.app-container.shop-detail {
    font-size: 14px;
    color: #333;

    & > > > .el-input__inner {
        border-radius: 2px !important;
    }

    & > > > .el-textarea__inner {
        border-radius: 2px !important;
        padding: 5px 10px;
    }

    // 图片框
    & > > > .el-upload-list--picture-card .el-upload-list__item {
        width: 120px;
        height: 120px;
        margin: 0;
    }

    // 查看图片
    .rotating-img {
        display: block;
        width: 60px;
        height: 60px;
        margin-right: 5px;
    }

    .red-tag-txt {
        color: #ff4949;
    }

    .head-title {
        margin-bottom: 15px;
    }

    // 导航栏
    .nav-box {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;

        .nav {
            position: relative;
            display: inline-block;
            display: flex;
            white-space: nowrap;

            .nav-item {
                margin: 0;
                font-size: 14px;
                height: 40px;
                padding: 10px 20px;
                color: #333;
                cursor: pointer;
            }

            .nav-item.active {
                color: #155BD4;
                // background: #f1f5fd;
                border-radius: 4px 4px 0 0;
                border-bottom: 2px solid #155BD4;
            }
        }
    }

    .nav-box::before {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        border-bottom: 1px solid #f0f0f0;
        content: '';
    }

    .shop-info-box {
        // 公共
        p {
            margin: 0;
        }

        p.tit {
            display: inline-block;
            text-align: right;
        }

        .asterisk {
            color: red;
            padding-right: 5px;
        }

        .table-box {
            display: block;
            width: 100%;
            margin: 20px 0;

            & > > > .el-table th, .el-table td {
                border-color: #f0f0f0;
                height: 40px;
                line-height: 40px;
            }

            & > > > .el-table td {
                height: 56px;
                line-height: 56px;
            }

            & > > > .el-table__row:last-child {
                td {
                    border-bottom: 0;
                }
            }

            & > > > .el-table th {
                background: #fafafa;
            }

            & > > > .el-table__body-wrapper {
                max-height: 480px;
                overflow-y: scroll;
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE 10+ */
            }

            & > > > .el-table__body-wrapper::-webkit-scrollbar {
                display: none; /* Chrome Safari */
            }

            & > > > .el-table__body {
                width: 100%;
            }
        }

        // 表格上的标题
        .table-data-title {
            display: flex;
            align-items: center;

            .text {
                font-size: 16px;
                // min-width: 80px;
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
                width: 117px;
                height: 30px;
                line-height: 28px;
                font-size: 14px;
                color: #1890FF;
                background: #FFFFFF;
                text-align: center;
                border: 1px solid #1890FF;
                border-radius: 2px;
                box-sizing: border-box;
                margin-left: auto;
                cursor: pointer;
            }
        }

        // 基本信息模块
        .basic-info-mod {
            // 审核状态
            .audit-status {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                background: #f7f8fa;
                padding: 20px;
                line-height: 1em;
                margin-top: 20px;
                color: #333;

                p.tit {
                    width: 95px;
                }

                p.txt {
                    & > > > .el-input--mini .el-input__inner {
                        width: 400px;
                    }
                }

                .week {
                    color: #666;
                }
            }

            .bg-img {
                display: flex;
                justify-content: flex-start;

                .business-license-box {
                    margin-right: 30px;

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

            // 信息
            .basic-info-list {
                margin: 20px 0;

                .basic-info-box {
                    display: flex;
                    justify-content: flex-start;

                    .left-info,
                    .right-info {
                        width: 50%;
                    }
                }

                .basic-info-item {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 20px 30px;
                }
            }

            & > > > .el-cascader {
                width: 100%;
            }
        }

        // 工商信息
        .business-info-mod {
            margin-top: 30px;

            & > > > .el-form {
                display: block;
                width: 100%;
                padding: 0 10px;

                .el-form-item {
                    margin-bottom: 30px;
                }
            }

            .ci-wrapper {
                display: flex;
                justify-content: flex-start;

                .left-info {
                    // width: 504px;
                    width: 40%;

                    .price-unit-text {
                        font-size: 14px;
                        color: #666;
                        margin-left: 15px;
                    }

                    .btn-box {
                        display: flex;
                        margin-left: 134px;
                        margin-bottom: 40px;

                        .prev-btn {
                            margin-right: 13px;
                        }
                    }
                }

                .right-info {
                    width: 440px;
                    width: 40%;
                    margin-left: 40px;

                    .business-license-box {
                        .license-content {
                            display: flex;
                            height: 120px;
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

                                .idcard.el-form-item {
                                    margin-bottom: 15px;
                                }

                                .idcard.el-form-item.is-error {
                                    margin-bottom: 45px;
                                }
                            }

                            .upload-example {
                                display: flex;
                                width: 100%;
                                // margin-top: 15px;
                                // margin-left: 120px;
                                .example-box {
                                    margin-left: 0;

                                    &:nth-child(2) {
                                        margin-left: 20px;
                                    }
                                }
                            }

                            // .upload-tips {
                            //   margin-left: 120px;
                            // }
                            .idcard {
                                height: 120px;
                            }
                        }
                    }

                    // 店铺简介
                    .store-intro {
                        width: 350px;
                    }

                    .img-static {
                        display: block;
                        width: 120px;
                        height: 120px;
                    }

                    .img-static:not(:first-child) {
                        margin-left: 20px;
                    }

                    .en-left {
                        margin-left: 140px;
                    }

                    .zh-left {
                        margin-left: 140px;
                    }

                    // 示例框
                    .example-box {
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 120px;
                        min-width: 120px;
                        height: 120px;
                        background: #FFFFFF;
                        border: 1px solid #EAEAEA;
                        border-radius: 3px;
                        box-sizing: border-box;
                        margin-left: 20px;
                        padding: 5px;

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
                            width: 120px;
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
                        line-height: 1.5em;
                        margin-top: 13px;
                    }

                    // 图片上传框样式修改
                    & > > > .el-upload {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 120px;
                        height: 121px;
                        background: #FFFFFF;
                        border: 1px solid #EAEAEA;
                        border-radius: 3px;
                        box-sizing: border-box;
                        // img {
                        //   width: 120px;
                        // }
                        .el-icon-plus {
                            font-size: 22px;
                            color: #EAEAEA;
                        }
                    }

                }

                .capital-int {
                    & > > > .el-input__inner {
                        padding-right: 0 !important;
                        border-radius: 2px 0 0 2px !important;
                    }
                }

                // 成立日期
                & > > > .el-date-editor.el-input,
                & > > > .el-date-editor.el-input__inner {
                    width: 100%;
                }

                // 营业期限
                & > > > .el-range-editor.el-input__inner {
                    width: auto;

                    .el-range-separator {
                        width: 8%;
                    }
                }
            }
        }

        // 签约信息
        .contract-info {
            width: 100%;
            margin-top: 30px;
            margin-bottom: 80px;

            .s-item {
                .apply-sign {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    // .apply-btn {
                    //   margin-left: 10px;
                    // }
                }

                .si-content {
                    margin-top: 12px;

                    .img-box {
                        display: flex;
                        align-items: center;
                        // justify-content: center;
                        img {
                            // 图片自适应
                            // width: auto;
                            // height: auto;
                            // max-width: 57px;
                            // max-height: 57px;
                            // 固定宽高
                            width: 57px;
                            height: 57px;
                        }

                        img:not(:last-child) {
                            margin-right: 5px;
                        }
                    }

                    .brand-logo {
                        display: flex;
                        align-items: flex-start;

                        img {
                            // 图片自适应
                            // width: auto;
                            // height: auto;
                            // max-width: 57px;
                            // max-height: 57px;
                            // 固定宽高
                            width: 57px;
                            height: 57px;
                        }

                        img:not(:last-child) {
                            margin: 5px;
                        }
                    }
                }

                .table-con {
                    padding: 0;
                }
            }

            .s-brand-item {
                margin: 50px 0 40px;
            }

            .s-sign-item {
                margin-bottom: 30px;
            }

            table {
                .table-item {
                    .img-item {
                        img {
                            vertical-align: middle;
                            width: 38px;
                            height: 38px;
                            background: #EBF1FF;
                            border-radius: 19px;
                            margin: auto;
                        }
                    }
                }
            }

            .btn-box {
                display: flex;
                justify-content: center;
                margin-bottom: 39px;

                .prev-btn {
                    margin-right: 13px;
                }
            }
        }

        // 财务信息
        .financial-info {
            margin: 30px 0;

            .create-btn {
                margin: 15px 0;
            }
        }

    }

    // 脚部
    .footer {
        .foot-box {
            display: block;

            .btn {
                margin-left: 150px;
                cursor: pointer;
                font-size: 14px;
            }
        }
    }

    .map {
        width: 100%;
        height: 300px;
    }


}

.m-disable {
    pointer-events: none;
    color: #c0c4cc;
}
</style>
