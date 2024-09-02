<template>
  <el-dialog
    :title="this.$i18n.t('product.chooseBrand')"
    :modal="false"
    top="100px"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" size="small">
      <el-form-item :label="this.$i18n.t('brand.brandName')">
        <el-input v-model="brandName" :placeholder="this.$i18n.t('brand.brandName')"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="default-btn primary-btn" @click="onSearch">{{$t("order.query")}}</div>
      </el-form-item>
    </el-form>

    <div class="prods-select-body">
      <el-table
        ref="brandTable"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectChangeHandle"
        style="width: 100%;"
        header-cell-class-name="table-header"
        row-class-name="table-row"
      >
        <el-table-column v-if="isSingle" width="50" header-align="center" align="center">
          <template slot-scope="scope">
            <div>
              <el-radio
                :label="scope.row.brandId"
                v-model="singleSelectBrandId"
                @change.native="getSelectBrandRow(scope.row)"
              >&nbsp;</el-radio>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!isSingle"
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column prop="brandId" align="center" :label="this.$i18n.t('brandPopups.brandId')"></el-table-column>
        <el-table-column
          prop="brandName"
          header-align="center"
          align="center"
          :label="this.$i18n.t('brand.brandName')"
        ></el-table-column>
        <el-table-column
          prop="firstChar"
          align="center"
          :label="this.$i18n.t('brandPopups.brandInitials')"
        ></el-table-column>
        <!-- <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.status===1?'正常':'下线'}}</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column align="center" width="140" label="品牌图片">
          <template slot-scope="scope">
            <img
              :src="resourcesUrl + scope.row.brandPic"
              width="100"
              height="100"
              v-if="scope.row.brandPic"
            />
          </template>
        </el-table-column>-->
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
    </div>
    <span slot="footer">
      <div class="default-btn primary-btn" @click="visible = false">{{$t("remindPop.cancel")}}</div>
      <div class="default-btn primary-btn" @click="submitBrand()">{{$t("remindPop.confirm")}}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      brandName: null,
      dataForm: {
        brand: ''
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      singleSelectBrandId: 0,
      allData: [],
      selectBrand: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  props: {
    isSingle: {
      default: false,
      type: Boolean
    },
    dataUrl: {
      default: '/platform/brand/page',
      type: String
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    init (selectBrand) {
      this.selectBrand = selectBrand
      this.visible = true
      this.dataListLoading = true
      if (this.selectBrand) {
        this.selectBrand.forEach(row => {
          this.dataListSelections.push(row)
        })
      }
      this.getDataList()
    },
    onSearch () {
      this.getDataList()
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(this.dataUrl),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize
            },
            {
              brandName: this.brandName,
              status: 1
            }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.dataListLoading = false
        if (this.selectBrand) {
          this.$nextTick(() => {
            this.selectBrand.forEach(row => {
              let index = this.dataList.findIndex((prodItem) => prodItem.brandId === row.brandId)
              this.$refs.brandTable.toggleRowSelection(this.dataList[index])
            })
          })
        }
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
    // 单选商品事件
    getSelectBrandRow (row) {
      this.dataListSelections = [row]
    },
    // 多选点击事件
    selectChangeHandle (selection) {
      this.dataList.forEach((tableItem) => {
        let selectedBrandIndex = selection.findIndex((selectedBrand) => {
          if (!selectedBrand) {
            return false
          }
          return selectedBrand.brandId === tableItem.brandId
        })
        let dataSelectedBrandIndex = this.dataListSelections.findIndex((dataSelectedBrand) => dataSelectedBrand.brandId === tableItem.brandId)
        if (selectedBrandIndex > -1 && dataSelectedBrandIndex === -1) {
          this.dataListSelections.push(tableItem)
        } else if (selectedBrandIndex === -1 && dataSelectedBrandIndex > -1) {
          this.dataListSelections.splice(dataSelectedBrandIndex, 1)
        }
      })
    },
    // 确定事件
    submitBrand () {
      let brands = []
      this.dataListSelections.forEach(item => {
        let brandIndex = brands.findIndex((brand) => brand.brandId === item.brandId)
        if (brandIndex === -1) {
          brands.push({ brandId: item.brandId, brandName: item.brandName })
        }
      })
      this.$emit('refreshSelectBrand', brands)
      this.dataListSelections = []
      this.visible = false
    }
  }
}
</script>
<style scoped>
.prods-select-body {
  height: 600px;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
</style>
