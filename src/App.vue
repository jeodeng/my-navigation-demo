<template>
  <div id="app">
    <transition :name="transitionName">
      <navigation>
        <router-view/>
      </navigation>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      transitionName: 'fade',
    };
  },
  created() {
    // 前进的时候 从左滑入
    this.$navigation.on('forward', (to, from) => {
      this.transitionName = 'slide-left';
    });

    // 后退的时候 从右滑出
    this.$navigation.on('back', (to, from) => {
      this.transitionName = 'slide-right';
    });
  },
};
</script>

<style>
h1, body, html {
  margin: 0;
}

html, body {
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
}

.hello {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  position: absolute;
  transition: all .3s;
  background: red;
}

.red {
  background: red;
}

.blue {
  background: blue;
}

.yellow {
  background: yellow;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 滑入滑出 */
.slide-left-enter,
.slide-right-leave-to {
  position: absolute;
  opacity: 0;
  transform: translate(100%, 0);
}
.slide-right-enter,
.slide-left-leave-to {
  position: absolute;
  opacity: 0;
  transform: translate(-100%, 0);
}

</style>
