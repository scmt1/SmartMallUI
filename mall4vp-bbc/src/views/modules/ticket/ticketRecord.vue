<template>
    <div>
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item prop="userMobile" label="用户手机号:">
                        <el-input v-model="searchForm.userMobile" type="text" clearable  placeholder="请输入用户手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="orderNumber" label="订单号:">
                        <el-input v-model="searchForm.orderNumber" type="text" clearable  placeholder="请输入订单号"></el-input>
                    </el-form-item>
                    <el-form-item prop="shopId" label="店铺:">
                        <el-select v-model="searchForm.shopId" clearable  placeholder="请选择店铺">
                            <el-option
                                    v-for="item in shopList"
                                    :key="item.shopId"
                                    :label="item.shopName"
                                    :value="item.shopId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                            label="积分时间:"
                    >
                        <el-date-picker
                                v-model="dateRange"
                                type="datetimerange"
                                :range-separator="$t('date.tip')"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :start-placeholder="$t('date.start')"
                                :end-placeholder="$t('date.end')"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="isRedBlood" label="是否冲红:">
                        <el-select v-model="searchForm.isRedBlood" clearable  placeholder="请选择">
                            <el-option label="未冲红" value="0"></el-option>
                            <el-option label="已冲红" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <div class="default-btn primary-btn" @click="searchChange(true)">搜索</div>
                        <div class="default-btn" @click="resetForm('searchForm')">重置</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="main-container">
            <el-table :data="dataList"
                                  header-cell-class-name="table-header"
                                  row-class-name="table-row"
                                  class="table-con"
                                  v-loading="dataListLoading"
                                  style="width: 100%">
            <el-table-column prop="orderNumber" label="单号" width="250"></el-table-column>
            <el-table-column prop="saleTime" width="170" label="销售日期"></el-table-column>
            <el-table-column prop="payment" label="付款金额"></el-table-column>
            <el-table-column prop="shopName" label="积分店铺"></el-table-column>
            <el-table-column prop="score" label="积分"></el-table-column>
            <el-table-column prop="createTime" width="160" label="积分时间"></el-table-column>
            <el-table-column prop="isRedBlood" label="是否冲红">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isRedBlood"
                               disabled
                               :active-text="scope.row.isRedBlood === 0 ? '否':'是'"
                               active-color="#13ce66"
                               inactive-color="#ff4949"
                               :active-value="1"
                               :inactive-value="0">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="userMobile" label="积分用户手机号"></el-table-column>
            <el-table-column prop="imgUrl" label="积分小票">
                <template slot-scope="scope">
                    <div class="table-cell-con">
                        <div class="table-cell-image">
                            <img v-if="scope.row.imgUrl" @click="previewImg(scope.row.imgUrl)" :src="scope.row.imgUrl" @error="handlePicError">
                            <img v-else src="~@/assets/img/def.png">
                        </div>
                    </div>
                </template>
            </el-table-column>
                <el-table-column prop="ticketImg" label="店铺积分小票">
                    <template slot-scope="scope">
                        <div class="table-cell-con">
                            <div class="table-cell-image">
                                <img v-if="scope.row.ticketImg" @click="previewImg(scope.row.ticketImg)" :src="scope.row.ticketImg" @error="handlePicError">
                                <img v-else src="~@/assets/img/def.png">
                            </div>
                        </div>
                    </template>
                </el-table-column>
            <el-table-column
                    fixed="right"
                    align="center"
                    :label="$t('publics.operating')"
                    width="100"
            >
                <template slot-scope="scope">
                    <div class="text-btn-con">
                        <div
                            class="default-btn text-btn"
                            @click="redBlood(scope.row)"
                        >冲红</div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
            <!-- 分页 -->
            <el-pagination
                    v-if="dataList.length"
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="page.currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="page.pageSize"
                    :total="page.total"
                    layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
            <!-- /分页 -->
        </div>
        <el-dialog :visible.sync="imgVisible" :modal="false" title="图片预览" width="30%">
            <img :src="previewPic" alt=""  width="100%" />
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'ticketRecord',
    data(){
      return {
        previewPic:'',
        imgVisible:false,
        theData: null, // 保存上次点击查询的请求条件
        theParams: null, // 保存上次点击查询的请求条件
        dataListLoading: false,
        dateRange:[],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        searchForm:{
          orderNumber:'',
          shopId:'',
          userMobile:'',
          isRedBlood:''
        },
        dataList:[],
        shopList: [],
      }
    },
    created () {
      this.getShopList()
      this.getDataList()
    },
    methods:{
      //图片预览
      previewImg(url) {
        this.previewPic = url
        this.imgVisible = true;
      },
      //积分冲红
      redBlood(row){
        if(row.isRedBlood === 1){
            this.$message.warning("该小票已被冲红，无法再次冲红");
            return
        }
        this.$http({
          url: this.$http.adornUrl("/platform/ticketIdentifyRecord/ticketRedBlood"),
          method: "get",
          params: this.$http.adornParams({
            ticketId:row.ticketId,
            userMobile:row.userMobile,
            score:row.score
          }),
        }).then(({ data }) => {
          this.$message.success("冲红成功！");
          this.getDataList()
        });
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
      getDataList (page, newData = false) {
        this.dataListLoading = true
        if (newData || !this.theData) {
          this.theParams = JSON.parse(JSON.stringify(this.searchForm))
          this.theData = {
            current: page == null ? this.page.currentPage : page.currentPage,
            size: page == null ? this.page.pageSize : page.pageSize,
            'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
            'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
          }
        } else {
          this.theData.current = page == null ? this.page.currentPage : page.currentPage
          this.theData.size = page == null ? this.page.pageSize : page.pageSize
        }
        this.$http({
          url: this.$http.adornUrl('/platform/ticketIdentifyRecord/getTicketRecordList'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              this.theData,
              this.searchForm
            )
          )
        }).then(({ data }) => {
          this.dataList = data.records
          this.page.total = data.total
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.page.pageSize = val
        this.page.currentPage = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.page.currentPage = val
        this.getDataList()
      },
      searchChange () {
        this.getDataList(this.page)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /**
       * 当图片加载失败时，切换至默认图
       */
      handlePicError (event) {
        event.target.src = require('../../../assets/img/def.png')
      }
    }
  }
</script>

<style scoped>

</style>
