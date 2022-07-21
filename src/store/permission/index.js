import { asyncRouterMap, constantRouterMap } from '../../router';

function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
        return route.meta.role.indexOf(roles) >= 0
    } else {
        return true
    }
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.routers = routers
            constantRouterMap[2].children = constantRouterMap[2].children.concat(routers);
            state.addRouters = constantRouterMap;
            console.log(constantRouterMap)
        }
    },
    actions: {
        generateRoutes({ commit }, data) {

            return new Promise(resolve => {
                const roles = data;

                const accessedRouters = asyncRouterMap.filter(v => {
                    if (roles == "admin") return true;
                    if (hasPermission(roles, v)) {
                        if (v.children && v.children.length > 0) {
                            v.children = v.children.filter(child => {
                                if (hasPermission(roles, child)) {
                                    return child
                                }
                                return false;
                            });
                            return v
                        } else {
                            return v
                        }
                    }
                    return false;
                });
                commit('SET_ROUTERS', accessedRouters);
                resolve();
            })
        }
    }
};

export default permission;

