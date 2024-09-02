<template>
    <div class="cardBatchManage">
        <!-- 搜索栏 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item label="批次号" class="search-form-item">
                        <el-select filterable v-model="searchForm.batchNumber" clearable placeholder="请选择" style="width: 100%">
                            <el-option :label="item" :value="item" v-for="(item,index) in batchNumList" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" class="search-form-item">
                        <el-input type="text" v-model="searchForm.cardTitle" placeholder="请输入关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="卡前缀" class="search-form-item">
                        <el-input type="text" v-model="searchForm.cardPrefix" placeholder="请输入卡前缀"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" class="search-form-item">
                        <el-select filterable v-model="searchForm.batchStatus" clearable placeholder="请选择" style="width: 100%">
                            <el-option label="未制卡(券)" :value="0"></el-option>
                            <el-option label="未出售" :value="1"></el-option>
                            <el-option label="已出售" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
<!--                    <el-form-item label="发放店铺" class="search-form-item">-->
<!--                        <el-select filterable v-model="searchForm.shopId" placeholder="请选择店铺" style="width: 100%">-->
<!--                            <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopId">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
                    <el-form-item label="类型" class="search-form-item">
                        <el-select filterable v-model="searchForm.cardType" clearable placeholder="请选择类型" style="width: 100%">
                            <el-option v-for="item in cardTypeList" :key="item.value" :label="item.title" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="批次时间" label-width="70px">
                        <el-date-picker
                                v-model="launchDateRange"
                                type="datetimerange"
                                :range-separator="$t('coupon.to')"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :start-placeholder="$t('coupon.startTime')"
                                :end-placeholder="$t('coupon.endTime')"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
                        <div class="default-btn" @click="resetSearchForm('searchForm')">{{ $t('product.reset') }}</div>
                        <div class="default-btn primary-btn" v-if="isAuth('platform:card:makeCard')" @click.stop="btnClick(1)">制卡(券)</div>
                        <div class="default-btn primary-btn" v-if="isAuth('platform:card:sellCard')" @click.stop="btnClick(2)">出售并充值</div>
                        <div class="default-btn primary-btn" v-if="isAuth('platform:card:changeCard')" @click.stop="replacementCard()">置换卡</div>
                        <div class="default-btn" v-if="isAuth('platform:card:batchFreezeCard')"
                             style="background-color: #f56c6c;color: #fff;border: 1px solid #f56c6c;"
                             @click.stop="btnClick(3)">冻结卡</div>
                        <div class="default-btn" v-if="isAuth('platform:card:soldToUnsold')"
                             style="background-color: #f56c6c;color: #fff;border: 1px solid #f56c6c;"
                             @click.stop="btnClick(4)">已售转未售</div>
<!--                        <div class="default-btn primary-btn" @click.stop="rechargeCard()">充值</div>-->
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="main-container">
            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table ref="activityTable" @selection-change="handleSelectionChange"
                          v-loading="tableLoading" :data="dataList" header-cell-class-name="table-header" row-class-name="table-row-low" style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column prop="batchNumber" label="批次号" min-width="80">
                    </el-table-column>
                    <el-table-column prop="cardTitle" label="名称" min-width="150">
                    </el-table-column>
                    <el-table-column prop="cardPrefix" label="卡前缀" min-width="60">
                    </el-table-column>
                    <el-table-column prop="cardType" label="类别" min-width="80">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.cardType === 1 ? 'success' : ''" effect="dark">{{cardTypeList.find(item => item.value == scope.row.cardType)
                                .title}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cardNum" label="数量" min-width="80">
                    </el-table-column>
                    <el-table-column prop="soldNum" label="已售" min-width="80">
                    </el-table-column>
                    <el-table-column prop="totalAmount" label="累计金额(元)" min-width="100">
                    </el-table-column>
                    <el-table-column prop="batchStatus" label="状态" min-width="100">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.batchStatus === 0" type="info" effect="dark">未制卡(券)</el-tag>
                            <el-tag v-if="scope.row.batchStatus === 1" type="" effect="dark">未出售</el-tag>
                            <el-tag v-if="scope.row.batchStatus === 2" type="danger" effect="dark">已出售</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="batchTime" label="批次时间" min-width="120">
                    </el-table-column>
                    <el-table-column label="有效期" min-width="150">
                        <template slot-scope="scope" v-if="scope.row.userStartTime && scope.row.userEndTime">
                            {{ scope.row.userStartTime }} 至 {{ scope.row.userEndTime }}
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column align="center" :label="$t('publics.operating')" width="250" v-if="isAuth('platform:card:operate')">
                        <template slot-scope="scope">
                            <div class="text-btn-con" style="display: inline-block;">
                                <div class="default-btn text-btn" @click.stop="editHandle(scope.row)">
                                    查看
                                </div>
                                <div class="default-btn text-btn" @click.stop="detailsHandle(scope.row.batchNumber)">
                                    明细
                                </div>
                                <div class="default-btn text-btn" v-if="scope.row.children" @click.stop="batchInfoHandle(scope.row.children)">
                                    批次信息
                                </div>
                                <div class="default-btn text-btn" v-if="scope.row.batchStatus === 0" @click.stop="deleteHandle(scope.row.batchNumber)">
                                    删除
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
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
        <!--    出售并充值/冻结/出售转未售    -->
        <el-dialog :visible.sync="numberShow" :title="btnType == 2 ? '出售并充值' : btnType == 3 ? '冻结' : btnType == 4 ? '出售转未售' : '编号'" :mask-closable="false" :draggable="false"
                   width="480px">
            <div style="display: flex;align-items: center;">
                <div style="width: 80px;">起止编号：</div>
                <div style="display: flex;align-items: center;">
                    <el-input v-model="startNum" @blur="startNumChange" type="number" size="small" placeholder="请输入开始编号"></el-input>
                    <div>至</div>
                    <el-input v-model="endNum" @blur="endNumChange" type="number" size="small" placeholder="请输入结束编号"></el-input>
                </div>
            </div>
            <div style="display: flex;align-items: center;margin-top: 15px;" v-if="btnType === 2">
                <div style="width: 80px;">数量：</div>
                <div style="display: flex;align-items: center;width: 83%;">
                    <el-input v-model="sellCardNum" readonly size="small"></el-input>
                </div>
            </div>
            <div style="display: flex;align-items: center;margin-top: 15px;" v-if="btnType === 3 || btnType === 4">
                <div style="width: 80px;">数量：</div>
                <div style="display: flex;align-items: center;width: 83%;">
                    <el-input v-model="cardNum" readonly size="small"></el-input>
                </div>
            </div>
            <div style="display: flex;align-items: center;margin-top: 15px;" v-if="btnType === 2">
                <div style="width: 80px;">购买单位：</div>
                <div style="display: flex;align-items: center;width: 83%;">
                    <el-input v-model="buyUnit" style="width: 100%;" size="small" placeholder="请输入购买单位" type="text">
                    </el-input>
                </div>
            </div>
            <div style="display: flex;align-items: center;margin-top: 15px;" v-if="btnType === 2">
                <div style="width: 80px;">充值金额：</div>
                <div style="display: flex;align-items: center;width: 83%;">
                    <el-input v-model="balance" size="small" placeholder="请输入充值金额" type="number" @change="balanceChange" min="0">
                        <template slot="append">{{ $t('coupon.yuan') }}</template>
                    </el-input>
                </div>
            </div>
            <div style="display: flex;align-items: center;margin-top: 15px;" v-if="btnType === 2">
              <div style="width: 80px;">出售时间：</div>
              <div style="display: flex;align-items: center;width: 83%;">
                <el-date-picker
                    v-model="sellTime"
                    type="date"
                    placeholder="选择出售时间"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    readonly
                >
                </el-date-picker>
              </div>
            </div>
            <div style="display: flex;align-items: center;margin-top: 15px;" v-if="btnType === 2">
              <div style="width: 80px;">购买事由：</div>
              <div style="display: flex;align-items: center;width: 83%;">
                <el-input v-model="buyReason" style="width: 100%;" size="small" placeholder="请输入购买事由" type="textarea">
                </el-input>
              </div>
            </div>
            <div slot="footer">
                <div class="default-btn primary-btn" v-if="btnType == 2" @click.stop="sell()">确定</div>
                <div class="default-btn primary-btn" v-if="btnType == 3" @click.stop="batchFreeze()">确定</div>
                <div class="default-btn primary-btn" v-if="btnType == 4" @click.stop="soldToUnsold()">确定</div>
                <div class="default-btn" @click="(numberShow = false)">关闭</div>
            </div>
        </el-dialog>
        <!--    批次信息查看    -->
        <el-dialog :visible.sync="lookVisible" title="批次信息" :mask-closable="false" :draggable="false"
                   width="500px">
            <el-form :model="batchCardInfo" ref="batchCardInfo" :rules="batchCardRule" label-width="110px">
                <el-form-item label="批次号">
                    <el-input v-model="batchCardInfo.batchNumber" disabled size="small" placeholder="批次号"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="cardTitle">
                    <el-input v-model="batchCardInfo.cardTitle" :disabled="!isEdit" size="small" placeholder="请输入会员卡名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="cardType">
                    <el-select style="width: 100%;" v-model="batchCardInfo.cardType" :disabled="!isEdit" placeholder="请选择类型">
                        <el-option v-for="(item,index) in cardTypeList" :key="index" :label="item.title" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="batchCardInfo.cardNum" disabled type="number" size="small" placeholder="数量"></el-input>
                </el-form-item>
                <el-form-item label="累计金额">
                    <el-input v-model="batchCardInfo.totalAmount" disabled placeholder="累计金额" type="number" min="0">
                        <template slot="append">{{ $t('coupon.yuan') }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="状态" class="search-form-item" prop="batchStatus">
                    <el-select filterable v-model="batchCardInfo.batchStatus" disabled placeholder="请选择" style="width: 100%">
                        <el-option label="未制卡(券)" :value="0"></el-option>
                        <el-option label="未出售" :value="1"></el-option>
                        <el-option label="已出售" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="批次时间">
                    <el-date-picker
                            disabled
                            v-model="batchCardInfo.batchTime"
                            type="datetime"
                            placeholder="选择批次时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开始时间" prop="userStartTime">
                    <el-date-picker
                            :disabled="!isEdit"
                            v-model="batchCardInfo.userStartTime"
                            type="date"
                            placeholder="选择开始时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="userEndTime">
                    <el-date-picker
                            :disabled="!isEdit"
                            v-model="batchCardInfo.userEndTime"
                            type="date"
                            placeholder="选择结束时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <div class="default-btn" @click="(lookVisible = false)">关闭</div>
                <div v-if="isEdit" class="default-btn primary-btn" @click="dataFormSubmit()" :loading="isSubmit">
                    提交
                </div>
            </div>
        </el-dialog>
        <!--   批次卡明细     -->
        <batch-card-list v-if="batchCardShow" ref="batchCardList"></batch-card-list>
        <!--       -->
        <el-dialog :visible.sync="recordVisible" title="批次信息" :mask-closable="false" :draggable="false"
                   width="800px">
            <div>
                <el-table style="width: 100%;background: none" :data="batchInfoList">
                    <el-table-column label="编号" prop="sellRecordNum" min-width="120">
                    </el-table-column>
                    <el-table-column prop="cardNum" label="数量" min-width="100">
                    </el-table-column>
                    <el-table-column prop="totalAmount" label="累计金额(元)" min-width="100">
                    </el-table-column>
                    <el-table-column prop="balance" label="单张金额(元)" min-width="100">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" min-width="100">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status === 0" type="info" effect="dark">未制卡(券)</el-tag>
                            <el-tag v-if="scope.row.status === 1" type="" effect="dark">未出售</el-tag>
                            <el-tag v-if="scope.row.status === 2" type="danger" effect="dark">已出售</el-tag>
                            <el-tag v-if="scope.row.status === 3" type="success" effect="dark">已绑定</el-tag>
                            <el-tag v-if="scope.row.status === 4" type="warning" effect="dark">已冻结</el-tag>
                            <el-tag v-if="scope.row.status === 5" type="warning" effect="dark">已置换</el-tag>
                            <el-tag v-if="scope.row.status === 6" type="warning" effect="dark">已核销</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buyUnit" label="购买单位" min-width="100">
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer">
                <div class="default-btn" @click="(recordVisible = false)">关闭</div>
            </div>
        </el-dialog>
        <!--    置换卡    -->
        <el-dialog :visible.sync="replacementCardShow" title="置换卡" :close-on-click-modal="false"
                   width="480px" class="replacement">
            <div style="display: flex;align-items: center;margin-bottom: 10px;" v-for="(item, index) in couponCardCodeList" :key="index">
                <div style="width: 120px;">实物券号：</div>
                <div style="display: flex;align-items: center;width: 83%;">
                    <el-input v-model="item.couponCardCode" @blur="couponCardCodeChange" size="small" placeholder="请输入实物券号"></el-input>
                </div>
                <i @click="addCouponCardClick" v-if="index == 0" class="el-icon-circle-plus-outline" style="color: #155bd4;font-size: 25px;margin-left: 10px;"></i>
                <i @click="delCouponCardClick(item)" v-if="index > 0" class="el-icon-delete-solid" style="color: #155bd4;font-size: 25px;margin-left: 10px;"></i>
            </div>
            <div style="display: flex;align-items: center;margin-bottom: 10px;height: 40px;">
                <div style="width: 120px;">是否分卡：</div>
                <el-radio-group v-model="isScoreCard" @change="isScoreCardChange()">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </div>
            <div v-if="displaceShow">
                <div style="display: flex;align-items: center;margin-bottom: 10px;">
                    <div style="width: 120px;">实物券总余额：</div>
                    <div style="display: flex;align-items: center;width: 83%;margin-right: 35px;">
                        <el-input v-model="couponCardBalance" readonly type="number" min="0" size="small">
                            <template slot="append">{{ $t('coupon.yuan') }}</template>
                        </el-input>
                    </div>
                </div>
                <div v-if="isScoreCard == 0" style="display: flex;align-items: center;margin-bottom: 10px;height: 40px;">
                    <div style="width: 120px;">是否有卡：</div>
                        <el-radio-group v-model="isHaveCard" @change="isHaveCardChange()">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                </div>
                <div v-if="isScoreCard == 0 && isHaveCard == 0">
                    <div style="display: flex;align-items: center;">
                        <div style="width: 120px;">置换卡编号：</div>
                        <div class="input" style="display: flex;align-items: center;width: 83%;margin-right: 35px;">
                            <el-input v-model="startNum" type="number" size="small" placeholder="请输入置换编号"></el-input>
                        </div>
                    </div>
                    <div style="margin-left: 100px;color: red;padding: 5px;">置换卡编号为纯数字</div>
                    <div style="display: flex;align-items: center;margin-bottom: 10px;">
                        <div style="width: 120px;">提货卡余额：</div>
                        <div style="display: flex;align-items: center;width: 83%;margin-right: 35px;">
                            <el-input v-model="cardBalance" readonly type="number" min="0" size="small">
                                <template slot="append">{{ $t('coupon.yuan') }}</template>
                            </el-input>
                        </div>
                    </div>
                </div>
                <div v-if="isScoreCard == 1 && isHaveCard == 0">
                    <div style="display: flex;margin-bottom: 10px;" v-for="(item, index) in cardInfoList" :key="index">
                        <div style="width: 100%;">
                            <div style="display: flex;align-items: center;">
                                <div style="width: 120px;">{{"置换卡" + (index+1) + "编号："}}</div>
                                <div class="input" style="display: flex;align-items: center;width: 90%;">
                                    <el-input v-model="item.startNum" type="number" size="small" placeholder="请输入置换卡编号"></el-input>
                                </div>
                            </div>
                            <div style="margin-left: 100px;color: red;padding: 5px;">置换卡编号为纯数字</div>
                            <div style="display: flex;align-items: center;margin-bottom: 10px;">
                                <div style="width: 120px;">{{"置换卡" + (index+1) + "余额："}}</div>
                                <div style="display: flex;align-items: center;width: 90%;">
                                    <el-input v-model="item.balance" type="number" min="0" size="small">
                                        <template slot="append">{{ $t('coupon.yuan') }}</template>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                        <div>
                            <i @click="addCardInfoClick" v-if="index == 0" class="el-icon-circle-plus-outline" style="color: #155bd4;font-size: 25px;margin-left: 10px;"></i>
                            <i @click="delCardInfoClick(item)" v-if="index > 0" class="el-icon-delete-solid" style="color: #155bd4;font-size: 25px;margin-left: 10px;"></i>
                        </div>
                    </div>
                </div>
                <div v-if="isHaveCard == 1">
                    <div style="display: flex;align-items: center;margin-bottom: 10px;">
                        <div style="width: 120px;">原卡号：</div>
                        <div style="display: flex;align-items: center;width: 83%;margin-right: 35px;">
                            <el-input v-model="oldCardCode" type="number"
                                      @blur="oldCardCodeChange"
                                      size="small" placeholder="请输入原卡号"></el-input>
                        </div>
                    </div>
                    <div style="display: flex;align-items: center;margin-bottom: 10px;">
                        <div style="width: 120px;">原卡余额：</div>
                        <div style="display: flex;align-items: center;width: 83%;margin-right: 35px;">
                            <el-input v-model="oldCardBalance" readonly type="number" min="0" size="small">
                                <template slot="append">{{ $t('coupon.yuan') }}</template>
                            </el-input>
                        </div>
                    </div>
                    <div style="display: flex;align-items: center;margin-bottom: 10px;">
                        <div style="width: 120px;">充值金额：</div>
                        <div style="display: flex;align-items: center;width: 83%;margin-right: 35px;">
                            <el-input v-model="couponCardBalance" readonly type="number" min="0" size="small">
                                <template slot="append">{{ $t('coupon.yuan') }}</template>
                            </el-input>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="default-btn primary-btn" v-if="displaceShow" @click.stop="replacementCardSubmit()">确定</div>
                <div class="default-btn" @click="(replacementCardShow = false)">关闭</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import batchCardList from './batchCardList'
  export default {
    name: 'cardBatchManage',
    components: {batchCardList},
    data () {
      var validateTime = (rule, value, callback) => {
        if (Date.parse(this.batchCardInfo.userStartTime) >= Date.parse(this.batchCardInfo.userEndTime)) {
          callback(new Error("开始时间不能大于或等于结束时间"))
        } else {
          callback()
        }
      }
      return {
        dataList: [],
        searchForm: {},
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        shopList: [],
        tableLoading:false,
        cardTypeList: [],
        launchDateRange: null,
        batchNumList:[],
        balance:0,
        batchNumbers:[],
        lookVisible:false,
        batchCardInfo:{},
        batchCardShow:false,
        isEdit:false,
        isSubmit:false,
        batchCardRule: {
          cardTitle: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          cardType: [
            {required: true, message: '请选择类别', trigger: 'blur'}
          ],
          userStartTime: [
            { required: true, message: "开始时间不能为空", trigger: 'blur' },
            { validator: validateTime, trigger: 'blur' }
          ],
          userEndTime: [
            { required: true, message: "结束时间不能为空", trigger: 'blur' },
            { validator: validateTime, trigger: 'blur' }
          ],
        },
        selectBatchNumber:[],
        btnType: "",//按钮类型
        startNum:"",//开始编号
        endNum:"",//结束编号
        sellCardNum:0,//出售数量
        cardNum:0,//冻结或出售转未售
        numberShow:false,
        recordVisible:false,
        batchInfoList:[],
        buyUnit:"",
        replacementCardShow:false,
        couponCardCode:'', //置换的实物券号
        couponCardBalance:0,//置换实物券余额
        cardBalance:0,//置换提货卡余额
        displaceShow:false,
        couponCardCodeList:[
          {couponCardCode:''}
        ], //实物券号列表
        cardCodeArr:[],//置换卡的实物券号
        isScoreCard: 0, //是否分卡
        cardInfoList: [
          {startNum:'',balance:0}
        ],
        isHaveCard:0,//是否有卡
        oldCardCode:'',//原卡号
        oldCardBalance:0,//原卡余额
        oldCardFlag:false,//原卡信息查询状态
        sellTime:null,//出售时间
        buyReason:'',//购买事由
      }
    },
    methods: {
      //是否分开改变
      isScoreCardChange(){
        this.cardInfoList = [{startNum:'',balance:0}];
        this.isHaveCard = 0
      },
      //是否有卡改变
      isHaveCardChange(){
        this.oldCardCode = ""
        this.oldCardBalance = 0
      },
      //增加实物券号
      addCouponCardClick(){
        this.couponCardCodeList.push({couponCardCode:''})
      },
      //删除实物券号
      delCouponCardClick(item){
        var index = this.couponCardCodeList.indexOf(item)
        if (index !== -1) {
          this.couponCardCodeList.splice(index, 1);
          if(item.couponCardCode){
            this.couponCardCodeChange()
          }
        }
      },
      //分卡增加卡信息
      addCardInfoClick(){
        this.cardInfoList.push({startNum:'',balance:0})
      },
      //分卡删除卡信息
      delCardInfoClick(item){
        var index = this.cardInfoList.indexOf(item)
        if (index !== -1) {
          this.cardInfoList.splice(index, 1);
        }
      },
      //开始编号改变
      startNumChange(){
        if(!this.startNum || this.startNum == 0){
          this.$message.warning("开始编号不能为0或为空");
          return
        }
        if(this.endNum < this.startNum && !this.endNum && this.endNum !== 0){
          this.$message.warning("结束编号不能小于开始编号");
          return
        }
        if(isNaN(this.startNum)){
          this.$message.warning("开始编号只能是纯数字");
          return
        }
        if(this.startNum && this.endNum){
          if(this.btnType == 2){
            this.getSellCardNum(this.selectBatchNumber[0].batchNumber,this.startNum,this.endNum)
          }else{
            this.getCardNum(this.selectBatchNumber[0].batchNumber,this.startNum,this.endNum)
          }
        }
      },
      //结束编号改变
      endNumChange(){
        if(!this.endNum || this.endNum == 0){
          this.$message.warning("结束编号不能为0或为空");
          return
        }
        if(this.endNum < this.startNum && !this.startNum && this.startNum !== 0){
          this.$message.warning("结束编号不能小于开始编号");
          return
        }
        if(isNaN(this.endNum)){
          this.$message.warning("结束编号只能是纯数字");
          return
        }
        if(this.startNum && this.endNum){
          if(this.btnType == 2){
            this.getSellCardNum(this.selectBatchNumber[0].batchNumber,this.startNum,this.endNum)
          }else{
            this.getCardNum(this.selectBatchNumber[0].batchNumber,this.startNum,this.endNum)
          }
        }
      },
      //原卡号改变
      oldCardCodeChange(){
        this.oldCardFlag = true
        this.$http({
          url: this.$http.adornUrl(
            '/platform/card/getCardInfoByCardCode'
          ),
          method: 'get',
          params: this.$http.adornParams({cardCode:this.oldCardCode}),
        }).then(({data}) => {
          this.oldCardFlag = false
          this.oldCardBalance = data.balance;
          this.oldCardCode = data.cardCode;
        })
      },
      //实物券号改变
      couponCardCodeChange(){
        const newArr = this.couponCardCodeList.map(item=>item.couponCardCode);
        const isRepeat = newArr.some((item,index,arr)=>arr.indexOf(item)!=index);
        if(isRepeat){
          this.$message.warning("存在相同实物券号，或存在多个未填实物券号");
          return
        }
        this.cardCodeArr = [];
        this.couponCardCodeList.map(item=>{
          this.cardCodeArr.push(item.couponCardCode);
        })
        this.displaceShow = false;
        this.$http({
          url: this.$http.adornUrl(
            '/platform/card/getCouponCardInfoByCardCodes'
          ),
          method: 'get',
          params: this.$http.adornParams({cardCodeList:this.cardCodeArr}),
        }).then(({data}) => {
          this.displaceShow = true;
          this.couponCardBalance = data.balance;
          this.cardBalance = this.couponCardBalance;
        })
      },
      //确认置换
      replacementCardSubmit(){
        const newArr = this.couponCardCodeList.map(item=>item.couponCardCode);
        const isRepeat = newArr.some((item,index,arr)=>arr.indexOf(item)!=index);
        if(isRepeat){
          this.$message.warning("存在相同实物券号，或存在多个未填实物券号");
          return
        }
        if(this.isHaveCard == 0){
          if(this.isScoreCard == 0){//单卡
            this.singleCard();
          }else if(this.isScoreCard == 1){//多卡
            this.manyCard();
          }
        }else if(this.isHaveCard == 1){
          this.oldCardRecharge()
        }
      },
      //原卡充值
      oldCardRecharge(){
        if(this.oldCardFlag){
          return
        }
        if(!this.oldCardCode){
          this.$message.warning("原卡号不能为空");
          return
        }
        this.$http({
          url: this.$http.adornUrl('/platform/card/rechargeCardBalance'),
          method: 'post',
          data:  this.$http.adornData({
            cardCode: this.oldCardCode,
            balance: this.couponCardBalance,
            couponCardCodes:this.cardCodeArr.join(",")
          })
        }).then(({data}) => {
          this.oldCardCode = ""
          this.isHaveCard = 0
          this.oldCardBalance = 0
          this.replacementCardShow = false;
          this.displaceShow = false;
          this.refreshChange()
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
          })
        })
      },
      //单券或多券置换单卡
      singleCard(){
        if(!this.startNum || this.startNum == 0){
          this.$message.warning("置换卡编号不能为0或为空");
          return
        }
        if(!(!isNaN(parseFloat(this.startNum)) && isFinite(this.startNum))){
          this.$message.warning("置换卡编号请输入纯数字");
          return
        }
        if(this.cardBalance != this.couponCardBalance){
          this.$message.warning("实物券余额与提货卡余额不一致");
          return
        }
        this.$http({
          url: this.$http.adornUrl('/platform/card/replacementCard'),
          method: 'post',
          data:  this.$http.adornData({
            batchNumber: this.selectBatchNumber[0].batchNumber,
            startNum: this.startNum,
            balance: this.cardBalance,
            couponCardCodes:this.cardCodeArr.join(",")
          })
        }).then(({data}) => {
          this.replacementCardShow = false;
          this.displaceShow = false;
          this.refreshChange()
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
          })
        })
      },
      //单券或多券置换多卡
      manyCard(){
        for (let i = 0; i < this.cardInfoList.length; i++) {
          if(!this.cardInfoList[i].startNum || this.cardInfoList[i].startNum == 0){
            this.$message.warning("置换卡编号存在为0或为空");
            return
          }
          if(!(!isNaN(parseFloat(this.cardInfoList[i].startNum)) && isFinite(this.cardInfoList[i].startNum))){
            this.$message.warning("置换卡编号请输入纯数字");
            return
          }
          if(!this.cardInfoList[i].balance || this.cardInfoList[i].balance == 0){
            this.$message.warning("置换卡余额存在为0或为空");
            return
          }
        }
        let amountArr = this.cardInfoList.map(item=>item.balance);
        amountArr = amountArr.map(Number);
        let sumAmount = 0;
        sumAmount = amountArr.reduce((x,y)=>{
          return x + y
        })
        if(this.couponCardBalance != sumAmount){
          this.$message.warning("实物券总余额与提货卡合计余额不一致");
          return
        }
        this.$http({
          url: this.$http.adornUrl('/platform/card/replacementManyCard'),
          method: 'post',
          data:  this.$http.adornData({
            batchNumber: this.selectBatchNumber[0].batchNumber,
            couponCardCodes:this.cardCodeArr.join(","),
            cardInfos: this.cardInfoList
          })
        }).then(({data}) => {
          this.replacementCardShow = false;
          this.displaceShow = false;
          this.refreshChange()
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
          })
        })
      },
      //通过起始编号获取出售数量
      getSellCardNum(batchNumber,startNum,endNum){
        this.$http({
          url: this.$http.adornUrl('/platform/card/getSellCardNum'),
          method: 'post',
          data: this.$http.adornData({
            batchNumber: batchNumber,
            startNum:startNum,
            endNum:endNum
          })
        }).then(({data}) => {
          this.sellCardNum = data
        })
      },
      //通过起始编号获取出售数量
      getCardNum(batchNumber,startNum,endNum){
        this.$http({
          url: this.$http.adornUrl('/platform/card/getCardNumByNumber'),
          method: 'post',
          data: this.$http.adornData({
            batchNumber: batchNumber,
            startNum:startNum,
            endNum:endNum
          })
        }).then(({data}) => {
          this.cardNum = data
        })
      },
      //批次信息修改提交
      dataFormSubmit(){
        this.$refs['batchCardInfo'].validate((valid) => {
          if (valid) {
            this.isSubmit = true;
            this.$http({
              url: this.$http.adornUrl('/platform/card/updateCardBybatchNumber'),
              method: 'post',
              data:  this.$http.adornData({
                batchNumber: this.batchCardInfo.batchNumber,
                cardTitle: this.batchCardInfo.cardTitle,
                cardType: this.batchCardInfo.cardType,
                userStartTime: this.batchCardInfo.userStartTime,
                userEndTime: this.batchCardInfo.userEndTime,
                shopId: 0
              })
            }).then(({data}) => {
              this.lookVisible = false;
              this.refreshChange()
              this.$message({
                message: this.$i18n.t('publics.operation'),
                type: 'success',
                duration: 1500,
              })
            }).finally(()=>{
              this.isSubmit = false;
            })
          }
        })
      },
      //勾选批次号
      handleSelectionChange(val) {
        this.selectBatchNumber = val;
      },
      // 制卡、出售、冻结按钮
      btnClick(type){
        this.btnType = type;
        if(this.selectBatchNumber.length > 1 && type == 1){
          let b = this.selectBatchNumber.every(item=>item.batchStatus === this.selectBatchNumber[0].batchStatus)
          if(!b){
            this.$message.warning("勾选批次存在不同状态");
            return
          }
        }
        this.batchNumbers = this.selectBatchNumber.map(item => item.batchNumber);
        if(this.batchNumbers.length < 1){
          this.$message.warning("请选择批次");
          return
        }
        this.balance = 0;
        this.startNum = "";
        this.endNum = "";
        this.buyUnit = "";
        this.sellCardNum = 0;
        this.cardNum = 0;
        let str = "";
        if (type === 1) {
          if(this.selectBatchNumber[0].batchStatus > 0){
            this.$message.warning("已选批次不能再次制卡(券)");
            return
          }
          str = "已制卡(券)"
        }else if(type === 2){
          if(this.selectBatchNumber.length > 1){
            this.$message.warning("只能选择1个批次出售");
            return
          }
          if(this.selectBatchNumber[0].batchStatus > 1){
            this.$message.warning("已选批次不能再次出售");
            return
          }
          if(this.selectBatchNumber[0].batchStatus == 0){
            this.$message.warning("已选批次还未制卡(券)暂不能出售");
            return
          }
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          const thisDayDate = `${year}-${month}-${day}`; //打印当前日期
          this.sellTime = thisDayDate
          this.buyReason = ''
          str = "出售"
        }else if (type === 3) {
          if(this.selectBatchNumber.length > 1){
            this.$message.warning("只能选择1个批次冻结");
            return
          }
          str = "冻结"
        }else if (type === 4) {
          if(this.selectBatchNumber.length > 1){
            this.$message.warning("只能选择1个批次出售转未售");
            return
          }
          str = "出售转未售"
        }
        if(type === 1){
          this.$confirm("确认" + str, this.$i18n.t('text.tips'), {
            confirmButtonText: this.$i18n.t('coupon.confirm'),
            cancelButtonText: this.$i18n.t('coupon.cancel'),
            type: 'warning'
          }).then(() => {
              this.makeCard();
          })
        }else if(type === 2) {
          this.numberShow = true;
          this.getMinNotSoldCardNumber(this.selectBatchNumber[0].batchNumber,0)
        }else if(type === 3) {
          this.numberShow = true;
        }else if(type === 4) {
          this.numberShow = true;
        }
      },
      // 已制卡(券)
      makeCard(){
        this.$http({
          url: this.$http.adornUrl('/platform/card/makeCardByNum'),
          method: 'post',
          data:  this.$http.adornData({
            batchNumbers: this.batchNumbers,
            shopId: 0
          })
        }).then(({data}) => {
          this.refreshChange()
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
          })
        })
      },
      // 出售并充值
      sell(){
        if(!this.startNum || !this.endNum || this.startNum == 0  || this.endNum == 0){
          this.$message.warning("编号不能为0或为空");
          return
        }
        if(this.endNum < this.startNum){
          this.$message.warning("结束编号不能小于开始编号");
          return
        }
        if(isNaN(this.startNum) || isNaN(this.endNum)){
          this.$message.warning("输入编号只能是纯数字");
          return
        }
        this.$http({
          url: this.$http.adornUrl('/platform/card/sellCardByNum'),
          method: 'post',
          data:  this.$http.adornData({
            batchNumber: this.batchNumbers[0],
            startNum: this.startNum,
            endNum: this.endNum,
            shopId: 0,
            balance: this.balance,
            buyUnit:this.buyUnit,
            buyReason:this.buyReason
          })
        }).then(({data}) => {
          this.numberShow = false;
          this.refreshChange()
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
          })
        })
      },
      //冻结
      batchFreeze(){
        if(!this.startNum || !this.endNum || this.startNum == 0  || this.endNum == 0){
          this.$message.warning("编号不能为0或为空");
          return
        }
        if(this.endNum < this.startNum){
          this.$message.warning("结束编号不能小于开始编号");
          return
        }
        if(isNaN(this.startNum) || isNaN(this.endNum)){
          this.$message.warning("输入编号只能是纯数字");
          return
        }
        this.$confirm('您确定将编号' + this.startNum + "至" + this.endNum + "的提货卡/券冻结吗？", this.$i18n.t('text.tips'), {
          confirmButtonText: this.$i18n.t('coupon.confirm'),
          cancelButtonText: this.$i18n.t('coupon.cancel'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/platform/card/freezeCardByNum'),
            method: 'post',
            data:  this.$http.adornData({
              batchNumber: this.batchNumbers[0],
              startNum: this.startNum,
              endNum: this.endNum,
              shopId: 0
            })
          }).then(({data}) => {
            this.numberShow = false;
            this.refreshChange()
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
            })
          })
        }).catch(() => {
        })
      },
      //出售转未售
      soldToUnsold(){
        if(!this.startNum || !this.endNum || this.startNum == 0  || this.endNum == 0){
          this.$message.warning("编号不能为0或为空");
          return
        }
        if(this.endNum < this.startNum){
          this.$message.warning("结束编号不能小于开始编号");
          return
        }
        if(isNaN(this.startNum) || isNaN(this.endNum)){
          this.$message.warning("输入编号只能是纯数字");
          return
        }
        this.$confirm('您确定将编号' + this.startNum + "至" + this.endNum + "的提货卡/券从已售改成未售吗？", this.$i18n.t('text.tips'), {
          confirmButtonText: this.$i18n.t('coupon.confirm'),
          cancelButtonText: this.$i18n.t('coupon.cancel'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/platform/card/soldToUnsoldCardByNum'),
            method: 'post',
            data:  this.$http.adornData({
              batchNumber: this.batchNumbers[0],
              startNum: this.startNum,
              endNum: this.endNum,
              shopId: 0
            })
          }).then(({data}) => {
            this.numberShow = false;
            this.refreshChange()
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
            })
          })
        }).catch(() => {
        })
      },
      //充值
      rechargeCard(){
        this.btnType = 3;
        if(this.selectBatchNumber[0].batchStatus != 1){
          this.$message.warning("该批次已不能充值");
          return
        }
        if(this.selectBatchNumber.length > 1){
          this.$message.warning("只能选择1个批次充值");
          return
        }
        if(this.selectBatchNumber.length > 1){
          let b = this.selectBatchNumber.every(item=>item.batchStatus === this.selectBatchNumber[0].batchStatus)
          if(!b){
            this.$message.warning("勾选批次存在不同状态");
            return
          }
        }
        this.batchNumbers = this.selectBatchNumber.map(item => item.batchNumber);
        if(this.batchNumbers.length < 1){
          this.$message.warning("请选择批次");
          return
        }
        this.numberShow = true;
        this.balance = 0;
      },
      // 确定充值
      recharge(){
        if(!this.startNum || !this.endNum || this.startNum === 0  || this.endNum === 0){
          this.$message.warning("编号不能为0或为空");
          return
        }
        if(this.endNum < this.startNum){
          this.$message.warning("结束编号不能小于开始编号");
          return
        }
        this.$http({
          url: this.$http.adornUrl('/platform/card/rechargeCardByNum'),
          method: 'post',
          data:  this.$http.adornData({
            batchNumber: this.batchNumbers[0],
            startNum: this.startNum,
            endNum: this.endNum,
            balance: this.balance,
            shopId: 0,
          })
        }).then(({data}) => {
          this.numberShow = false;
          this.refreshChange()
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
          })
        })
      },
      /**
       * 消费金额最低要求检验
       */
      balanceChange () {
        let balance = this.balance
        this.balance = balance <= 0 ? 0.01 : balance
        this.balance = balance > 9999999999999 ? 9999999999999 : balance
      },
      // 冻结
      freeze(){
        this.$http({
          url: this.$http.adornUrl('/platform/card/freezeCardByNum'),
          method: 'post',
          data:  this.$http.adornData({
            batchNumbers: this.batchNumbers,
            shopId: 0
          })
        }).then(({data}) => {
          this.refreshChange()
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
          })
        })
      },
      //置换卡
      replacementCard(){
        this.couponCardCode = '';
        this.couponCardCodeList = [{couponCardCode:''}];
        this.isScoreCard = 0;
        this.couponCardBalance = 0;
        this.cardBalance = 0;
        this.displaceShow = false;
        if(this.selectBatchNumber.length === 0){
          this.$message.warning("请选择置换批次");
          return
        }
        if(this.selectBatchNumber.length > 1){
          this.$message.warning("只能选择1个批次置换");
          return
        }
        if(this.selectBatchNumber[0].cardType !== 1){
          this.$message.warning("请选择类别为提货卡的批次");
          return
        }
        this.getMinNotSoldCardNumber(this.selectBatchNumber[0].batchNumber,1)
        this.replacementCardShow = true
      },
      //获取最小未出售卡(券)编号
      getMinNotSoldCardNumber(batchNumber,type){
        this.$http({
          url: this.$http.adornUrl('/platform/card/getMinNotSoldCardNumber'),
          method: 'get',
          params: this.$http.adornParams({batchNumber: batchNumber})
        }).then(({data}) => {
          this.cardInfo = data
          let num = this.cardInfo.cardNumber.split(this.cardInfo.cardPrefix)[1]
          if(type == 0){//出售并充值卡
            this.startNum = num
          }else if(type == 1){//置换卡
            this.startNum = num
            this.endNum = num
          }
        })
      },
      // 获取类型
      getTypeData () {
        let type = 'card_type'
        this.$http({
          url: this.$http.adornUrl(`/sys/dictData/getByType/${type}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.cardTypeList = data
        })
      },
      // 获取所有营业店铺
      getShopList() {
        this.$http({
          url: this.$http.adornUrl("/platform/shopDetail/getAllShop"),
          method: "get",
          params: this.$http.adornParams(),
        }).then(({ data }) => {
          this.shopList = data;
        });
      },
      handleSizeChange (val) {
        this.page.pageSize = val
        this.getDataList(this.page)
      },
      handleCurrentChange (val) {
        this.page.currentPage = val
        this.getDataList(this.page)
      },
      // 刷新回调用
      refreshChange () {
        this.page.currentPage = 1
        this.getBatchNum();
        this.getDataList(this.page)
      },
      // 获取数据列表
      getDataList (page, newData = false) {
        this.tableLoading = true
        if (newData || !this.theData) {
          this.theData = JSON.parse(JSON.stringify(this.searchForm))
          this.theData.startTime = this.launchDateRange === null ? null : this.launchDateRange[0]
          this.theData.endTime = this.launchDateRange === null ? null : this.launchDateRange[1]
        }
        this.$http({
          url: this.$http.adornUrl('/platform/card/batchCardPage'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                current: page == null ? this.page.currentPage : page.currentPage,
                size: page == null ? this.page.pageSize : page.pageSize,
                shopId: 0
              },
              this.theData
            )
          )
        }).then(({data}) => {
          this.dataList = data.records
          this.page.total = data.total
        }).finally(() => {
          this.tableLoading = false
        })
      },
      //编辑
      editHandle(row){
        this.isEdit = true;
        this.lookVisible = true;
        this.batchCardInfo = row;
        this.batchCardInfo.cardType = this.batchCardInfo.cardType.toString();
      },
      //批次提货卡(券)明细
      detailsHandle(batchNumber){
        this.batchCardShow = true;
        this.$nextTick(() => {
          this.$refs.batchCardList.init(batchNumber)
        })
      },
      //批次信息查看
      batchInfoHandle(row){
        this.recordVisible = true;
        this.batchInfoList = row;
      },
      deleteHandle (batchNumber) {
        if (!batchNumber) {
          return
        }
        this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${batchNumber ? this.$i18n.t('coupon.delete') : this.$i18n.t('sys.batchDelete')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
          confirmButtonText: this.$i18n.t('coupon.confirm'),
          cancelButtonText: this.$i18n.t('coupon.cancel'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/platform/card/delBatchCard'),
            method: 'post',
            data:  this.$http.adornData({
              batchNumber:batchNumber,
              shopId:0
            })
          }).then(({data}) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.refreshChange()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 条件查询
      searchChange (newData = false) {
        this.page.currentPage = 1
        this.getDataList(this.page, newData)
      },
      /**
       * 重置表单
       * @param {String} formName 表单名称
       */
      resetSearchForm (formName) {
        this.$refs[formName].resetFields()
        this.launchDateRange = null
        this.searchForm = {}
      },
      // 获取批次号
      getBatchNum(){
        this.$http({
          url: this.$http.adornUrl('/platform/card/queryBatchNumList'),
          method: 'get',
          params:  this.$http.adornParams({})
        }).then(({data}) => {
          if(data){
            this.batchNumList = data.reverse();
          }
        })
      },
      init(){
        this.getTypeData();
        this.getShopList();
        this.getDataList();
        this.getBatchNum();
      }
    },
  }
</script>

<style lang="scss">
    .replacement {
    }
    .replacement .input .el-input__inner {
        border-color: red !important;
        color: red;
    }
</style>
