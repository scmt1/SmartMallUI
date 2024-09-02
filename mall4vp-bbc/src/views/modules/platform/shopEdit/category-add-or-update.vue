<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="false"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="closePopup"
    width="90%"
    top="8vh"
    class="shop-in-category-pup-dialog"
  >
    <div class="">
      <div class="popup">
        <div class="title">
          <div class="text"><span class="stress">*</span>{{ $t('shopProcess.editSigningCategory') }}</div>
          <div class="tips">
            {{ $t('shopProcess.preSigned') }}
            <span class="bold">{{ totalCount }}</span>
            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}，{{ $t('shopProcess.mostAdd') }}
            <span class="bold">200</span>
            {{ $t('shopProcess.piece') }}{{ $t('shopProcess.category') }}
          </div>
          <div class="close-btn" @click="closePopup"><i class="el-icon-close" /></div>
        </div>

        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="auto" size="small">
            <div class="input-row margin-bottom-none">
              <!-- <el-form-item prop="name" :label="$t('publics.category')">
                <el-input v-model="searchForm.name" size="small" :placeholder="$t('publics.category')"></el-input>
              </el-form-item> -->
              <el-form-item prop="categoryId" :label="$t('publics.category')">
                <el-cascader
                  ref="cascaderAddr"
                  filterable
                  v-model="selectedPlatformCategories"
                  :options="categoryList"
                  :props="platformCategoriesTreeProps"
                  style="width:100%"
                  clearable
                  :placeholder="$t('tip.select')"
                  change-on-select
                  @change="handlePlatformCategoryChange"
                  :show-all-levels="false"
                />
              </el-form-item>
              <div class="default-btn primary-btn" @click="searchChange">{{$t('product.search')}}</div>
              <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
            </div>
          </el-form>
        </div>

        <div class="main-container content">
          <!-- 表格 -->
          <div ref="tableBox" class="table-con right-box table-box">
            <el-table
              :data="signCategories"
              header-cell-class-name="table-header"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                :label="this.$i18n.t('shopProcess.categoryName')"
              />
              <el-table-column
                prop="parentName"
                :label="this.$i18n.t('shopProcess.parentCategoryName')"
              />
              <el-table-column
                prop="platformRate"
                :label="this.$i18n.t('shopProcess.categoryRate')"
              >
                <template slot-scope="{ row }">
                  <span v-if="row.platformRate || row.platformRate === 0">{{ row.platformRate }} %</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="customizeRate"
                :label="this.$i18n.t('shopProcess.customRate')"
              >
                <template slot-scope="scope">
                  <div class="custom-rate">
                    <el-input
                      v-model="scope.row.customizeRate"
                      type="number"
                      :min="0"
                      :max="99.9999"
                      :precision="4"
                      placeholder="0~99.9999"
                      size="small"
                      style="width: 80%;"
                      @blur="checkCustomizeRateInt(scope)"
                      @keydown.native="channelInputLimit"
                    />%
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="qualifications"
                :label="this.$i18n.t('shopProcess.categoryQualifications')"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.imgs.length" class="business-qual">
                    <!-- <imgs-upload v-model="scope.row.qualifications" :limit="2" :prompt="false" /> -->
                    <el-image
                      v-for="(img,index) in scope.row.imgs"
                      :key="index"
                      class="rotating-img"
                      :src="img"
                      :preview-src-list="scope.row.imgs"
                    />
                  </div>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="categoryStatus"
                :label="this.$i18n.t('shopProcess.categoryStatus')"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.categoryStatus === 1" class="tag-txt">{{ $t('publics.normal') }}</div>
                  <div v-if="scope.row.categoryStatus === 0" class="tag-txt red-tag-txt">{{ $t('publics.LowerShelf') }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                :label="this.$i18n.t('remindPop.operation')"
                width="100px"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="default-btn text-btn" @click="deleteSelectedCategory(scope)">{{ $t('remindPop.delete') }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="pagination">
            <!-- 分页 -->
            <el-pagination
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
        <!-- <div class="btn-box btn-row">
          <div class="default-btn" @click="closePopup">取消</div>
          <div class="default-btn primary-btn" @click="comfirmSubmit">确定</div>
        </div> -->
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  components: {
    // imgsUpload
  },
  props: {
    // 签约分类列表
    signCategoryList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      shopId: 0,
      visible: false,

      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {}, // 搜索
      selectedPlatformCategories: [],
      totalCount: null, // 签约总数量

      // table渲染列表(可滚动)
      signCategories: [],

      signList: [],

      categoryList: [],
      platformCategoriesTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      },

      // 消息提示关闭
      messageClosed: true
    }
  },
  methods: {
    init (shopId) {
      this.shopId = shopId
      this.visible = true
      this.getSignCategoryList()
      this.getPlatformCategory()
    },

    /**
     * 获取已签约类目列表
     */
    getSignCategoryList () {
      this.$http({
        url: this.$http.adornUrl('/prod/category/pageSigningInfo'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          'shopId': this.shopId,
          'current': this.page.currentPage,
          'size': this.page.pageSize,
          'status': 1 // 签约状态：1：已通过 0待审核 -1未通过
        }, this.searchForm))
      }).then(({ data }) => {
        this.signList = JSON.parse(JSON.stringify(data.records))
        this.signCategories = this.handleImgData(data.records)
        this.page.total = data.total
        this.page.currentPage = data.current
        if (this.totalCount === null) {
          this.totalCount = data.total
        }
        if (this.page.currentPage > data.pages) {
          this.page.currentPage = data.pages
          this.getSignCategoryList()
        }
      })
    },

    /**
     * 监听平台分类选择变化
     */
    handlePlatformCategoryChange (val) {
      this.searchForm.primaryCategoryId = undefined
      this.searchForm.secondaryCategoryId = undefined
      this.searchForm.categoryId = undefined
      if (val.length === 1) { // 长度为1，表明当前选择的是一级分类（点击了一级分类）
        this.searchForm.primaryCategoryId = val[0] // 平台一级分类id
      } else if (val.length === 2) { // 长度为2，表明当前选择的是二级分类（点击了二级分类）
        this.searchForm.secondaryCategoryId = val[1] // 平台二级分类id
      } else if (val.length === 3) { // 长度为3，表明当前选择的是三级分类（点击了三级分类）
        this.searchForm.categoryId = val[2] // 平台三级分类id
      }
    },

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
      if (imgUrls.length) {
        imgUrls.forEach((img, index) => {
          if (img.indexOf('http') === -1 && img.indexOf('https') === -1) {
            const image = this.resourcesUrl + img
            imgs.push(image)
          } else {
            imgs.push(img)
          }
        })
      }
      return imgs
    },

    /**
     * 获取平台分类列表，并转换成树形结构
     */
    getPlatformCategory () {
      this.loading = true
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({
          maxGrade: 2,
          status: 1
        })
      }).then(({ data }) => {
        this.allCategories = data
        let categorgTreeData = treeDataTranslate(data, 'categoryId', 'parentId')
        // 过滤没有下级分类的类目
        categorgTreeData = this.removeNotThirdCategoryItem(categorgTreeData)
        this.categoryList = categorgTreeData
      })
    },

    handleAddrChange (val) {
      this.searchForm.categoryId = val[2]
    },

    /**
     * 去除没有三级分类的类目
     */
    removeNotThirdCategoryItem (treeData) {
      const firstCategory = treeData
      for (let i = 0, index = 0; i < firstCategory.length; i++) {
        if (firstCategory[index].grade !== 2) {
          if (firstCategory[index].children) {
            const secondCategory = firstCategory[index].children
            firstCategory[index].children = this.removeNotThirdCategoryItem(secondCategory)
          } else {
            firstCategory.splice(index, 1)
            // 当前位置的元素已经被删除，当前位置索引不用++
            continue
          }
        }
        index++
      }
      return firstCategory
    },

    /**
     * 自定义扣率输入框判断
     */
    checkCustomizeRateInt (scope) {
      const { row, $index } = scope
      const orgCustomizeRate = JSON.parse(JSON.stringify(this.signList[$index].customizeRate))
      let customizeRate = parseFloat(row.customizeRate)
      let verification = true
      if (customizeRate === 0) {
        this.$set(this.signCategories[$index], 'customizeRate', 0)
        customizeRate = 0
      }
      // 如果当前项原本无自定义扣率，失焦时输入框内容为空，则终止
      if ((!orgCustomizeRate && orgCustomizeRate !== 0) && (!customizeRate && customizeRate !== 0)) {
        return
      }
      if (customizeRate) {
        // 0~99.9999
        const reg = /^(([1-9]{0,1}?\d{1}?)|(0{1}))(\.\d{0,4})?$/
        if (!reg.test(customizeRate)) {
          this.$set(this.signCategories[$index], 'customizeRate', orgCustomizeRate || '')
          this.messageClosed = false
          this.$message({
            message: this.$i18n.t('shopProcess.customizeRateErrorTips'),
            type: 'error',
            duration: 2000,
            onClose: () => {
              this.messageClosed = true
            }
          })
          verification = false
        }
      }
      if (verification) {
        this.changeCustomizeRateInt(scope)
      }
    },

    channelInputLimit (e) {
      const key = e.key
      // 不允许输入'-'
      if (key === '-' || key === '+') {
        e.returnValue = false
        return false
      }
      return true
    },

    /**
     * 修改扣率
     */
    changeCustomizeRateInt (scope) {
      const param = {
        categoryId: scope.row.categoryId,
        rate: scope.row.customizeRate,
        shopId: this.shopId
      }
      this.$http({
        url: this.$http.adornUrl('/platform/categoryShop/updateRate'),
        method: 'put',
        params: param
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('shopProcess.customizeRateEditSuccess'),
          type: 'success',
          duration: 1000,
          onClose: () => {}
        })
        this.signList = JSON.parse(JSON.stringify(this.signCategories))
      })
    },

    /**
     * 根据id删除数组项
     * @param {Number} id 需要删除的id
     * @param {Array} list 目标数组
     * @return {Array}
     */
    deleteById: function (id, list) {
      for (let index = list.length - 1; index >= 0; index--) {
        if (list[index] && list[index].categoryId === id) {
          list.splice(index, 1)
        }
      }
      return list
    },

    /**
     * 签约分类
     */
    signCategory () {
      if (!this.messageClosed) {
        return
      }
      const params = []
      this.allSelectedCategories.forEach(item => {
        const param = {
          categoryId: item.categoryId,
          rate: item.customizeRate,
          qualifications: item.qualifications ? item.qualifications : null,
          shopId: this.shopId
        }
        params.push(param)
      })
      this.$http({
        url: this.$http.adornUrl(`/prod/category/signing?shopId=${this.shopId}`),
        method: 'put',
        data: params
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('shopProcess.categorySaveSuccess'),
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
      if (this.allSelectedCategories.length > 0) {
        this.allSelectedCategories.forEach((el) => {
          this.signCategories.forEach((item) => {
            if (el.categoryId === item.categoryId) {
              el.qualifications = item.qualifications
              el.customizeRate = item.customizeRate
            }
          })
        })
        this.signCategory()
      } else {
        this.$message({
          message: this.$i18n.t('shopProcess.categorySigningNotEmpty'),
          type: 'error',
          duration: 1000
        })
      }
    },

    /**
     * 删除已选分类
     */
    deleteSelectedCategory (scope) {
      this.$confirm(this.$i18n.t('shopProcess.defineDeleteSigning') + '[' + scope.row.name + ']?', this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/categoryShop'),
          method: 'DELETE',
          params: this.$http.adornParams({
            categoryId: scope.row.categoryId,
            shopId: this.shopId
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('shopProcess.deleteSigningCategorySuccess'),
            type: 'success',
            duration: 1000,
            onClose: () => {}
          })
          this.getSignCategoryList()
          this.totalCount--
        })
      }).catch(() => {})

      // const index = scope.$index
      // this.allSelectedCategories.splice(index, 1)
      // this.signCategories.splice(index, 1)
      // this.getIds(this.allSelectedCategories, 1)
    },

    /**
     * 关闭弹窗
     */
    closePopup () {
      this.$emit('closePopup', 'category')
    },

    searchChange () {
      this.page.currentPage = 1
      this.getSignCategoryList()
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.selectedPlatformCategories = []
      this.searchForm = {}
    },

    handleSizeChange (val) {
      this.page.pageSize = val
      this.getSignCategoryList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getSignCategoryList()
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
  .popup {
    // position: fixed;
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    // width: 80%;
    // height: 730px;
    // background: #FFFFFF;
    // margin: auto;
    // z-index: 101;
    display: block;

    .red-tag-txt {
      color: #ff4949;
    }

    .search-bar {
      margin-top: 20px;
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
          padding-right: 5px;
        }
      }
      .tips {
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        color: #999;
        margin-left: 10px;
        .bold {
          color: #000;
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

    // 内容
    .content {
      // display: flex;
      // align-items: top;
      // justify-content: space-between;
      // padding: 0 20px;
      // margin-top: 20px;
      margin-top: 0;
      .rotating-img {
        display: inline-block;
        width: 60px;
        height: 60px;
      }
      .rotating-img:not(:last-child) {
        margin-right: 5px;
      }
      .left-box {
        // width: 262px;
        width: 20%;
        height: 574px;
        background: #FFFFFF;
        border: 1px solid #E9EAEC;
        box-sizing: border-box;
        overflow-y: scroll;
        & ::v-deep .filter-tree {
          padding-right: 10px;
          .el-tree-node__expand-icon {
            position: absolute;
            right: 2%;
          }
          .el-checkbox {
            margin-left: 12px;
          }
          .el-tree-node__expand-icon.expanded {
            transform: rotate(-90deg);
          }
          .custom-tree-node {
            display: inline-block;
            max-width: 185px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
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
      .right-box {
        position: relative;
        // width: 946px;
        // width: 80%;
        width: 100%;
        // height: 550px;
        // margin-left: 21px;
        // overflow-y: scroll;
        & ::v-deep .el-input {
          width: 50%;
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

        // 上传图片框
        // & ::v-deep .el-upload {
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   width: 65px;
        //   height: 65px;
        //   background: #FCFCFC;
        //   border-radius: 0;
        //   border: 1px solid #EAEAEA;
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
        /* 谷歌隐藏滚动条 */
        // &::-webkit-scrollbar {
        //   display: none;
        // }
        /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
        /* IE隐藏滚动条 */
        // -ms-overflow-style: none;
        /* 火狐隐藏滚动条 */
        // overflow: -moz-scrollbars-none;

        // 上传图片样式
        .business-qual {
          & ::v-deep .el-upload-list--picture-card .el-upload-list__item {
            width: 80px;
            height: 80px;
            line-height: 80px;
            margin-bottom: 0;
          }
          & ::v-deep .el-upload--picture-card {
            width: 80px;
            height: 80px;
            line-height: 90px;
            background: #fff;
          }
        }

        // 自定义类目扣率
        .custom-rate {
          & ::v-deep .el-input__inner {
            padding: 0 5px;
            padding-right: 0;
          }
        }
      }
      .table-box {
        border-top: 1px solid #E9EAEC;
        border-left: 1px solid #E9EAEC;
        border-right: 1px solid #E9EAEC;
        box-sizing: border-box;
        padding-bottom: 0;
        & ::v-deep .el-table__body-wrapper {
          // max-height: 502px;
          height: 475px;
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
      }
    }
    //侧边栏
    .custom-tree-node {
      font-size: 14px;
    }
  }
  .pagination {
    margin-top: 20px;
    padding-bottom: 20px;
    text-align: right;
  }
}
</style>
