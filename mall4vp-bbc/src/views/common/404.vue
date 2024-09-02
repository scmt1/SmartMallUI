<template>
  <div class="site-wrapper site-page--not-found">
    <div class="not-found-container">
      <img src="~@/assets/img/404.png" alt="404">
      <div class="content">
        <div class="text">
          {{ $t('homes.notFoundTips') }}
        </div>
        <div class="btns">
          <div class="default-btn" @click="$router.go(-1)">{{ $t('homes.backPrePage') }}</div>
          <div class="default-btn primary-btn" @click="$router.push({ name: 'home' })">{{ $t('homes.toHome') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--not-found {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    .not-found-container {
      margin-top: 15vh;
      align-items: center;
      display: flex;
      flex-direction: column;
      img {
        width: 600px;
        height: 280px;
      }
      .content {
        .text {
          color: #666;
          font-size: 28px;
          margin: 40px 0;
        }
        .btns {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
</style>
