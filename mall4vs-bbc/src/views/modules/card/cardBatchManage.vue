<template>
    <div class="cardBatchManage">
        <!-- 搜索栏 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item label="批次号" class="search-form-item">
                        <el-select filterable v-model="searchForm.batchNumber" placeholder="请选择" style="width: 100%">
                            <el-option :label="item" :value="item" v-for="(item,index) in batchNumList" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" class="search-form-item">
                        <el-input type="text" v-model="searchForm.cardTitle" placeholder="请输入关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" class="search-form-item">
                        <el-select filterable v-model="searchForm.batchStatus" placeholder="请选择" style="width: 100%">
                            <el-option label="未制卡(券)" :value="0"></el-option>
                            <el-option label="未出售" :value="1"></el-option>
                            <el-option label="已出售" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型" class="search-form-item">
                        <el-select filterable v-model="searchForm.cardType" placeholder="请选择类型" style="width: 100%">
                            <el-option v-for="item in cardTypeList" :key="item.value" :label="item.title" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="批次时间" label-width="70px">
                        <el-date-picker
                                v-model="launchDateRange"
                                type="datetimerange"
                                :range-separator="$t('time.tip')"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :start-placeholder="$t('time.start')"
                                :end-placeholder="$t('time.end')"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
                        <div class="default-btn" @click="resetSearchForm('searchForm')">重置</div>
                        <div class="default-btn primary-btn" @click.stop="btnClick(1)">制卡(券)</div>
                        <div class="default-btn primary-btn" @click.stop="btnClick(2)">出售</div>
                        <div class="default-btn primary-btn" @click.stop="rechargeCard()">充值</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="main-container">
            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table ref="activityTable" @selection-change="handleSelectionChange" v-loading="tableLoading" :data="dataList" header-cell-class-name="table-header" row-class-name="table-row-low" style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column prop="batchNumber" label="批次号" min-width="80">
                    </el-table-column>
                    <el-table-column prop="cardTitle" label="名称" min-width="150">
                    </el-table-column>
                    <el-table-column prop="cardType" label="类别" min-width="80">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.cardType === 1 ? 'success' : ''" effect="dark">{{cardTypeList.find(item => item.value == scope.row.cardType)
                                .title}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cardNum" label="数量" min-width="100">
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
                    <el-table-column label="有效期" min-width="130">
                        <template slot-scope="scope" v-if="scope.row.userStartTime && scope.row.userEndTime">
                            {{ scope.row.userStartTime }} 到 {{ scope.row.userEndTime }}
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column fixed="right" align="center" :label="$t('publics.operating')" width="250">
                        <template slot-scope="scope">
                            <div class="text-btn-con" style="display: inline-block;">
                                <div class="default-btn text-btn" @click.stop="editHandle(scope.row)">
                                    查看
                                </div>
<!--                                <div class="default-btn text-btn" @click.stop="lookHandle(scope.row)">-->
<!--                                    查看-->
<!--                                </div>-->
                                <div class="default-btn text-btn" @click.stop="detailsHandle(scope.row.batchNumber)">
                                    明细
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
        <!--    充值金额    -->
        <el-dialog :visible.sync="rechargeShow" title="充值金额" :mask-closable="false" :draggable="false"
                   width="480px">
            <div style="display: flex;align-items: center;">
                <div style="width: 80px;">充值金额：</div>
                <div style="display: flex;align-items: center;">
                    <el-input v-model="balance" size="small" placeholder="请输入充值金额" type="number" @change="balanceChange" min="0">
                        <template slot="append">{{ $t('coupon.yuan') }}</template>
                    </el-input>
                </div>
            </div>
            <div slot="footer">
                <div class="default-btn primary-btn" @click.stop="recharge()">确定</div>
                <div class="default-btn" @click="(rechargeShow = false)">关闭</div>
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
                            type="datetime"
                            placeholder="选择开始时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="userEndTime">
                    <el-date-picker
                            :disabled="!isEdit"
                            v-model="batchCardInfo.userEndTime"
                            type="datetime"
                            placeholder="选择结束时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd HH:mm:ss"
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
        rechargeShow:false,
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
        selectBatchNumber:[]
      }
    },
    methods: {
      //批次信息修改提交
      dataFormSubmit(){
        this.$refs['batchCardInfo'].validate((valid) => {
          if (valid) {
            this.isSubmit = true;
            this.$http({
              url: this.$http.adornUrl('/admin/card/updateCardBybatchNumber'),
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
      // 出售、充值、冻结按钮
      btnClick(type){
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
        this.balance = 0;
        let str = "";
        if(type === 1){
          if(this.selectBatchNumber[0].batchStatus > 0){
            this.$message.warning("已选批次不能再次制卡(券)");
            return
          }
          str = "已制卡(券)"
        }else if(type === 2){
          if(this.selectBatchNumber[0].batchStatus > 1){
            this.$message.warning("已选批次不能再次出售)");
            return
          }
          if(this.selectBatchNumber[0].batchStatus == 0){
            this.$message.warning("已选批次还未制卡(券)暂不能出售)");
            return
          }
          str = "出售"
        }
        if(type === 1 || type === 2){
          this.$confirm("确认" + str, this.$i18n.t('text.tips'), {
            confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
            cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
            type: 'warning'
          }).then(() => {
            if(type === 1){
              this.makeCard();
            }else if(type === 2){
              this.sell();
            }
          })
        }else{
          if(type === 3){
            this.freeze();
          }
        }
      },
      // 已制卡(券)
      makeCard(){
        this.$http({
          url: this.$http.adornUrl('/admin/card/makeCardByNum'),
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
      // 出售
      sell(){
        this.$http({
          url: this.$http.adornUrl('/admin/card/sellCardByNum'),
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
      //充值
      rechargeCard(){
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
        this.rechargeShow = true;
        this.balance = 0;
      },
      // 充值
      recharge(){
        this.$http({
          url: this.$http.adornUrl('/admin/card/rechargeCardByNum'),
          method: 'post',
          data:  this.$http.adornData({
            batchNumbers: this.batchNumbers,
            balance: this.balance,
            shopId: 0
          })
        }).then(({data}) => {
          this.rechargeShow = false;
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
          url: this.$http.adornUrl('/admin/card/freezeCardByNum'),
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
      // 获取类型
      getTypeData () {
        let type = 'card_type'
        this.$http({
          url: this.$http.adornUrl(`/multishop/sys/dictData/getByType/${type}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.cardTypeList = data
        })
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
          url: this.$http.adornUrl('/admin/card/batchCardPage'),
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
      lookHandle (row) {
        this.isEdit = false;
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
      deleteHandle (batchNumber) {
        if (!batchNumber) {
          return
        }
        this.$confirm("确定进行 [删除] 操作？", this.$i18n.t('text.tips'), {
          confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
          cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/admin/card/delBatchCard'),
            method: 'post',
            data:  this.$http.adornData({
              batchNumber:batchNumber,
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
          url: this.$http.adornUrl('/admin/card/queryBatchNumList'),
          method: 'get',
          params:  this.$http.adornParams({})
        }).then(({data}) => {
          this.batchNumList = data;
        })
      },
      init(){
        this.getTypeData();
        this.getDataList();
        this.getBatchNum();
      }
    },
  }
</script>

<style scoped>

</style>
