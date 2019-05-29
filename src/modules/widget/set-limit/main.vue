<template>
    <modal :title="'权限设置'" @destroy="destroy" @submit="submit">
        <div class="set_limit">
            <ul class="limit_list">
                <li v-for="items in filterList">
                    <div class="wrapper">
                        <div class="name">
                            <span class="el-icon" :class="{'el-icon-caret-bottom':(items.list.length >1)}"></span>
                            <template v-if="items.list.length >1">
                                {{items.modelName}}
                            </template>
                            <template v-else>
                                {{items.list[0].summary || items.list[0].modelName}}
                            </template>
                        </div>
                        <div v-if="items.list.length == 1" class="limit">
                            <span class="check_box_con" @click="select(items.list[0],'readStatus')">
                                <check-box  :is-check="filterChecked(items.list[0].readStatus)"></check-box>查看
                            </span>
                            <span class="check_box_con" @click="select(items.list[0],'writeStatus')">
                                <check-box  :is-check="filterChecked(items.list[0].writeStatus)"></check-box>编辑
                            </span>
                        </div>
                    </div>
                    <ul v-if="items.list.length >1">
                        <li v-for="child in items.list">
                            <div class="wrapper">
                                <div class="name"><span class="el-icon"></span>{{child.summary || child.modelName}}</div>
                                <div class="limit">
                                    <span class="check_box_con" @click="select(child,'readStatus')">
                                        <check-box  :is-check="filterChecked(child.readStatus)"></check-box>查看
                                    </span>
                                    <span class="check_box_con" @click="select(child,'writeStatus')">
                                        <check-box  :is-check="filterChecked(child.writeStatus)"></check-box>编辑
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>

                </li>
            </ul>
        </div>
    </modal>
</template>

<script>
    import * as api from './api';
    import Modal from '@/modules/widget/common/Modal.vue';
    import CheckBox from '@/modules/widget/common/CheckBox.vue'

    export default{
        components:{
            Modal,
            CheckBox
        },
        data(){
            return {
                authoritiesList:[],
                authoritiesMaps:{},
                filterList:[],
                locked:false,
            }
        },
        methods:{
            filterChecked(status){
                var result = false;
                if(status == 1){
                    result = true;
                }
                return result;
            },
            destroy(){
                this.$el &&
                this.$el.parentNode &&
                this.$el.parentNode.removeChild(this.$el);
                this.$destroy();
            },
            submit(close){
                var list = [];
                for(var key in this.authoritiesMaps){
                    list.push(this.authoritiesMaps[key]);
                }
                this.callback && this.callback(list);
                close && close();
            },
            select(data,key){
                console.log(data.uuid);
                let obj = this.authoritiesMaps[data.uuid];
                obj[key] = obj[key] == 0?1:0;
                if(key == 'writeStatus'){
                    obj['readStatus'] = 1;
                }
                if(key == 'readStatus' && obj[key] == 0){
                    obj['writeStatus'] = 0;
                }

                console.log(this.authoritiesMaps)
            },
            filterAuthorities(){
                let maps = {}
                for(var items of this.authoritiesList){
                    if(items.list.length > 0){
                        for(var _items of items.list){
                            maps[_items.uuid] = _items;
                        }
                    }
                }
                this.authoritiesMaps = maps;
                if(this.authorities && this.authorities.length > 0){//数据覆盖
                    for(var items of this.authorities){
                        if(this.authoritiesMaps[items.uuid]){
                            this.authoritiesMaps[items.uuid].readStatus = items.readStatus;
                            this.authoritiesMaps[items.uuid].writeStatus = items.writeStatus;
                        }
                        
                    }
                }

                console.log(this.authoritiesList)

                this.filterList = this.authoritiesList;

            }

        },
        mounted(){
            this.filterAuthorities();
        }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    @import "~@/config/config.less";
    .set_limit{
        width: 450px;
        height: 350px;
        overflow: auto;
        .limit_list{
            li{
                .wrapper{
                    margin-bottom: 10px;
                    height: 20px;
                    .name{
                        width: 150px;
                        float: left;
                        box-sizing: border-box;
                        .el-icon{
                            width: 20px;
                            height: 20px;
                            line-height: 20px;
                            cursor: pointer;
                            display: inline-block;
                            float: left;
                        }
                    }
                    .limit{
                        margin-left: 150px;
                        .check_box_con{
                            cursor: pointer;
                            margin-right: 30px;
                            /deep/ .checkbox{
                                margin-right: 4px;
                            }
                        }
                    }
                }
                ul{
                    .wrapper{
                        .name{
                            padding-left: 20px;
                        }
                    }
                }
            }
        }


    }
</style>
