<template>
	<div ref="container" class="platform">
		<div ref="operate" class="operate">
			<el-button v-if="edit" @click="goAddPlat">添加</el-button>
		</div>
		<div class="platform_list">
			<el-table
			    ref="multipleTable"
			    :data="platList"
			    :height="tableHeight"
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="">
			<!--     <el-table-column
			      type="selection"
			      width="55">
			    </el-table-column> -->
			    <el-table-column
			      prop="id"
			      label="平台ID"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="平台名称"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      label="创建时间"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.createDate | timesToDate('yyyy-MM-dd') }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="shareRatio"
			      label="平台分成"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="entryMax"
			      label="入账阀值"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      label="状态"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.status == 0?"已启用":"已停用" }}</template>
			    </el-table-column>
			    <el-table-column
			      label="管理员"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.majorAdmin && scope.row.majorAdmin.loginName}}</template>
			    </el-table-column>
			    <el-table-column
			      width="140"
			      prop="autoTimeMin"
			      label="小额提现下限／次"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      width="140"
			      prop="autoTimeMax"
			      label="小额提现上限／次"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      width="140"
			      prop="autoDayMax"
			      label="小额提现上限／天"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      width="140"
			      prop="handleTimeMax"
			      label="大额提现上限／次"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      width="140"
			      prop="handleTimeMin"
			      label="大额提现下限／次"
			      show-overflow-tooltip>
			    </el-table-column>

			    <el-table-column
			      width="140"
			      prop="handleDayMax"
			      label="大额提现上限／天"
			      show-overflow-tooltip>
			    </el-table-column>


			    <el-table-column v-if="edit" label="操作" width="180" fixed="right">
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="mini"
			          type="danger"
			          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			      </template>
			    </el-table-column>


			  </el-table>
		</div>
	</div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex';
	import newPlat from '@/modules/widget/new-plat'
	import {Operate} from '@/config/operate'

	export default{
		data(){
			return {
				platformList:[],
				tableHeight:250,

			}
		},
		computed:{
			...mapGetters({
				user: 'userStore/user/user',
				total: 'platStore/platform/total',
				currentPage: 'platStore/platform/currentPage',
				limit: 'platStore/platform/limit',
				platList: 'platStore/platform/platList',
				nav: 'homeStore/home/nav',
				authorities_nav: 'userStore/user/authorities',
			}),
			edit(){
				let path = this.$route.path;
				return Operate(this.user,path,this.nav,this.authorities_nav);
			}
		},
		methods:{
			goAddPlat(){
				newPlat({
					user:this.user,
					callback:() => {
						this.getPlatList(1);
					}
				})
			},
			handleEdit(index,data){
				newPlat({
					user:this.user,
					plat:data,
					callback:() => {
						this.getPlatList();
					}
				})
			},
			handleDelete(index,data){
				let msg = "确定要删除账号”"+data.name+"“吗？"
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.$store.dispatch('platStore/platform/deletePlat',{uuid:data.uuid}).then(() => {
		          		this.getPlatList();
					})
		        }).catch(() => {
		                   
		        });

			},
			getPlatList(currentPage,limit){//获取账号列表
		    	currentPage = currentPage || this.currentPage;
		    	limit = limit || this.limit;
		    	const orgId = this.user.orgId;
				this.$store.dispatch('platStore/platform/getPlatFormList',{orgId,currentPage,limit}).then(() => {
				})
		    },
			setHeight(){
		    	var container = this.$refs.container.offsetHeight;
		    	var operate = this.$refs.operate.offsetHeight;
		    	var tableHeight = container - operate -24;
		    	console.log(tableHeight);
		    	this.tableHeight = tableHeight;
		    },
		},
		mounted(){
	    	setTimeout(() => {
	    		this.setHeight();
	    	})
	    },
		created(){
			this.getPlatList();
		}
	}
</script>
<style rel="stylesheet/less" lang="less" scoped>
  	@import "~@/config/config.less";
  	.platform{
  		padding-left: 20px;
  		position: absolute;
  		left: 0;
  		top: 0;
  		right: 0;
  		bottom: 0;
  		overflow: auto;
  		.operate{
  			margin-bottom: 20px;
  		}
  	}
</style>
