<template>
    <div class="app-container shop-detail">
        <!-- <div class="head-title">{{$t('shopProcess.merchantDetail')}}</div> -->
        <!-- 导航栏 -->
        <div class="nav-box">
            <div class="nav">
                <div :class="['nav-item', navStatus === 0 ? 'active' : '']" @click="switchNav(0)">{{
                    $t('shopProcess.basicInfo') }}
                </div>
                <div :class="['nav-item', navStatus === 1 ? 'active' : '']" @click="switchNav(1)">{{
                    $t('shopProcess.businessInfo') }}
                </div>
                <div :class="['nav-item', navStatus === 2 ? 'active' : '']" @click="switchNav(2)">{{
                    $t('shopProcess.signUpInfo') }}
                </div>
                <div :class="['nav-item', navStatus === 3 ? 'active' : '']" @click="switchNav(3)">{{
                    $t('shopProcess.financeInfo') }}
                </div>
            </div>
        </div>
        <!-- 模块 -->
        <div class="shop-info-box">
            <!-- 基本信息 -->
            <div v-if="navStatus === 0" class="basic-info-mod">
                <!-- 店铺审核状态 -->
                <div class="audit-status">
                    <!-- status 0 未审核 1已通过 -1未通过 2平台下线 3 平台下线待审核 -->
                    <!-- shopStatus 店铺状态(-1:已删除 0: 停业中 1:营业中 2:平台下线 3:上线待审核 4:店铺申请中 5:开店待审核) -->
                    <div v-if="shopAuditStatus" class="audit-item">
                        <span>{{ $t('shopProcess.auditStatus') }}：</span>
                        <span v-if="shopAuditStatus.status === -1">{{ $t('shop.failed') }}</span>
                        <span v-if="shopAuditStatus.status === 0">{{ $t('shop.unreviewed') }}</span>
                        <span v-if="shopAuditStatus.status === 1">{{ $t('shop.passed') }}</span>
                        <span v-if="shopAuditStatus.status === 2">{{ $t('shop.platformOffline') }}</span>
                    </div>
                    <div class="audit-item">
                        <span>{{ $t('shopProcess.accountStatus') }}：</span>
                        <span v-if="shopBasicInfo.accountStatus === 0">{{ $t('shopProcess.disable') }}</span>
                        <span v-if="shopBasicInfo.accountStatus === 1">{{ $t('shopProcess.enable') }}</span>
                        <span v-if="shopBasicInfo.accountStatus === -1">{{ $t('shopProcess.delete') }}</span>
                    </div>
                    <div class="audit-item">
                        <span>{{ $t('shopProcess.shopStatus') }}：</span>
                        <span v-if="shopBasicInfo.shopStatus === -1">{{ $t('shopProcess.deleted') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 0">{{ $t('shopProcess.closed') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 1">{{ $t('shopProcess.inOperation') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 2">{{ $t('shop.platformOffline') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 3">{{ $t('shopProcess.onlinePendingReview') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 4">{{ $t('shopProcess.shopApplication') }}</span>
                        <span v-if="shopBasicInfo.shopStatus === 5">{{ $t('shopProcess.storeOpenPendingReview') }}</span>
                    </div>
                </div>
                <!-- 信息 -->
                <div class="basic-info-list">
                    <div class="left-info">
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.logo') }}：</p>
                            <p v-if="shopBasicInfo && shopBasicInfo.shopLogo" class="txt">
                                <el-image
                                        class="img-static"
                                        :src="shopBasicInfo.shopLogo.indexOf('http') === 0 ? shopBasicInfo.shopLogo : resourcesUrl + shopBasicInfo.shopLogo"
                                        :preview-src-list="shopBasicInfo.shopLogo.indexOf('http') === 0 ? [shopBasicInfo.shopLogo] : [resourcesUrl + shopBasicInfo.shopLogo]"
                                />
                                <span v-if="!shopBasicInfo.shopLogo" class="weak">{{ $t('order.notYet') }}</span>
                            </p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit">{{ $t('shopProcess.storeAccount') }}：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.merchantAccount }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.merchantName') }}：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.merchantName }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.shopName') }}：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.shopName }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>行业类型：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.industryType }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>店铺类型：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.storeType }}</p>
                        </div>
                        <!-- <div class="basic-info-item">
                          <p class="tit"><span class="asterisk">*</span>联系人：</p>
                          <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.contactName }}</p>
                        </div> -->
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.tel') }}：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.tel }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.email') }}：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.email }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.addr') }}：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.province }}{{ shopBasicInfo.city }}{{
                                shopBasicInfo.area }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.detailAddr') }}：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.shopAddress }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>楼层：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.floor }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>房号：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.roomNumber }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>排序：</p>
                            <p v-if="shopBasicInfo" class="txt">{{ shopBasicInfo.sort }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit">{{ $t('shopProcess.intro') }}：</p>
                            <p v-if="shopBasicInfo.intro" class="txt">{{ shopBasicInfo.intro }}</p>
                            <p v-if="!shopBasicInfo.intro" class="txt weak">{{ $t('order.notYet') }}</p>
                        </div>
                    </div>
                    <div class="right-info">

                        <!-- 背景图 -->
                        <!-- <div class="basic-info-item">
                          <p class="tit"><span class="asterisk">*</span>{{$t('shopProcess.backgroundPic')}}：</p>
                          <div class="txt bg-img">
                            <div v-if="shopBasicInfo && shopBasicInfo.mobileBackgroundPic" class="bg-img-item">
                              <el-image
                                class="img-static"
                                :src="shopBasicInfo.mobileBackgroundPic.indexOf('http') === 0 ? shopBasicInfo.mobileBackgroundPic : resourcesUrl + shopBasicInfo.mobileBackgroundPic"
                                :preview-src-list="shopBasicInfo.mobileBackgroundPic.indexOf('http') === 0 ? [shopBasicInfo.mobileBackgroundPic] : [resourcesUrl + shopBasicInfo.mobileBackgroundPic]"
                              />
                              <div class="img-tips">
                                <p>{{ $t('shopProcess.mobileBackgroundPic') }}</p>
                                <p>{{ $t('shopProcess.mobilePicTips') }}</p>
                              </div>
                            </div>
                            <div v-if="shopBasicInfo && shopBasicInfo.pcBackgroundPic" class="bg-img-item">
                              <el-image
                                class="img-static"
                                :src="shopBasicInfo.pcBackgroundPic.indexOf('http') === 0 ? shopBasicInfo.pcBackgroundPic : resourcesUrl + shopBasicInfo.pcBackgroundPic"
                                :preview-src-list="shopBasicInfo.pcBackgroundPic.indexOf('http') === 0 ? [shopBasicInfo.pcBackgroundPic] : [resourcesUrl + shopBasicInfo.pcBackgroundPic]"
                              />
                              <div class="img-tips">
                                <p>{{ $t('shopProcess.pcBackgroundPic') }}</p>
                                <p>{{ $t('shopProcess.pcPicTips') }}</p>
                              </div>
                            </div>
                            <div v-if="!shopBasicInfo.mobileBackgroundPic && !shopBasicInfo.pcBackgroundPic" class="txt weak">{{ $t('order.notYet') }}</div>
                          </div>
                        </div> -->

                    </div>
                </div>
            </div>
            <!-- /基本信息 -->

            <!-- 工商信息 -->
            <div v-if="navStatus === 1" class="basic-info-mod">
                <div class="basic-info-list">
                    <div class="left-info">
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.creditCode') }}：</p>
                            <p v-if="businessInfo" class="txt">{{ businessInfo.creditCode }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.firmName') }}：</p>
                            <p v-if="businessInfo" class="txt">{{ businessInfo.firmName }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.representative') }}：</p>
                            <p v-if="businessInfo.representative" class="txt">{{ businessInfo.representative }}</p>
                            <p v-if="!businessInfo.representative" class="txt weak">{{ $t('order.notYet') }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit">{{ $t('shopProcess.capital') }}：</p>
                            <p v-if="businessInfo.capital" class="txt">{{ businessInfo.capital }} {{
                                $t('shopProcess.tenThousandYuan') }}</p>
                            <p v-if="!businessInfo.capital" class="txt weak">{{ $t('order.notYet') }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit">{{ $t('shopProcess.residence') }}：</p>
                            <p v-if="businessInfo.residence" class="txt">{{ businessInfo.residence }}</p>
                            <p v-if="!businessInfo.residence" class="txt weak">{{ $t('order.notYet') }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit">{{ $t('shopProcess.fountTime') }}：</p>
                            <p v-if="businessInfo.foundTime" class="txt">{{ businessInfo.foundTime }}</p>
                            <p v-if="!businessInfo.foundTime" class="txt weak">{{ $t('order.notYet') }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.businessPeriod') }}：</p>
                            <p v-if="businessInfo.startTime && businessInfo.endTime" class="txt">
                                {{ businessInfo.startTime.slice(0, 10) + ' - ' + businessInfo.endTime.slice(0, 10)
                                }}</p>
                            <p v-if="!businessInfo.startTime || !businessInfo.endTime" class="txt weak">{{
                                $t('order.notYet') }}</p>
                        </div>
                        <!-- <div class="basic-info-item">
                          <p class="tit"><span class="asterisk">*</span>营业期限至：</p>
                          <p v-if="businessInfo.endTime" class="txt">{{ businessInfo.endTime }}</p>
                          <p v-if="!businessInfo.endTime" class="txt weak">暂无</p>
                        </div> -->
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.businessScope') }}：</p>
                            <p v-if="businessInfo" class="txt">{{ businessInfo.businessScope }}</p>
                        </div>
                    </div>
                    <div class="right-info">
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.businessLicense') }}：</p>
                            <el-image
                                    v-if="businessInfo && businessInfo.businessLicense"
                                    class="img-static"
                                    :src="businessInfo.businessLicense.indexOf('http') === 0 ? businessInfo.businessLicense : resourcesUrl + businessInfo.businessLicense"
                                    :preview-src-list="businessInfo.businessLicense.indexOf('http') === 0 ? [businessInfo.businessLicense] : [resourcesUrl + businessInfo.businessLicense]"
                            />
                            <p v-if="!businessInfo.businessLicense" class="txt weak">{{ $t('order.notYet') }}</p>
                        </div>
                        <div class="basic-info-item">
                            <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.corporateIdentityCard') }}：
                            </p>
                            <div class="txt bg-img">
                                <el-image
                                        v-if="businessInfo && businessInfo.identityCardFront"
                                        class="img-static"
                                        :src="businessInfo.identityCardFront.indexOf('http') === 0 ? businessInfo.identityCardFront : resourcesUrl + businessInfo.identityCardFront"
                                        :preview-src-list="businessInfo.identityCardFront.indexOf('http') === 0 ? [businessInfo.identityCardFront] : [resourcesUrl + businessInfo.identityCardFront]"
                                />
                                <el-image
                                        v-if="businessInfo && businessInfo.identityCardLater"
                                        class="img-static"
                                        :src="businessInfo.identityCardLater.indexOf('http') === 0 ? businessInfo.identityCardLater : resourcesUrl + businessInfo.identityCardLater"
                                        :preview-src-list="businessInfo.identityCardLater.indexOf('http') === 0 ? [businessInfo.identityCardLater] : [resourcesUrl + businessInfo.identityCardLater]"
                                />
                            </div>
                            <p v-if="!businessInfo.identityCardFront && !businessInfo.identityCardLater"
                               class="txt weak">{{ $t('order.notYet') }}</p>
                        </div>
                    </div>
                </div>

            </div>
            <!-- /工商信息 -->

            <!-- 签约信息 -->
            <div v-if="navStatus === 2" class="contract-info table-box">
                <!-- 签约类目 -->
                <div class="contracted-items contract-category">
                    <div class="tips">
                        <p class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.signingCategory') }}</p>
                        <p class="txt weak">
                            {{ $t('shopProcess.preSigned') }}
                            <span class="txt-bold">{{ categoryContract.length }}</span>
                            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}，
                            {{ $t('shopProcess.application') }}
                            <span class="txt-bold">{{ applyingCategoryNum }}</span>
                            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}，
                            {{ $t('shopProcess.mostAdd') }}
                            <span class="txt-bold">200</span>
                            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}
                        </p>
                    </div>
                    <div class="table-box">
                        <!--  height="286" -->
                        <el-table
                                :data="categoryContract"
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
                                    <div v-if="row.platformRate || row.platformRate === 0 || row.customizeRate || row.customizeRate === 0">
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
                                <template slot-scope="scope">
                                    <div v-if="scope.row.imgs.length">
                                        <el-image
                                                v-for="(img,index) in scope.row.imgs"
                                                :key="index"
                                                class="tab-img"
                                                :src="img"
                                                :preview-src-list="scope.row.imgs"
                                        />
                                    </div>
                                    <span v-if="!scope.row.imgs.length">--</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="categoryStatus"
                                    :label="this.$i18n.t('shopProcess.categoryStatus')"
                            >
                                <template slot-scope="scope">
                                    <div v-if="scope.row.categoryStatus === 1" class="tag-txt">{{ $t('publics.normal')
                                        }}
                                    </div>
                                    <div v-if="scope.row.categoryStatus === 0" class="tag-txt red-tag-txt">{{
                                        $t('publics.LowerShelf') }}
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <!-- 签约品牌 -->
                <div class="contracted-items contract-brands">
                    <div class="tips">
                        <p class="tit"><span class="asterisk"/>{{ $t('shopProcess.signingBrand') }}</p>
                        <p class="txt weak">
                            {{ $t('shopProcess.preSigned') }}
                            <span class="txt-bold">{{ platformBrandList.length + customizeBrandList.length }}</span>
                            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}，
                            {{ $t('shopProcess.application') }}
                            <span class="txt-bold">{{ applyingBrandNum }}</span>
                            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}，
                            {{ $t('shopProcess.mostAdd') }}
                            <span class="txt-bold">50</span>
                            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}
                        </p>
                    </div>
                    <div class="table-box main-container">
                        <div class="table-con">
                            <!-- height="286" -->
                            <el-table
                                    :data="platformBrandList"
                                    header-cell-class-name="table-header"
                                    style="width: 100%"
                            >
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
                                        prop="imgUrl"
                                        :label="this.$i18n.t('shopProcess.brandLogo')"
                                >
                                    <template slot-scope="scope">
                                        <el-image
                                                v-if="scope.row.imgUrl"
                                                class="tab-img"
                                                :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"
                                                :preview-src-list="scope.row.imgUrl.indexOf('http')===-1 ? [resourcesUrl + scope.row.imgUrl] : [scope.row.imgUrl]"
                                        />
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="imgs"
                                        :label="this.$i18n.t('shopProcess.brandQualifications')"
                                >
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.imgs.length">
                                            <el-image
                                                    v-for="(img,index) in scope.row.imgs"
                                                    :key="index"
                                                    class="tab-img"
                                                    :src="img"
                                                    :preview-src-list="scope.row.imgs"
                                            />
                                        </div>
                                        <span v-if="!scope.row.imgs.length">--</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="brandStatus"
                                        :label="this.$i18n.t('shopProcess.brandStatus')"
                                >
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.brandStatus === 1" class="tag-txt">{{ $t('publics.normal')
                                            }}
                                        </div>
                                        <div v-if="scope.row.brandStatus === 0" class="tag-txt red-tag-txt">{{
                                            $t('publics.LowerShelf') }}
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <!-- 自定义品牌列表 -->
                        <div v-if="pageType === 'toAudit'" class="table-con">
                            <!--  height="286" -->
                            <el-table
                                    :data="customizeBrandList"
                                    style="width: 100%"
                            >
                                <el-table-column
                                        prop="name"
                                        :label="this.$i18n.t('shopProcess.merchantSelfIncreasing')"
                                >
                                    <template slot-scope="scope">
                                        <span class="table-cell-text">{{ scope.row.name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="firstLetter"
                                />
                                <el-table-column
                                        prop="imgUrl"
                                >
                                    <!-- label="品牌logo" -->
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.imgUrl">
                                            <el-image
                                                    v-for="(img,index) in scope.row.imgs"
                                                    :key="index"
                                                    class="tab-img"
                                                    :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"
                                                    :preview-src-list="scope.row.imgUrl.indexOf('http')===-1 ? [resourcesUrl + scope.row.imgUrl] : [scope.row.imgUrl]"
                                            />
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="imgs"
                                >
                                    <!-- label="授权文件" -->
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.imgs.length">
                                            <el-image
                                                    v-for="(img,index) in scope.row.imgs"
                                                    :key="index"
                                                    class="tab-img"
                                                    :src="img"
                                                    :preview-src-list="scope.row.imgs"
                                            />
                                        </div>
                                        <span v-if="!scope.row.imgs.length">--</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="brandStatus"
                                >
                                    <template slot-scope="scope">
                                        <div v-if="pageType === 'toAudit'">
                                            <div class="tag-txt red-tag-txt">{{ $t('liveRoom.underReview') }}</div>
                                        </div>
                                        <div v-else>
                                            <div v-if="scope.row.brandStatus === 1" class="tag-txt">{{
                                                $t('publics.normal') }}
                                            </div>
                                            <div v-if="scope.row.brandStatus === 0" class="tag-txt red-tag-txt">{{
                                                $t('publics.LowerShelf') }}
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                    </div>
                </div>
                <div v-if="pageType !== 'toAudit'">
                    <!-- 签约有效期 -->
                    <div class="contracted-items s-item">
                        <div class="tips">
                            <div class="tit"><span class="asterisk">*</span>{{
                                $t('shopProcess.validityPeriodOfContract') }}
                            </div>
                            <div class="txt weak">{{ $t('shopProcess.validPeriod') }}</div>
                        </div>
                        <div class="si-content">
                            <div>
                                <el-date-picker
                                        v-model="contractTimeRange"
                                        type="datetimerange"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        :range-separator="$t('date.tip')"
                                        :start-placeholder="this.$i18n.t('shopProcess.startTime')"
                                        :end-placeholder="this.$i18n.t('shopProcess.endTime')"
                                        disabled
                                />
                            </div>
                        </div>
                    </div>
                    <!-- 商家类型 -->
                    <div class="contracted-items s-item">
                        <div class="tips">
                            <div class="tit"><span class="asterisk">*</span>{{ $t('shopProcess.shopType') }}</div>
                        </div>
                        <div class="si-content">
                            <div>
                                <el-radio v-model="shopBasicInfo.type" :label="0" disabled>{{
                                    $t('shopProcess.ordinaryShop') }}
                                </el-radio>
                                <el-radio v-model="shopBasicInfo.type" :label="1" disabled>{{
                                    $t('shopProcess.preferredGoodShop') }}
                                </el-radio>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /签约信息 -->

            <!-- 财务信息 -->
            <div v-if="navStatus === 3" class="financial-info">
                <el-form ref="financialInfo" label-width="140px" :model="financialInfo" size="small">
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
            <!-- /财务信息 -->

        </div>

        <!-- 脚部 -->
        <div v-if="pageType === 'toAudit' && shopStatus.shopStatus !== 5" class="footer">
            <div class="foot-box">
                <div class="default-btn primary-btn" @click="openAuditPopup(1)">{{ $t('shopProcess.audit') }}</div>
                <div class="default-btn" @click="openAuditPopup(-1)">{{ $t('shopProcess.reject') }}</div>
            </div>
        </div>

        <!-- 审核弹窗 -->
        <el-dialog
                :visible.sync="auditDialogVisible"
                append-to-body
                :close-on-click-modal="false"
                destroy-on-close
                :show-close="false"
                class="audit-dialog"
        >
            <div class="content">
                <div class="head">
                    <span class="tit">{{ $t('shopProcess.merchantReview') }}</span>
                    <span class="sub-tit">{{ $t('shopProcess.addSigning') }}</span>
                </div>
                <el-form ref="auditform" label-width="auto" :model="auditform" :rules="auditformRules" size="small">
                    <el-form-item :label="this.$i18n.t('shopProcess.validityPeriodOfContract')" prop="date">
                        <el-date-picker
                                v-model="auditform.date"
                                type="daterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :range-separator="this.$i18n.t('text.to')"
                                :start-placeholder="this.$i18n.t('shopProcess.startTime')"
                                :end-placeholder="this.$i18n.t('shopProcess.endTime')"
                                @change="getContractDate"
                        />
                    </el-form-item>
                    <el-form-item :label="this.$i18n.t('shopProcess.shopType')" prop="shopType">
                        <el-radio-group v-model="auditform.shopType">
                            <el-radio :label="0">{{ $t('shopProcess.ordinaryShop') }}</el-radio>
                            <el-radio :label="1">{{ $t('shopProcess.preferredGoodShop') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="auditDialogVisible = false">{{ $t('remindPop.cancel') }}</div>
        <div class="default-btn primary-btn" @click="reviewStoreApplications(1)">{{ $t('shopProcess.submit') }}</div>
                <!-- <el-button @click="auditDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="reviewStoreApplications(1)">提交</el-button> -->
      </span>
        </el-dialog>
        <!-- 驳回弹窗 -->
        <el-dialog
                :title="this.$i18n.t('shopProcess.rejectRemarks')"
                :visible.sync="reviewDialogVisible"
                append-to-body
                :close-on-click-modal="false"
                destroy-on-close
                class="remarks"
        >
            <el-input
                    v-model="remarks"
                    type="textarea"
                    :rows="2"
                    maxlength="200"
                    :placeholder="this.$i18n.t('shopProcess.rejectInputTips')"
            />

            <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="reviewDialogVisible = false">{{ $t('remindPop.cancel') }}</div>
        <div class="default-btn primary-btn" @click="reviewStoreApplications(-1)">{{ $t('shopProcess.submit') }}</div>
                <!-- <el-button @click="reviewDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="reviewStoreApplications(-1)">提交</el-button> -->
      </span>
        </el-dialog>

        <!-- 图片预览 -->
        <!-- <picture-preview v-if="picturePreviewVisible" ref="picturePreview" /> -->

    </div>
</template>

<script>
  // import * as api from '@/api/platform/audit-shop'
  // import picturePreview from '@/components/PicturePreview'
  export default {
    // components: {
    //   picturePreview
    // },
    data () {
      return {
        // 图片前缀
        resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
        // 图片预览
        picturePreviewVisible: false,
        shopId: this.$route.query.shopId || 0,
        // 页面类型 查看详情/审核申请
        pageType: this.$route.query.pageType || '',
        // 导航切换
        navStatus: 0,

        // 店铺审核状态
        shopAuditStatus: {},
        // 店铺状态
        shopStatus: {},

        // 店铺基本信息
        shopBasicInfo: {},

        // 店铺工商信息
        businessInfo: {},

        // 店铺分类签约信息
        categoryContract: [],

        // 平台品牌签约信息
        platformBrandList: [],

        // 自增签约品牌信息
        customizeBrandList: [],

        // 店铺财务信息
        settlementAccounts: [],

        // 审核信息
        auditform: {
          date: [],
          shopType: null
        },
        // 审核弹窗
        auditDialogVisible: false,
        // 签约有效期
        contractStartTime: '',
        contractEndTime: '',
        contractTimeRange: [],
        // 商家类型
        merchantType: 0,
        auditformRules: {
          date: [
            {required: true, message: this.$i18n.t('shopProcess.contractValidityNotEmpty'), trigger: 'change'}
          ],
          shopType: [
            {required: true, message: this.$i18n.t('shopProcess.selectShopType'), trigger: 'change'}
          ]
        },
        // 驳回弹窗
        reviewDialogVisible: false,
        // 驳回备注
        remarks: '',

        applyingCategoryNum: 0, // 申请中类目数量
        applyingBrandNum: 0, // 申请中品牌数量

        financialInfo: {
          mchNo: '',
          appId: '',
          apiKey: ''
        },
        industryTypeList: []
      }
    },

    mounted () {
      // 查询基本信息
      this.queryShopBasicInfo()
      // 店铺审核状态
      this.queryShopAuditStatus()
      // 行业类型
      this.getIndustryType()
    },

    methods: {
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
      switchNav (value) {
        this.navStatus = value
        if (value === 1) {
          // 查询工商信息
          this.queryShopBusinessInfo()
        } else if (value === 2) {
          // 查询分类签约信息
          this.queryCategoryContractInfo()
          // 查询品牌签约信息
          this.queryBrandSigningInfo()

          // 查询分类申请信息
          this.queryCategoryContractInfo(0)
          // 查询品牌申请信息
          this.queryBrandSigningInfo(0)
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
          url: this.$http.adornUrl(`/shop/shopAuditing/${this.shopId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.shopAuditStatus = data
          // this.shopStatus = data.shopDetail
        })
      },

      /**
       * 查询基本信息
       */
      queryShopBasicInfo () {
        this.$http({
          url: this.$http.adornUrl('/platform/shopDetail/info'),
          method: 'get',
          params: this.$http.adornParams({
            shopId: this.shopId
          })
        }).then(({data}) => {
          this.shopBasicInfo = data
          if (data.contractStartTime && data.contractEndTime) {
            this.contractTimeRange = [data.contractStartTime, data.contractEndTime]
          }
        })
      },

      /**
       * 查询工商信息
       */
      queryShopBusinessInfo () {
        this.$http({
          url: this.$http.adornUrl('/platform/shopCompany'),
          method: 'get',
          params: this.$http.adornParams({
            shopId: this.shopId,
            status: this.pageType === 'toAudit' && this.shopStatus.shopStatus !== 5 ? null : 1
          })
        }).then(({data}) => {
          this.businessInfo = data
          this.shopBasicInfo.businessLicense = this.shopBasicInfo.businessLicense ? this.shopBasicInfo.businessLicense : data.businessLicense
          this.shopBasicInfo.identityCardFront = this.shopBasicInfo.identityCardFront ? this.shopBasicInfo.identityCardFront : data.identityCardFront
          this.shopBasicInfo.identityCardLater = this.shopBasicInfo.identityCardLater ? this.shopBasicInfo.identityCardLater : data.identityCardLater
        })
      },

      /**
       * 查询分类签约信息
       */
      queryCategoryContractInfo (status = 1) {
        this.$http({
          url: this.$http.adornUrl('/prod/category/signingInfoByShopId'),
          method: 'get',
          params: this.$http.adornParams({
            shopId: this.shopId,
            status: this.pageType === 'toAudit' ? null : status // 签约状态：1：已通过 0待审核 -1未通过
          })
        }).then(({data}) => {
          if (status === 1) {
            this.categoryContract = data
            this.categoryContract.forEach(el => {
              el.imgs = el.qualifications ? el.qualifications.split(',') : []
              if (el.imgs.length) {
                el.imgs.forEach(img => {
                  img = this.getImgSrc(img)
                })
              }
            })
            console.log('categoryContract：', this.categoryContract)
          } else if (status === 0) {
            this.applyingCategoryNum = data.length
          }
        })
      },

      /**
       * 查询品牌签约信息
       */
      queryBrandSigningInfo (status = 1) {
        // api.queryBrandSigning({ shopId: this.shopId }).then(data => {
        //   this.platformBrandList = data.platformBrandList
        //   this.platformBrandList.forEach(el => {
        //     el.imgs = el.qualifications ? el.qualifications.split(',') : []
        //   })
        //   this.customizeBrandList = data.customizeBrandList
        //   this.customizeBrandList.forEach(el => {
        //     el.imgs = el.qualifications ? el.qualifications.split(',') : []
        //   })
        // })
        this.$http({
          url: this.$http.adornUrl('/platform/brand/listSigningByShopId'),
          method: 'get',
          params: this.$http.adornParams({
            shopId: this.shopId,
            status: this.pageType === 'toAudit' ? null : status // 签约状态：1：已通过 0待审核 -1未通过
          })
        }).then(({data}) => {
          if (status === 1) {
            this.platformBrandList = data.platformBrandList
            this.platformBrandList.forEach(el => {
              el.imgs = el.qualifications ? el.qualifications.split(',') : []
              if (el.imgs.length) {
                el.imgs.forEach(img => {
                  img = this.getImgSrc(img)
                })
              }
            })
            this.customizeBrandList = data.customizeBrandList
            this.customizeBrandList.forEach(el => {
              el.imgs = el.qualifications ? el.qualifications.split(',') : []
              if (el.imgs.length) {
                el.imgs.forEach(img => {
                  img = this.getImgSrc(img)
                })
              }
            })
          } else if (status === 0) {
            this.applyingBrandNum = data.platformBrandList.length
          }
        })
      },

      /**
       * 获取图片路径
       */
      getImgSrc (img) {
        if (!img) {
          return ''
        }
        if (img.indexOf('http://') === 0 || img.indexOf('https://') === 0) {
          return img
        }
        return this.resourcesUrl + img
      },

      /**
       * 查询财务信息
       */
      queryShopFinancialInfo () {
        this.$http({
          url: this.$http.adornUrl(`/platform/shopMch/queryByShopId`),
          method: 'get',
          params: this.$http.adornParams({
            shopId: this.shopId,
            status: this.pageType === 'toAudit' && this.shopStatus.shopStatus !== 5 ? null : 1
          })
        }).then(({data}) => {
          if (data) {
            this.financialInfo = data
          }
        })
      },

      /**
       * 打开审核弹窗
       */
      openAuditPopup (status) {
        if (status === 1) {
          // 审核
          this.auditDialogVisible = true
          return
        }
        if (status === -1) {
          // 驳回
          this.remarks = ''
          this.reviewDialogVisible = true
        }
      },
      getContractDate (date) {
        this.contractStartTime = date[0]
        this.contractEndTime = date[1]
      },
      /**
       * 提交店铺申请审核
       */
      reviewStoreApplications (status) {
        let param = {}
        param = {
          shopId: this.shopId,
          status: status // 0 未审核 1已通过 -1未通过 2平台下线 3 平台下线待审核
        }
        // 审核
        if (status === 1) {
          this.$refs.auditform.validate(valid => {
            if (!valid) {
              return
            }
            param.shopType = this.auditform.shopType
            param.contractStartTime = this.contractStartTime
            param.contractEndTime = this.contractEndTime
            this.auditApply(status, param)
          })
          return
        }
        // 驳回，备注必填
        if (status === -1) {
          if (!this.remarks.trim() || this.remarks.trim().length > 200) {
            this.$message({
              message: this.$i18n.t('shopProcess.rejectRemarks'),
              type: 'error',
              duration: 1000
            })
            return
          }
          param.remarks = this.remarks.trim() // 驳回备注
          this.auditApply(status, param)
        }
      },

      auditApply (status, param) {
        this.$http({
          url: this.$http.adornUrl('/shop/shopAuditing/audit'),
          method: 'put',
          data: this.$http.adornData(param)
        }).then(({data}) => {
          this.$message({
            message: status === 1 ? this.$i18n.t('shopProcess.auditPass') : this.$i18n.t('shopProcess.applyFailed'),
            type: 'success',
            duration: 1000
          })
          if (status === 1) {
            this.$refs['auditform'].resetFields() // 清空表单
            this.$refs['auditform'].clearValidate() // 表单验证关闭时清除错误验证信息
            this.auditDialogVisible = false
          } else {
            this.remarks = ''
            this.reviewDialogVisible = false
          }
          this.$router.push('/platform-auditShop')
        })
      },

      /**
       * 图片预览
       */
      picturePreview (imgUrl) {
        this.picturePreviewVisible = true
        this.$nextTick(() => {
          this.$refs.picturePreview.init(imgUrl)
        })
      }

    }
  }
</script>

<style lang="scss" scoped>
    .app-container {
        margin-bottom: 30px;
    }

    .app-container.shop-detail {
        font-size: 14px;
        color: #333;
        min-height: 852px;

        .head-title {
            margin-bottom: 15px;
        }

        .red-tag-txt {
            color: #ff4949;
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
                    line-height: 1em;
                    padding: 15px 20px;
                    color: #333;
                    cursor: pointer;
                }

                .nav-item.active {
                    color: #155bd4;
                    // background: rgba(24,144,255, 0.06);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid #155bd4;
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
            margin-bottom: 80px;
            // 公共
            p {
                margin: 0;
            }

            .asterisk {
                color: #FF2120;
                padding-right: 5px;
            }

            .tips {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 100%;

                .tit {
                    font-size: 16px;
                    min-width: 80px;
                }

                .txt.weak {
                    font-size: 12px;
                    color: #999;
                    margin-left: 10px;
                }

                .txt-bold {
                    color: #333;
                }
            }

            .si-content {
                margin-top: 20px;
                margin-bottom: 25px;
            }

            .table-box {
                display: block;
                width: 100%;
                margin: 20px 0;

                & > > > .el-table th, .el-table td {
                    border-color: #f0f0f0;
                }

                & > > > .el-table__body-wrapper {
                    max-height: 245px;
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

            // 图片
            .tab-img {
                width: 60px;
                height: 60px;
                margin-right: 5px;
                cursor: pointer;
            }

            .business-info-item {
                width: 40%;
                display: flex;
                align-items: top;
                justify-content: flex-start;
                margin-bottom: 20px;
                line-height: 32px;

                p.tit {
                    width: 155px;
                    text-align: right;
                }

                // .img-static {
                //   display: block;
                //   width: auto;
                //   max-width: 80px;
                //   height: auto;
                //   max-height: 80px;
                //   margin-right: 10px;
                //   cursor: pointer;
                // }
            }

            .img-static {
                display: block;
                width: 100px;
                height: 100px;
                margin-right: 15px;
                border-radius: 10px;
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
                        width: 110px;
                    }

                    .weak {
                        color: #666;
                    }
                }

                // 基本信息 & 工商信息
                .basic-info-list {
                    display: flex;
                    align-items: top;
                    justify-content: flex-start;
                    width: 100%;
                    margin: 30px 0;

                    .left-info {
                        // width: 550px;
                        width: 40%;
                        min-width: 400px;
                        margin-right: 20px;
                        text-align: left;
                    }

                    .right-info {
                        width: 40%;
                        min-width: 300px;
                        // .img-static {
                        //   display: block;
                        //   width: 120px;
                        //   height: auto;
                        //   cursor: pointer;
                        //   border: 1px dashed #d9d9d9;
                        // }
                    }

                    .basic-info-item {
                        display: flex;
                        justify-content: flex-start;
                        margin-bottom: 30px;
                        line-height: 24px;

                        .tit {
                            width: 155px;
                            min-width: 155px;
                            text-align: right;
                            margin-right: 15px;
                        }

                        .txt {
                            display: block;
                            word-break: break-all;
                            letter-spacing: 1px;

                            &.weak {
                                color: #bbb;
                            }
                        }

                        // 背景图
                        .bg-img {
                            display: flex;
                            align-items: flex-start;
                            justify-content: flex-start;
                            text-align: center;

                            .bg-img-item {
                                .img-static {
                                    display: inline-block;
                                    margin-right: 0;
                                }
                            }

                            .bg-img-item:not(:last-child) {
                                margin-right: 10px;
                            }

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

            // 签约信息
            .contract-info {
                margin-top: 30px;

                .table-box {
                    margin: 15px 0;

                    .table-con {
                        padding: 0;
                    }
                }

                .contracted-items.contract-brands {
                    margin: 50px 0;
                }

                .take-down {
                    color: #ff4949;
                }
            }

            // 财务信息
            .financial-info {
                margin: 30px 0;

                .tips {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    padding-bottom: 20px;

                    .txt {
                        margin-right: 5px;

                        .date-block {
                            display: inline-block;
                            padding: 5px 8px;
                            border: 1px solid #d9d9d9;
                            border-radius: 5px;
                            color: #155bd4;
                            font-weight: bold;
                        }

                        .date-block {
                            margin-right: 5px;
                        }
                    }
                }

                .table-box {
                    margin-top: 10px;

                    & > > > .el-table__body-wrapper {
                        max-height: 504px;
                    }
                }
            }

        }

        // 脚部
        .footer {
            z-index: 8;
            width: 86%;
            position: fixed;
            bottom: 0;
            padding: 10px;
            padding-left: 20px;
            padding-right: 20px;
            box-shadow: 4px 2px 5px 5px #eee;
            background: #fff;
            margin-left: -20px;

            .foot-box {
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .btn {
                    padding: 10px 20px;
                    margin-right: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .btn:first-child {
                    background: #155bd4;
                    color: #fff;
                }

                .btn:last-child {
                    border: 1px solid #d9d9d9;
                }
            }
        }

    }

    // 审核弹窗
    .audit-dialog.el-dialog__wrapper {
        & > > > .el-dialog__header {
            padding: 0;
            padding-bottom: 0;
        }

        & > > > .el-dialog__body {
            padding-top: 0;
            padding-bottom: 0;
        }

        .content {
            .head {
                line-height: 1em;
                font-size: 16px;
                color: #333;
                padding: 15px 0;
                margin-bottom: 10px;

                .sub-tit {
                    color: #999;
                    font-size: 12px;
                    margin-left: 10px;
                }
            }

            & > > > .el-form {
                margin-top: 20px;
            }

            & > > > .el-range-separator {
                width: 10%;
            }
        }
    }
</style>
