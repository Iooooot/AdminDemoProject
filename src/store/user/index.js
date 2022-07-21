import axios from 'axios'


const user = {
    state: {
        permissions: [],//该用户所有权限
        role: '',
    },
    getters: {
    },
    mutations: {
        GETPERMISSIONS(state, value) {
            state.permissions = value;
        },
        GETROLE(state, value) {
            state.role = value;
            console.log(state.role)
        },

    },
    actions: {
        async getPermissions({ commit }) {
            const { data: res } = await axios.get('user/menus')
            if (res.result != "SUCCESS") return this.$message.error(res.message)
            commit('GETPERMISSIONS', res.data)
        },
        async getRole({ commit }) {
            const { data: res } = await axios.get('user/getRole')
            if (res.result != "SUCCESS") return this.$message.error(res.message)
            commit('GETROLE', res.data)
        },

    },
};

export default user;

