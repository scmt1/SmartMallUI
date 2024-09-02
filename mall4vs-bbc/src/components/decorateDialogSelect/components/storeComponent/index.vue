<template>
  <div class="category-modal-content">
    <div class="category-form">
      <el-form inline ref="searchForm" :model="searchForm" label-width="108px">
        <el-form-item :label="$t('pcdecorate.commonModal.storeName')+'：'">
          <el-input v-model.trim="searchForm.shopName" style="width: 200px" :placeholder="$t('pcdecorate.shopMessage.shopNameTips')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="searchbtn" @click="handleSearch">{{$t('pcdecorate.commonModal.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table
        ref="multipTable"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        row-key="shopId"
        :data="tableList"
        height="320"
        v-loading="tableLoading"
        :class="{'tables-checkedbox': !isMulilt}"
        @selection-change="selectChange">
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="shopName" :label="$t('pcdecorate.shopMessage.storeMessage')" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="shopName-content">
              <el-image :src="scope.row.shopLogo" fit="fill"></el-image>
              <span style="width: calc(100% - 65px);overflow:hidden;text-overflow: ellipsis;white-space: nowrap">{{scope.row.shopName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="type" 
          width="200px" 
          :label="$t('pcdecorate.shopMessage.shopType')" 
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 0" class="noraml-store">
              <span>{{storeType(scope.row.type)}}</span>
            </div>
            <div v-else-if="scope.row.type === 1" class="pre-store">
              <span>{{storeType(scope.row.type)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="shopStatus" 
          width="150" 
          :label="$t('pcdecorate.shopMessage.shopStatus')" 
          align="center" 
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.shopStatus === -1" class="tag-text">{{$t('shop.nonactivated')}}</span>
            <span v-else-if="scope.row.shopStatus === 0" class="tag-text">{{$t('shop.closed')}}</span>
            <span v-else-if="scope.row.shopStatus === 1" class="tag-text active">{{$t('shop.inOperation')}}</span>
            <span v-else-if="scope.row.shopStatus === 2" class="tag-text">
                {{$t('groups.offlineViolation')}}
            </span>
            <span v-else-if="scope.row.shopStatus === 4" class="tag-text">
                {{$t('distributionMsg.applying')}}
            </span>
            <span v-else-if="scope.row.shopStatus === 3 || scope.row.shopStatus === 5" class="tag-text">
                {{$t('product.pendingReview')}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 12px; text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="perProps.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="perProps.perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="perProps.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    activeName: {
      type: String,
      default: () => ''
    },
    isMulilt: { // 是否支持多选
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      searchForm: {},
      tableList: [], // 店铺列表
      multipleSelection: [], // 表格选中的数据
      tableLoading: false, // 表格loading
      perProps: { // 分页
        page: 1,
        perPage: 10,
        total: 0
      }
    }
  },
  computed: {
    // 店铺类型
    storeType () {
      return (type) => {
        if (type === 0) {
          return this.$t('pcdecorate.shopMessage.ordinaryShops')
        } else if (type === 1) {
          return this.$t('pcdecorate.shopMessage.preferShops')
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    // 选中
    selectChange (rows) {
      this.multipleSelection = rows
      if (this.isMulilt) { // 支持多选
        this.$emit('handleGoodsSelect', { type: 'storeItem', value: this.multipleSelection })
      } else { // 仅支持单选
        if (this.multipleSelection.length === 1 || this.multipleSelection.length === 0) {
          this.$emit('handleGoodsSelect', { type: 'storeItem', value: this.multipleSelection[0] })
        } else if (this.multipleSelection.length > 1) {
          this.$refs.multipTable.toggleRowSelection(this.multipleSelection[0])
        }
      }
    },
    // 搜索
    handleSearch () {
      this.getStoreList('search')
    },
    // 获取店铺列表
    getStoreList (val) {
      if (val === 'search') {
        this.perProps.page = 1
      }
      let { page, perPage } = this.perProps
      this.tableLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/shopDetail/searchShops'),
        method: 'get',
        params: this.$http.adornParams({
          current: page,
          size: perPage,
          shopName: this.searchForm.shopName
        })
      }).then(({data}) => {
        this.tableList = data.records
        this.perProps.total = data.total
        this.tableLoading = false
      }).catch((err) => {
        this.tableLoading = false
      })
    },
    // 分页每页显示多少条
    handleSizeChange (val) {
      this.perProps.perPage = val
      this.getStoreList()
    },
    // 分页显示第几页
    handleCurrentChange (val) {
      this.perProps.page = val
      this.getStoreList()
    }
  },
  watch: {
    activeName (val) {
      if (val === '3') {
        this.$set(this.searchForm, 'shopName', '')
        // 获取店铺列表
        this.getStoreList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.category-modal-content {
    .category-form {
        .searchbtn {
            width: 68px;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #155BD4;
            border-radius: 2px;
            margin: 4px 0 0 10px;
        }
        
    }
    .tables {
        width: 93%;
        margin: 0 auto;
        margin-bottom: 20px;
        .shopName-content {
            display: flex;
            align-items: center;
            .el-image {
                width: 48px;
                height: 48px;
                margin-right: 15px;
            }
        }
    }
    .noraml-store {
        display: flex;
        justify-content: center;
        span {
            min-width: 66px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333333;
            font-size: 12px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 3px;
        }
        
    }
    .pre-store {
        display: flex;
        justify-content: center;
        span {
            min-width: 66px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #155BD4;
            color: #155BD4 ;
            font-size: 12px;
            border-radius: 3px;
        }
    }
    .tag-text {
        height: 24px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 3px;
        display: inline-block;
        font-size: 12px;
        padding: 0px 8px;
        line-height: 24px;
        &.active {
            border: 1px solid #155BD4;
            color: #155BD4 ;
        }
    }
}

</style>
<style lang="scss">
.category-modal-content {
    min-height: 450px;
    max-height: 450px;
    height: 450px;
    overflow-y: auto;
    .el-input__inner {
        height: 32px;
    }
    .table-header {
        &:nth-child(1) {
            .cell {
                display: none;
            }
        }
    }
}
.tables-checkedbox {
    .el-checkbox {
      .el-checkbox__inner {
          position: relative;
          &:after {
              border: 0;
              position: absolute;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: #fff;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
          }
      }
        .el-checkbox__inner {
            border-radius: 50%;
        }
        &.is-checked {
            .el-checkbox__inner {
                position: relative;
                &:after {
                    border: 0;
                    position: absolute;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #fff;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
}
</style>