<template>
  <div
    ref="rightPanel"
    :class="{show:show}"
    class="rightPanel-container"
  >
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <div
        class="handle-button"
        :style="{'top':buttonTop+'px','background-color':theme}"
        @click="show=!show" 
      >
        <i :class="show?'el-icon-close':'el-icon-setting'" />
      </div>
      <div class="rightPanel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
  import {addClass, removeClass} from '@/utils'

  export default {
    name: 'RightPanel',
    props: {
      clickNotClose: {
        default: false,
        type: Boolean
      },
      buttonTop: {
        default: 250,
        type: Number
      }
    },
    data () {
      return {
        show: false,
        theme: '#000'
      }
    },
    computed: {},
    watch: {
      show (value) {
        if (value && !this.clickNotClose) {
          this.addEventClick()
        }
        if (value) {
          addClass(document.body, 'showRightPanel')
        } else {
          removeClass(document.body, 'showRightPanel')
        }
      }
    },
    mounted () {
      this.insertToBody()
    },
    beforeDestroy () {
      const elx = this.$refs.rightPanel
      elx.remove()
    },
    methods: {
      addEventClick () {
        window.addEventListener('click', this.closeSidebar)
      },
      closeSidebar (evt) {
        const parent = evt.target.closest('.rightPanel')
        if (!parent) {
          this.show = false
          window.removeEventListener('click', this.closeSidebar)
        }
      },
      insertToBody () {
        const elx = this.$refs.rightPanel
        const body = document.querySelector('body')
        body.insertBefore(elx, body.firstChild)
      }
    }
  }
</script>

<style>
  .showRightPanel {
    overflow: hidden;
    position: relative;
    width: calc(100% - 15px);
  }
</style>

<style lang="scss" scoped>
  .rightPanel-background {
    opacity: 0;
    transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
    background: rgba(0, 0, 0, .2);
    width: 0;
    height: 0;
    top: 0;
    left: 0;
    position: fixed;
    z-index: -1;
  }

  .rightPanel {
    background: #fff;
    position: fixed;
    height: 100vh;
    width: 100%;
    max-width: 260px;
    top: 0;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
    transition: all .25s cubic-bezier(.7, .3, .1, 1);
    transform: translate(100%);
    z-index: 200;
    left: auto;
    right: 0px;
  }

  .show {
    transition: all .3s cubic-bezier(.7, .3, .1, 1);

    .rightPanel-background {
      z-index: 100;
      opacity: 1;
      width: 100%;
      height: 100%;
    }

    .rightPanel {
      transform: translate(0);
    }
  }

  .handle-button {
    position: absolute;
    border-radius: 6px 0 0 6px !important;
    pointer-events: auto;
    z-index: 0;
    cursor: pointer;
    pointer-events: auto;
    font-size: 24px;
    text-align: center;
    color: #fff;
    line-height: 48px;
    left: -22px;
    width: 22px;
    height: 52px;
    transition: all .2s;

    &:hover {
      left: -48px;
      width: 48px;
    }

    i {
      font-size: 16px;
      line-height: 48px;
    }
  }
</style>
