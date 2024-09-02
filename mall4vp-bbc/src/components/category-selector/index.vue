<template>
  <div class="category-selector">
    <el-dialog
      :title="this.$i18n.t('category.categorySelector')"
      :visible.sync="visible"
      :append-to-body="visible"
      width="1000px">
      <div class="prod-category clearfix">
        <div class="category">
          <!-- 分类 -->
          <div class="category-box">
            <el-input v-model="firstCategorys.categoryName" :placeholder="this.$i18n.t('category.chooseProdCateg')" :disabled="true"></el-input>
            <ul class="category-list">
              <li
                class="category-item"
                :class="item.categoryId==firstCategorys.id?'active':''"
                @click="selectFirstCategorys(item.categoryId, index)"
                v-for="(item,index) in firstCategorys.dataList"
                :key="item.categoryId"
              >{{item.categoryName}}</li>
            </ul>
          </div>
          <!-- 分类 -->
          <div class="category-box" v-if="secondCategorys.dataList && secondCategorys.dataList.length && firstCategorys.id !== 0">
            <el-input :placeholder="this.$i18n.t('category.chooseProdCateg')" v-model="secondCategorys.categoryName" :disabled="true"></el-input>
            <ul class="category-list">
              <li
                class="category-item"
                :class="item.categoryId==secondCategorys.id?'active':''"
                @click="selectSecondCategorys(item.categoryId,index)"
                v-for="(item,index) in secondCategorys.dataList"
                :key="item.categoryId"
              >{{item.categoryName}}</li>
            </ul>
          </div>
          <!-- 分类 -->
          <div class="category-box" v-if="threeCategorys.dataList.length > 0 && secondCategorys.id !== 0">
            <el-input :placeholder="this.$i18n.t('category.chooseProdCateg')" v-model="threeCategorys.categoryName" :disabled="true"></el-input>
            <ul class="category-list">
              <li
                class="category-item"
                :class="[isCreateCategory?'prohibit-sel':item.categoryId==threeCategorys.id?'active':'']"
                @click="selectThreeCategorys(item.categoryId,index)"
                v-for="(item,index) in threeCategorys.dataList"
                :key="item.categoryId"
              >{{item.categoryName}}</li>
            </ul>
          </div>
        </div>
        <!-- 当前选择 -->
        <div class="current-selected">
          <span class="blod">{{$t("category.currCho")}}：</span>
          <span class="select-item">{{firstCategorys.categoryName}}</span>
          <span class="select-item" v-if="secondCategorys.id">&nbsp;>&nbsp;&nbsp;{{secondCategorys.categoryName}}</span>
          <span class="select-item" v-if="threeCategorys.id">&nbsp;>&nbsp;&nbsp;{{threeCategorys.categoryName}}</span>
        </div>
        <!-- 确认 -->
        <div class="read-rule">
          <div class="read-rule-txt"
               :class="(!isCreateCategory && threeCategorys.id !== 0) || (isCreateCategory && firstCategorys.id !== 0)?'todo':''"
               @click="optionsConfirm">{{$t("category.haveReadFol")}}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        allDataList: [],
        // 第一个分类
        firstCategorys: {
          id: 0,
          name: '',
          dataList: []
        },
        // 第二个分类
        secondCategorys: {
          id: 0,
          name: '',
          dataList: []
        },
        // 第三个分类
        threeCategorys: {
          id: 0,
          name: '',
          dataList: []
        },
        parentId: 0,
        isCreateCategory: false // 是否创建（平台）分类选择
      }
    },
    props: {
      // categoryList: Array
      hasThreeCategory: {
        default: true,
        type: Boolean
      }
    },

    methods: {
      /**
       * 初始化
       */
      init (type, selectedCategories) {
        this.visible = true
        if (selectedCategories && selectedCategories.length > 0) {
          this.firstCategorys = selectedCategories[0] || this.firstCategorys
          this.secondCategorys = selectedCategories[1] || this.secondCategorys
          this.threeCategorys = selectedCategories[2] || this.threeCategorys
        }
  
        this.$http({
          url: this.$http.adornUrl(`/prod/category/listCategory`),
          method: 'get'
        }).then(data => {
          this.allDataList = data.data
          console.log(this.allDataList)
          this.firstCategorys.dataList = this.allDataList.filter(item => item.grade === 0 || item.grade === '0')
          console.log('this.firstCategorys.dataList', this.firstCategorys.dataList)
          if (selectedCategories && selectedCategories.length === 2) {
            this.secondCategorys.dataList = this.allDataList.filter(item => item.parentId === this.firstCategorys.id)
          }
        })
        this.isCreateCategory = !!(type && type === 1)
      },
      show () {
        this.visible = true
      },
      hide () {
        this.visible = false
      },
      // 选中第一个分类
      selectFirstCategorys (categoryId, index) {
        this.secondCategorys.dataList = this.allDataList.filter(item => item.parentId === categoryId)
        this.firstCategorys.categoryName = index >= 0 ? this.firstCategorys.dataList[index].categoryName : this.firstCategorys.categoryName
        this.parentId = this.firstCategorys.id = categoryId
        this.secondCategorys.id = 0
        this.threeCategorys.id = 0
      },
      // 选中第二个分类
      selectSecondCategorys (categoryId, index) {
        this.threeCategorys.dataList = this.allDataList.filter(item => item.parentId === categoryId)
        this.parentId = this.secondCategorys.id = categoryId
        this.secondCategorys.categoryName = index >= 0 ? this.secondCategorys.dataList[index].categoryName : this.secondCategorys.categoryName
        this.threeCategorys.id = 0
      },
      // 选中第三个分类
      selectThreeCategorys (categoryId, index) {
        if (this.isCreateCategory) {
          return
        }
        this.parentId = this.threeCategorys.id = categoryId
        this.threeCategorys.categoryName = index >= 0 ? this.threeCategorys.dataList[index].categoryName : this.threeCategorys.categoryName
      },
      // 新增 / 修改
      optionsConfirm () {
        if (!this.isCreateCategory && !this.threeCategorys.id) {
          return
        }
        if (this.isCreateCategory && !this.firstCategorys.id) {
          return
        }
        // this.$store.commit('common/removeMainActiveTab')
        var selectedCategories = []
        if (this.firstCategorys.id) {
          selectedCategories.push(this.firstCategorys)
          this.firstCategorys.dataList = null
        }
        if (this.secondCategorys.id) {
          selectedCategories.push(this.secondCategorys)
          this.secondCategorys.dataList = null
        }
        if (!this.isCreateCategory && this.threeCategorys.id) {
          selectedCategories.push(this.threeCategorys)
          this.threeCategorys.dataList = null
        }
        console.log('selectedCategories', selectedCategories)
        this.$emit('getCategorySelected', selectedCategories, this.parentId)
      }

    }
  }
</script>

<style lang="scss">
  .prod-category {
    .clearfix::after {
      display: block;
      content: "";
      visibility: hidden;
      height: 0;
      clear: both;
    }
    width: 90%;
    margin: 0 auto;
    ul,
    li {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .tips {
      // display: inline-block;
      float: right;
      padding: 10px 12px;
      background: #02a1e9;
      color: #fff;
      font-size: 13px;
      margin: 0;
    }
    .category-box {
      box-sizing: border-box;
      width: 32%;
      box-sizing: border-box;
      display: inline-block;
      border: 1px solid #e4e4e4;
      padding: 20px;
      background: #fff;
      box-shadow: 0px 5px 8px -4px #e2e2e2;
    }
    .int {
      width: 100%;
      height: 2.5em;
      line-height: 2.5em;
      text-indent: 1em;
      border: 1px solid #e2e2e2;
      border-radius: 5px;
      outline: none;
      /* box-shadow: 0px 5px 8px -4px #e2e2e2; */
    }
    input.int::placeholder {
      color: #bdbdbd;
    }
    .category-list {
      margin-top: 10px;
      height: 250px;
      margin-left: 10px;
      overflow-y: auto;
    }
    .category-item {
      display: -webkit-box;
      max-width: 100%;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-word;
      word-wrap: break-word;
      padding: 6px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .category-item:hover,
    .category-item.active {
      // background: #e9f9ff;
      background: #f5f5f5;
      border-radius: 3px;
    }
    .current-selected {
      display: block;
      width: 100%;
      margin-top: 20px;
      border: 2px solid #fedbab;
      padding: 6px;
      background: #fffaf2;
      line-height: 1.5em;
      word-break: break-word;
      word-wrap: break-word;
      overflow: hidden;
    }
    .read-rule {
      width: 100%;
      margin-top: 20px;
    }
    .read-rule-txt {
      text-align: center;
      color: #fff;
      background: #999999;
      line-height: 3em;
      width: 50%;
      margin: 0 auto;
    }
    .rule {
      border: 1px solid #b9b9b9;
      padding: 0 10px;
      font-size: 13px;
      color: #777;
      margin-top: 20px;
    }
    .notice {
      line-height: 3em;
      border-bottom: 1px dashed #b9b9b9;
      margin: 0;
    }
    .blod {
      display: inline-block;
      font-weight: bold;
    }
    .rule-tit {
      text-align: center;
    }
    .rule-txt {
      line-height: 1.5em;
      padding-bottom: 30px;
    }
    .todo {
      background: #02a1e9;
      cursor: pointer;
    }
    .prohibit-sel {
      cursor: not-allowed;
    }
  }
</style>
