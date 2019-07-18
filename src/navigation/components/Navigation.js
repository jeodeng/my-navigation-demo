import Routes from '../routes'
import { getKey, matches } from '../utils'

export default (keyName) => {
  return {
    name: 'navigation',
    abstract: true,
    props: {},
    data: () => ({
      routes: Routes
    }),
    computed: {},
    watch: {
      routes(val) {
        for (const key in this.cache) {
          if (!matches(val, key)) {
            const vnode = this.cache[key]
            vnode && vnode.componentInstance.$destroy()
            delete this.cache[key]
          }
        }
      },
    },
    created() {
      this.cache = {}
    },
    destroyed() {
      for (const key in this.cache) {
        const vnode = this.cache[key]
        vnode && vnode.componentInstance.$destroy()
      }
    },
    render() {
      const vnode = this.$slots.default ? this.$slots.default[0] : null
      if (vnode) {

        // 给该节点的key赋值
        vnode.key = vnode.key || (vnode.isComment
          ? 'comment'
          : vnode.tag)

        // 根据路由获取hash key
        const key = getKey(this.$route, keyName)

        // 判断 如果该节点key属性中不存在key，则加上
        if (vnode.key.indexOf(key) === -1) {
          vnode.key = `__navigation-${key}-${vnode.key}`
        }

        // 判断缓存中是否存在该节点
        if (this.cache[key]) {
          if (vnode.key === this.cache[key].key) {
            // 判断要渲染的节点key是否存在缓存中，如果存在就从缓存中取出来恢复该节点
            vnode.componentInstance = this.cache[key].componentInstance;

            // 判断是否缓存了scrollTop
            const scrollTop = vnode.componentInstance.scrollTop;

            if (scrollTop) {

              // 如果缓存了就渲染，用定时器是因为无法判断dom何时渲染完成
              setTimeout(() => {
                vnode.elm.scrollTop = scrollTop;
              }, 100);
            }

          } else {
            // replace vnode to cache
            this.cache[key].componentInstance.$destroy()
            this.cache[key] = vnode
          }
        } else {

          setTimeout(() => {
            // 监听dom的滚动事件，修改实例的滚动值
            vnode.elm.addEventListener("scroll", (e) => {
              vnode.componentInstance.scrollTop = e.target.scrollTop;
            });
          }, 100);

          // 缓存一个新节点
          this.cache[key] = vnode
        }
        vnode.data.keepAlive = true
      }
      return vnode
    }
  }
}
