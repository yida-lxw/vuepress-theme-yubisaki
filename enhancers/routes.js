const Layout = () => import('../Layout');
const NoutFound = () => import('../components/NotFound');

const ROOT = '/';

const install = (Vue, { router, themeConfig }) => {
    const navs = navsLocale(themeConfig.nav);
    const routes = [];
    
    // 通过 redirect 获取目录结构中设置了 index 的目录
    const navInRouter = router.options.routes
        .filter(route => route.redirect)
        .map(route => route.redirect);

    navs.forEach(nav => {
        if (nav.link && !~navInRouter.indexOf(nav.link)) {
            routes.push({
                path: nav.link,
                component: Layout,
                name: `nav-${nav.text}`,
                meta: { root: nav.root || false }
            })
        }
    });

    // inject root
    if (!hasRoot(router)) {
        routes.push({
            path: ROOT,
            name: 'root',
            component: Layout
        })
    };

    routes.push({
        path: '/404.html',
        name: 'notfound',
        component: NoutFound
    })

    router.addRoutes(routes);
}

const hasRoot = (router) => {
    const routes = router.options.routes;
    for(let route of routes) {
        if (route.path === ROOT) return true;
    }
    return false;
}

/**
 * 获取本地的 nav link
 * 过滤掉 http | https | // header
 * @param {Array} navs 
 */
const navsLocale = (navs) => {
    const localeReg = /^\/(?!\/).*/;

    return navs.filter(nav => nav.link && localeReg.test(nav.link))
}

export default { install }