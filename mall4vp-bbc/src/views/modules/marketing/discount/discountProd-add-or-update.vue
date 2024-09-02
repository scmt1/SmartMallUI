<template>
  <el-dialog
    :title="!isShowProd ? '选择商品' : $t('prodList.lookOver')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-table
      ref="prodTable"
      :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row"
      v-loading="dataListLoading"
      style="width: 100%;marginBottom:20px  "
    >
      <!-- <el-table-column v-if="!isShowProd"
                       type="selection"
                       header-align="center"
                       align="center"
                       width="50">
      </el-table-column>-->
      <!-- <el-table-column width="50" header-align="center" align="center">
        <template slot-scope="scope">
          <div>
            <el-radio
              :label="scope.row.prodId"
              v-model="prodId"
              @change.native="getSelectProdRow(scope.$index, scope.row)"
              >&nbsp;</el-radio
            >
          </div>
        </template>
      </el-table-column> -->

      <el-table-column
        prop="prodName"
        :label="$t('discount.prodName')"
      ></el-table-column>
      <el-table-column
        :label="$t('discount.commodityPictures')"
      >
        <template slot-scope="scope">
          <prod-pic
            height="60"
            width="60"
            :pic="scope.row.pic"
          ></prod-pic>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <span slot="footer">
      <!-- <el-button type="primary"
                 v-if="isShowProd"
                 size="small"
      @click="visible = false">确定</el-button>-->
      <div class="default-btn primary-btn" @click="selectProd()">{{
        $t("remindPop.confirm")
      }}</div>
    </span>
  </el-dialog>
</template>

<script>
import ProdPic from '@/components/prod-pic'
export default {
  components: {
    ProdPic
  },
  data () {
    return {
      visible: false,
      dataForm: {
        product: ''
      },
      isShowProd: 0,
      allData: [],
      prodId: 0,
      discountProds: [],
      discountId: 0,
      dataList: [],
      current: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  methods: {
    // 获取数据列表
    init (id, discountProds) {
      this.discountProds = discountProds
      this.discountId = id
      this.visible = true
      this.dataListLoading = true
      if (discountProds) {
        this.discountProds.forEach(row => {
          this.dataListSelections.push(row)
        })
      }
      this.showProd(this.discountId, 1)
    },
    showProd (id, val) {
      if (this.discountId !== id) {
        this.current = 1
        this.pageSize = 10
      }
      this.isShowProd = val
      this.discountId = id
      this.visible = true
      this.$http({
        url: this.$http.adornUrl(`/platform/discountProd/info/${id}`),
        method: 'get',
        params: this.$http.adornParams({
          current: this.current,
          size: this.pageSize,
          discountId: this.discountId
        })
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.current = data.current
        this.page = data.pages
      })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.showProd(this.discountId, 1)
    },
    // 当前页
    currentChangeHandle (val) {
      this.current = val
      this.showProd(this.discountId, 1)
    },
    // 选择产品
    selectProd () {
      var prods = []
      this.dataListSelections.forEach(item => {
        let prodIndex = prods.findIndex(prod => prod.prodId === item.prodId)
        if (prodIndex === -1) {
          prods.push({
            discountProdId: 0,
            prodId: item.prodId,
            prodName: item.prodName,
            pic: item.pic
          })
        }
      })
      // var prods = this.dataListSelections.map(item => {
      //   return {discountProdId: 0, prodId: item.prodId, prodName: item.prodName, pic: item.pic}
      // })
      this.$emit('refreshDiscountProds', prods)
      this.dataListSelections = []
      this.visible = false
    },
    // 获取当选的行
    getSelectProdRow (index, row) {
      this.dataListSelections = []
      this.dataListSelections.push(row)
    }
  }
}
</script>
