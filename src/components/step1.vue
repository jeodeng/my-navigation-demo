<template>
  <div class="hello red">
    <h1>Page One</h1>
    <input type="text" name="" value=""><br><br>
    <button @click="gotoPrevStep">上一步</button>
    <button @click="gotoNextStep">下一步</button>
  </div>
</template>

<script>
export default {
  components: {
  },
  name: 'step1',
  methods: {
    gotoPrevStep() {
      this.$router.go(-1);
    },
    gotoNextStep() {
      this.$router.push('/step2');
    },
  },
};
</script>
