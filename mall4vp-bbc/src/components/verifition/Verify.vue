<template>
  <div v-show="showBox" :class="mode=='pop'?'verify-mask':''">
    <div :class="mode=='pop'?'verifybox':''" :style="{'max-width':parseInt(imgSize.width)+30+'px'}">
      <div v-if="mode=='pop'" class="verifybox-top">
        {{ $t("pleaseCompleteTheSecurityVerification") }}
        <span class="verifybox-close" @click="closeBox">
          <i class="iconfont icon-close" />
        </span>
      </div>
      <div class="verifybox-bottom" :style="{margin:mode=='pop'?'3% 5% 5%':'0'}">
        <!-- 验证码容器 -->
        <components
          :is="componentType"
          v-if="componentType"
          ref="instance"
          :captcha-type="captchaType"
          :type="verifyType"
          :figure="figure"
          :arith="arith"
          :mode="mode"
          :v-space="vSpace"
          :explain="explain"
          :img-size="imgSize"
          :block-size="blockSize"
          :bar-size="barSize"
          :default-img="defaultImg"
        />
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
/**
     * Verify 验证码组件
     * @description 分发验证码使用
     * */
import VerifySlide from './Verify/VerifySlide'
import VerifyPoints from './Verify/VerifyPoints'

export default {
  name: 'Vue2Verify',
  components: {
    VerifySlide,
    VerifyPoints
  },
  props: {
    // 双语化
    locale: {
      require: false,
      type: String,
      default () {
        // 默认语言不输入为浏览器语言
        if (navigator.language) {
          var language = navigator.language
        } else {
          var language = navigator.browserLanguage
        }
        return language
      }
    },
    captchaType: {
      type: String,
      required: true
    },
    figure: {
      type: Number
    },
    arith: {
      type: Number
    },
    mode: {
      type: String,
      default: 'pop'
    },
    vSpace: {
      type: Number
    },
    explain: {
      type: String
    },
    imgSize: {
      type: Object,
      default () {
        return {
          width: '310px',
          height: '155px'
        }
      }
    },
    blockSize: {
      type: Object
    },
    barSize: {
      type: Object
    }
  },
  data () {
    return {
      // showBox:true,
      clickShow: false,
      // 内部类型
      verifyType: undefined,
      // 所用组件类型
      componentType: undefined,
      // 默认图片
      defaultImg: require('@/assets/img/default-verify-error.jpg')
    }
  },
  computed: {
    instance () {
      return this.$refs.instance || {}
    },
    showBox () {
      if (this.mode == 'pop') {
        return this.clickShow
      } else {
        return true
      }
    }
  },
  watch: {
    captchaType: {
      immediate: true,
      handler (captchaType) {
        switch (captchaType.toString()) {
          case 'blockPuzzle':
            this.verifyType = '2'
            this.componentType = 'VerifySlide'
            break
          case 'clickWord':
            this.verifyType = ''
            this.componentType = 'VerifyPoints'
            break
        }
      }
    }
  },
  mounted () {
    this.uuid()
  },
  methods: {
    // 生成 uuid
    uuid () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      var slider = 'slider' + '-' + s.join('')
      var point = 'point' + '-' + s.join('')
      // 判断下是否存在 slider
      console.log(localStorage.getItem('slider'))
      if (!localStorage.getItem('slider')) {
        localStorage.setItem('slider', slider)
      }
      if (!localStorage.getItem('point')) {
        localStorage.setItem('point', point)
      }
    },
    /**
             * i18n
             * @description 兼容vue-i18n 调用$t来转换ok
             * @param {String} text-被转换的目标
             * @return {String} i18n的结果
             * */
    i18n (text) {
      if (this.$t) {
        return this.$t(text)
      } else {
        // 兼容不存在的语言
        const i18n = this.$options.i18n.messages[this.locale] || this.$options.i18n.messages['en-US']
        return i18n[text]
      }
    },
    /**
             * refresh
             * @description 刷新
             * */
    refresh () {
      if (this.instance.refresh) {
        this.instance.refresh()
      }
    },
    closeBox () {
      this.clickShow = false
      this.refresh()
    },
    show () {
      if (this.mode == 'pop') {
        this.clickShow = true
      }
      // this.$refs.instance.init()
    }
  }
}
</script>
<style>
    .verifybox{
        position: relative;
        box-sizing: border-box;
        border-radius: 5rpx;
        border: 1px solid #e4e7eb;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0,0,0,.3);
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
    }
    .verifybox-top{
        padding: 0 5%;
        /* height: 50px; */
        /* line-height: 50px; */
        text-align: left;
        margin-top: 4%;
        font-size: 14rpx;
        font-weight: bold;
        color: #333333;
        /* border-bottom: 1px solid #e4e7eb; */
        box-sizing: border-box;
    }
    .verifybox-bottom{
        /* padding: 15px; */
        box-sizing: border-box;
    }
    .verifybox-close{
        position: absolute;
        top: 13px;
        right: 5%;
        width: 24px;
        height: 24px;
        text-align: center;
        cursor: pointer;
    }
    .verify-mask{
        position: fixed;
        top: 0;
        left:0;
        z-index: 1001;
        width: 100%;
        height: 100vh;
        background: rgba(0,0,0,.3);
        /* display: none; */
        transition: all .5s;
    }
    .verify-tips{
        position: absolute;
        left: 0px;
        bottom:0px;
        width: 100%;
        height: 30px;
        line-height:30px;
        color: #fff;
    }
    .suc-bg{
       background-color:rgba(92, 184, 92,.5);
       filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
    }
    .err-bg{
       background-color:rgba(217, 83, 79,.5);
       filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
    }
    .tips-enter,.tips-leave-to{
        bottom: -30px;
    }
    .tips-enter-active,.tips-leave-active{
        transition: bottom .5s;
    }
    /* ---------------------------- */
    /*常规验证码*/
    .verify-code {
        font-size: 20px;
        text-align: center;
        cursor: pointer;
        margin-bottom: 5px;
        border: 1px solid #ddd;
    }

    .cerify-code-panel {
        height: 100%;
        overflow: hidden;
    }

    .verify-code-area {
        float: left;
    }

    .verify-input-area {
        float: left;
        width: 60%;
        padding-right: 10px;

    }

    .verify-change-area {
        line-height: 30px;
        float: left;
    }

    .varify-input-code {
        display: inline-block;
        width: 100%;
        height: 25px;
    }

    .verify-change-code {
        color: #337AB7;
        cursor: pointer;
    }

    .verify-btn {
        width: 200px;
        height: 30px;
        background-color: #337AB7;
        color: #FFFFFF;
        border: none;
        margin-top: 10px;
    }

    /*滑动验证码*/
    .verify-bar-area {
        position: relative;
        background: #FFFFFF;
        text-align: center;
        margin-top: 4%;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        border: 1px solid #ddd;
        -webkit-border-radius: 4px;
    }

    .verify-bar-area .verify-move-block {
        position: absolute;
        top: 0px;
        left: 0;
        background: #fff;
        cursor: pointer;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        box-shadow: 0 0 2px #888888;
        -webkit-border-radius: 1px;
    }

    .verify-bar-area .verify-move-block:hover {
        background-color: #337ab7;
        color: #FFFFFF;
    }

    .verify-bar-area .verify-left-bar {
        position: absolute;
        top: -1px;
        left: -1px;
        background: #f0fff0;
        cursor: pointer;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        border: 1px solid #ddd;
    }

    .verify-img-panel {
        margin: 0;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        /* border-top: 1px solid #ddd; */
        /* border-bottom: 1px solid #ddd; */
        border-radius: 3px;
        position: relative;
    }

    .verify-img-panel .verify-refresh {
        width: 25px;
        height: 25px;
        text-align: center;
        padding: 5px;
        cursor: pointer;
        position: absolute;
        top: 3%;
        right: 2%;
        z-index: 2;
    }

    .verify-img-panel .icon-refresh {
        font-size: 20px;
        color: #fff;
    }

    .verify-img-panel .verify-gap {
        background-color: #fff;
        position: relative;
        z-index: 2;
        border: 1px solid #fff;
    }

    .verify-bar-area .verify-move-block .verify-sub-block {
        position: absolute;
        text-align: center;
        z-index: 3;
        /* border: 1px solid #fff; */
    }

    .verify-bar-area .verify-move-block .verify-icon {
        font-size: 18px;
    }

    .verify-bar-area .verify-msg {
        z-index: 3;
        color: #333;
    }

    /*字体图标的css*/
    /*@font-face {font-family: "iconfont";*/
    /*src: url('../fonts/iconfont.eot?t=1508229193188'); !* IE9*!*/
    /*src: url('../fonts/iconfont.eot?t=1508229193188#iefix') format('embedded-opentype'), !* IE6-IE8 *!*/
    /*url('data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAaAAAsAAAAACUwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADMAAABCsP6z7U9TLzIAAAE8AAAARAAAAFZW7kiSY21hcAAAAYAAAAB3AAABuM+qBlRnbHlmAAAB+AAAAnQAAALYnrUwT2hlYWQAAARsAAAALwAAADYPNwajaGhlYQAABJwAAAAcAAAAJAfeA4dobXR4AAAEuAAAABMAAAAYF+kAAGxvY2EAAATMAAAADgAAAA4CvAGsbWF4cAAABNwAAAAfAAAAIAEVAF1uYW1lAAAE/AAAAUUAAAJtPlT+fXBvc3QAAAZEAAAAPAAAAE3oPPXPeJxjYGRgYOBikGPQYWB0cfMJYeBgYGGAAJAMY05meiJQDMoDyrGAaQ4gZoOIAgCKIwNPAHicY2Bk/sM4gYGVgYOpk+kMAwNDP4RmfM1gxMjBwMDEwMrMgBUEpLmmMDgwVDxbwtzwv4EhhrmBoQEozAiSAwAw1A0UeJzFkcENgCAMRX8RjCGO4gTe9eQcnhzAfXC2rqG/hYsT8MmD9gdS0gJIAAaykAjIBYHppCvuD8juR6zMJ67A89Zdn/f1aNPikUn8RvYo8G20CjKim6Rf6b9m34+WWd/vBr+oW8V6q3vF5qKlYrPRp4L0Ad5nGL8AeJxFUc9rE0EYnTezu8lMsrvtbrqb3TRt0rS7bdOmdI0JbWmCtiItIv5oi14qevCk9SQVLFiQgqAF8Q9QLKIHLx48FkHo3ZNnFUXwD5C2B6dO6sFhmI83w7z3fe8RnZCjb2yX5YlLhskkmScXCIFRxYBFiyjH9Rqtoqes9/g5i8WVuJyqDNTYLPwBI+cljXrkGynDhoU+nCgnjbhGY5yst+gMEq8IBIXwsjPU67CnEPm4b0su0h309Fd67da4XBhr55KSm17POk7gOE/Shq6nKdVsC7d9j+tcGPKVboc9u/0jtB/ZIA7PXTVLBef6o/paccjnwOYm3ELJetPuDrvV3gg91wlSXWY6H5qVwRzWf2TybrYYfSdqoXOwh/Qa8RWIjBTiSI3h614/vKSNRhONOrsnQi6Xf4nQFQDTmJE1NKbhI6crHEJO/+S5QPxhYJRRyvBFBP+5T9EPpEAIVzzRQIrjmJ6jY1WTo+NXTMchuBsKuS8PRZATSMl9oTA4uNLkeIA0V1UeqOoGQh7IAxGo+7T83fn3T+voqCNPPAUazUYUI7LgKSV1Jk2oUeghYGhZ+cKOe2FjVu5ZKEY2VkE13AK1+jI4r1KLbPlZfrKiPhOXKPRj7q9sj9XJ7LFHNmrKJS3VCdhXGSdKrtmoQaWeMjQVt0KD6sGPOx0oH2fgtzoNROxtNq8F3tzYM/n+TjKSX5qf2jx941276TIr9FjXxKr8eX/6bK4yuopwo9py1sw8F9kdw4AmurRpLUM3tYx5ZnKpfHPi8dzz19vJ6MjyxYUrpqeb1uLs3eGV6vr21pSqpeWkqonAN9oUyIiXpv8XvlN5e3icY2BkYGAA4n0vN4fG89t8ZeBmYQCBa9wPPRH0/wcsDMwmQC4HAxNIFABAfAqaAHicY2BkYGBu+N/AEMPCAAJAkpEBFbABAEcMAm94nGNhYGBgfsnAwMKAigESnwEBAAAAAAAAdgCkANoBCAFsAAB4nGNgZGBgYGMIZGBlAAEmIOYCQgaG/2A+AwARSAFzAHicZY9NTsMwEIVf+gekEqqoYIfkBWIBKP0Rq25YVGr3XXTfpk6bKokjx63UA3AejsAJOALcgDvwSCebNpbH37x5Y08A3OAHHo7fLfeRPVwyO3INF7gXrlN/EG6QX4SbaONVuEX9TdjHM6bCbXRheYPXuGL2hHdhDx18CNdwjU/hOvUv4Qb5W7iJO/wKt9Dx6sI+5l5XuI1HL/bHVi+cXqnlQcWhySKTOb+CmV7vkoWt0uqca1vEJlODoF9JU51pW91T7NdD5yIVWZOqCas6SYzKrdnq0AUb5/JRrxeJHoQm5Vhj/rbGAo5xBYUlDowxQhhkiMro6DtVZvSvsUPCXntWPc3ndFsU1P9zhQEC9M9cU7qy0nk6T4E9XxtSdXQrbsuelDSRXs1JErJCXta2VELqATZlV44RelzRiT8oZ0j/AAlabsgAAAB4nGNgYoAALgbsgI2RiZGZkYWRlZGNkZ2BsYI1OSM1OZs1OSe/OJW1KDM9o4S9KDWtKLU4g4EBAJ79CeQ=') format('woff'),*/
    /*url('../fonts/iconfont.ttf?t=1508229193188') format('truetype'), !* chrome, firefox, opera, Safari, Android, iOS 4.2+*!*/
    /*url('../fonts/iconfont.svg?t=1508229193188#iconfont') format('svg'); !* iOS 4.1- *!*/
    /*}*/

    .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-check:before {
        content: " ";
        display: block;
        width: 16px;
        height: 16px;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 9999;
        background-image: url("data:image/png;base64,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");
        background-size: contain;
    }

    .icon-close:before {
        content: " ";
        display: block;
        width: 16px;
        height: 16px;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 9999;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAShJREFUWEft1sEKgzAMBuCGvacHh/G2h9lOKgjzRTMqTkRqm/ztwIG7usbPNElLInJzJ/jRBdntwpWRfVn+R0b6vn8454SZXzmNpYlzmJGu6yoiGhfAm5nvCGYYhlFEKr9WROq2badQHC3ErzVjtggY4hfuA1kw+7VENDVNUx9lNVmsCMaK8LgkxJoZBKGGaDEowgRJYXIQZsgRhoj8Fs8tOgdNFKapfWMzI1DA698RBJSR7xtDGBRRHGKZM0UOvdjWoBjVHNnqQ92xjO+1WBGMCRJrUWQCbz9QDdHMiRyMCqJBRLpJdWonIRZEDiYKQRAoRn0xQoZVkYvR9qqIIEKZga6KPtBy6XXM/IydPalnmjjJYk29pNTzC1Lk0Cu1HdCI/8XLTwn5AHhNkDLKHHepAAAAAElFTkSuQmCC");
        background-size: contain;
    }

    .icon-right:before {
        content: " ";
        display: block;
        width: 60%;
        height: 60%;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-size: cover;
        z-index: 9999;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAALVJREFUSEvt1LENwjAQheE/YgAooIZZYA9GYyOQGICCDWABjIyw5MJW3rsoFaSN8z777uIhpbRgxmf4A2PVdUu0/Qbex4LLexe4AUvgAFwVxAVOwBF4qIgL5E1bSASwkCggI1MACWkBeUrOwE6ZkmrNC9gAz/q7HnABysyrTgLWCqAG1iXKu963/o0pPSjj2g3PO4gCUngUkMMjgBUeAfJlt+o1tDUdbg9mv66dEf6sdU/wg8AbtmtyGXDdHawAAAAASUVORK5CYII=");
        background-size: contain;
    }

    .icon-refresh:before {
        content: " ";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 9999;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAATRJREFUOE/F1E8r/VEQx/HXxYOQSCliZSEPgETKwp8UZaMQC2uPQFFI2bGwkrV+hYXEVlayIVmwUB6DXE0dut3fvfd707ec3Zk5824+M3OmUCwWG+V4Cn8FbEUBr1liamXYjUX0oQVNeMEt9vGY4BdYwnPcqwFHsJwCz1FMwQ0YxQL2cIl7TOGhGjBg85jJkHeEQ+zWAvZgHZNZtUr+gI0jkqiY4TaiJmdVgCH5X5mvF3O4qiQ5jAMlNSvnRqeHy4xvuPu2lTYlRiOK3FWn3IrPSoFtuEZHXsDghORBfP4WWj6HW0n2aV7AqN8mJvICBickr2A6A3qM2f/GoMq2GcIqDhBf7yMFxn8ewxo2cFIvMN51puXQj/a0HJ5wgx28V1JQ7z5sTusrhrjmqReYxfnx5w78Al5RbBWv+bTzAAAAAElFTkSuQmCC");
        background-size: contain;
    }
</style>
