<template>
  <div class="hello yellow" id="test">
    <h1>Page Two</h1>
    <button type="button" name="button" @click="scrollTop">scrollTop</button>
    <ul class="test">
      <li v-for="i in 15">{{ i }}</li>
    </ul>
    <input type="text" name="" value=""><br><br>
    <button @click="gotoPrevStep">上一步</button>
    <button @click="gotoNextStep">下一步</button>
    <ul class="test">
      <li v-for="i in 15">{{ i }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'step2',
  data() {
    return {
      aaa: '测试测试',
    }
  },
  methods: {
    gotoPrevStep() {
      this.$router.go(-1);
    },
    gotoNextStep() {
      this.$router.push('/step3');
    },
    scrollTop() {
      const el = document.getElementById('test');
      el.scrollTop = 1000;
    },
  },
};
</script>

<style>
  .test li {
    line-height: 80px;
  }
</style>
