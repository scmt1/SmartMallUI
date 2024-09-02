<template>
  <el-dialog
    :title="!isShowProd ? '选择商品' : '查看商品'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-table
      ref="prodTable"
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
    >
      <!-- <el-table-column v-if="!isShowProd"
                       type="selection"
                       header-align="center"
                       align="center"
                       width="50">
      </el-table-column>-->
      <el-table-column width="50" header-align="center" align="center">
        <template slot-scope="scope">
          <div>
            <el-radio
              :label="scope.row.prodId"
              v-model="prodId"
              @change.native="getSelectProdRow(scope.$index,scope.row)"
            >&nbsp;</el-radio>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="prodName" header-align="center" align="center" label="产品名称"></el-table-column>
      <el-table-column align="center" width="140" label="产品图片">
        <template slot-scope="scope">
          <img :src="scope.row.pic" width="100" height="100" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <span slot="footer">
      <div
        class="default-btn primary-btn"
        :class="[dataListSelections.length <= 0?'disabled-btn':'','default-btn text-btn']"
        :disabled="dataListSelections.length <= 0"
        @click="selectProd(dataListSelections.length <= 0)"
      >确定</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
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
      pageIndex: 1,
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
      this.getDataList()
    },
    showProd (id, val) {
      this.isShowProd = val
      this.visible = true
      this.$http({
        url: this.$http.adornUrl(`/admin/discountProd/info/${id}`),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          discountId: id
        })
      }).then(({ data }) => {
        this.dataList = data
      })
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/platform/search/prod/page'),
        method: 'get',
        params: this.$http.adornParams({
          current: this.pageIndex,
          size: this.pageSize,
          status: 1
        })
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.dataListLoading = false
        this.$nextTick(() => {
          if (this.discountProds) {
            this.discountProds.forEach(row => {
              let index = this.dataList.findIndex(
                prodItem => prodItem.prodId === row.prodId
              )
              this.$refs.prodTable.toggleRowSelection(this.dataList[index])
            })
          }
        })
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 选择产品
    selectProd (state) {
      if (!state) {
        return
      }
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
