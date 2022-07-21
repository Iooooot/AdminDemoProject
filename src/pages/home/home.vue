<template>
    <el-container>
        <el-header>
            <div>
                <img src="@/assets/logo.png" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? 64+'px':200+'px'">

                <div class="toggle-button" @click="toggloCollapse">|||</div>

                <el-menu :default-active="$route.path" class="el-menu-vertical-demo"
                     background-color="#333744" text-color="#fff" active-text-color="#409EFF"
                    unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
                    <el-submenu :index="item.psId + ''" v-for="item in $store.state.user.permissions" :key="item.psId">
                        <template slot="title">
                            <i :class="iconsObj[item.psId]"></i>
                            <span class="iconSpan">{{item.psName}}</span>
                        </template>
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.psId">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.psName}}</span>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return {
            iconsObj:{
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            isCollapse:false
        }
    },
    created(){
        this.$store.dispatch('getPermissions')
        
    },
    methods:{
        logout(){
            window.localStorage.removeItem('token');
            this.$router.push('/login');
        },

        toggloCollapse(){
            this.isCollapse = !this.isCollapse;
        },
    }
}
</script>

<style lang="scss" scoped>
    .el-container{
        height: 100%;
    }
    .el-header{
        background-color: #373D41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size:20px;
    }
    .el-header span{
        display: inline-block;
        height: 100%;
        margin-bottom: 15px;
        margin-left: 10px;
        vertical-align:bottom;
    }
    .el-header  img{
        width: 48px;
        height: 48px;
    }
    .el-aside{
        background-color: #333744;
        .iconSpan{
        margin-left: 10px;
        }

        .el-menu{
            border-right: none;
        }

        .toggle-button{
            background-color: #4A5064;
            font-size: 12px;
            line-height: 24px;
            color: #fff;
            text-align: center;
            letter-spacing: 0.2em;
            cursor: pointer;
        }
    }
    
    .el-main{
        background-color: #EAEDF1;
    }
</style>