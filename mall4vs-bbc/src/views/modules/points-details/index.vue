<template>
    <div>
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item prop="nickName" :label="$t('users.name') + ':'">
                        <el-input v-model="searchForm.nickName" type="text" clearable  :placeholder="$t('users.name')"></el-input>
                    </el-form-item>
                    <el-form-item prop="source" label="来源:">
                        <el-select v-model="searchForm.source" clearable  placeholder="请选择来源">
                            <el-option
                                    v-for="item in sourceList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="ioType" label="出入类型:">
                        <el-select v-model="searchForm.ioType" clearable  placeholder="请选择出入类型">
                            <el-option
                                    v-for="item in ioTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
                        <div class="default-btn" @click="resetForm('searchForm')">重置</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <el-table :data="dataList"
                  header-cell-class-name="table-header"
                  row-class-name="table-row-low"
                  class="user-edit-table"
                  style="width: 100%">
            <el-table-column prop="nickName" label="用户"></el-table-column>
            <el-table-column prop="createTime" :label="$t('user.changeTime')"></el-table-column>
            <el-table-column prop="source" :label="$t('user.changeReason')">
                <template slot-scope="scope">
                    <span v-if="scope.row.source===4 && scope.row.ioType === 1">{{$t('user.refundRetrunScore')}}</span>
                    <span v-else>{{[$t('user.registerScore'),$t('user.shopping'),$t('user.levelUp'),$t('user.signIn'),$t('user.shoppingDeducteScore'),$t('user.scoreExpired'),$t('user.rechargeBalance'),$t('user.sysChangeScore')][scope.row.source]}}</span>
                    <span v-if="scope.row.isLock">{{$t('user.lockScore')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="score" :label="$t('user.changeScoreNum')"></el-table-column>
            <el-table-column prop="ioType" :label="$t('shop.ioType')">
                <template slot-scope="scope">
                    <span>{{[$t('shop.pay'),$t('shop.income')][scope.row.ioType]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="shopName" label="变更来源">
                <template slot-scope="scope">
                    <span v-if="scope.row.shopName">{{scope.row.shopName}}</span>
                    <span v-else>系统</span>
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
</template>

<script>
  export default {
    name: 'pointsDetails',
    data(){
      return {
        theData: null, // 保存上次点击查询的请求条件
        theParams: null, // 保存上次点击查询的请求条件
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        searchForm:{
          nickName:'',
          source:'',
          ioType:''
        },
        sourceList:[
          {
            label:'注册送积分',
            value:0
          },
          {
            label:'订单',
            value:1
          },
          {
            label:'等级提升获取',
            value:2
          },
          {
            label:'签到',
            value:3
          },
          {
            label:'购物抵扣积分',
            value:4
          },
          {
            label:'积分过期',
            value:5
          },
          {
            label:'余额充值',
            value:6
          },
          {
            label:'系统更改',
            value:7
          }
        ],
        ioTypeList:[
          {
            label:'支出',
            value:0
          },
          {
            label:'收入',
            value:1
          }
        ],
        dataList: [],
      }
    },
    created () {
      this.getData()
    },
    methods:{
      // 条件查询
      searchChange (newData = false) {
        this.page.currentPage = 1
        this.getData(this.page, newData)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.searchForm = {
          nickName:'',
          source:'',
          ioType:''
        }
      },
      // 获取数据
      getData (page,newData = false) {
        this.dataListLoading = true
        if (newData || !this.theData) {
          this.theParams = JSON.parse(JSON.stringify(this.searchForm))
          this.theData = {
            current: page == null ? this.page.currentPage : page.currentPage,
            size: page == null ? this.page.pageSize : page.pageSize
          }
        } else {
          this.theData.current = page == null ? this.page.currentPage : page.currentPage
          this.theData.size = page == null ? this.page.pageSize : page.pageSize
        }
        this.$http({
          url: this.$http.adornUrl('/multishop/user/userScoreLog/page'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(this.theData, this.theParams), false
          )
        }).then(({ data }) => {
          this.dataList = data.records
          this.page.total = data.total
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.page.pageSize = val
        this.page.currentPage = 1
        this.getData(this.page)
      },
      // 当前页
      currentChangeHandle (val) {
        this.page.currentPage = val
        this.getData(this.page)
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
