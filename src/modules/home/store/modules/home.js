import * as types from '../mutation-types'

// initial state
const state = {
  scope: 'nav_information',
  openKeys:[],
  bread_crumb:[],
  nav:[{
      name:"我的信息",
      path:"/information",
      uuid:"information"
    },{
      name:"账号与权限",
      uuid:"account",
      children:[{
          name:"账号管理",
          path:"/limit/account",
          uuid:"account_manage",
          parent:{
            name:"账号与权限",
            uuid:"account",
          }
        },{
          name:"账号组管理",
          path:"/limit/account_group",
          uuid:"account_group_manage",
          parent:{
            name:"账号与权限",
            uuid:"account",
          }
        }
      ]
    },{
      name:"平台管理",
      path:"/platform",
      uuid:"plat_manage"
    },{
      name:"公会管理",
      path:"/group",
      uuid:"union_manage"
    },{
      name:"艺人管理",
      uuid:"actor_manage",
      children:[{
          name:"艺人分配",
          path:"/actor/assign",
          uuid:"actor_assign",
          parent:{
            name:"艺人管理",
            uuid:"actor_manage",
          }
        },{
          name:"艺人信息管理",
          path:"/actor/management",
          uuid:"actor_info_manage",
          parent:{
            name:"艺人管理",
            uuid:"actor_manage",
          }
        },
        {
          name:"艺人申请",
          path:"/actor/apply",
          uuid:"actor_apply",
          parent:{
            name:"艺人管理",
            uuid:"actor_apply",
          }
        }
      ]
    },{
      name:"经纪人管理",
      path:"/agent",
      uuid:"broker_manage",

    },{
      name:"财务管理",
      uuid:"finance_manage",
      children:[{
          name:"入账管理",
          path:"/finance/account",
          uuid:"finance_income",
          parent:{
            name:"财务管理",
            uuid:"finance_manage",
          }
        },{
          name:"财务流水",
          path:"/finance/flow",
          uuid:"finance_flow",
          parent:{
            name:"财务管理",
            uuid:"finance_manage",
          }
        },{
          
          name:"提现管理",
          path:"/finance/reflect",
          uuid:"finance_cash",
          parent:{
            name:"财务管理",
            uuid:"finance_manage",
          }
        },{
          
          name:"艺人薪资结算",
          path:"/finance/actor",
          uuid:"finance_cator",
          parent:{
            name:"财务管理",
            uuid:"finance_manage",
          }
        },{
          
          name:"经纪人薪资结算",
          path:"/finance/agent",
          uuid:"finance_broker",
          parent:{
            name:"财务管理",
            uuid:"finance_manage",
          }
        },{
          
          name:"公会结算",
          path:"/finance/union",
          uuid:"finance_union",
          parent:{
            name:"财务管理",
            uuid:"finance_manage",
          }
        }
      ]
    },{
      name:"统计分析",
      path:"/analyze",
      uuid:"analysis_system",
    },{
      name:"操作日志",
      path:"/logs",
      uuid:"opt_log",
    },
  ],
  navMaps:{}
}

// getters
const getters = {
  scope: state => state.scope,
  openKeys: state => state.openKeys,
  bread_crumb: state => state.bread_crumb,
  nav: state => state.nav,
  navMaps: state => state.navMaps,
}

// actions
const actions = {
  switchScope({ commit, state }, scope) {
    commit('SWITCH_SCOPE', scope);
  },
  setOpenKeys({ commit, state},key){
    commit('SET_OPEN_KEYS', key);
  },
  setOpenKeysDirect({ commit, state},key){
    commit('SET_OPEN_KEYS_DIRECT', key);
  },
  setBreadCrumb({ commit, state},list){
    commit('SET_BREAD_CRUMB', list);
  },
  initNav({ commit, state}){
    commit('INIT_NAV');
  },
  chagneRouter({commit,state,dispatch},{router}){
    dispatch('initNav');
    const path = router.path;
    let maps = state.navMaps;
    var nav = null;
    for(var key in maps){
      if(maps[key].path == path){
        nav = maps[key];
      }
    }
    if(nav){
      // dispatch('setOpenKeys',nav.uuid);
      dispatch('switchScope',nav.uuid);
      let bread_crumb = [];
      bread_crumb.push(nav);
      if(nav.parent){
        bread_crumb.unshift(nav.parent);
        // dispatch('setOpenKeysDirect',nav.parent.uuid);
      }
      dispatch('setBreadCrumb',bread_crumb)
    }
  }


}

// mutations
const mutations = {
  [types.SWITCH_SCOPE](state, scope) {
    state.scope = scope;
  },
  [types.SET_OPEN_KEYS](state, key) {
    const index = state.openKeys.findIndex(item => item == key);
    if(index >= 0){
      state.openKeys.splice(index,1);
    }else{
      state.openKeys.push(key);
    }
  },
  [types.SET_OPEN_KEYS_DIRECT](state, key) {
    const index = state.openKeys.findIndex(item => item == key);
    if(index >= 0){
    }else{
      state.openKeys.push(key);
    }
  },


  [types.SET_BREAD_CRUMB](state, list) {
    const home = {
      name:"主页",
      uuid:"main",
      path:"/"
    }
    list.unshift(home);
    state.bread_crumb = list;
  },
  [types.INIT_NAV](state) {
    const list = state.nav;
    let maps = {};
    function fn(list){
      for(var items of list){
        maps[items.uuid] = items;
        if(items.children && items.children.length > 0){
          fn(items.children);
        }
      }
    }
    fn(list);
    state.navMaps = maps;
  },




}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
