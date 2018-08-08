<template>
  <div class="viewShow">
    <transition name="router-fade" mode="out-in">
      <router-view
        class="view"
        keep-alive>
      </router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    components: {}
  }
</script>

<style lang="scss">
  @import "./style/style.scss";
  .viewShow{
    width:100%;
    overflow-y: hidden;
    overflow-x:hidden;
    height:100%;
  }
  .view{
     height:100%;
  }
</style>
