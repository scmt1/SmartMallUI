<template>
  <div class="categort-page-conntent" v-loading="pageLoading">
    <div class="category-select">
      <div class="top-header">
        <div class="one-input">
          <span>{{$t('pcdecorate.commonModal.categoryOne')}}</span>
        </div>
        <div class="one-input">
          <span>{{$t('pcdecorate.commonModal.categoryTwo')}}</span>
        </div>
        <div class="one-input">
          <span>{{$t('pcdecorate.commonModal.categoryThree')}}</span>
        </div>
      </div>
      <div class="select-options">
        <div class="border-right"></div>
        <div class="border-right"></div>
        <el-cascader-panel
          ref="casCaderRef"
          v-if="options.length > 0"
          v-model="category" 
          :options="options"
          @expand-change="handleExpandChange"
          @change="handleChange"
          :props="defaultProps">
        </el-cascader-panel>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    activeName: { // 激活tab名
      type: String,
      default: () => ''
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          label: 'categoryName',
          value: 'categoryId',
          children: 'childrenCategory'
        }
      }
    },
    customLinkArr: { // 自定义链接回显数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      category: [],
      options: [],
      pageLoading: false // 页面loading
    }
  },
  methods: {
      // 获取分类列表
    getCategoryList (maxGrade) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/prod/category/platformCategory'),
          method: 'get',
          params: this.$http.adornParams({
            // maxGrade: maxGrade, // 2表示三级分类，1 表示二级分类， 0 表示一级分类
            status: 1
          })
        }).then(({ data }) => {
          resolve(data)
        })
      })
    },
      // 渲染分类列表
    async setCategoryList () {
      let allCate = await this.getCategoryList()
        // 获取一级分类
      let res1 = await allCate.filter(el => el.grade === 0)
        // 获取二级分类
      let res2 = await allCate.filter(el => el.grade === 1)
        // 获取三级分类
      let res3 = await allCate.filter(el => el.grade === 2)
        // 将三级分类合并到二级分类上
      let arr2 = JSON.parse(JSON.stringify(res2))
      for (let i = 0; i < arr2.length; i++) {
        arr2[i].childrenCategory = []
        for (let j = 0; j < res3.length; j++) { // 子元素
          if (arr2[i].categoryId === res3[j].parentId) {
            arr2[i].childrenCategory.push(res3[j])
          }
        }
      }
        // 将二级分类合并到一级分类上
      let arr3 = JSON.parse(JSON.stringify(res1))
      for (let i = 0; i < arr3.length; i++) {
        arr3[i].childrenCategory = []
        for (let j = 0; j < arr2.length; j++) { // 子元素
          if (arr3[i].categoryId === arr2[j].parentId) {
            arr3[i].childrenCategory.push(arr2[j])
          }
        }
      }
      this.pageLoading = false
      this.options = arr3
        // 数据回显
      if (this.customLinkArr && this.customLinkArr.type != '' && this.customLinkArr.type === '2') {
        this.category = []
        this.customLinkArr.link.forEach(element => {
          this.category.push(element.value)
        })
        this.$nextTick(() => {
          this.setDatas()
        })
      }
    },
      // 当分类展开
    handleExpandChange (val) {
      this.$emit('handleGoodsSelect', { type: 'categoryItem', value: {}})
    },
    handleChange (val) {
      if (val.length === 3) { // 说明此时选择了三级
        let datas = this.$refs.casCaderRef ? this.$refs.casCaderRef.getCheckedNodes() : []
        let obj = {
          label: datas[0].label,
          data: [
            {
              label: datas[0].pathLabels[0],
              value: datas[0].path[0]
            },
            {
              label: datas[0].pathLabels[1],
              value: datas[0].path[1]
            },
            {
              label: datas[0].pathLabels[2],
              value: datas[0].path[2]
            }
          ]
        }
        this.$emit('handleGoodsSelect', { type: 'categoryItem', value: obj})
      } else {
        this.$emit('handleGoodsSelect', { type: 'categoryItem', value: {}})
      }
    },
      // 设置回显
    setDatas () {
      let datas = this.$refs.casCaderRef ? this.$refs.casCaderRef.getCheckedNodes() : []
      let obj = {
        label: datas[0].label,
        data: [
          {
            label: datas[0].pathLabels[0],
            value: datas[0].path[0]
          },
          {
            label: datas[0].pathLabels[1],
            value: datas[0].path[1]
          },
          {
            label: datas[0].pathLabels[2],
            value: datas[0].path[2]
          }
        ]
      }
      this.$emit('handleGoodsSelect', { type: 'categoryItem', value: obj})
    }
  },
  watch: {
    activeName (val) {
      if (val === '2') {
        this.pageLoading = true
          // 获取分类列表
        this.$refs.casCaderRef && this.$refs.casCaderRef.clearCheckedNodes()
        this.options = []
        this.category = []
        this.setCategoryList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.categort-page-conntent {
    min-height: 450px;
    max-height: 450px;
    height: 450px;
    padding: 0 27px;
    overflow-y: auto;
    .category-select {
        width: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border: 1px solid #E1E6F0;
        .top-header {
            width: 858px;
            height: 55px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            .one-input {
                width: 286px;
                height: 100%;
                border-right: 1px solid #E1E6F0;
                display: flex;
                align-items: center;
                padding: 0 10px;
                &:last-child {
                    border-right: none;
                }
                span {
                    width: 100%;
                    display: block;
                    background: rgba(247, 249, 251, 0.39);
                    border: 1px solid #E1E6F0;
                    border-radius: 2px;
                    font-size: 13px;
                    color: #aaa;
                    height: 30px;
                    line-height: 30px;
                    padding-left: 10px;
                }
            }
        }
    
        .select-options {
            display: flex;
            position: relative;
            height: 375px;
            .border-right {
                position: absolute;
                width: 1px;
                height: 100%;
                background: #E1E6F0;
                &:nth-child(1) {
                    left: 285px;
                }
                &:nth-child(2) {
                    left: 571px;
                }
            }
            .el-cascader-panel.is-bordered {
                border: none!important;
            }
        }
    }
}
</style>
<style lang="scss">
.category-select {
  .el-cascader-menu {
    width: 286px;
    overflow: hidden;
    border-color: #E1E6F0;
    border: none!important;
    .el-cascader-menu__wrap {
      width: 285px;
      height: 375px;
      overflow: hidden !important;
      margin-bottom: 0px!important;
      .el-cascader-menu__list {
        padding: 0px;
        height: 285px;
        overflow-y: auto;
      }
    }
    .el-cascader-node {
      padding: 0 30px 0 10px;
      .el-icon-check {
        display: none;
      }
      &.in-active-path {
        background: #F5F7FA;
      }
    }
    .el-cascader-node__label {
      padding: 0 10px 0 0;
    }
    &:nth-child(2) {
      width: 287px;
    }
    &:nth-child(3) {
      width: 287px;
      .el-cascader-menu__wrap {
        width: 287px;
      }
    }
  }
}
.el-scrollbar__bar.is-vertical {
  display: none;
}
</style>