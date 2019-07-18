<template>
  <div class="hello blue">
    <h1>Page Tree</h1>
    <input type="text" name="" value=""><br><br>
    <button @click="gotoPrevStep">上一步</button>
    <button @click="gotoStep1">回到首页</button>
    <button @click="gotoPrevStep2">上2步</button>
    <button @click="replaceStep2">replace至step2</button>
    <button @click="replaceStep3">replace至step3</button>
  </div>
</template>

<script>
export default {
  name: 'step2',
  methods: {
    gotoPrevStep() {
      this.$router.go(-1);
    },
    gotoStep1() {
      this.$router.push('/');
    },
    gotoPrevStep2() {
      this.$router.go(-2);
    },
    replaceStep2() {
      this.$router.replace({ path: '/step2' });
    },
    replaceStep3() {
      this.$router.go(0);
    },
  },
};
</script>
