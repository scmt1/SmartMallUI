<template>
  <div class="choose-goods">
    <!-- <evue-table  :data="list" :option="option" @currentRowChange="currentRowChange"></evue-table> -->
    <el-table :data="list" style="width: 100%"
     highlight-current-row
     @current-change="handleCurrentChange">
       <el-table-column
        prop="name"
        :label="$i18n.t('shopFeature.chooseFeature.pageTitle')">
      </el-table-column>
      <el-table-column
        prop="createTime"
        :label="$i18n.t('shopFeature.chooseFeature.createTime')">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'choose-feature',
  props: {
    isGetChooseData: {// 是否开始返回数据
      type: Boolean,
      default: false
    }
  },
  watch: {
    isGetChooseData () {
      if (!this.currentchooseFeatures.renovationId) {
        this.$message.error(this.$i18n.t('shopFeature.chooseFeature.choosePageTips'))
        return
      }
      this.$emit('chooseChooseFeaturesFun', {
        data: this.currentchooseFeatures
      })
    }
  },
  data () {
    return {
      list: [],
      currentchooseFeatures: {}, // 当前选择的
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  mounted () {
    this.getMiniPagesList()
  },
  methods: {
    /**
     * 获取微页面列表
     */
    getMiniPagesList () {
      this.$http({
        url: this.$http.adornUrl('/shop/shopRenovation/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize
            }
          )
        )
      }).then(({ data }) => {
        this.list = data.records
        this.totalPage = data.total
      }).catch((error) => {
        console.log('err', error)
      })
    },
    // 每页数
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getMiniPagesList()
    },
    // 当前页
    handleCurrentPageChange (val) {
      this.pageIndex = val
      this.getMiniPagesList()
    },
    /**
     * 选择微页面
     */
    handleCurrentChange (ev) {
      this.currentchooseFeatures = ev
    }
  }
}
</script>

<style lang="scss" scoped>
.choose-goods {
  .goods {
    display: flex;

    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      object-position: center;
    }

    .goodsName {
      flex: 1;
      padding-top: 5px;
      padding-left: 5px;

      p {
        color: #38f;
        cursor: pointer;
      }

      span {
        color: #f60;
      }
    }
  }
}
</style>
