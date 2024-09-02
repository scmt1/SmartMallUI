<template>
  <div class="micro-classification-list-box">
    <div class="design-preview-controller">

      <div ref="design_vue_pre" class="rc-design-vue-preview default-preview">
        <img v-if="!formData.categoryList.length" src="/img/micro-page/class.png">

        <div v-if="formData.categoryList.length" class="all-class">
          <div class="all-item-left">
            <div
              v-for="(item,index) in formData.categoryList"
              :key="index"
              :class="['all-item-list',{active:index === 0}]"
            >
              {{ item.title }}
            </div>
          </div>
          <div class="all-item-right">
            <div v-for="(item,index) in formData.categoryList" :key="index">
              <div v-if="item.banner&&item.banner.image_url" class="banner-wrapper">
                <div class="banner-wrapper-cont" :style="{backgroundImage:'url('+item.banner.image_url+')'}"/>
              </div>
              <div class="group_body">
                <div class="container_group">
                  <div class="container_group-title">{{ item.title }}</div>
                  <div v-if="item.subCategoryList" class="container_group-list">
                    <div
                      v-for="(itemSub,indexSub) in item.subCategoryList"
                      :key="indexSub"
                      class="container_group-list-item"
                    >
                      <div
                        v-if="itemSub.image_url"
                        class="cap-category-container__img"
                        :style="{backgroundImage:'url('+itemSub.image_url+')'}"
                      />
                      <div v-if="itemSub.title" class="cap-category-container__title">{{ itemSub.title }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isShowEdit" class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">商品分类列表</div>
        <div v-for="(item,index) in formData.categoryList" :key="index" class="collapse-box">
          <div class="collapse-item">
            <div class="title-header">
              分类{{ index+1 }} :
              <el-input
                v-model="item.title"
                class="inputTitle"
                placeholder="请输入分类名称"
                @click.stop="inputFocus(index)"
              />
              <i
                class="iconRight"
                :class="item.isSw ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                @click="item.isSw = !item.isSw"
              />
            </div>
            <div :class="['collapse-con',{hide:!item.isSw}]">
              <div class="add-ads-desc">
                <span class="label-name">分类头图</span>：
              </div>
              <!--添加一个背景图-->
              <div
                v-if="!item.banner.image_url"
                class="editor-card-add"
                @click="addHeaderImg(item,index)"
              >
                <div class="add-image">
                  <div class="add-image-text">
                    <i class="el-icon-plus"/>
                    添加一个背景图
                  </div>
                  <div class="add-image-tip">{{ headerImg }}</div>
                </div>
              </div>

              <!--头图-->
              <div v-if="item.banner.image_url" class="class-edit-box">
                <div class="editor_subentry-item clearfix">
                  <div class="image-component image-editor">
                    <div class="has-choosed-image-box">
                      <img class="thumb-image" :src="item.banner.image_url" width="80" height="80">
                      <span class="modify-image" @click.stop="addHeaderImg(item,index)">更换图片</span>
                    </div>
                  </div>

                  <div class="subentry-item-editor">
                    <div class="subentry-control-group">
                      <label class="editor-container">
                        <div class="control-group-label">
                          跳转:
                        </div>
                        <div class="editor__control-group-control">
                          <div class="rc-choose-link-menu">
                            <div style="display: inline-block;">
                              <el-dropdown trigger="click" @command="handleCommandOne">

                                <div
                                  style="font-size: 12px;color: #333;cursor: pointer;"
                                  @click="chooseItem(index,2)"
                                >
                                  <span
                                    v-show="item.banner.type"
                                    class="typelabel"
                                  >{{ item.banner.type|typeNameFilter }}</span>
                                  {{ item.banner.title ? item.banner.title : '选择跳转到的页面' }}
                                  <i class="zenticon zenticon-right rc-choose-link-menu--closed"/>
                                </div>

                                <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item v-for="(v,i) in linkArray" :key="i" :command="({index,v})">
                                    {{ v.title }}
                                  </el-dropdown-item>
                                </el-dropdown-menu>

                              </el-dropdown>

                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <i class="el-icon-error item-delete " @click="item.banner.image_url=''"/>
              </div>

              <div class="add-ads-desc">
                <span class="label-name">子分类</span>：
              </div>
              <div class="editor">
                <div class="editor-container">
                  <div class="editor editor-control">
                    <div class="rc-design-editor-card">
                      <div class="editor-card rc-design-component-image-ad-editor-card">
                        <!--添加的图 item-->
                        <SlickList v-model="item.subCategoryList" :use-drag-handle="true" axis="y">
                          <SlickItem
                            v-for="(subItem,subIndex) in item.subCategoryList"
                            :key="subIndex"
                            class="class-edit-box"
                            :index="subIndex"
                          >
                            <div class="editor_subentry-item clearfix">
                              <div class="image-component image-editor">
                                <div class="has-choosed-image-box">
                                  <img class="thumb-image" :src="subItem.image_url" width="80" height="80">
                                  <div v-handle class="drag_box"/>
                                  <span class="modify-image" @click.stop="addItemImg(subIndex,index)">更换图片</span>
                                </div>
                              </div>
                              <div class="subentry-item-editor">
                                <div class="zent-design-editor__control-group">
                                  <label class="editor-container">
                                    <div class="control-group-label">
                                      标题:
                                    </div>
                                    <div class="editor__control-group-control">
                                      <div class="zent-input-wrapper">
                                        <el-input
                                          v-model.trim="subItem.title"
                                          size="mini"
                                          placeholder="建议10个字以内，可不填"
                                          clearable
                                        />
                                      </div>
                                    </div>
                                  </label>
                                </div>
                                <div class="subentry-control-group">
                                  <label class="editor-container">
                                    <div class="control-group-label">
                                      跳转:
                                    </div>
                                    <div class="editor__control-group-control">
                                      <div class="rc-choose-link-menu">
                                        <div style="display: inline-block;">
                                          <el-dropdown trigger="click" @command="handleCommandOne">
                                            <div
                                              :class="['choose_ed',{active:subItem.type&&subItem.title}]"
                                              @click="chooseItem(index,1,subIndex)"
                                            >
                                              <span v-if="subItem.type" class="typelabel">
                                                {{ subItem.type|typeNameFilter }}
                                              </span>

                                              {{ subItem.type&&subItem.title ? subItem.title : '选择跳转到的页面' }}
                                              <i class="zenticon zenticon-right rc-choose-link-menu--closed"/>
                                            </div>
                                            <el-dropdown-menu slot="dropdown">
                                              <el-dropdown-item
                                                v-for="(v,i) in linkArray"
                                                :key="i"
                                                :command="({index,v})"
                                              >
                                                {{ v.title }}
                                              </el-dropdown-item>
                                            </el-dropdown-menu>
                                          </el-dropdown>

                                        </div>
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <i
                              class="el-icon-error item-delete"
                              @click="item.subCategoryList.splice(subIndex,1)"
                            />
                          </SlickItem>
                        </SlickList>
                        <!--添加一个子分类-->
                        <div
                          class="editor-card-add"
                          @click="addNewChildren(index)"
                        >
                          <div class="add-image">
                            <div class="add-image-text">
                              <i class="el-icon-plus"/>
                              添加一个子分类
                            </div>
                            <div class="add-image-tip" v-html="uploadtip"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <i
              class="el-icon-error item-delete all-del"
              @click="formData.categoryList.splice(index,1)"
            />
          </div>
        </div>
        <!--添加一个主分类-->
        <div style="padding: 10px;" class="editor-card-add" @click="addNewItem">
          <div style="text-align: center;width: 100%"><i class="el-icon-plus"/>添加一个主分类</div>
        </div>

      </div>
    </div>


    <!-- 弹窗, 新增图片 -->
    <elx-imgbox ref="elxImgbox"
                @refreshPic="refreshPic"
                :maxSize="10"
                :imgSizeLimit="false"></elx-imgbox>

    <!-- 商品选择弹窗  -->
    <prods-select v-if="dialogChooseGoods"
                  ref="ProdsSelect"
                  :isSingle="true"
                  @refreshSelectProds="chooseGoodsFun"></prods-select>
  </div>
</template>
<script>
  import index from './index.js'

  export default index
</script>
