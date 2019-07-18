import Vue from 'vue';
import Router from 'vue-router';
import step1 from '@/components/step1';
import step2 from '@/components/step2';
import step3 from '@/components/step3';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'step1',
      component: step1,
    },
    {
      path: '/step2',
      name: 'step2',
      component: step2,
    },
    {
      path: '/step3',
      name: 'step3',
      component: step3,
    },
  ],
});
