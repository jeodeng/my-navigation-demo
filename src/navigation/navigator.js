import Routes from './routes'
import { getKey } from './utils'

export default (bus, store, moduleName, keyName) => {

  // 判断是否使用了vuex传入store
  if (store) {
    store.registerModule(moduleName, {
      state: {
        routes: Routes
      },
      mutations: {
        'navigation/FORWARD': (state, { to, from, name }) => {
          state.routes.push(name)
        },
        'navigation/BACK': (state, { to, from, count }) => {
          state.routes.splice(state.routes.length - count, count)
        },
        'navigation/REPLACE': (state, { to, from, name }) => {
          state.routes.splice(Routes.length - 1, 1, name)
        },
        'navigation/REFRESH': (state, { to, from }) => {
        },
        'navigation/RESET': (state) => {
          state.routes.splice(0, state.routes.length)
        }
      }
    })
  }

  const forward = (name, toRoute, fromRoute) => {
    const to = { route: toRoute }
    const from = { route: fromRoute }
    const routes = store ? store.state[moduleName].routes : Routes
    // if from does not exist, it will be set null
    from.name = routes[routes.length - 1] || null
    to.name = name
    store ? store.commit('navigation/FORWARD', { to, from, name }) : routes.push(name)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(routes)
    bus.$emit('forward', to, from)
  }
  const back = (count, toRoute, fromRoute) => {
    const to = { route: toRoute }
    const from = { route: fromRoute }
    const routes = store ? store.state[moduleName].routes : Routes
    from.name = routes[routes.length - 1]
    to.name = routes[routes.length - 1 - count]

    // 返回上一级的时候会把上一级之前的路由全部删除，路由信息从栈中删除
    store ? store.commit('navigation/BACK', { to, from, count }) : routes.splice(Routes.length - count, count)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(routes)
    bus.$emit('back', to, from)
  }
  const replace = (name, toRoute, fromRoute) => {
    const to = { route: toRoute }
    const from = { route: fromRoute }

    // 判断是否用了store
    const routes = store ? store.state[moduleName].routes : Routes

    // 在这里判断routes中是否存在
    from.name = routes[routes.length - 1] || null
    to.name = name

    // 判断是否有stroe存在
    store ? store.commit('navigation/REPLACE', { to, from, name }) : routes.splice(Routes.length - 1, 1, name)

    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(routes)

    bus.$emit('replace', to, from)
  }
  const refresh = (toRoute, fromRoute) => {
    const to = { route: toRoute }
    const from = { route: fromRoute }
    const routes = store ? store.state[moduleName].routes : Routes
    to.name = from.name = routes[routes.length - 1]
    store ? store.commit('navigation/REFRESH', { to, from }) : null
    bus.$emit('refresh', to, from)
  }
  const reset = () => {
    store ? store.commit('navigation/RESET') : Routes.splice(0, Routes.length)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([])
    bus.$emit('reset')
  }

  const record = (toRoute, fromRoute, replaceFlag) => {
    const name = getKey(toRoute, keyName);

    // 类型判断
    // 如果是替换，直接replace
    if (replaceFlag) {
      replace(name, toRoute, fromRoute)
    } else {

      // 在栈中从后往前找
      const toIndex = Routes.lastIndexOf(name)

      if (toIndex === -1) {
        // 找不到，相当于进入一个新的页面，前进
        forward(name, toRoute, fromRoute)
      } else if (toIndex === Routes.length - 1) {
        // 要去的路由是栈最后一个，代表刷新
        refresh(toRoute, fromRoute)
      } else {
        // 返回
        back(Routes.length - 1 - toIndex, toRoute, fromRoute)
      }
    }
  }

  return {
    record, reset
  }
}
