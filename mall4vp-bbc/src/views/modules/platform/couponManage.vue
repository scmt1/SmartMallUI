<template>
    <div class="mod-marketing-coupon">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="优惠券管理" name="first">
                <div class="search-bar">
                    <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                        <div class="input-row">
                            <el-form-item prop="couponName" :label="$t('coupon.couponName') + ':'" label-width="80px"
                                          class="search-form-item">
                                <el-input type="text" v-model="searchForm.couponName"
                                          :placeholder="$t('coupon.couponName')"></el-input>
                            </el-form-item>
                            <el-form-item prop="overdueStatus" :label="$t('coupon.expiredStatus') + ':'"
                                          label-width="60px" class="search-form-item">
                                <el-select v-model="searchForm.overdueStatus" :placeholder="$t('coupon.expiredStatus')">
                                    <el-option :label="$t('coupon.notExpired')" :value="1"></el-option>
                                    <el-option :label="$t('coupon.expired')" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="putonStatus" :label="$t('coupon.deliveryStatus') + ':'"
                                          label-width="80px" class="search-form-item">
                                <el-select v-model="searchForm.putonStatus" :placeholder="$t('coupon.deliveryStatus')">
                                    <el-option :label="$t('coupon.cancelLaunch')" :value="-1"></el-option>
                                    <el-option :label="$t('coupon.launched')" :value="1"></el-option>
                                    <el-option :label="$t('coupon.waitAutoLaunch')" :value="0"></el-option>
                                    <el-option :label="$t('coupon.waitLaunch')" :value="4"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="putSource" label="投放来源:"
                                          label-width="80px" class="search-form-item">
                                <el-select v-model="searchForm.putSource" placeholder="请选择投放来源">
                                    <el-option label="平台" :value="1"></el-option>
                                    <el-option label="工会" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                    :label="$t('coupon.expire')+':'"
                                    label-width="70px"
                            >
                                <el-date-picker
                                        v-model="dateRange"
                                        type="datetimerange"
                                        :range-separator="$t('coupon.to')"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        :start-placeholder="$t('coupon.startTime')"
                                        :end-placeholder="$t('coupon.endTime')"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item
                                    label="投放时间"
                                    label-width="70px"
                            >
                                <el-date-picker
                                        v-model="launchDateRange"
                                        type="datetimerange"
                                        :range-separator="$t('coupon.to')"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        :start-placeholder="$t('coupon.startTime')"
                                        :end-placeholder="$t('coupon.endTime')"
                                ></el-date-picker>
                            </el-form-item>
                            <div class="default-btn primary-btn marginBottom" @click="searchChange(true)">{{
                                $t('product.search') }}
                            </div>
                            <div class="default-btn" @click="resetSearchForm('searchForm')">{{ $t('product.reset') }}
                            </div>
                            <div
                                    class="default-btn primary-btn"
                                    @click.stop="addOrUpdateHandle()">
                                {{ $t('sysManagement.add') }}
                            </div>
                            <div
                                    class="default-btn primary-btn"
                                    @click.stop="statisticClick()">
                                {{statisticName}}
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="main-container">
                    <div v-if="statisticName == '关闭统计'" class="data-statistics" style="background: rgb(250, 250, 250);">
                        <div class="statistics-list">
                            <div class="item">
                                <div class="title">发放总量</div>
                                <div class="amount"  style="color: rgb(26, 102, 255);"><span
                                        class="amount-num">{{couponStatistic.sourceStockTotal}}</span>张
                                </div>
                            </div>
                            <div class="item">
                                <div class="line"></div>
                                <div class="title"></div>
                            </div>
                            <div class="item">
                                <div class="title">已领取数量</div>
                                <div class="amount">
                                    <span class="amount-num">{{couponStatistic.takeNumTotal}}</span>张
                                </div>
                            </div>
                            <div class="item">
                                <div class="line"></div>
                                <div class="title"></div>
                            </div>
                            <div class="item">
                                <div class="title">剩余数量</div>
                                <div class="amount">
                                    <span class="amount-num">{{couponStatistic.stocksTotal}}</span>张
                                </div>
                            </div>
                            <div class="item">
                                <div class="line"></div>
                                <div class="title"></div>
                            </div>
                            <div class="item">
                                <div class="title">已核销数量</div>
                                <div class="amount"  style="color: rgb(250, 173, 20);">
                                    <span class="amount-num">{{couponStatistic.useNumTotal}}</span>张
                                </div>
                                <div class="detail">
                                    <span @click.stop="useNumDetail()" class="detail-text" >明细</span>
                                </div>
                            </div>
                        </div>
                        <div class="statistics-list" style="margin-top: 15px;">
                            <div class="item">
                                <div class="title">今日领取数量</div>
                                <div class="amount"><span
                                        class="amount-num">{{receiveAndUseStatistic.todayReceiveTotal}}</span>张
                                </div>
                            </div>
                            <div class="item">
                                <div class="line"></div>
                                <div class="title"></div>
                            </div>
                            <div class="item">
                                <div class="title">昨日领取数量</div>
                                <div class="amount">
                                    <span class="amount-num">{{receiveAndUseStatistic.yesterDayReceiveTotal}}</span>张
                                </div>
                            </div>
                            <div class="item">
                                <div class="line"></div>
                                <div class="title"></div>
                            </div>
                            <div class="item">
                                <div class="title">今日使用数量</div>
                                <div class="amount">
                                    <span class="amount-num">{{receiveAndUseStatistic.todayUseTotal}}</span>张
                                </div>
                            </div>
                            <div class="item">
                                <div class="line"></div>
                                <div class="title"></div>
                            </div>
                            <div class="item">
                                <div class="title">昨日使用数量</div>
                                <div class="amount">
                                    <span class="amount-num">{{receiveAndUseStatistic.yesterDayUseTotal}}</span>张
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-con coupon-table">
<!--                        :summary-method="getSummaries"-->
<!--                        show-summary-->
                        <el-table
                                v-loading="dataListLoading"
                                ref="couponListTable"
                                :data="dataList"
                                header-cell-class-name="table-header"
                                row-class-name="table-row-low"
                                style="width: 100%">

                            <el-table-column
                                    fixed
                                    align="left"
                                    prop="couponName"
                                    :label="$t('coupon.couponName')"
                                    width="200">
                                <template slot-scope="scope">
                                    <span class="table-cell-text">{{ scope.row.couponName }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    align="left"
                                    prop="couponType"
                                    :label="$t('coupon.couponType')"
                                    width="100">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.couponType === 1" class="tag-text">{{ $t('coupon.cashCoupon') }}</span>
                                    <span v-else-if="scope.row.couponType === 2" class="tag-text">{{ $t('coupon.discountVoucher') }}</span>
                                    <span v-else-if="scope.row.couponType === 3" class="tag-text">{{ $t('coupon.coinCertificate') }}</span>
                                    <span v-else-if="scope.row.couponType === 4" class="tag-text">提货卡/券</span>
                                    <span v-else-if="scope.row.couponType === 5" class="tag-text">消费券</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="putSource"
                                    label="投放来源"
                                    min-width="100"
                            >
                                <template slot-scope="scope">
                                    <div class="tag-text" v-if="scope.row.putSource == 1">平台</div>
                                    <div class="tag-text" v-if="scope.row.putSource == 2">工会</div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="isGroup"
                                    label="是否团购"
                                    min-width="100"
                            >
                                <template slot-scope="scope">
                                    <div class="tag-text">
                                        {{["否","是"]
                                        [scope.row.isGroup]}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="startTime"
                                    :label="$t('coupon.startTime')"
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="endTime"
                                    :label="$t('coupon.endTime')"
                                    width="160">
                            </el-table-column>

                            <el-table-column
                                    prop="overdueStatus"
                                    :label="$t('coupon.expiredStatus')"
                                    width="auto">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.overdueStatus === 1" class="tag-text">{{ $t('coupon.notExpired') }}</span>
                                    <span v-else class="tag-text">{{ $t('coupon.expired') }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="putonStatus"
                                    :label="$t('coupon.deliveryStatus')"
                                    width="auto">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.putonStatus === 1" class="tag-text">{{ $t('coupon.launched') }}</span>
                                    <span
                                            v-else-if="scope.row.putonStatus === 0"
                                            class="tag-text"
                                    >{{ $t('coupon.waitAutoLaunch') }}</span>
                                    <span
                                            v-else-if="scope.row.putonStatus === -1"
                                            class="tag-text"
                                    >{{ $t('coupon.cancelLaunch') }}</span>
                                    <span
                                            v-else-if="scope.row.putonStatus ===2"
                                            class="tag-text"
                                    >{{ $t('coupon.violationOffShelf') }}</span>
                                    <span
                                            v-else-if="scope.row.putonStatus ===3"
                                            class="tag-text"
                                    >{{ $t('coupon.waitingForReview') }}</span>
                                    <span
                                            v-else-if="scope.row.putonStatus ===4"
                                            class="tag-text"
                                    >{{ $t('coupon.waitLaunch') }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="launchTime"
                                    :label="$t('coupon.timeToMarket')"
                                    width="160"
                            >
                            </el-table-column>

                            <el-table-column
                                    prop="stocks"
                                    :label="$t('coupon.stock')"
                                    width="auto">
                            </el-table-column>

                            <el-table-column
                                    prop="takeNum"
                                    :label="$t('dataAnalysis.receiveTimes')"
                                    width="auto">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.couponType === 4" class="tag-text">{{ scope.row.version }}</span>
                                    <span v-else class="tag-text">{{ scope.row.takeNum }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="useNum"
                                    :label="$t('dataAnalysis.miniMallUsedTimes')"
                                    width="120">
                            </el-table-column>

                            <el-table-column
                                    prop="getWay"
                                    :label="$t('coupon.getWay')"
                                    width="auto">
                                <template slot-scope="scope">
                                    <span class="tag-text">{{ [$t('coupon.receiveDirectly'), $t('coupon.exchangeOrSystemIssue')][scope.row.getWay] }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    fixed="right"
                                    align="center"
                                    :label="$t('publics.operating')"
                                    width="200"
                            >
                                <template slot-scope="scope">
                                    <div class="text-btn-con">
                                        <div
                                                class="default-btn text-btn"
                                                @click="addOrUpdateHandle(scope.row.couponId)"
                                        >{{ $t('coupon.edit') }}
                                        </div>
                                        <div
                                                class="default-btn text-btn"
                                                @click="couponReceive(scope.row.couponId,scope.row.couponType)"
                                        >领取明细
                                        </div>
                                        <div
                                                class="default-btn text-btn"
                                                v-if="scope.row.putonStatus > 1 && scope.row.putonStatus !== 4"
                                                @click="auditEventHandle(scope.row.couponId)"
                                        >{{ $t('coupon.offlineActivities') }}
                                        </div>
                                        <div
                                                class="default-btn text-btn"
                                                @click="deleteHandle(scope.row.couponId)"
                                        >{{ $t('coupon.delete') }}
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-pagination
                            v-if="dataList.length"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="page.currentPage"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="page.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="page.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="优惠券分组" name="second">
                <div class="couponGroup">
                    <div class="operation-bar">
                        <el-button type="primary" class="change" size="small" @click.stop="addCouponGroup">新增组合券
                        </el-button>
                        <el-button type="primary" class="change" size="small" @click.stop="searchCouponGroup">搜索
                        </el-button>
                    </div>
                    <el-row :gutter="15">
                        <el-col :span="4" style="margin-bottom: 10px;" v-for="(item, index) in groupCouponList" :key="index">
                            <el-card :body-style="{ padding: '0px' }" :key="index">
                                <img src="../../../assets/img/coupon-img.png" class="image">
                                <div style="padding: 10px;">
                                    <span>{{ item.groupName }}</span>
                                    <div class="bottom clearfix">
                                        <el-dropdown class="button">
                      <span class="el-dropdown-link">
                          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item icon="el-icon-view" @click.native="lookGroup(item)">
                                                    查看
                                                </el-dropdown-item>
                                                <el-dropdown-item icon="el-icon-delete"
                                                                  @click.native="deleteCouponGroup(item)">删除
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <el-pagination
                        v-if="groupCouponList.length"
                        @size-change="groupCouponSizeChangeHandle"
                        @current-change="groupCouponCurrentChangeHandle"
                        :current-page="groupCouponPage.currentPage"
                        :page-sizes="[10, 20]"
                        :page-size="groupCouponPage.pageSize"
                        :total="groupCouponPage.total"
                        layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
            </el-tab-pane>
        </el-tabs>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
        <!-- 下线管理弹窗-->
        <offlineEventHandle
                v-if="offlineEventHandleVisible"
                selectUrl="/admin/coupon/getOfflineHandleEventByCouponId"
                applyUrl="/admin/coupon/auditApply"
                ref="offlineEvent"
                @refreshDataList="refreshChange"
        ></offlineEventHandle>
        <!--  优惠券组合选择  -->
        <el-dialog :title="$t('user.selectCoupons')" :visible.sync="couponSelectShow" width="60%"
                   class="select-coupon-dialog">
            <el-form ref="dataForm" :inline="true" :model="couponSearchForm" class="demo-form-inline form"
                     :rules="dataRule">
                <el-row>
                    <el-form-item label="组合名称" prop="groupName">
                        <el-input v-model="couponSearchForm.groupName" size="small" placeholder="请输入组合名称"
                                  clearable></el-input>
                    </el-form-item>
                </el-row>
                <el-form-item>
                    <el-input
                            v-model="couponSearchForm.couponName"
                            size="small"
                            :placeholder="$t('user.couponTip1')"
                            clearable
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <div
                            class="default-btn primary-btn"
                            @click="couponSearchChange"
                    >{{ $t('pictureManager.query') }}
                    </div>
                </el-form-item>
            </el-form>
            <div class="main-container">
                <div class="prods-select-body table-con">
                    <el-table
                            :row-key="getRowKey"
                            ref="couponTable"
                            :data="couponList"
                            header-cell-class-name="table-header"
                            row-class-name="table-row-low"
                            v-loading="couponListLoading"
                            @selection-change="couponSelectChangeHandle"
                            style="width: 100%;"
                    >
                        <el-table-column
                                type="selection"
                                :reserve-selection="true"
                                width="50"
                        ></el-table-column>
                        <el-table-column
                                prop="couponName"
                                :label="$t('marketing.couponName')"
                                width="250"
                        >
                            <template slot-scope="scope">
                                <span class="table-cell-text"> {{ scope.row.couponName }} </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="shopId"
                                label="优惠券发放端"
                        >
                            <template slot-scope="scope">
                                <div>{{ scope.row.shopId == 0 ? '平台' : '店铺' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="putSource"
                                label="投放来源"
                        >
                            <template slot-scope="scope">
                                <div v-if="scope.row.putSource == 1">平台</div>
                                <div v-if="scope.row.putSource == 2">工会</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="startTime"
                                :label="$t('coupon.startTime')"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="endTime"
                                :label="$t('coupon.endTime')"
                                width="160">
                        </el-table-column>
                        <el-table-column
                                prop="couponType"
                                :label="$t('coupon.couponType')"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="stocks"
                                :label="$t('user.stockNum')"
                        ></el-table-column>
<!--                        <el-table-column-->
<!--                                prop="limitNum"-->
<!--                                :label="$t('user.couponUpperLimit')"-->
<!--                        ></el-table-column>-->
                    </el-table>
                </div>
                <el-pagination
                        v-if="couponList.length"
                        @size-change="sizeChangeHandle"
                        @current-change="currentChangeHandle"
                        :current-page="couponPage.currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="couponPage.pageSize"
                        :total="couponPage.total"
                        layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
            </div>
            <span slot="footer">
        <div @click="couponSelectShow = false" class="default-btn">{{ $t('remindPop.cancel') }}</div>
        <div class="default-btn primary-btn" @click="submitSelectCoupon()">{{ $t('remindPop.confirm') }}</div>
      </span>
        </el-dialog>
        <!--  优惠券组合查看  -->
        <el-dialog
                title="优惠券组合查看"
                :visible.sync="couponLookShow"
                width="50%"
                class="select-coupon-dialog"
        >
            <div class="main-container">
                <div class="prods-select-body table-con">
                    <el-table
                            max-height="400"
                            ref="couponLookTable"
                            :data="couponLookList"
                            header-cell-class-name="table-header"
                            row-class-name="table-row-low"
                            style="width: 100%;"
                    >
                        <el-table-column
                                prop="couponName"
                                :label="$t('marketing.couponName')"
                                width="250"
                        >
                            <template slot-scope="scope">
                                <span class="table-cell-text"> {{ scope.row.couponName }} </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="shopId"
                                label="优惠券发放端"
                        >
                            <template slot-scope="scope">
                                <div>{{ scope.row.shopId == 0 ? '平台' : '店铺' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="putSource"
                                label="投放来源"
                        >
                            <template slot-scope="scope">
                                <div v-if="scope.row.putSource == 1">平台</div>
                                <div v-if="scope.row.putSource == 2">工会</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="couponType"
                                :label="$t('coupon.couponType')"
                        >
                            <template slot-scope="scope">
                                <span v-if="scope.row.couponType === 1" class="tag-text">{{ $t('coupon.cashCoupon') }}</span>
                                <span v-else-if="scope.row.couponType === 2" class="tag-text">{{ $t('coupon.discountVoucher') }}</span>
                                <span v-else-if="scope.row.couponType === 3" class="tag-text">{{ $t('coupon.coinCertificate') }}</span>
                                <span v-else-if="scope.row.couponType === 4" class="tag-text">提货卡/券</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="stocks"
                                :label="$t('user.stockNum')"
                        ></el-table-column>
                        <el-table-column
                                prop="limitNum"
                                :label="$t('user.couponUpperLimit')"
                        ></el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer">
        <div @click="couponLookShow = false" class="default-btn">{{ $t('remindPop.cancel') }}</div>
      </span>
        </el-dialog>
        <!--  优惠券使用情况查看  -->
        <el-dialog
                title="优惠券使用情况"
                :visible.sync="useNumDetailShow"
                width="700px"
        >
            <div class="main-container">
                <div class="search-bar" style="display: flex;align-items: center;margin-bottom: 10px;padding: 10px 20px 10px;">
                    <div style="margin-right: 10px;">使用时间</div>
                    <el-date-picker
                            style="height: 30px;"
                            v-model="useDateRange"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                    ></el-date-picker>
                    <div style="margin-left: 10px;" class="default-btn primary-btn" @click="searchUseNumDetail()">{{
                        $t('product.search') }}
                    </div>
                    <div class="default-btn" @click="resetUseTime()">{{ $t('product.reset') }}
                    </div>
                </div>
                <div class="prods-select-body">
                    <el-table
                            v-loading="useNumLoading"
                            max-height="500"
                            ref="couponUseTable"
                            :data="couponUseList"
                            header-cell-class-name="table-header"
                            row-class-name="table-row-low"
                            style="width: 100%;"
                            show-summary
                    >
                        <el-table-column
                                prop="shopName"
                                label="店铺名称"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="writeOffNum"
                                label="已核销数量"
                        ></el-table-column>
                        <el-table-column
                                fixed="right"
                                align="center"
                                :label="$t('publics.operating')"
                                width="80"
                        >
                            <template slot-scope="scope">
                                <div class="text-btn-con">
                                    <div
                                            class="default-btn text-btn"
                                            @click="getShopWriteOffDetail(scope.row.writeOffShopId,scope.row.shopName)"
                                    >明细
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer">
                <div @click="useNumDetailShow = false" class="default-btn">{{ $t('remindPop.cancel') }}</div>
            </span>
        </el-dialog>
        <!--  店铺优惠券核销明细查看  -->
        <el-dialog
                title="店铺优惠券核销明细"
                :visible.sync="shopWriteOffDetailShow"
                width="1100px"
                class="shopWriteOffDetail"
        >
            <div class="main-container">
                <div>
                    <el-button type="primary" size="small" @click="exportData">导出</el-button>
                </div>
                <div style="margin: 10px 0;">
                    <el-table
                            v-loading="writeOffLoading"
                            :data="shopWriteOffList"
                            header-cell-class-name="table-header"
                            row-class-name="table-row-low"
                            style="width: 100%"
                    >
                        <el-table-column
                                fixed
                                label="优惠券"
                                prop="couponName"
                                align="left"
                        />
                        <el-table-column
                                fixed
                                label="使用人"
                                prop="nickName"
                                align="left"
                                width="120"
                        />
                        <el-table-column
                                fixed
                                label="联系电话"
                                prop="userMobile"
                                align="left"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.userMobile ? scope.row.userMobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "暂无" }}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="订单编号"
                                prop="orderNumber"
                                width="180"
                        />
                        <el-table-column
                                prop="amount"
                                label="减免金额"
                                width="120"
                        />
                        <el-table-column
                                prop="useTime"
                                label="使用时间"
                        />
                        <el-table-column
                                prop="shopName"
                                label="核销店铺"
                        />
                        <div slot="empty">
                            &nbsp;
                        </div>
                    </el-table>
                </div>
                <el-pagination
                        @size-change="shopWriteOffHandleSizeChange"
                        @current-change="shopWriteOffHandleCurrentChange"
                        :current-page="shopWriteOffPage.currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="shopWriteOffPage.pageSize"
                        :total="shopWriteOffPage.total"
                        layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 优惠券领取记录 -->
        <CouponReceiveDetail
                v-if="couponReceiveDetailVisible"
                ref="couponReceiveDetail"></CouponReceiveDetail>
        <!-- 提货卡券购买记录 -->
        <CardBuyDetail
                v-if="cardBuyDetailVisible"
                ref="cardBuyDetail"></CardBuyDetail>
    </div>
</template>

<script>
  import AddOrUpdate from './couponManage-add-or-update'
  import OfflineEventHandle from '@/components/offline-event-handle'
  import CouponReceiveDetail from '@/components/coupon-receive-detail'
  import CardBuyDetail from '@/components/card-buy-detail'

  export default {
    data () {
      return {
        theData: null, // 保存上次点击查询的请求条件
        statisticData: null, // 保存上次点击查询的请求条件
        theParams: null, // 保存上次点击查询的请求条件
        activeName: 'first',
        search: {
          slot: ''
        },
        dataForm: {
          shopId: 0,
          orderNumber: '',
          status: null
        },
        dateRange: [],
        launchDateRange: [],
        dataList: [],
        dataListLoading: false,
        offlineEventHandleVisible: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        searchForm: {
          couponName: '',
          overdueStatus: '',
          putonStatus: '',
          putSource:''
        },
        couponSelectShow: false,
        couponPage: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        couponList: [], //优惠券列表
        couponListLoading: false,
        couponSearchForm: {
          couponName: '',
          groupName: '',
        },
        dataCouponListSelections: [], //选中优惠券
        groupCouponList: [], //分组优惠券
        groupCouponPage: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        couponLookShow: false,
        couponLookList: [],
        dataRule: {
          groupName: [
            {required: true, message: '分组名称不能为空', trigger: 'blur'}
          ],
        },
        statisticName: '数据统计',
        couponStatistic:{
          stocksTotal:0,
          sourceStockTotal:0,
          takeNumTotal:0,
          useNumTotal:0
        },
        useNumDetailShow:false,
        couponUseList:[],
        useDateRange: [],
        shopWriteOffDetailShow:false,
        shopWriteOffPage: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        shopWriteOffList:[],
        writeOffShopId:'',
        couponReceiveDetailVisible:false,
        shopName:'',
        receiveAndUseStatistic:{
          yesterDayReceiveTotal:0,
          todayReceiveTotal:0,
          yesterDayUseTotal:0,
          todayUseTotal:0
        },
        writeOffLoading:false,
        useNumLoading:false,
        cardBuyDetailVisible:false
      }
    },
    components: {
      AddOrUpdate,
      OfflineEventHandle,
      CouponReceiveDetail,
      CardBuyDetail
    },
    created () {
      this.getDataList()
      this.statisticCoupon()
      this.platformReceiveAndUseStatistic()
    },
    methods: {
      //优惠券领取明细
      couponReceive(couponId,couponType){
        if(couponType == 4){
          this.cardBuyDetailVisible = true
          this.$nextTick(() => {
            this.$refs.cardBuyDetail.init(couponId)
          })
        }else{
          this.couponReceiveDetailVisible = true
          this.$nextTick(() => {
            this.$refs.couponReceiveDetail.init(couponId)
          })
        }
      },
      //获取店铺核销明细
      getShopWriteOffDetail(shopId,shopName){
        this.writeOffShopId = shopId
        this.shopName = shopName
        this.shopWriteOffDetailShow = true
        this.shopWriteOffPage.currentPage = 1
        this.shopWriteOffPage.pageSize = 10
        this.getWriteOffRecordList(this.shopWriteOffPage,shopId)
      },
      //获取店铺核销优惠券列表
      getWriteOffRecordList(page){
        this.writeOffLoading = true;
        this.$http({
          url: this.$http.adornUrl('/platform/couponUseRecord/shopWriteOffDetail'),
          method: 'get',
          params: this.$http.adornParams(
          {
                writeOffShopId:this.writeOffShopId,
                current: page == null ? this.shopWriteOffPage.currentPage : page.currentPage,
                size: page == null ? this.shopWriteOffPage.pageSize : page.pageSize,
                beginTime: this.useDateRange ? this.useDateRange[0] : null, // 开始时间
                endTime: this.useDateRange ? this.useDateRange[1] : null, // 结束时间
                couponStartTime: this.dateRange === null ? null : this.dateRange[0], // 开始时间
                couponEndTime: this.dateRange === null ? null : this.dateRange[1], // 结束时间
                launchTime: this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
                launchEndTime: this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
                couponName: this.searchForm.couponName,
                overdueStatus: this.searchForm.overdueStatus,
                putonStatus: this.searchForm.putonStatus,
                putSource: this.searchForm.putSource,
            }
          )
        }).then(({data}) => {
          this.shopWriteOffList = data.records
          this.shopWriteOffPage.total = data.total
        }).finally(()=>{
          this.writeOffLoading = false;
        })
      },
      shopWriteOffHandleSizeChange (val) {
        this.shopWriteOffPage.pageSize = val
        this.getWriteOffRecordList()
      },
      shopWriteOffHandleCurrentChange (val) {
        this.shopWriteOffPage.currentPage = val
        this.getWriteOffRecordList()
      },
      //导出
      exportData () {
        const loading = this.$loading({
          lock: true,
          target: '.shopWriteOffDetail',
          customClass: 'export-load',
          background: 'transparent',
          text: "数据导出中......"
        })
        this.$http({
          url: this.$http.adornUrl('/platform/couponUseRecord/shopDownloadWriteOff'),
          method: 'GET',
          params: this.$http.adornParams({
            writeOffShopId:this.writeOffShopId,
            beginTime: this.useDateRange ? this.useDateRange[0] : null, // 开始时间
            endTime: this.useDateRange ? this.useDateRange[1] : null, // 结束时间
            couponStartTime: this.dateRange === null ? null : this.dateRange[0], // 开始时间
            couponEndTime: this.dateRange === null ? null : this.dateRange[1], // 结束时间
            launchTime: this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
            launchEndTime: this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
            couponName: this.searchForm.couponName,
            overdueStatus: this.searchForm.overdueStatus,
            putonStatus: this.searchForm.putonStatus,
            putSource: this.searchForm.putSource,
          }),
          responseType: 'blob'
        }).then(({data}) => {
          loading.close()
          let fileName = this.shopName + "优惠券核销记录数据.xlsx";
          let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
          const elink = document.createElement('a')
          if ('download' in elink) {
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            navigator.msSaveBlob(blob, fileName)
          }
          this.$message({
            message: "导出成功",
            type: 'success',
            duration: 1500,
            onClose: () => {

            }
          })
        }).catch((e) => {
          loading.close()
        })
      },
      //重置使用时间
      resetUseTime(){
        this.useDateRange = []
      },
      //核销详细
      useNumDetail(){
        this.useDateRange = []
        this.couponWriteOffDetail()
        this.useNumDetailShow = true
      },
      //搜索核销明细
      searchUseNumDetail(){
        this.couponWriteOffDetail()
      },
      //优惠券核销详情
      couponWriteOffDetail(){
        this.useNumLoading = true;
        this.$http({
          url: this.$http.adornUrl('/platform/couponUseRecord/writeOffDetail'),
          method: 'get',
          params: this.$http.adornParams(
            {
              'beginTime': this.useDateRange === null ? null : this.useDateRange[0], // 开始时间
              'endTime': this.useDateRange === null ? null : this.useDateRange[1], // 结束时间
              'couponStartTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
              'couponEndTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
              'launchTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
              'launchEndTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
              'couponName': this.searchForm.couponName,
              'overdueStatus': this.searchForm.overdueStatus,
              'putonStatus': this.searchForm.putonStatus,
              'putSource': this.searchForm.putSource,
            }
          )
        }).then(({data}) => {
          this.couponUseList = data
        }).finally(()=>{
          this.useNumLoading = false;
        })
      },
      //数据统计点击
      statisticClick () {
        if (this.statisticName == '数据统计') {
          this.statisticName = '关闭统计'
        } else {
          this.statisticName = '数据统计'
        }
      },
      //表格自定义统计
      getSummaries (param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '单页合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (column.property === 'stocks' || column.property === 'takeNum' || column.property === 'useNum') {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += '张'
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      //tab切换
      handleClick (tab) {
        if (tab.name === 'first') {
          this.resetSearchForm('searchForm')
          this.searchForm.couponName = ''
          this.searchForm.overdueStatus = ''
          this.searchForm.putonStatus = ''
          this.searchForm.putSource = ''
          this.theData = null
          this.theParams = null
          this.page.currentPage = 1
          this.page.pageSize = 10
          this.getDataList(this.page)
          this.statisticData = null
          this.statisticCoupon()
          this.platformReceiveAndUseStatistic()
        } else {
          this.groupCouponPage.currentPage = 1
          this.groupCouponPage.pageSize = 10
          this.getGroupCoupon(this.groupCouponPage)
        }
      },
      searchCouponGroup(){
        this.groupCouponPage.currentPage = 1
        this.groupCouponPage.pageSize = 10
        this.getGroupCoupon(this.groupCouponPage)
      },
      // 每页数
      sizeChangeHandle (val) {
        this.couponPage.pageSize = val
        this.couponPage.currentPage = 1
        this.getCouponDataList(this.couponPage)
      },
      // 当前页
      currentChangeHandle (val) {
        this.couponPage.currentPage = val
        this.getCouponDataList(this.couponPage)
      },
      //优惠券搜索
      couponSearchChange () {
        this.getCouponDataList(this.couponPage)
      },
      //组合优惠券选择提交
      submitSelectCoupon () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataCouponListSelections.length == 0) {
              this.$message.error('请选择需要绑定的优惠券！')
              return
            }
            let requestData = []
            for (let i = 0; i < this.dataCouponListSelections.length; i++) {
              requestData.push({
                'couponId': this.dataCouponListSelections[i].couponId,
                'groupName': this.couponSearchForm.groupName
              })
            }
            this.$http({
              url: this.$http.adornUrl('/platform/couponOnly/save'),
              method: 'post',
              data: this.$http.adornData(requestData, false)
            }).then(({data}) => {
              this.$message({
                message: this.$i18n.t('publics.operation'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dataCouponListSelections = []
                  this.couponSelectShow = false
                  this.groupCouponPage.currentPage = 1
                  this.groupCouponPage.pageSize = 10
                  this.getGroupCoupon(this.groupCouponPage)
                }
              })
            })
          }
        })
      },
      //查询组合优惠券
      getGroupCoupon (groupCouponPage) {
        this.$http({
          url: this.$http.adornUrl('/platform/couponOnly/page'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                current: groupCouponPage == null ? this.groupCouponPage.currentPage : groupCouponPage.currentPage,
                size: groupCouponPage == null ? this.groupCouponPage.pageSize : groupCouponPage.pageSize,
              },
            )
          )
        }).then(({data}) => {
          this.groupCouponList = data.records
          this.groupCouponPage.total = data.total
        })
      },
      //组合优惠券页数
      groupCouponSizeChangeHandle (val) {
        this.groupCouponPage.pageSize = val
        this.groupCouponPage.currentPage = 1
        this.getGroupCoupon(this.groupCouponPage)
      },
      //组合优惠券分页
      groupCouponCurrentChangeHandle (val) {
        this.groupCouponPage.currentPage = val
        this.getGroupCoupon(this.groupCouponPage)
      },
      //优惠券选择
      couponSelectChangeHandle (selection) {
        this.couponList.forEach((tableItem) => {
          let selectedProdIndex = selection.findIndex((selectedCoupon) => {
            if (!selectedCoupon) {
              this.dataCouponListSelections = []
              return false
            }
            return selectedCoupon.couponId === tableItem.couponId
          })
          let dataSelectedProdIndex = this.dataCouponListSelections.findIndex((dataSelectedCoupon) => dataSelectedCoupon.couponId === tableItem.couponId)
          if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
            this.dataCouponListSelections.push(tableItem)
          } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
            this.dataCouponListSelections.splice(dataSelectedProdIndex, 1)
          }
        })
      },
      //优惠券列表
      getCouponDataList (couponPage) {
        this.couponListLoading = true
        this.$http({
          url: this.$http.adornUrl('/platform/coupon/couponPageList'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                current: couponPage == null ? this.couponPage.currentPage : couponPage.currentPage,
                size: couponPage == null ? this.couponPage.pageSize : couponPage.pageSize,
                getWay: 0
              },
              this.couponSearchForm
            )
          )
        }).then(({data}) => {
          this.couponList = data.records
          this.couponList.forEach((item, i) => {
            // 平台投放 / 用户领取
            item.couponType = item.couponType === 1 ? this.$t('coupon.cashCoupon') : (item.couponType === 2 ? this.$t('coupon.discountVoucher') : (item.couponType === 3 ? this.$t('coupon.coinCertificate') : (item.couponType === 4 ? "提货卡/券" : '')))
            this.$set(item, 'eachObtain', 1)
            this.dataCouponListSelections.forEach((multItem, j) => {
              if (this.couponList[i].couponId == this.dataCouponListSelections[j].couponId) {
                this.$refs.couponTable.toggleRowSelection(this.couponList[i], true)//这步操作是让  页面显示选中的数据
              }
            })
          })
          this.couponPage.total = data.total
          this.couponListLoading = false
        })
      },
      getRowKey: function (row) {
        return row.couponId
      },
      //通过分组编号获取绑定的优惠券
      getCouponByGroupNum (groupNum) {
        this.$http({
          url: this.$http.adornUrl('/platform/couponOnly/getCouponByGroupNum'),
          method: 'get',
          params: this.$http.adornParams({groupNum: groupNum})
        }).then(({data}) => {
          this.couponLookList = data
        })
      },
      //新增优惠券组合
      addCouponGroup () {
        this.couponSelectShow = true
        this.dataCouponListSelections = []
        this.couponSearchForm.groupName = ''
        this.couponPage.currentPage = 1
        this.couponPage.pageSize = 10
        this.getCouponDataList(this.couponPage)
        this.$refs.couponTable.clearSelection()
      },
      //修改优惠券
      lookGroup (item) {
        this.couponLookShow = true
        this.getCouponByGroupNum(item.groupNum)
        // this.couponLookList = item.coupon
      },
      //删除优惠券组合
      deleteCouponGroup (item) {
        this.$http({
          url: this.$http.adornUrl('/platform/couponOnly'),
          method: 'delete',
          data: this.$http.adornData(item.groupNum, false)
        }).then(({data}) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.groupCouponPage.currentPage = 1
              this.groupCouponPage.pageSize = 10
              this.getGroupCoupon(this.groupCouponPage)
            }
          })
        })
      },
      //优惠券统计
      platformReceiveAndUseStatistic(newData = false){
        if (newData || !this.statisticData) {
          this.theParams = JSON.parse(JSON.stringify(this.searchForm))
          this.statisticData = {
            'couponName': this.dataForm.couponName,
            'shopId': 0,
            'overdueStatus': this.dataForm.overdueStatus,
            'putonStatus': this.dataForm.putonStatus,
            'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
            'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
            'launchTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
            'launchEndTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
          }
        }

        this.$http({
          url: this.$http.adornUrl('/platform/coupon/platformReceiveAndUseStatistic'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              this.statisticData,
              this.theParams
            ), false
          )
        }).then(({data}) => {
          if(data){
            this.receiveAndUseStatistic = data
          }else{
            this.receiveAndUseStatistic ={
              yesterDayReceiveTotal:0,
              todayReceiveTotal:0,
              yesterDayUseTotal:0,
              todayUseTotal:0
            }
          }
        })
      },
      //优惠券统计
      statisticCoupon(newData = false){
        if (newData || !this.statisticData) {
          this.theParams = JSON.parse(JSON.stringify(this.searchForm))
          this.statisticData = {
            'couponName': this.dataForm.couponName,
            'shopId': 0,
            'overdueStatus': this.dataForm.overdueStatus,
            'putonStatus': this.dataForm.putonStatus,
            'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
            'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
            'launchTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
            'launchEndTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
          }
        }

        this.$http({
          url: this.$http.adornUrl('/platform/coupon/statistic'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              this.statisticData,
              this.theParams
            ), false
          )
        }).then(({data}) => {
          if(data){
            this.couponStatistic = data
          }else{
            this.couponStatistic = {
              stocksTotal:0,
              sourceStockTotal:0,
              takeNumTotal:0,
              useNumTotal:0
            }
          }
        })
      },
      // 获取数据列表
      getDataList (page, newData = false) {
        this.dataListLoading = true
        if (this.page) {
          let size = Math.ceil(this.page.total / this.page.pageSize)
          this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
        }

        if (newData || !this.theData) {
          this.theParams = JSON.parse(JSON.stringify(this.searchForm))
          this.theData = {
            current: page == null ? this.page.currentPage : page.currentPage,
            size: page == null ? this.page.pageSize : page.pageSize,
            'couponName': this.dataForm.couponName,
            'shopId': this.dataForm.shopId,
            'overdueStatus': this.dataForm.overdueStatus,
            'putonStatus': this.dataForm.putonStatus,
            'putSource': this.dataForm.putSource,
            'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
            'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
            'launchTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
            'launchEndTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
          }
        } else {
          this.theData.current = page == null ? this.page.currentPage : page.currentPage
          this.theData.size = page == null ? this.page.pageSize : page.pageSize
        }

        this.$http({
          url: this.$http.adornUrl('/platform/coupon/page'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              this.theData,
              this.theParams
            ), false
          )
        }).then(({data}) => {
          this.dataList = data.records
          this.page.total = data.total
        }).finally(()=>{
          this.dataListLoading = false
        })
      },
      orderStatus () {

      },
      // 新增 / 修改
      addOrUpdateHandle (val) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(val)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(this.$i18n.t('remindPop.makeSure') + ' ' + `[${id ? this.$i18n.t('remindPop.delete') : this.$i18n.t('remindPop.batchDeletion')}]` + ' ' + this.$i18n.t('remindPop.operation') + '?', this.$i18n.t('remindPop.remind'), {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl('/platform/coupon'),
              method: 'delete',
              data: this.$http.adornData(id, false)
            }).then(({data}) => {
              this.page.total = this.page.total - 1
              this.$message({
                message: this.$i18n.t('remindPop.success'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.refreshChange()
                }
              })
            })
          })
          .catch(() => {
          })
      },
      // 条件查询
      searchChange (newData = false) {
        this.page.currentPage = 1
        this.getDataList(this.page, newData)
        this.statisticCoupon(newData)
        this.platformReceiveAndUseStatistic(newData)
      },
      // 刷新回调用
      refreshChange () {
        this.getDataList(this.page)
        this.statisticCoupon()
        this.platformReceiveAndUseStatistic()
      },
      // 多选变化
      selectionChange (val) {
        this.dataListSelections = val
      },
      // 清空自定义数据
      searchReset () {
        this.dateRange = []
        this.launchDateRange = []
      },

      // 下线管理
      auditEventHandle (id) {
        this.offlineEventHandleVisible = true
        this.$nextTick(() => {
          this.$refs.offlineEvent.init(id)
        })
      },
      /**
       * 重置表单
       * @param {String} formName 表单名称
       */
      resetSearchForm (formName) {
        this.$refs[formName].resetFields()
        this.searchReset()
      },

      handleSizeChange (val) {
        this.page.pageSize = val
        this.getDataList()
      },
      handleCurrentChange (val) {
        this.page.currentPage = val
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss" scoped>
    .marginBottom {
        margin-bottom: 20px
    }

    .couponGroup {
        .time {
            font-size: 13px;
            color: #999;
        }

        .bottom {
            margin-top: 13px;
            line-height: 12px;
        }

        .button {
            padding: 0;
            float: right;
        }

        .image {
            width: 100%;
            display: block;
        }

        .clearfix:before,
        .clearfix:after {
            display: table;
            content: "";
        }

        .clearfix:after {
            clear: both
        }

        .el-dropdown-link {
            cursor: pointer;
            color: #409EFF;
        }

        .el-icon-arrow-down {
            font-size: 12px;
        }

        .operation-bar {
            margin-bottom: 10px;
        }
    }
    .data-statistics {
        margin: 30px 0 0;
        padding: 28px 0 32px;
        border-radius: 3px;
        border: 1px solid #EBEBEB;
        .statistics-list {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            .item {
                .title {
                    color: gray;
                    margin-bottom: 10px;
                }
                .amount {
                    margin-bottom: 10px;
                    .amount-num {
                        padding-right: 3px;
                        font-weight: 600;
                        font-size: 20px;
                    }
                }
                .detail-text {
                    color: #1965ff;
                    cursor: pointer;
                }
            }
        }
    }
</style>
