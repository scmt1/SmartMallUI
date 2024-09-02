<template>
  <div class="categort-page-conntent">
    <div class="category-select">
        <div class="top-header">
          <div class="one-input">
            <span>{{$t('pcdecorate.commonModal.categoryOne')}}</span>
          </div>
        </div>
        <div class="select-options">
          <div 
            :class="{'category-items': true, 'active': active === index}" 
            v-for="(item, index) in options" 
            :key="index"
            @click="handleGoodsSelect(item, index)">{{item.categoryName}}</div>
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
      customLinkArr: { // 自定义链接回显数据
        type: Object,
        default: () => {}
      }
    },
    data() {
        return {
          active: '', // 当前激活
          options: []
        }
    },
    methods: {
        // 获取分类列表
        getCategoryList(maxGrade) {
          return new Promise((resolve, reject) => {
            this.$http({
              url: this.$http.adornUrl('/prod/category/shopCategory'),
              method: 'get',
            }).then(({ data }) => {
              resolve(data)
            })
          })
        },
        // 渲染分类列表
        async setCategoryList() {
          // 获取一级分类
          let res1 = await this.getCategoryList();
          this.options = res1;
          // 数据回显
          if(this.customLinkArr && this.customLinkArr.type != '' && this.customLinkArr.type === '2') {
            this.options.forEach((item,index) => {
              if(item.categoryId == this.customLinkArr.link.categoryId) {
                this.active = index;
                this.$emit('handleGoodsSelect', { type: 'categoryItem', value: {data: item, label: item.categoryName} });
              }
            })
          }
        },
        // 选择分类
        handleGoodsSelect(item, index) {
          this.active = index;
          this.$emit('handleGoodsSelect', { type: 'categoryItem', value: {data: item, label: item.categoryName} });
        }
    },
    watch: {
      activeName(val) {
        if(val === '2') {
          // 获取分类列表
          this.active = '';
          this.$refs.casCaderRef && this.$refs.casCaderRef.clearCheckedNodes();
          this.options = [];
          this.setCategoryList();
        }
      },
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
            width: 100%;
            height: 70px;
            display: flex;
            align-items: center;
            .one-input {
                width: 100%;
                height: 100%;
                border-right: 1px solid #E1E6F0;
                display: flex;
                align-items: center;
                padding: 0 20px;
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
            width: 100%;
            display: flex;
            position: relative;
            height: 360px;
            flex-direction: column;
            overflow-y: auto;
            padding: 0 20px;
            .category-items {
                width: 100%;
                height: 30px;
                line-height: 30px;
                cursor: pointer;
                padding-left: 10px;
                &:hover {
                    color: #155BD4;
                    background: #f8fafb;
                }
                &.active {
                    color: #155BD4;
                    background: #f8fafb;
                }
            }
        }
    }
}
</style>