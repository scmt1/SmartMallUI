<template>
  <el-dialog
    :title="$t('prodList.detailsTitle')"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="handleClose"
    width="1198px"
    top="10vh"
    >
    <div class="prod-info name">
      <div class="tit">{{$t('product.prodName')}}:</div>
      <div class="content">{{prodInfo.prodName}}</div>
    </div>
    <div class="prod-info brief">
      <div class="tit">{{$t('prodList.sellingPoints')}}:</div>
      <div class="content">{{prodInfo.brief}}</div>
    </div>
    <div class="prod-info imgs">
      <div class="tit">{{$t('product.pic')}}:</div>
      <div class="content">
        <el-image
          v-for="(item, index) in imgsList"
          :key="index"
          class="prod-imgs"
          :src="item"
          :preview-src-list="imgsList"
          fit="contain"></el-image>
      </div>
    </div>
    <div class="prod-info skus">
      <div class="tit">{{$t('prodSku.prodSku')}}:</div>
    </div>
    <div class="prod-info sku-table">
      <el-table
        ref="skuListTable"
        :data="prodInfo.skuList"
        header-cell-class-name="table-header"
        row-class-name="table-row"
        height="340"
      >
        <el-table-column prop="pic" :label="$t('product.pic')">
          <template slot-scope="scope">
            <img :src="scope.row.pic" class="sku-img">
          </template>
        </el-table-column>

        <el-table-column v-for="(item, index) in skuPropertiesTitleList" :key="index"  :label="item">
          <template slot-scope="scope">
            <span>{{scope.row.skuName.split(' ')[index]}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="price" :label="$t('prodList.salesPrice')">
          <template slot-scope="scope">
            <span>￥{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oriPrice" :label="$t('prodList.marketValue')">
          <template slot-scope="scope">
            <span>￥{{scope.row.oriPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stocks" :label="$t('marketing.inventory')">
          <template slot-scope="scope">
            <span>{{scope.row.stocks}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="volume" :label="$t('prodList.prodVolume')">
          <template slot-scope="scope">
            <span>{{scope.row.volume}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="weight" :label="$t('prodList.prodWeight')">
          <template slot-scope="scope">
            <span>{{scope.row.weight}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="dialogVisible = false">{{$t('coupon.cancel')}}</div>
      <div class="default-btn primary-btn" @click="dialogVisible = false">{{$t('coupon.confirm')}}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      prodInfo: {},
      imgsList: [],
      skuPropertiesTitleList: []
    }
  },
  methods: {
    init (prodId) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl(`/prod/prod/info/${prodId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          data.pic = data.pic.indexOf('http') > -1 ? data.pic : this.resourcesUrl + data.pic
          if (data.skuList) {
            data.skuList.forEach((el, index) => {
              el.pic = el.pic ? el.pic.indexOf('http') > -1 ? el.pic : this.resourcesUrl + el.pic : data.pic
              if (index === 0 && el.properties) {
                this.skuPropertiesTitleList = el.properties.split(';').map(item => item.split(':')[0])
              }
            })
          }
          this.imgsList = data.imgs.split(',').map(el => el.indexOf('http') > -1 ? el : this.resourcesUrl + el)
          this.prodInfo = data
        })
      })
    },
    handleClose (done) {
      this.$emit('handleHidePop')
      done()
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding-bottom: 10px;
}
.prod-info {
  display: flex;
  align-content: center;
  margin-bottom: 30px;
}
.prod-info.skus {
  margin-bottom: 20px;
}
.prod-info.sku-table {
  margin-bottom: 0;
}
.prod-info .tit {
  margin-right: 12px;  
}
.prod-info .content {
  flex: 1;
}
.prod-info .content .prod-imgs {
  width: 80px;
  height: 80px;
  margin-right:12px;
}
.prod-info.sku-table .sku-img {
  width: 40px;
  height:40px;
}
</style>