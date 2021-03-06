import Vue from "vue";
import Router, {RouteConfig} from "vue-router";
/* Layout */
import Layout from "@/layout/index.vue";

Vue.use(Router);

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
 ConstantRoutes
 a base page that does not have permission requirements
 all roles can be accessed
 */
export const constantRoutes: RouteConfig[] = [
    {
        path: "/login",
        component: () =>
            import(/* webpackChunkName: "login" */ "@/views/login/index.vue"),
        meta: {hidden: true}
    },

    {
        path: "/register",
        component: () =>
            import(/* webpackChunkName: "login" */ "@/views/login/register.vue"),
        meta: {hidden: true}
    },

    {
        path: "/",
        component: Layout,
        redirect: "/edit",
        meta: {
            title: "笔记邮件",
            icon: "dashboard",
            alwaysShow: true
        },
        children: [
            /* {
                 path: "index",
                 component: () =>
                     import(/!* webpackChunkName: "guide" *!/ "@/views/guide/index.vue"),
                 name: "Guide",
                 meta: {
                     title: "guide",
                     icon: "guide",
                     noCache: true
                 }
             },*/
            {
                path: "edit",
                component: () =>
                    import( "@/views/my-test/editor/myedit.vue"),
                name: "Edit",
                meta: {
                    title: "编辑工具",
                    icon: "user",
                    keepAlive: true,
                }
            },
            {
                path: "articleList",
                component: () =>
                    import( "@/views/my-test/manager/table/tableList.vue"),
                name: "articleList",
                meta: {
                    title: "笔记列表",
                    icon: "user",
                    keepAlive: true,
                }
            },
        ]
    },

    {
        path: "/trade",
        component: Layout,
        redirect: "/trade",
        meta: {
            title: "交易舱",
            icon: "dashboard",
            alwaysShow: true
        },
        children: [
            {
                path: "stockList",
                component: () =>
                    import( "@/views/fund/stockList.vue"),
                name: "stockList",
                meta: {
                    title: "持仓列表",
                    icon: "user",
                    keepAlive: true,
                }
            }
        ]
    },
    {
        path: "/404",
        component: () =>
            import(/* webpackChunkName: "404" */ "@/views/error-page/404.vue"),
        meta: {hidden: true}
    }
    /*{
        path: "/example",
        component: Layout,
        redirect: "/example/tree",
        meta: {
            title: "Example",
            icon: "example",
            alwaysShow: true
        },
        children: [
            {
                path: "tree",
                component: () =>
                    import(/!* webpackChunkName: "tree" *!/ "@/views/tree/index.vue"),
                meta: {
                    title: "Tree",
                    icon: "tree"
                }
            }
        ]
    },*/
    /*{
        path: "/table",
        component: Layout,
        redirect: "/table/list",
        meta: {
            title: "Table",
            icon: "table"
        },
        children: [
            {
                path: "create",
                component: () =>
                    import(
                        /!* webpackChunkName: "table-create" *!/ "@/views/table/create.vue"
                        ),
                name: "CreateArticle",
                meta: {
                    title: "createArticle",
                    icon: "edit"
                }
            },
            {
                path: "edit/:id(\\d+)",
                component: () =>
                    import(/!* webpackChunkName: "table-edit" *!/ "@/views/table/edit.vue"),
                name: "EditArticle",
                meta: {
                    title: "editArticle",
                    noCache: true,
                    activeMenu: "/table/list",
                    hidden: true
                }
            },
            {
                path: "list",
                component: () =>
                    import(
                        /!* webpackChunkName: "table-list" *!/ "@/views/table/index.vue"
                        ),
                name: "ArticleList",
                meta: {
                    title: "articleList",
                    icon: "list"
                }
            }
        ]
    }*/
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

export const asyncRoutes: RouteConfig[] = [
    /*{
        path: "/permission",
        component: Layout,
        redirect: "/permission/setting",
        name: "Permission",
        meta: {
            title: "permission",
            icon: "lock",
            roles: ["admin"], // you can set roles in root nav
            alwaysShow: true // will always show the root menu
        },
        children: [
            {
                path: "account",
                component: () =>
                    import(/!* webpackChunkName: "account" *!/ "@/views/account/index.vue"),
                name: "Account",
                meta: {
                    title: "account",
                    icon: "user",
                    roles: ["admin"], // you can set roles in root nav
                }
            },
            {
                path: "setting",
                component: () =>
                    import(/!* webpackChunkName: "setting" *!/ "@/views/setting/index.vue"),
                name: "Setting",
                meta: {
                    title: "setting",
                    icon: "setting",
                    roles: ["admin"], // you can set roles in root nav

                }
            }
        ]
    },
    {
        path: "/myTest",
        component: Layout,
        redirect: "/permission/setting",
        name: "myTest",
        meta: {
            title: "myTest",
            icon: "lock",
            roles: ["admin"], // you can set roles in root nav
            alwaysShow: true // will always show the root menu
        },
        children: [
            {
                path: "computerTest",
                component: () =>
                    import( "@/views/my-test/computer-test.vue"),
                name: "computerTest",
                meta: {
                    title: "computerTest",
                    icon: "user",
                    roles: ["admin"] // or you can only set roles in sub nav
                }
            },
            {
                path: "propsTest",
                component: () =>
                    import( "@/views/my-test/manager/PropsPage.vue"),
                name: "propsTest",
                meta: {
                    title: "propsTest",
                    icon: "user",
                    roles: ["admin"] // or you can only set roles in sub nav
                }
            },
            {
                path: "emitTest",
                component: () =>
                    import( "@/views/my-test/manager/EmitPage.vue"),
                name: "emitTest",
                meta: {
                    title: "emitTest",
                    icon: "user",
                    keepAlive: true,
                    roles: ["admin"] // or you can only set roles in sub nav
                }
            },
            {
                path: "refTest",
                component: () =>
                    import( "@/views/my-test/manager/RefPage.vue"),
                name: "emitTest",
                meta: {
                    title: "refTest",
                    icon: "user",
                    roles: ["admin"] // or you can only set roles in sub nav
                }
            },
            {
                path: "edit",
                component: () =>
                    import( "@/views/my-test/editor/myedit.vue"),
                name: "emitTest",
                meta: {
                    title: "编辑器",
                    icon: "user",
                    keepAlive:true,
                    roles: ["admin"] // or you can only set roles in sub nav
                }
            },
            {
                path: "TESTV-BIND",
                component: () =>
                    import( "@/views/my-test/manager/testVbind.vue"),
                name: "TESTV-BIND",
                meta: {
                    title: "TESTV-BIND",
                    icon: "user",
                    roles: ["admin"] // or you can only set roles in sub nav
                }
            },
            {
                path: "upload",
                component: () =>
                    import( "@/views/my-test/manager/upload/upload.vue"),
                name: "upload",
                meta: {
                    title: "文件上传",
                    icon: "user",
                    roles: ["admin"] // or you can only set roles in sub nav
                }
            }, {
                path: "search",
                component: () =>
                    import( "@/views/my-test/manager/search/search.vue"),
                name: "upload",
                meta: {
                    title: "搜索",
                    icon: "user",
                    roles: ["admin"] // or you can only set roles in sub nav
                }
            }

        ]
    },
    {
        path: "/charts",
        component: Layout,
        redirect: "/charts/index",
        meta: {
            roles: ["admin"]
        },
        children: [
            {
                path: "index",
                component: () =>
                    import(/!* webpackChunkName: "charts" *!/ "@/views/charts/index.vue"),
                name: "charts",
                meta: {
                    title: "charts",
                    icon: "chart"
                }
            }
        ]
    },*/
    {
        path: "*",
        redirect: "/404",
        meta: {hidden: true}
    }
];

const createRouter = () =>
    new Router({
        // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
        scrollBehavior: (to, from, savedPosition) => {
            if (savedPosition) {
                return savedPosition;
            } else {
                return {x: 0, y: 0};
            }
        },
        base: process.env.BASE_URL,
        routes: constantRoutes
    });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    (router as any).matcher = (newRouter as any).matcher; // reset router
}

export default router;
