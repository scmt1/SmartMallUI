<template>
  <div class="mod-fina-details">
    <!-- 头部 -->
    <div class="header">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="16">
          <h4>全部会员</h4>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-button size="mini" @click="selectColumn()">设置显示字段</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- /头部 -->

    <!-- 搜索条件 -->
    <div class="screening-conditions">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList(this.page)">
        <div class="search">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="16">
              <!-- <el-form-item> -->
              <el-input
                v-model="inputValue"
                size="small"
                class="input-with-select"
                style="width: 360px;"
              >
                <el-select v-model="selectValue" slot="prepend" style="width: 130px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <!-- <el-button slot="append" icon="el-icon-search">搜索</el-button> -->
              </el-input>
              <!-- </el-form-item> -->
            </el-col>
            <el-col :span="8" style="text-align: right;">
              <!-- <el-form-item> -->
              <el-button size="small" @click="exportData">导出会员</el-button>
              <!-- <el-button size="small" @click="selectUserTags">高级筛选</el-button> -->
              <!-- </el-form-item> -->
            </el-col>
          </el-row>
        </div>
        <div class="search">
          &nbsp;
          <el-form-item label="客户标签">
            <el-button @click="clearAllTags" size="small">不限</el-button>
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >{{tag.tagName}}</el-tag>
            <el-button class="button-new-tag" size="small" @click="selectUserTags()">添加</el-button>
            <!-- <tags-select :limit="5" v-model="dynamicTags" >添加</tags-select> -->
          </el-form-item>
        </div>
        <div class="search">&nbsp;&nbsp;&nbsp;</div>
        <div class="search">
          <el-form-item>
            <el-button
              class="operation-btn"
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchChange()"
            >{{$t("order.query")}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              class="operation-btn"
              icon="el-icon-delete"
              size="small"
              @click="clearSearch()"
            >{{$t("product.reset")}}</el-button>
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <div class="batchOption">
          <el-form-item label="批量操作">
            <el-button class="operation-btn" size="mini" @click="clear()">修改成长值</el-button>
            <el-button class="operation-btn" size="mini" @click="clear()">打标签</el-button>
            <el-button class="operation-btn" size="mini" @click="clear()">修改积分</el-button>
            <!-- <el-button class="operation-btn" size="mini" @click="clear()">修改分销员等级</el-button> -->
            <!-- <el-button class="operation-btn" size="mini" @click="clear()">送优惠券</el-button> -->
            <!-- <el-button class="operation-btn" size="mini" @click="clear()">修改关系链</el-button> -->
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- /搜索条件 -->
    <!-- 主体部分 -->
    <div class="user-main">
      <div class="table" style="width: 99%">
        <el-table
          :data="dataList"
          @selection-change="handleSelectionChange"
          border
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- 基础信息 -->
          <el-table-column prop="nickName" label="会员昵称" width="110" fixed="left"></el-table-column>
          <el-table-column prop="pic" label="会员头像" fixed="left">
            <template slot-scope="scope">
              <img src="~@/assets/img/userImg.jpg" v-if="!scope.row.pic" width="60" height="60" />
              <img :src="scope.row.pic" v-else width="60" height="60" />
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="用户名称" width="110" v-if="isVisible1"></el-table-column>
          <el-table-column prop="userMobile" label="联系电话" width="110"></el-table-column>
          <el-table-column prop="levelName" label="会员等级" width="90" v-if="isVisible2"></el-table-column>
          <el-table-column prop="levelType" label="会员类型" width="90" v-if="isVisible3">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.levelType === 0"
                size="small"
                type="info"
              >{{$t('user.ordinaryMember')}}</el-tag>
              <el-tag v-else size="small" type="primary">{{$t('user.paidMembership')}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" v-if="isVisible4">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.status === 0"
                size="small"
                type="danger"
              >{{$t('publics.disable')}}</el-tag>
              <el-tag v-else size="small">{{$t('publics.normal')}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="userRegtime" label="注册时间" width="160" v-if="isVisible5"></el-table-column>

          <!-- 交易信息 -->
          <el-table-column prop="reConsTime" label="最近消费时间" width="160" v-if="isVisible6">
            <template slot="header">
              <span>最近消费时间</span>
              <el-popover placement="top" width="200" trigger="hover" content="最近一次的消费时间">
                <i class="el-icon-question" slot="reference"></i>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="consAmount" label="消费金额" v-if="isVisible7"></el-table-column>
          <el-table-column prop="actualAmount" label="实付金额" v-if="isVisible8"></el-table-column>
          <el-table-column prop="consTimes" label="消费次数" v-if="isVisible9"></el-table-column>

          <!-- <el-table-column prop="consPower" label="消费力"></el-table-column> -->
          <el-table-column prop="averDiscount" label="平均折扣" v-if="isVisible10"></el-table-column>
          <!-- <el-table-column prop="aa" label="连带率"></el-table-column> -->
          <el-table-column prop="rechargeAmount" label="充值金额" v-if="isVisible11"></el-table-column>

          <el-table-column prop="rechargeTimes" label="充值次数" v-if="isVisible12"></el-table-column>
          <el-table-column prop="afterSaleAmount" label="退款金额" v-if="isVisible13"></el-table-column>
          <el-table-column prop="afterSaleTimes" label="退款次数" v-if="isVisible14"></el-table-column>
          <!-- <el-table-column prop="aa" label="会员卡"></el-table-column> -->

          <!-- 账户资产 -->
          <el-table-column prop="currentScore" label="当前积分" v-if="isVisible15"></el-table-column>
          <el-table-column prop="sumScore" label="累计积分" v-if="isVisible16"></el-table-column>
          <el-table-column prop="currentBalance" label="当前余额" v-if="isVisible17"></el-table-column>
          <el-table-column prop="sumBalance" label="累计余额" v-if="isVisible18"></el-table-column>
          <!-- 分销信息 -->
          <!-- <el-table-column prop="distributionLevel" label="分销等级"></el-table-column>
          <el-table-column prop="distributorTime" label="成为分销员时间"></el-table-column>-->
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="addOrUpdateHandle(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <el-pagination
        v-if="dataList.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <!-- /分页 -->
    </div>
    <!-- /主体部分 -->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <!-- 列表选择列显隐弹窗 -->
    <column-select v-if="columnSelectVisible" ref="columnSelect" @refreshTableList="refreshColumn"></column-select>
    <!-- 标签选择弹窗 -->
    <tags-select
      v-if="tagsSelectVisible"
      :limit="5"
      ref="tagsSelect"
      @refreshTagsArr="refreshTagsSelect"
    ></tags-select>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import ColumnSelect from './user-all-manager-table-column'
import TagsSelect from '@/components/tags-select'

export default {
  components: {
    AddOrUpdate,
    ColumnSelect,
    TagsSelect
  },
  mounted () {
    this.getDataList()
    // this.getProdEffect(this.page)
  },
  data () {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      inputValue: null,
      selectValue: 1,
      dataList: [],
      dateRange: [],
      dataForm: {
      },
      options: [
        {
          value: 1,
          label: '用户名称'
        },
        {
          value: 2,
          label: '用户昵称'
        },
        {
          value: 3,
          label: '联系电话'
        }
        // {
        //   value: 4,
        //   label: '会员卡号'
        // },
        // {
        //   value: 5,
        //   label: '客户编号'
        // },
        // {
        //   value: 4,
        //   label: '邀请人手机号'
        // }
      ],
      dynamicTags: [],
      multipleSelection: [], // 多选
      searchForm: {},
      addOrUpdateVisible: false,
      columnSelectVisible: false,
      tagsSelectVisible: true,
      isVisible1: false, // 控制列显隐
      isVisible2: false,
      isVisible3: false,
      isVisible4: false,
      isVisible5: false,
      isVisible6: false,
      isVisible7: false,
      isVisible8: false,
      isVisible9: false,
      isVisible10: false,
      isVisible11: false,
      isVisible12: false,
      isVisible13: false,
      isVisible14: false,
      isVisible15: false,
      isVisible16: false,
      isVisible17: false,
      isVisible18: false,
      isVisible19: false,
      isVisible20: false
    }
  },
  methods: {
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/userManager/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    selectColumn () {
      this.columnSelectVisible = true
      this.$nextTick(() => {
        this.$refs.columnSelect.init()
      })
    },
    refreshChange () {
      //
    },
    // 条件查询
    searchChange (params) {
      this.searchForm = {}
      if (this.selectValue === 1) {
        this.searchForm.realName = this.inputValue
      } else if (this.selectValue === 2) {
        this.searchForm.nickName = this.inputValue
      } else if (this.selectValue === 3) {
        this.searchForm.userMobile = this.inputValue
      }
      this.getDataList(this.page)
    },
    // 清空搜索条件
    clearSearch () {
      this.searchForm = {}
      this.inputValue = null
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 选择客户标签
    selectUserTags () {
      this.tagsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.tagsSelect.init()
      })
    },
    // 移除标签单个选项
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    // 清除所有标签
    clearAllTags () {
      this.dynamicTags = []
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    // 选择标签弹窗
    refreshTagsSelect (data) {

    },
    // 控制字段显示
    refreshColumn (columnData) {
      this.isVisible1 = columnData.includes('用户名称')
      this.isVisible2 = columnData.includes('会员等级')
      this.isVisible3 = columnData.includes('会员类型')
      this.isVisible4 = columnData.includes('状态')
      this.isVisible5 = columnData.includes('注册时间')
      this.isVisible6 = columnData.includes('最近消费时间')
      this.isVisible7 = columnData.includes('消费金额')
      this.isVisible8 = columnData.includes('实付金额')
      this.isVisible9 = columnData.includes('消费次数')
      this.isVisible10 = columnData.includes('平均折扣')
      this.isVisible11 = columnData.includes('充值金额')
      this.isVisible12 = columnData.includes('充值次数')
      this.isVisible13 = columnData.includes('退款金额')
      this.isVisible14 = columnData.includes('退款次数')
      this.isVisible15 = columnData.includes('当前积分')
      this.isVisible16 = columnData.includes('累计积分')
      this.isVisible17 = columnData.includes('当前余额')
      this.isVisible18 = columnData.includes('累计余额')
    },
    exportData () {
      console.log(this.dataList)
    }

  }
}
</script>
<style lang="scss">
</style>
    