<template>
  <el-dialog class="shop-in-category-pup-dialog" :visible.sync="visible" width="80%" :show-close="false" top="8vh">
    <div class="">
      <div class="popup">
        <div class="title">
          <div class="text">{{ $t('shopProcess.editSigningBrand') }}</div>
          <div class="tips">
            {{ $t('shopProcess.preSigned') }}
            <span class="bold">{{ totalCount }}</span>
            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}，{{ $t('shopProcess.mostAdd') }}
            <span class="bold">50</span>
            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.brand') }}
          </div>
          <div class="close-btn" @click="closePopup"><i class="el-icon-close" /></div>
        </div>

        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="auto" size="small">
            <div class="input-row margin-bottom-none">
              <el-form-item prop="name" :label="$t('shopProcess.brandName')">
                <el-input v-model="searchForm.name" size="small" :placeholder="$t('shopProcess.brandName')"></el-input>
              </el-form-item>
              <div class="default-btn primary-btn" @click="searchChange">{{$t('product.search')}}</div>
              <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
            </div>
          </el-form>
        </div>

        <div class="content">
          <!-- <div class="left-box">
            <div class="search-box">
              <input v-model="keyword" class="search-input" placeholder="请输入品牌名称">
              <div class="search-btn" @click="searchBrand">
                <i class="el-icon-search" />
              </div>
            </div>
            <div class="brand-box">
              <div class="brand-list">
                <div
                  v-for="(item, index) in allBrandList"
                  :key="index"
                  class="brand-item"
                  :class="{'active':item.isSelected===true}"
                  @click="addBrand(item, index)"
                >{{ item.name }}</div>
              </div>
            </div>
          </div> -->

          <!-- 已签约品牌列表 -->
          <div class="main-container right-box">
            <div class="table-con table-box">
              <!-- height="575" -->
              <el-table
                :data="signBrandList"
                header-cell-class-name="table-header"
                width="100%"
              >
                <el-table-column
                  prop="name"
                  :label="this.$i18n.t('shopProcess.brandName')"
                >
                  <template slot-scope="scope">
                    <span class="table-cell-text">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="firstLetter"
                  :label="this.$i18n.t('shopProcess.firstLetter')"
                />
                <el-table-column
                  prop="imgUrl"
                  :label="this.$i18n.t('shopProcess.brandLogo')"
                >
                  <template slot-scope="scope">
                    <el-image
                      class="rotating-img"
                      :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"
                      :preview-src-list="scope.row.imgUrl.indexOf('http')===-1 ? [resourcesUrl + scope.row.imgUrl] : [scope.row.imgUrl]"
                    />
                    <!-- <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl" style="width:57px;height:57px"> -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="qualifications"
                  :label="this.$i18n.t('shopProcess.brandQualifications')"
                >
                  <template slot-scope="scope">
                    <div class="business-qual">
                      <el-image
                      v-for="(img,index) in scope.row.imgs"
                      :key="index"
                      class="rotating-img"
                      :src="img"
                      :preview-src-list="scope.row.imgs"
                    />
                      <!-- <imgs-upload v-model="scope.row.qualifications" :limit="2" /> -->
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="brandStatus"
                  :label="this.$i18n.t('shopProcess.brandStatus')"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.brandStatus === 1" class="tag-txt">{{ $t('publics.normal') }}</div>
                    <div v-if="scope.row.brandStatus === 0" class="tag-txt red-tag-txt">{{ $t('publics.LowerShelf') }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  :label="this.$i18n.t('remindPop.operation')"
                  width="100px"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="default-btn text-btn" @click="deleteBrand(scope)">{{ $t('remindPop.delete') }}</div>
                    <!-- <el-button type="text" @click="deleteBrand(scope.row.brandId, scope.$index)">删除</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 分页 -->
            <div class="pagination">
              <el-pagination
                v-if="signBrandList.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
              </el-pagination>
            </div>
          </div>
        </div>
        <!-- <div class="btn-box btn-row">
          <div class="default-btn" @click="closePopup">取消</div>
          <div class="default-btn primary-btn" @click="comfirmSubmit">确定</div>
        </div> -->
      </div>
    </div>
  </el-dialog>
</template>

<script>
import imgsUpload from '@/components/imgs-upload'
export default {
  components: {
    imgsUpload
  },
  data () {
    return {
      shopId: 0,
      // 图片前缀
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      keyword: '',
      allBrandList: [],
      visible: false,
      signBrandList: [],
      customSignBrandList: [],
      customSignBrandRule: {
        name: [
          { required: true, message: this.$i18n.t('product.brandNaBeEmpty'), trigger: 'blur' }
        ],
        logo: [
          { required: true, message: this.$i18n.t('product.brandLogoNotEmpty'), trigger: 'blur' }
        ]
      },
      filterBrandList: [],
      imgs: '',

      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      totalCount: null, // 总数量
      searchForm: {} // 搜索
    }
  },
  methods: {
    // 初始化
    init (shopId) {
      this.shopId = shopId
      this.visible = true
      this.getPlatformBrand()
      this.getSignBrandList()
    },

    /**
     * 获取平台全部品牌
     */
    getPlatformBrand () {
      this.$http({
        url: this.$http.adornUrl(`/platform/brand/list`),
        method: 'get',
        params: this.$http.adornParams({ name: this.keyword, status: 1 })
      }).then(({ data }) => {
        // const signBrandList = this.signBrandList
        // const allBrandList = data
        this.allBrandList = data
        // this.brandEcho(allBrandList, signBrandList)
      })
    },

    /**
     * 左侧回显选中品牌或已签约品牌
     * @param {Array} allBrandList 全部品牌
     * @param {Array} signBrandList 选中品牌和已签约品牌
     */
    brandEcho (allBrandList, signBrandList) {
      allBrandList.forEach(item => {
        item.isSelected = false
      })
      if (signBrandList.length > 0 && allBrandList.length > 0) {
        for (let i = 0; i < signBrandList.length; i++) {
          for (let j = 0; j < allBrandList.length; j++) {
            if (signBrandList[i].brandId === allBrandList[j].brandId) {
              allBrandList[j].isSelected = true
              break
            }
          }
        }
      }
      this.allBrandList = allBrandList
    },

    /**
     * 获取签约品牌列表
     */
    getSignBrandList () {
      this.$http({
        url: this.$http.adornUrl(`/platform/brand/pageSigningByShopId`),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          'shopId': this.shopId,
          'current': this.page.currentPage,
          'size': this.page.pageSize,
          'status': 1 // 签约状态：1：已通过 0待审核 -1未通过
        }, this.searchForm))
      }).then(({ data }) => {
        this.signBrandList = this.handleImgData(data.records)
        this.page.total = data.total
        this.page.currentPage = data.current
        if (this.totalCount === null) {
          this.totalCount = data.total
        }
      })
    },

    // 处理数据图片
    handleImgData (dataList) {
      dataList.forEach(item => {
        const imgUrls = item.qualifications ? item.qualifications.split(',') : []
        if (imgUrls.length) {
          item.imgs = this.handleImgUrl(imgUrls)
        } else {
          item.imgs = []
        }
      })
      return dataList
    },
    handleImgUrl (imgUrls) {
      const imgs = []
      imgUrls.forEach((img, index) => {
        if (img.indexOf('http') === -1 && img.indexOf('https') === -1) {
          const image = this.resourcesUrl + img
          imgs.push(image)
        } else {
          imgs.push(img)
        }
      })
      return imgs
    },

    /**
     * 搜索品牌
     */
    searchBrand () {
      this.getPlatformBrand()
    },

    /**
     * 选中添加品牌
     */
    addBrand (brandObj, index) {
      brandObj.brandStatus = brandObj.status
      const length = this.signBrandList.length + this.customSignBrandList.length
      if (length > 50) {
        this.$message.warning(this.$i18n.t('shopProcess.brandMaxLimitTips'))
      } else {
        if (brandObj.isSelected === false) {
          this.signBrandList.push(brandObj)
        }
        this.allBrandList[index].isSelected = true
      }
    },

    /**
     * 删除选中品牌
     * @param {Number} id 品牌id
     * @param {Number} index 选中品牌列表索引
     */
    deleteBrand (scope) {
      this.$confirm(this.$i18n.t('shopProcess.deleteSigningBrandTips') + '[' + scope.row.name + ']?', this.$i18n.t('chat.tips'), {
        confirmButtonText: this.$i18n.t('webInfoConfig.determine'),
        cancelButtonText: this.$i18n.t('webInfoConfig.cancellation'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/brandShop'),
          method: 'DELETE',
          params: this.$http.adornParams({
            brandId: scope.row.brandId,
            shopId: this.shopId
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('shopProcess.deleteSigningBrandSuccess'),
            type: 'success',
            duration: 1000,
            onClose: () => {}
          })
          this.getSignBrandList()
          this.totalCount--
        })
      }).catch(() => {})
      // 去除选中样式
      // this.allBrandList.forEach(brandItem => {
      //   if (brandItem.brandId === id) {
      //     brandItem.isSelected = false
      //   }
      // })
      // this.signBrandList.splice(index, 1)
    },

    /**
     * 签约品牌
     */
    signBrand () {
      const params = {
        platformBrandList: [],
        customizeBrandList: []
      }
      this.signBrandList.forEach(item => {
        const param = {
          brandId: item.brandId,
          name: item.name,
          imgUrl: item.imgUrl,
          qualifications: item.qualifications
        }
        params.platformBrandList.push(param)
      })
      this.$http({
        url: this.$http.adornUrl(`/platform/brand/signing?shopId=${this.shopId}`),
        method: 'put',
        data: this.$http.adornData(params)
      }).then(() => {
        this.$message({
          message: this.$i18n.t('shopProcess.brandSaveSuccess'),
          type: 'success',
          duration: 1000
        })
        this.closePopup()
      })
    },

    /**
     * 确认提交
     */
    comfirmSubmit () {
      if (this.signBrandList.find(el => !el.imgUrl)) {
        this.$message.error(this.$i18n.t('shopProcess.brandLogoNotEmpty'))
        return
      }
      if (this.signBrandList.find(el => !el.qualifications)) {
        this.$message.error(this.$i18n.t('shopProcess.brandAuthorizationNotEmpty'))
        return
      }
      this.signBrand()
    },

    /**
     * 关闭弹窗
     */
    closePopup () {
      this.$emit('closePopup', 'brand')
    },

    searchChange () {
      this.page.currentPage = 1
      this.getSignBrandList()
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.searchForm = {}
    },

    handleSizeChange (val) {
      this.page.pageSize = val
      this.getSignBrandList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getSignBrandList()
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-in-category-pup-dialog {
  & ::v-deep .el-dialog__header {
    padding: 0;
  }
  & ::v-deep .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }
  & ::v-deep .el-dialog {
    min-width: 950px;
  }
  // margin-bottom: 200px;
  .popup {
    // position: absolute;
    // top: 0;
    // bottom: 0;
    // left: 50%;
    // transform: 50;
    // right: 0;
    // width: 1270px;
    // height: 730px;
    // background: #FFFFFF;
    // margin: auto;
    // z-index: 101;
    display: block;

    .search-bar {
      margin-top: 20px;
    }

    .red-tag-txt {
      color: #ff4949;
    }

    // 表格上的标题
    .title {
      display: flex;
      align-items: center;
      width: 100%;
      height: 64px;
      // padding-left: 20px;
      border-bottom: 1px solid #EAEAEA;
      .text {
        height: 23px;
        line-height: 21px;
        font-size: 16px;
        .stress {
          color: #FF2120;
        }
      }
      .tips {
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        color: #999;
        margin-left: 10px;
        .bold {
          color: #333;
        }
      }
      .close-btn {
        font-size: 23px;
        color: #DEDEDE;
        margin-left: auto;
        // margin-right: 20px;
        cursor: pointer;
      }
    }

    // 预览图片
    .rotating-img {
      width: 60px;
      height: 60px;
    }
    .rotating-img:not(:last-child) {
      margin-right: 5px;
    }

    // 内容
    .content {
      // display: flex;
      // align-items: top;
      // justify-content: space-between;
      // padding: 0 20px;
      // margin-top: 20px;
      .main-container {
        margin-top: 0;
      }
      .left-box {
        width: 20%;
        .search-box {
          position: relative;
          // width: 262px;
          width: 100%;
          height: 36px;
          background: #FFFFFF;
          border: 1px solid #E8E9EC;
          box-sizing: border-box;
          .search-input {
            width: 100%;
            height: 100%;
            padding: 0 67px 0 12px;
            border: none;
            outline: none;
            box-sizing: border-box;
          }
          input::-webkit-input-placeholder {
            font-size: 14px;
            color: #999;
          }
          .search-btn {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 55px;
            height: 100%;
            font-size: 20px;
            color: #CBCED4;
            border-left: 1px solid #E8E9EC;
            cursor: pointer;
          }
        }
        .brand-box {
          // width: 262px;
          width: 100%;
          height: 540px;
          border: 1px solid #E9EAEC;
          box-sizing: border-box;
          overflow-y: scroll;
          margin-top: 14px;
          .brand-list {
            .brand-item {
              width: 100%;
              height: 47px;
              line-height: 47px;
              font-size: 14px;
              padding-left: 14px;
              overflow: hidden;
              cursor: pointer;
              margin-bottom: 3px;
            }
            .active {
              background: rgba(24, 144, 255, 0.13);
            }
          }
          /* 谷歌隐藏滚动条 */
          &::-webkit-scrollbar {
            display: none;
          }
          /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
          /* IE隐藏滚动条 */
          -ms-overflow-style: none;
          /* 火狐隐藏滚动条 */
          overflow: -moz-scrollbars-none;
        }
        /* 谷歌隐藏滚动条 */
        &::-webkit-scrollbar {
          display: none;
        }
        /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
        /* IE隐藏滚动条 */
        -ms-overflow-style: none;
        /* 火狐隐藏滚动条 */
        overflow: -moz-scrollbars-none;
      }
      .right-box {
        // width: 946px;
        // width: 80%;
        width: 100%;
        // margin-left: 21px;
        .table-box {
          // width: 100%;
          // height: 487px;
          // border: 1px solid #E9EAEC;
          border-top: 1px solid #E9EAEC;
          border-left: 1px solid #E9EAEC;
          border-right: 1px solid #E9EAEC;
          box-sizing: border-box;
          padding-bottom: 0;
          & ::v-deep .el-table__body-wrapper {
            // max-height: 540px;
            height: 490px;
            overflow-y: scroll;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
          }
          & ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }
          & ::v-deep .el-table__body {
            width: 100%;
          }
          // & ::v-deep .el-table th.gutter {
          //   display: table-cell !important;
          // }
          // & ::v-deep .el-table__body-wrapper .el-table__body {
          //   width: 100% !important;
          // }
          // & ::v-deep .el-table--scrollable-y .el-table__body-wrapper {
          //   /* 谷歌隐藏滚动条 */
          //   &::-webkit-scrollbar {
          //     display: none;
          //   }
          //   /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
          //   /* IE隐藏滚动条 */
          //   -ms-overflow-style: none;
          //   /* 火狐隐藏滚动条 */
          //   overflow: -moz-scrollbars-none;
          // }
          // & ::v-deep tr.el-table__row:last-child {
          //   td {
          //     border-bottom: 0;
          //   }
          // }
          // 上传图片框
          // & ::v-deep .el-upload {
          //   display: flex;
          //   align-items: center;
          //   justify-content: center;
          //   width: 65px;
          //   height: 65px;
          //   background: #FCFCFC;
          //   border: 1px solid #EAEAEA;
          //   border-radius: 0;
          //   box-sizing: border-box;
          //   .el-icon-plus {
          //     font-size: 22px;
          //     color: #EAEAEA;
          //   }
          //   img {
          //     width: 100%;
          //     height: 100%;
          //   }
          // }
          // & ::v-deep  .el-upload-list__item {
          //   display: block;
          //   width: 65px;
          //   height: 65px;
          //   border-radius: 0;
          // }

          // 上传图片样式
          .business-qual {
            & ::v-deep .el-upload-list--picture-card .el-upload-list__item {
              width: 80px;
              height: 80px;
              margin-bottom: 0;
            }
            & ::v-deep .el-upload--picture-card {
              width: 80px;
              height: 80px;
              line-height: 80px;
            }
            & ::v-deep .el-upload {
              width: 80px;
              height: 80px;
              line-height: 80px;
              .pic {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .custom-box {
          display: flex;
          align-items: center;
          width: 962px;
          height: 60px;
          font-size: 14px;
          background: #FAFAFA;
          border: 1px solid #EAEAEA;
          box-sizing: border-box;
          margin-top: 17px;
          .text {
            padding-left: 30px;
          }
          .add-btn {
            width: 140px;
            height: 36px;
            line-height: 34px;
            text-align: center;
            background: #FFFFFF;
            border: 1px solid #EAEAEA;
            box-sizing: border-box;
            margin-left: auto;
            margin-right: 25px;
            cursor: pointer;
          }
        }

      }
    }
    .pagination {
      margin-top: 15px;
      margin-bottom: 10px;
      padding-bottom: 10px;
    }
  }
}
</style>
