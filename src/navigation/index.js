import Routes from './routes'
import Navigator from './navigator'
import NavComponent from './components/Navigation'
import { genKey, isObjEqual } from './utils'

export default {
  install: (Vue, { router, store, moduleName = 'navigation', keyName = 'VNK' } = {}) => {

    // 判断是否传入路由，若无抛错
    if (!router) {
      console.error('vue-navigation need options: router')
      return
    }

    // 创建承载容器
    const bus = new Vue()

    // 创建路由
    // moduleName为store中的module名，默认navigation
    // keyName 在url中的key名，默认VNK
    const navigator = Navigator(bus, store, moduleName, keyName);

    // hack vue-router replace for replaceFlag
    const routerReplace = router.replace.bind(router);
    let replaceFlag = false
    router.replace = (location, onComplete, onAbort) => {
      replaceFlag = true
      routerReplace(location, onComplete, onAbort)
    }

    // 包装了个路由钩子，初始化key
    router.beforeEach((to, from, next) => {

      // 判断下一级路由是否有key
      if (!to.query[keyName]) {

        const query = { ...to.query }

        // isObjEqual用于判断两个对象是否相同
        // 对下一级路由进行处理
        // 跳到相同路由不改变key
        if (to.path === from.path && isObjEqual(
          { ...to.query, [keyName]: null },
          { ...from.query, [keyName]: null },
        ) && from.query[keyName]) {
          query[keyName] = from.query[keyName]
        } else {
          query[keyName] = genKey();
        }

        // 打断当前导航，带上参数再次进入路由
        next({ name: to.name, params: to.params, query, replace: replaceFlag || !from.query[keyName] })
      } else {
        next();
      }
    })

    // 记录路由的变化
    router.afterEach((to, from) => {
      navigator.record(to, from, replaceFlag)
      replaceFlag = false
    })

    // 注册组件
    Vue.component('navigation', NavComponent(keyName))

    // 写入vue全局方法
    Vue.navigation = Vue.prototype.$navigation = {
      on: (event, callback) => {
        bus.$on(event, callback)
      },
      once: (event, callback) => {
        bus.$once(event, callback)
      },
      off: (event, callback) => {
        bus.$off(event, callback)
      },
      getRoutes: () => Routes.slice(),
      cleanRoutes: () => navigator.reset()
    }
  }
}
