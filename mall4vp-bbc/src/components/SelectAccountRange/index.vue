<template>
  <div class="select-account-range">
    <el-form-item label="" prop="type">
      <div class="default-btn" @click="dialogVisible = true">{{ $t('weixin.select') }}{{ name }}</div>
    </el-form-item>
    <el-form-item label="" prop="type" v-if="tableData.length > 0">
      <el-table
        :data="tableData"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
      >
        <el-table-column
          :prop="propList[0]"
          :label="`${name}${$t('publics.name')}`"
        />
        <el-table-column
          :prop="propList[1]"
          :label="$t('shop.contactName')"
        />
        <el-table-column
          :prop="propList[2]"
          :label="$t('shop.contactTel')"
        />
        <el-table-column
          prop="email"
          :label="$t('shopProcess.email')"
        />
      </el-table>
    </el-form-item>
    <el-dialog
      :title="`${$t('weixin.select')}${name}`"
      :visible.sync="dialogVisible"
      append-to-body>
      <el-form :inline="true" :model="searchParam" class="demo-form-inline" size="small">
        <el-form-item :label="`${name}${$t('publics.name')}`">
          <el-input v-model="searchParam[propList[0]]" :placeholder="`${name}${$t('publics.name')}`" clearable />
        </el-form-item>
        <el-form-item>
          <div class="default-btn primary-btn" @click="getPage()">{{$t('product.search')}}</div>
          <div class="default-btn" @click="clearSearchInfo()">{{$t('product.reset')}}</div>
        </el-form-item>
      </el-form>
      <el-table
        :data="pageVO.records"
        v-loading="pageLoading"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          :prop="propList[0]"
          :label="`${name}${$t('publics.name')}`"
        />
        <el-table-column
          :prop="propList[1]"
          :label="$t('shop.contactName')"
        />
        <el-table-column
          :prop="propList[2]"
          :label="$t('shop.contactTel')"
        />
        <el-table-column
          :prop="propList[3]"
          :label="$t('publics.status')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row[propList[3]] === -1">{{$t('shop.deleted')}}</span>
            <span v-else-if="scope.row[propList[3]] === 0">{{ type == 2 ? $t('publics.disable') : $t('shop.stop')}}</span>
            <span v-else-if="scope.row[propList[3]] === 1">{{ type == 2 ? $t('publics.normal') : $t('shop.inOperation')}}</span>
            <span v-else-if="scope.row[propList[3]] === 2">{{$t('shop.offlineViolation')}}</span>
            <span v-else-if="scope.row[propList[3]] === 3 || scope.row[propList[3]] === 5">{{$t('shop.offlinePendingReview')}}</span>
            <span v-else-if="scope.row[propList[3]] === 4">{{$t('distributionMsg.applying')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页条 -->
      <el-pagination
        v-if="pageVO.total>0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParam.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchParam.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageVO.total">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="sumbit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'select-account-range',
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      multipleSelection: [],
      searchParam: {
        size: 10,
        current: 1
      },
      // 返回参数
      pageVO: {
        records: [], // 返回的列表
        total: 0, // 一共多少条数据
        pages: 0 // 一共多少页
      },
      // loading
      pageLoading: true
    }
  },
  props: {
    type: {
      type: Number,
      default: 0
    },
    tableList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    name () {
      return this.type === 1 ? this.$t('publics.business') : this.$t('publics.user')
    },
    propList () {
      const shopProp = ['shopName', 'contactName', 'mobile', 'shopStatus']
      const userProp = ['nickName', 'realName', 'userMobile', 'status']
      return this.type === 1 ? shopProp : userProp
    },
    api () {
      return this.type === 1 ? '/shop/shopAuditing/page' : '/admin/user/userPage'
    }
  },
  mounted () {
    this.getPage()
    this.tableData = this.tableList
  },
  methods: {
    getPage () {
      this.pageLoading = true
      if (this.type === 1) {
        this.searchParam.shopStatusList = [0, 1, 2, 3]
      }
      this.$http({
        url: this.$http.adornUrl(this.api),
        method: 'get',
        params: this.$http.adornParams(this.searchParam)
      }).then(({ data }) => {
        this.pageVO = data
        this.pageLoading = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    sumbit () {
      this.dialogVisible = false
      this.tableData = this.multipleSelection
      let ids = []
      this.tableData.forEach(item => {
        if (this.type === 1) {
          ids.push(item.shopId)
        } else {
          ids.push(item.userId)
        }
      })
      this.$emit('getIds', ids)
    },
    // 清空搜索内容
    clearSearchInfo () {
      this.searchParam[this.propList[0]] = null
      this.searchParam.current = 1
      this.getPage()
    },
    handleSizeChange (val) {
      this.searchParam.size = val
      this.getPage()
    },
    handleCurrentChange (val) {
      this.searchParam.current = val
      this.getPage()
    }
  }
}
</script>

<style lang="scss">

</style>
