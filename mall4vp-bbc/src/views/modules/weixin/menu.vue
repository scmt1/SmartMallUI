<template>

  <div class="menu_setting_box js_menuBox dn"
       style="display: block;">
    <div class="menu_setting_area js_editBox">
      <div class="menu_preview_area">
        <div class="mobile_menu_preview">
          <div class="mobile_hd tc">
            {{ gzh_name }}
          </div>
          <div class="mobile_bd">
            <ul class="pre_menu_list grid_line ui-sortable ui-sortable-disabled no_menu"
                style="z-index:3;"
                id="menuList">
              <li v-for="(btn,index) in menu.button"
                  :key="btn.id"
                  class="jsMenu pre_menu_item grid_item jslevel1 size1of3 ui-sortable ui-sortable-disabled">
                <a href="javascript:void(0);"
                   @click="menu_selected(btn.name,index)"
                   :class="[{pre_menu_link: index===activeMenuIndex && activeMenuType()==1}]"
                   draggable="false">
                  <i class="icon_menu_dot js_icon_menu_dot dn"></i>
                  <i class="icon20_common sort_gray"></i>
                  <span class='js_l1Title'>{{ btn.name }}</span>
                </a>
                <div class="sub_pre_menu_box js_l2TitleBox"
                     v-if="index===activeMenuIndex">
                  <ul class="sub_pre_menu_list">
                    <li v-for="(sub,index) in btn.sub_button"
                        :key="sub.id"
                        class='jslevel2'><a href="javascript:void(0);"
                         @click="menu_item_selected(sub.name,index)"
                         :class="[{pre_menu_link: index===activeMenuItemIndex && activeMenuType()==2}]"
                         class="jsSubView"
                         draggable="false"><span class="sub_pre_menu_inner js_sub_pre_menu_inner"><i class="icon20_common sort_gray"></i><span class='js_l2Title'>{{ sub.name }}</span></span></a></li>
                    <li class='js_addMenuBox'
                        v-if="isSet(menu.button[activeMenuIndex].sub_button)&&btn.sub_button.length>=0&&btn.sub_button.length<5">
                      <a href="javascript:void(0);"
                         class="jsSubView js_addL2Btn"
                         title="最多添加5个子菜单"
                         @click="menu_item_add()"
                         draggable="false"><span class="sub_pre_menu_inner js_sub_pre_menu_inner"><i class="icon14_menu_add"></i></span></a></li>
                  </ul>
                  <i class="arrow arrow_out"></i>
                  <i class="arrow arrow_in"></i>
                </div>
              </li>
              <li class="js_addMenuBox pre_menu_item grid_item no_extra size1of1"><a href="javascript:void(0);"
                   v-if="isSet(menu.button)?(menu.button.length>=0&&menu.button.length<3):false"
                   @click="menu_add()"
                   :class="[{pre_menu_link: activeMenuIndex===''}]"
                   class="js_addL1Btn"
                   title="最多添加3个一级菜单"
                   draggable="false"> <i class="icon14_menu_add"></i> <span class="js_addMenuTips">添加菜单</span></a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="menu_form_area">
        <div id="js_none"
             class="menu_initial_tips tips_global"
             style="display: none;"></div>
        <div id="js_rightBox"
             class="portable_editor to_left"
             style="display: none;"
             v-show="activeMenuIndex > 0 || activeMenuIndex === 0 || activeMenuItemIndex > 0 || activeMenuIndex === 0 ">
          <div class="editor_inner">
            <div class="global_mod float_layout menu_form_hd js_second_title_bar">
              <h4 class="global_info"> 菜单名称 </h4>
              <div class="global_extra">
                <a href="javascript:void(0);"
                   id="jsDelBt"
                   @click="menu_del()"
                   v-if="showDelBtnType===1">删除菜单</a>
                <a href="javascript:void(0);"
                   id="jsDelBt"
                   @click="menu_item_del()"
                   v-if="showDelBtnType===2">删除子菜单</a>
              </div>
            </div>
            <div class="menu_form_bd"
                 id="view">
              <div id="js_innerNone"
                   style="display:none;"
                   class="msg_sender_tips tips_global"></div>
              <div class="frm_control_group js_setNameBox">
                <label for=""
                       class="frm_label"> <strong class="title js_menuTitle">菜单名称</strong>
                </label>
                <div class="frm_controls">
                  <span class="frm_input_box with_counter counter_in append"
                        v-if="activeMenuType() == 1 && isSet(menu.button[activeMenuIndex])"> <input type="text"
                           class="frm_input js_menu_name"
                           v-model="menu.button[activeMenuIndex].name" /> </span>
                  <span class="frm_input_box with_counter counter_in append"
                        v-if="activeMenuType() == 2 && isSet(menu.button[activeMenuIndex].sub_button[activeMenuItemIndex])">
                    <input type="text"
                           class="frm_input js_menu_name"
                           v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].name" />
                  </span>
                  <p class="frm_msg fail js_titleEorTips dn">字数超过上限</p>
                  <p class="frm_msg fail js_titlenoTips dn"
                     style="display: none;">请输入菜单名称</p>
                  <p class="frm_tips js_titleNolTips">字数不超过4个汉字或8个字母</p>
                </div>
              </div>
              <div class="frm_control_group"
                   v-show="((activeMenuIndex > 0 || activeMenuIndex === 0) && (menu.button[activeMenuIndex].sub_button.length == 0)) || (activeMenuItemIndex > 0 || activeMenuItemIndex === 0) "
                   style="display: none;">
                <label for=""
                       class="frm_label"> <strong class="title js_menuContent">菜单内容</strong>
                </label>
                <div class="frm_controls frm_vertical_pt">
                  <label class="frm_radio_label js_radio_sendMsg"
                         @click="radio_label_selected(1)"
                         :class="[{selected:showMenuContentType===1}]"
                         data-editing="0"> <i class="icon_radio"></i> <span class="lbl_content">发送消息</span> <input type="radio"
                           name="hello"
                           class="frm_radio" /> </label>
                  <label class="frm_radio_label js_radio_url"
                         @click="radio_label_selected(2)"
                         :class="[{selected:showMenuContentType===2}]"
                         data-editing="0"> <i class="icon_radio"></i> <span class="lbl_content">跳转网页</span> <input type="radio"
                           name="hello"
                           class="frm_radio" /> </label>
                  <label class="frm_radio_label js_radio_url"
                         @click="radio_label_selected(3)"
                         :class="[{selected:showMenuContentType===3}]"
                         data-editing="0"> <i class="icon_radio"></i> <span class="lbl_content">小程序</span> <input type="radio"
                           name="hello"
                           class="frm_radio" /> </label>
                  <label class="frm_radio_label js_radio_url"
                         @click="radio_label_selected(4)"
                         :class="[{selected:showMenuContentType===4}]"
                         data-editing="0"> <i class="icon_radio"></i> <span class="lbl_content">点击推送事件</span> <input type="radio"
                           name="hello"
                           class="frm_radio" /> </label>
                </div>
              </div>
              <div class="menu_content_container">
                <div class="menu_content send jsMain"
                     id="edit"
                     v-show="showMenuContentType===1"
                     style="display: none;">
                  <div class="msg_sender"
                       id="editDiv">
                    <div class="msg_tab">
                      <div class="tab_navs_panel">
                        <span class="tab_navs_switch_wrp switch_prev js_switch_prev"> <span class="tab_navs_switch"></span> </span>
                        <span class="tab_navs_switch_wrp switch_next js_switch_next"
                              style="display: none;"> <span class="tab_navs_switch"></span>
                        </span>
                        <div class="tab_navs_wrp"
                             style="width: 650px">
                          <ul class="tab_navs js_tab_navs"
                              style="margin-left:0;">
                            <li class="tab_nav tab_appmsg width4"
                                :class="[{selected:showMenuContentMsgType===1}]"
                                data-type="10"
                                data-tab=".js_appmsgArea"
                                data-tooltip="图文消息"
                                @click="setMateriaListByType('news')"><a href="javascript:void(0);"
                                 @click="content_msg_tab_nav(1)">&nbsp;<i class="icon_msg_sender"></i><span class="msg_tab_title">图文消息</span></a></li>
                            <li class="tab_nav tab_img width4"
                                :class="[{selected:showMenuContentMsgType===2}]"
                                data-type="2"
                                data-tab=".js_imgArea"
                                data-tooltip="图片"
                                @click="setMateriaListByType('image')"><a href="
                                javascript:void(0);"
                                 @click="content_msg_tab_nav(2)">&nbsp;<i class="icon_msg_sender"></i><span class="msg_tab_title">图片</span></a></li>
                            <li class="tab_nav tab_audio width4"
                                :class="[{selected:showMenuContentMsgType===3}]"
                                data-type="3"
                                data-tab=".js_audioArea"
                                data-tooltip="语音"
                                @click="setMateriaListByType('voice')"><a href="javascript:void(0);"
                                 @click="content_msg_tab_nav(3)">&nbsp;<i class="icon_msg_sender"></i><span class="msg_tab_title">语音</span></a></li>
                            <li class="tab_nav tab_video width4 no_extra"
                                :class="[{selected:showMenuContentMsgType===4}]"
                                data-type="15"
                                data-tab=".js_videoArea"
                                data-tooltip="视频"
                                @click="setMateriaListByType('video')">
                              <a href="javascript:void(0);"
                                 @click="content_msg_tab_nav(4)">&nbsp;<i class="icon_msg_sender"></i><span class="msg_tab_title">视频</span></a></li>
                            <!-- <li class="tab_nav">
                              <label>KEY:</label>
                              <input style="width: 190px"
                                     type="text"
                                     v-if="activeMenuType() == 1 && isSet(menu.button[activeMenuIndex])"
                                     v-model="menu.button[activeMenuIndex].key"
                                     value="">
                              <input style="width: 190px"
                                     type="text"
                                     v-if="activeMenuType() == 2 && isSet(menu.button[activeMenuIndex].sub_button[activeMenuItemIndex])"
                                     v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].key"
                                     value="">
                            </li> -->
                          </ul>
                        </div>
                      </div>
                      <div class="tab_panel">
                        <div class="tab_content"
                             v-show="showMenuContentMsgType===1"
                             style="display: none;">
                          <div class="js_appmsgArea inner ">
                            <div>
                              <span v-if="activeMenuType() == 1">
                                <el-select v-model="menu.button[activeMenuIndex].media_id"
                                           placeholder="请选择">
                                  <el-option v-for="item in new_materialList"
                                             :key="item.mediaId"
                                             :label="item.mediaName"
                                             :value="item.mediaId">
                                  </el-option>
                                </el-select>

                              </span>
                              <span v-if="activeMenuType() == 2">
                                <el-select v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].media_id"
                                           placeholder="请选择">
                                  <el-option v-for="item in new_materialList"
                                             :key="item.mediaId"
                                             :label="item.mediaName"
                                             :value="item.mediaId">
                                  </el-option>
                                </el-select>
                              </span>
                            </div>
                            <!--type 10图文 2图片  3语音 15视频 11商品消息-->
                            <!-- <div class="tab_cont_cover jsMsgSendTab"
                                 data-index="0">
                              <div class="media_cover">
                                <span class="create_access"> <a class="add_gray_wrp jsMsgSenderPopBt"
                                     href="javascript:void(0);"
                                     data-type="10"
                                     data-index="0"> <i class="icon36_common add_gray"></i>
                                    <strong>从素材库中选择</strong> </a> </span>
                              </div>
                              <div class="media_cover">
                                <span class="create_access"> <a target="_blank"
                                     class="add_gray_wrp"
                                     href="javascript:void(0);">
                                    <i class="icon36_common add_gray"></i>
                                    <strong>新建图文消息</strong> </a>
                                </span>
                              </div>
                            </div> -->
                          </div>
                        </div>
                        <div class="tab_content"
                             v-show="showMenuContentMsgType===2"
                             style="display: none;">
                          <div class="js_imgArea inner ">
                            <!--type 10图文 2图片  3语音 15视频 11商品消息-->
                            <div>
                              <span v-if="activeMenuType() == 1">
                                <el-select v-model="menu.button[activeMenuIndex].media_id"
                                           placeholder="请选择">
                                  <el-option v-for="item in new_materialList"
                                             :key="item.mediaId"
                                             :label="item.mediaName"
                                             :value="item.mediaId">
                                  </el-option>
                                </el-select>

                              </span>
                              <span v-if="activeMenuType() == 2">
                                <el-select v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].media_id"
                                           placeholder="请选择">
                                  <el-option v-for="item in new_materialList"
                                             :key="item.mediaId"
                                             :label="item.mediaName"
                                             :value="item.mediaId">
                                  </el-option>
                                </el-select>
                              </span>
                            </div>

                            <!-- <div class="tab_cont_cover jsMsgSendTab"
                                 data-index="1"
                                 data-type="2">
                              <div class="media_cover">
                                <span class="create_access"> <a class="add_gray_wrp jsMsgSenderPopBt"
                                     href="javascript:void(0);"
                                     data-type="2"
                                     data-index="1"> <i class="icon36_common add_gray"></i>
                                    <strong>从素材库中选择</strong> </a> </span>
                              </div>
                              <div class="media_cover">
                                <span class="create_access"> <a class="add_gray_wrp"
                                     id="msgSendImgUploadBt"
                                     data-type="2"
                                     href="javascript:void(0);"> <i class="icon36_common add_gray"></i>
                                    <strong>上传图片</strong> </a> </span>
                              </div>
                            </div> -->
                          </div>
                        </div>
                        <div class="tab_content"
                             v-show="showMenuContentMsgType===3"
                             style="display: none;">
                          <div class="js_audioArea inner ">
                            <div>
                              <span v-if="activeMenuType() == 1">
                                <el-select v-model="menu.button[activeMenuIndex].media_id"
                                           placeholder="请选择">
                                  <el-option v-for="item in new_materialList"
                                             :key="item.mediaId"
                                             :label="item.mediaName"
                                             :value="item.mediaId">
                                  </el-option>
                                </el-select>

                              </span>
                              <span v-if="activeMenuType() == 2">
                                <el-select v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].media_id"
                                           placeholder="请选择">
                                  <el-option v-for="item in new_materialList"
                                             :key="item.mediaId"
                                             :label="item.mediaName"
                                             :value="item.mediaId">
                                  </el-option>
                                </el-select>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="tab_content"
                             v-show="showMenuContentMsgType===4"
                             style="display: none;">
                          <div class="js_videoArea inner ">
                            <!--type 10图文 2图片  3语音 15视频 11商品消息-->
                            <!-- <div class="tab_cont_cover jsMsgSendTab"
                                 data-index="3">
                              <div class="media_cover">
                                <span class="create_access"> <a class="add_gray_wrp jsMsgSenderPopBt"
                                     href="javascript:void(0);"
                                     data-type="15"
                                     data-index="3"> <i class="icon36_common add_gray"></i>
                                    <strong>从素材库中选择</strong> </a> </span>
                              </div>
                              <div class="media_cover">
                                <span class="create_access"> <a target="_blank"
                                     class="add_gray_wrp"
                                     href="javascript:void(0);">
                                    <i class="icon36_common add_gray"></i>
                                    <strong>新建视频</strong> </a> </span>
                              </div>
                            </div> -->

                            <div>
                              <span v-if="activeMenuType() == 1">
                                <el-select v-model="menu.button[activeMenuIndex].media_id"
                                           placeholder="请选择">
                                  <el-option v-for="item in new_materialList"
                                             :key="item.mediaName"
                                             :label="item.mediaId"
                                             :value="item.mediaName">
                                  </el-option>
                                </el-select>

                              </span>
                              <span v-if="activeMenuType() == 2">
                                <el-select v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].media_id"
                                           placeholder="请选择">
                                  <el-option v-for="item in new_materialList"
                                             :key="item.mediaName"
                                             :label="item.mediaId"
                                             :value="item.mediaName">
                                  </el-option>
                                </el-select>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="profile_link_msg_global menu_send mini_tips warn dn js_warn">
                    请勿添加其他公众号的主页链接 </p>
                </div>
                <div class="menu_content url jsMain"
                     id="url"
                     v-show="showMenuContentType===2"
                     style="display: none;">
                  <form action=""
                        id="urlForm"
                        onsubmit="return false;">
                    <p class="menu_content_tips tips_global">订阅者点击该子菜单会跳到以下链接</p>
                    <div class="frm_control_group">
                      <label for=""
                             class="frm_label">页面地址</label>
                      <div class="frm_controls">
                        <span class="frm_input_box"
                              v-if="activeMenuType() == 1"> <input type="text"
                                 class="frm_input"
                                 id="urlText"
                                 name="urlText"
                                 v-model="menu.button[activeMenuIndex].url" /> </span>
                        <span class="frm_input_box"
                              v-if="activeMenuType() == 2"> <input type="text"
                                 class="frm_input"
                                 id="urlText"
                                 name="urlText"
                                 v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].url" />
                        </span>
                        <p class="profile_link_msg_global menu_url mini_tips warn dn js_warn">
                          请勿添加其他公众号的主页链接 </p>
                        <p class="frm_tips"
                           id="js_urlTitle"
                           style="display: none;"> 来自<span class="js_name"></span><span style="display:none;"> -《<span class="js_title"></span>》</span></p>
                      </div>
                    </div>
                    <div class="frm_control_group btn_appmsg_wrap">
                      <div class="frm_controls">
                        <p class="frm_msg fail dn"
                           id="urlUnSelect"
                           style="display: none;">
                          <span for="urlText"
                                class="frm_msg_content"
                                style="display: inline;">请选择一篇文章</span></p>
                        <!-- <a href="javascript:void(0);"
                           id="js_appmsgPop">从公众号图文消息中选择</a>
                        <a href="javascript:void(0);"
                           class="dn btn btn_default"
                           id="js_reChangeAppmsg">重新选择</a> -->
                      </div>
                    </div>
                  </form>
                </div>
                <div class="menu_content url jsMain"
                     v-show="showMenuContentType===3"
                     style="display: none;">
                  <form action=""
                        onsubmit="return false;">
                    <p class="menu_content_tips tips_global">订阅者点击该子菜单会跳到以下小程序</p>
                    <div class="frm_control_group">
                      <label for=""
                             class="frm_label">小程序ID</label>
                      <div class="frm_controls">
                        <span class="frm_input_box"
                              v-if="activeMenuType() == 1"> <input type="text"
                                 class="frm_input"
                                 id="urlText"
                                 name="urlText"
                                 v-model="menu.button[activeMenuIndex].appid" /> </span>
                        <span class="frm_input_box"
                              v-if="activeMenuType() == 2"> <input type="text"
                                 class="frm_input"
                                 id="urlText"
                                 name="urlText"
                                 v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].appid" />
                        </span>
                        <p class="profile_link_msg_global menu_url mini_tips warn dn js_warn">
                          请勿添加其他公众号的主页链接 </p>
                        <p class="frm_tips"
                           id="js_urlTitle"
                           style="display: none;"> 来自<span class="js_name"></span><span style="display:none;"> -《<span class="js_title"></span>》</span></p>
                      </div>
                    </div>
                    <div class="frm_control_group">
                      <label for=""
                             class="frm_label">首页地址</label>
                      <div class="frm_controls">
                        <span class="frm_input_box"
                              v-if="activeMenuType() == 1"> <input type="text"
                                 class="frm_input"
                                 name="urlText"
                                 v-model="menu.button[activeMenuIndex].pagepath" /> </span>
                        <span class="frm_input_box"
                              v-if="activeMenuType() == 2"> <input type="text"
                                 class="frm_input"
                                 name="urlText"
                                 v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].pagepath" />
                        </span>
                        <p class="profile_link_msg_global menu_url mini_tips warn dn js_warn">
                          请勿添加其他公众号的主页链接 </p>
                        <p class="frm_tips"
                           id="js_urlTitle"
                           style="display: none;"> 来自<span class="js_name"></span><span style="display:none;"> -《<span class="js_title"></span>》</span></p>
                      </div>
                    </div>
                    <div class="frm_control_group">
                      <label for=""
                             class="frm_label">页面url</label>
                      <div class="frm_controls">
                        <span class="frm_input_box"
                              v-if="activeMenuType() == 1"> <input type="text"
                                 class="frm_input"
                                 name="urlText"
                                 v-model="menu.button[activeMenuIndex].url" /> </span>
                        <span class="frm_input_box"
                              v-if="activeMenuType() == 2"> <input type="text"
                                 class="frm_input"
                                 name="urlText"
                                 v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].url" />
                        </span>
                        <p class="profile_link_msg_global menu_url mini_tips warn dn js_warn">
                          请勿添加其他公众号的主页链接 </p>
                        <p class="frm_tips"
                           id="js_urlTitle"
                           style="display: none;"> 来自<span class="js_name"></span><span style="display:none;"> -《<span class="js_title"></span>》</span></p>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="menu_content key jsMain"
                     id="key"
                     v-show="showMenuContentType===4"
                     style="display: none;">
                  <form action=""
                        id="urlForm"
                        onsubmit="return false;">
                    <p class="menu_content_tips tips_global">订阅者点击该子菜单会推送事件给开发者</p>
                    <div class="frm_control_group">
                      <label for=""
                             class="frm_label">KEY</label>
                      <div class="frm_controls">
                        <span class="frm_input_box"
                              v-if="activeMenuType() == 1"> <input type="text"
                                 class="frm_input"
                                 id="urlText"
                                 name="urlText"
                                 v-model="menu.button[activeMenuIndex].key" /> </span>
                        <span class="frm_input_box"
                              v-if="activeMenuType() == 2"> <input type="text"
                                 class="frm_input"
                                 id="urlText"
                                 name="urlText"
                                 v-model="menu.button[activeMenuIndex].sub_button[activeMenuItemIndex].key" />
                        </span>
                        <p class="frm_tips"
                           id="js_urlTitle"
                           style="display: none;"> 来自<span class="js_name"></span><span style="display:none;"> -《<span class="js_title"></span>》</span></p>
                      </div>
                    </div>
                    <div class="frm_control_group btn_appmsg_wrap">
                      <div class="frm_controls">
                        <p class="frm_msg fail dn"
                           id="urlUnSelect"
                           style="display: none;">
                          <span for="urlText"
                                class="frm_msg_content"
                                style="display: inline;">请选择一篇文章</span></p>
                        <!-- <a href="javascript:void(0);"
                           id="js_appmsgPop">从公众号图文消息中选择</a>
                        <a href="javascript:void(0);"
                           class="dn btn btn_default"
                           id="js_reChangeAppmsg">重新选择</a> -->
                      </div>
                    </div>
                  </form>
                </div>
                <div class="menu_content sended"
                     style="display:none;">
                  <p class="menu_content_tips tips_global">订阅者点击该子菜单会跳到以下链接</p>
                  <div class="msg_wrp"
                       id="viewDiv"></div>
                  <p class="frm_tips">来自<span class="js_name">素材库</span><span style="display:none;">
                      -《<span class="js_title"></span>》</span></p>
                </div>
                <div id="js_errTips"
                     style="display:none;"
                     class="msg_sender_msg mini_tips warn"></div>
              </div>
            </div>
          </div>
          <span class="editor_arrow_wrp"> <i class="editor_arrow editor_arrow_out"></i> <i class="editor_arrow editor_arrow_in"></i> </span>
        </div>
      </div>
    </div>
    <div class="tool_bar tc js_editBox">
      <el-button type="primary"
                 @click="saveData()">保存菜单</el-button>
      <el-button type="success"
                 @click="release()">发布菜单</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'wechat',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: function () {
    return {
      gzh_name: '实时预览',
      menu: {
        button: []
      },
      new_menu: { button: [] },
      activeMenuName: '',
      activeMenuIndex: '',
      activeMenuItemName: '',
      activeMenuItemIndex: '',
      showDelBtnType: '', // 1:delMenu 2:delMenuItem
      showMenuContentType: '', // 1:发送消息 2:跳转链接
      showMenuContentMsgType: '', // 1:图文信息 2:图片 3:语音 4:视频
      materialList: [],
      material: '',
      new_materialList: []
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    setMateriaListByType (type) {
      if (this.activeMenuType() === 1) {
        this.menu.button[this.activeMenuIndex].media_id = null
      } else {
        this.menu.button[this.activeMenuIndex].sub_button[this.activeMenuItemIndex].media_id = null
      }

      this.new_materialList = []
      // eslint-disable-next-line no-undef
      this.materialList.forEach(item => {
        if (item.mediaType === type) {
          this.new_materialList.push(item)
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/weixin/weixinMenu/info'),
        method: 'get'
      }).then(({ data }) => {
        if (data) {
          this.menu = data
        }
        this.getMaterialDataList()
      })
    },
    // 获取素材数据列表
    getMaterialDataList () {
      this.$http({
        url: this.$http.adornUrl('/weixin/material/list'),
        method: 'get'
      }).then(({ data }) => {
        this.materialList = data
      })
    },
    // 保存设置
    save (menu) {
      this.$http({
        url: this.$http.adornUrl('/weixin/weixinMenu'),
        method: 'put',
        data: this.$http.adornData({
          'menu': menu
        })
      }).then(({ data }) => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 1500
        })
      })
    },
    // 发布菜单
    release () {
      this.$http({
        url: this.$http.adornUrl('/weixin/weixinMenu/release'),
        method: 'put'
      }).then(({ data }) => {
        this.$message({
          message: '发布成功',
          type: 'success',
          duration: 1500
        })
      })
    },
    menu_data_completing: function () {
      for (let i = 0; i < this.menu.button.length; i++) {
        if (!('type' in this.menu.button[i])) {
          this.menu.button[i].type = 'media_id'
        }
        if (!('name' in this.menu.button[i])) {
          this.menu.button[i].name = ''
        }
        if (!('key' in this.menu.button[i])) {
          this.menu.button[i].key = ''
        }
        if (!('url' in this.menu.button[i])) {
          this.menu.button[i].url = ''
        }
        if (!('appid' in this.menu.button[i])) {
          this.menu.button[i].appid = ''
        }
        if (!('pagepath' in this.menu.button[i])) {
          this.menu.button[i].pagepath = ''
        }
        if (!('sub_button' in this.menu.button[i])) {
          this.menu.button[i].sub_button = []
        }
        if (this.menu.button[i].sub_button.length > 0) {
          for (let j = 0; j < this.menu.button[i].sub_button.length; j++) {
            if (!('type' in this.menu.button[i].sub_button[j])) {
              this.menu.button[i].sub_button[j].type = 'media_id'
            }
            if (!('name' in this.menu.button[i].sub_button[j])) {
              this.menu.button[i].sub_button[j].name = ''
            }
            if (!('key' in this.menu.button[i].sub_button[j])) {
              this.menu.button[i].sub_button[j].key = ''
            }
            if (!('url' in this.menu.button[i].sub_button[j])) {
              this.menu.button[i].sub_button[j].url = ''
            }
            if (!('appid' in this.menu.button[i].sub_button[j])) {
              this.menu.button[i].sub_button[j].appid = ''
            }
            if (!('pagepath' in this.menu.button[i].sub_button[j])) {
              this.menu.button[i].sub_button[j].pagepath = ''
            }
            if (!('sub_button' in this.menu.button[i].sub_button[j])) {
              this.menu.button[i].sub_button[j].sub_button = []
            }
          }
        }
      }
    },
    saveData: function () {
      // 补全数据,无数据也要为空
      this.menu_data_completing()
      for (let i = 0; i < this.menu.button.length; i++) {
        if (this.menu.button[i].sub_button.length > 0) {
          // eslint-disable-next-line camelcase
          const _sub_button = []
          for (let j = 0; j < this.menu.button[i].sub_button.length; j++) {
            if (this.menu.button[i].sub_button[j].type === 'media_id') {
              _sub_button[j] = {
                type: this.menu.button[i].sub_button[j].type,
                name: this.menu.button[i].sub_button[j].name,
                media_id: this.menu.button[i].sub_button[j].media_id
                // key: this.menu.button[i].sub_button[j].key
              }
            } else if (this.menu.button[i].sub_button[j].type === 'view') {
              _sub_button[j] = {
                type: this.menu.button[i].sub_button[j].type,
                name: this.menu.button[i].sub_button[j].name,
                url: this.menu.button[i].sub_button[j].url
              }
            } else if (this.menu.button[i].sub_button[j].type === 'miniprogram') {
              _sub_button[j] = {
                type: this.menu.button[i].sub_button[j].type,
                name: this.menu.button[i].sub_button[j].name,
                appid: this.menu.button[i].sub_button[j].appid,
                pagepath: this.menu.button[i].sub_button[j].pagepath,
                url: this.menu.button[i].sub_button[j].url
              }
            } else if (this.menu.button[i].sub_button[j].type === 'click') {
              _sub_button[j] = {
                type: this.menu.button[i].sub_button[j].type,
                name: this.menu.button[i].sub_button[j].name,
                key: this.menu.button[i].sub_button[j].key
              }
            }
          }
          if (this.menu.button[i].type === 'media_id') {
            this.new_menu.button[i] = {
              name: this.menu.button[i].name,
              sub_button: _sub_button
            }
          } else if (this.menu.button[i].type === 'view') {
            this.new_menu.button[i] = {
              name: this.menu.button[i].name,
              sub_button: _sub_button
            }
          } else if (this.menu.button[i].type === 'miniprogram') {
            this.new_menu.button[i] = {
              name: this.menu.button[i].name,
              sub_button: _sub_button
            }
          } else if (this.menu.button[i].type === 'click') {
            this.new_menu.button[i] = {
              name: this.menu.button[i].name,
              sub_button: _sub_button
            }
          }
        } else {
          if (this.menu.button[i].type === 'media_id') {
            this.new_menu.button[i] = {
              type: this.menu.button[i].type,
              name: this.menu.button[i].name,
              media_id: this.menu.button[i].media_id
            }
          } else if (this.menu.button[i].type === 'view') {
            this.new_menu.button[i] = {
              type: this.menu.button[i].type,
              name: this.menu.button[i].name,
              url: this.menu.button[i].url
            }
          } else if (this.menu.button[i].type === 'miniprogram') {
            this.new_menu.button[i] = {
              type: this.menu.button[i].type,
              name: this.menu.button[i].name,
              appid: this.menu.button[i].appid,
              pagepath: this.menu.button[i].pagepath,
              url: this.menu.button[i].url
            }
          } else if (this.menu.button[i].type === 'click') {
            this.new_menu.button[i] = {
              type: this.menu.button[i].type,
              name: this.menu.button[i].name,
              key: this.menu.button[i].key
            }
          }
        }
      }
      this.save(JSON.stringify(this.new_menu))
    },
    menu_selected: function (name, index) {
      this.showDelBtnType = 1
      this.activeMenuName = name
      this.activeMenuIndex = index
      this.activeMenuItemName = ''
      this.activeMenuItemIndex = ''

      // 补全数据,无数据也要为空
      this.menu_data_completing()

      if (this.menu.button[this.activeMenuIndex].sub_button.length > 0) {
        this.showMenuContentType = ''
      } else {
        this.showMenuContentType = this.activeMenuBtnType()
      }
    },
    menu_item_selected: function (name, index) {
      this.showDelBtnType = 2
      this.activeMenuItemName = name
      this.activeMenuItemIndex = index

      // 补全数据,无数据也要为空
      this.menu_data_completing()

      if (this.activeMenuIndex > 0 || this.activeMenuIndex === 0) {
        if (this.menu.button[this.activeMenuIndex].sub_button.length > 0) {
          this.showMenuContentType = this.activeMenuBtnType()
        }
      }
    },
    menu_add: function () {
      if (this.menu.button.length < 3) {
        this.activeMenuItemIndex = ''
        this.activeMenuItemName = ''
        this.menu.button.push({
          type: 'media_id',
          name: '菜单名称',
          media_id: '',
          url: '',
          sub_button: []
        })
        this.activeMenuIndex = this.menu.button.length - 1
        this.activeMenuName = '菜单名称'
        this.showDelBtnType = 1
        // 补全数据,无数据也要为空
        this.menu_data_completing()
      } else {
        alert('最多3个一级菜单')
      }
    },
    menu_item_add: function () {
      if (this.menu.button[this.activeMenuIndex].sub_button.length < 5) {
        this.menu.button[this.activeMenuIndex].sub_button.push({
          type: 'media_id',
          name: '子菜单名称',
          media_id: '',
          url: '',
          sub_button: []
        })
        this.activeMenuItemIndex =
          this.menu.button[this.activeMenuIndex].sub_button.length - 1
        this.activeMenuItemName = '子菜单名称'
        this.showDelBtnType = 2
        // 补全数据,无数据也要为空
        this.menu_data_completing()
      } else {
        alert('最多5个二级菜单')
      }
    },
    menu_del: function () {
      if (this.menu.button.length <= 3 && this.menu.button.length > 0) {
        if (
          this.activeMenuIndex !== 0 &&
          this.activeMenuIndex === this.menu.button.length - 1
        ) {
          this.menu.button.splice(this.activeMenuIndex, 1)
          this.activeMenuIndex -= 1
        } else if (this.activeMenuIndex === 0) {
          this.menu.button.splice(this.activeMenuIndex, 1)
          this.activeMenuIndex = 0
        } else {
          this.menu.button.splice(this.activeMenuIndex, 1)
        }

        if (this.menu.button.length === 0) {
          this.activeMenuIndex = ''
          this.activeMenuName = ''
          this.activeMenuItemIndex = ''
          this.activeMenuItemName = ''
        }
      }
    },
    menu_item_del: function () {
      if (
        this.menu.button[this.activeMenuIndex].sub_button.length <= 5 &&
        this.menu.button[this.activeMenuIndex].sub_button.length > 0
      ) {
        if (
          this.activeMenuItemIndex ===
          this.menu.button[this.activeMenuIndex].sub_button.length - 1
        ) {
          this.menu.button[this.activeMenuIndex].sub_button.splice(
            this.activeMenuItemIndex,
            1
          )
          this.activeMenuItemIndex -= 1
        } else if (this.activeMenuItemIndex === 0) {
          this.menu.button[this.activeMenuIndex].sub_button.splice(
            this.activeMenuItemIndex,
            1
          )
          this.activeMenuItemIndex = 0
        } else {
          this.menu.button[this.activeMenuIndex].sub_button.splice(
            this.activeMenuItemIndex,
            1
          )
        }

        if (this.menu.button[this.activeMenuIndex].sub_button.length === 0) {
          this.activeMenuIndex = ''
          this.activeMenuName = ''
          this.activeMenuItemIndex = ''
          this.activeMenuItemName = ''
        }
        this.showMenuContentType = this.activeMenuBtnType()
      }
    },
    radio_label_selected: function (val) {
      this.showMenuContentType = val
      if (val === 1) {
        this.setType('media_id')
      } else if (val === 2) {
        this.setType('view')
      } else if (val === 3) {
        this.setType('miniprogram')
      } else if (val === 4) {
        this.setType('click')
      }
    },
    content_msg_tab_nav: function (val) {
      this.showMenuContentMsgType = val
    },
    activeMenuType: function () {
      if (this.activeMenuIndex !== '' && this.activeMenuItemIndex !== '') {
        // 子菜单、二级菜单
        return 2
      } else if (
        this.activeMenuIndex !== '' &&
        this.activeMenuItemIndex === ''
      ) {
        // 一级菜单
        return 1
      } else {
        return 0
      }
    },
    activeMenuBtnType: function () {
      if (this.activeMenuType() === 1) {
        // 一级菜单
        switch (this.menu.button[this.activeMenuIndex].type) {
          case 'media_id':
            return 1
          case 'view':
            return 2
          case 'miniprogram':
            return 3
          case 'click':
            return 4
          default:
            return 0
        }
      } else if (this.activeMenuType() === 2) {
        // 子菜单、二级菜单
        switch (
        // eslint-disable-next-line standard/computed-property-even-spacing
        this.menu.button[this.activeMenuIndex].sub_button[
          this.activeMenuItemIndex
        ].type
        ) {
          case 'media_id':
            return 1
          case 'view':
            return 2
          case 'miniprogram':
            return 3
          case 'click':
            return 4
          default:
            return 0
        }
      } else {
        return ''
      }
    },
    isSet: function (variable) {
      if (typeof variable !== 'undefined') {
        return true
      } else {
        return false
      }
      //  return true
    },
    setType: function (type) {
      if (this.activeMenuType() === 1) {
        this.menu.button[this.activeMenuIndex].type = type
      } else if (this.activeMenuType() === 2) {
        // eslint-disable-next-line standard/computed-property-even-spacing
        this.menu.button[this.activeMenuIndex].sub_button[
          this.activeMenuItemIndex
        ].type = type
      }
    },
    setNemMenuObj: function () {
      for (let i = 0; i < this.menu.button.length; i++) {
        if (this.menu.button[i].sub_button.length > 0) {
          this.new_menu.push({
            name: this.menu.button[i].name,
            sub_button: this.menu.button[i].sub_button
          })
        } else {
          if (this.menu.button[i].type === 'media_id') {
            this.new_menu.push({
              name: this.menu.button[i].name,
              type: this.menu.button[i].type,
              media_id: this.menu.button[i].media_id,
              sub_button: []
            })
          } else if (this.menu.button[i].type === 'view') {
            this.new_menu.push({
              name: this.menu.button[i].name,
              type: this.menu.button[i].type,
              url: this.menu.button[i].url,
              sub_button: []
            })
          } else if (this.menu.button[i].type === 'miniprogram') {
            this.new_menu.push({
              name: this.menu.button[i].name,
              type: this.menu.button[i].type,
              appid: this.menu.button[i].appid,
              pagepath: this.menu.button[i].pagepath,
              url: this.menu.button[i].url,
              sub_button: []
            })
          } else if (this.menu.button[i].type === 'click') {
            this.new_menu.push({
              name: this.menu.button[i].name,
              type: this.menu.button[i].type,
              key: this.menu.button[i].key,
              sub_button: []
            })
          }
        }
      }
    }
  }}
</script>

