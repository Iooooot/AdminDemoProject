<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权利列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="psName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="psLevel">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.psLevel == '0'">一级</el-tag>
                        <el-tag v-if="scope.row.psLevel == '1'" type="success">二级</el-tag>
                        <el-tag v-if="scope.row.psLevel == '2'" type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            rightsList:[]
        }
    },
    created(){
        this.getRightsList()
    },
    methods:{
        async getRightsList(){
            const {data:res} = await this.$http.get('rights/list')
            if(res.result != "SUCCESS") this.$message.error('获取权限列表失败！');
            this.rightsList = res.data
        }
    }
}
</script>