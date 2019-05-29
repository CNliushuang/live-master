<template>
	<div ref="container" class="account_list">
		<div ref="filter" class="filter clearfix">
			<div class="filter_items">
				<div class="name">
					账号名称：
				</div>
				<div class="content">
					<el-input :clearable="true" v-model="filter.loginName" placeholder="请输入账号名称"></el-input>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					账号组：
				</div>
				<div class="content">
					<el-select :clearable="true" @change="changeAuthorityGroup" v-model="filter.authorityGroupId" placeholder="请选择账号组">
					    <el-option
							v-for="item in authorityGroup"
							:key="item.uuid"
							:label="item.name"
							:value="item.uuid"
							>
					    </el-option>
					</el-select>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					数据级别：
				</div>
				<div class="content">
					<el-select :clearable="true" :disabled="disabledOrgType" v-model="filter.authorityGroupOrgType" @change="" placeholder="请选择数据级别">
					    <el-option
							v-for="item in orgType"
							:key="item.uuid"
							:label="item.name"
							:value="item.uuid"
							>
					    </el-option>
					</el-select>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					平台名称：
				</div>
				<div class="content">
					<el-select :disabled="user.platId?true:false" :clearable="true" v-model="filter.platId" @change="changePlat" placeholder="请选择平台">
					    <el-option
							v-for="item in platList"
							:key="item.uuid"
							:label="item.name"
							:value="item.uuid"
							>
					    </el-option>
					</el-select>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					公会名称：
				</div>
				<div class="content" @click="goSelectUnion" style="cursor: pointer">
					<!--<el-select :clearable="true" v-model="filter.unionId" @change="changeUnion" placeholder="请选择公会" filterable :filter-method="filterUnion">-->
					    <!--<el-option-->
							<!--v-for="item in unionList"-->
							<!--:key="item.uuid"-->
							<!--:label="item.name"-->
							<!--:value="item.uuid"-->
							<!--&gt;-->
					    <!--</el-option>-->
					<!--</el-select>-->
          <el-input :value="filter.unionName" readonly="" placeholder="请选择公会" ></el-input>
          <i v-if="filter.unionName" class="el-icon-error" @click.stop="clearSelectUnion"></i>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					状态：
				</div>
				<div class="content">
					<el-select :clearable="true" v-model="filter.status" @change="" placeholder="请选择状态">
					    <el-option
							v-for="item in statusList"
							:key="item.uuid"
							:label="item.name"
							:value="item.uuid"
							>
					    </el-option>
					</el-select>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					管理员：
				</div>
				<div class="content">
					<el-input :clearable="true" v-model="filter.nickname" placeholder="请输入管理员名称"></el-input>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					联系方式：
				</div>
				<div class="content">
					<el-input :clearable="true" v-model="filter.mobile" placeholder="请输入管理员联系方式"></el-input>
				</div>
			</div>

			<div class="opt_btn">
				<el-button @click="getAccountList(1)" type="primary">查询</el-button>
				<el-button @click="resetFilter">重置</el-button>
			</div>
		</div>
		<div ref="operate" class="operate">
			<el-button v-if="edit" @click="goAddAccount">添加</el-button>
			<!-- <el-button type="danger">删除</el-button> -->
		</div>
		<div class="filter_list">
			<el-table
			    ref="multipleTable"
			    :data="accountList"
			    :height="tableHeight"
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="">
<!-- 			    <el-table-column
			      type="selection"
			      width="55">
			    </el-table-column> -->
			    <el-table-column
			      prop="loginName"
			      label="账号名称"
			      width="120"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      label="创建时间"
			      width="120"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.createDate | timesToDate('yyyy-MM-dd') }}</template>
			    </el-table-column>
			    <el-table-column
			      label="账号组"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.authorityGroup && scope.row.authorityGroup.name}}</template>

			    </el-table-column>
			    <el-table-column
			      label="数据级别"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.authorityGroup && scope.row.authorityGroup.orgType | filterOrgType }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="platName"
			      label="平台名称"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="unionName"
			      label="公会名称"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      label="状态"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.status == 0?"已启用":"已停用" }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="nickname"
			      label="管理员"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="mobile"
			      label="联系电话"
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
			          @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.userType != 'SUPER_ADMIN'">删除</el-button>
			      </template>
			    </el-table-column>


			  </el-table>
			</div>
			<div ref="page" class="page">
				<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage"
			      :page-sizes="[10,20, 30, 40, 50]"
			      :page-size="limit"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</div>


	</div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex';
	import newAccount from '@/modules/widget/new-account'
	import {Operate} from '@/config/operate'
  import selectUnion from '@/modules/widget/select-union-v2'

	export default{
		data(){
			return {
				authorityGroup:[],
				platList:[],
				unionList:[],
				tableHeight:200,
				orgType:[{
					uuid:"SYSTEM",
					name:"系统",
				},{
					uuid:"PLAT",
					name:"平台",
				},{
					uuid:"UNION",
					name:"公会",
				}],
				statusList:[{
					uuid:1,
					name:"已停用",
				},{
					uuid:0,
					name:"已启用",
				}],
				disabledOrgType:false,
				filter:{
					nickname:"",
					authorityGroupId:"",
					authorityGroupOrgType:"",
					status:"",
					orgId:"",
					platId:"",
					unionId:"",
          unionName:"",
					loginName:"",
					mobile:"",
				},
				limit:10,
        parentId:""
			}
		},
		computed: {
			...mapGetters({
				accountList: 'limitStore/account/accountList',
				total: 'limitStore/account/total',
				currentPage: 'limitStore/account/currentPage',
				// limit: 'limitStore/account/limit',
				user: 'userStore/user/user',
				nav: 'homeStore/home/nav',
				authorities_nav: 'userStore/user/authorities',
			}),
			edit(){
				let path = this.$route.path;
				return Operate(this.user,path,this.nav,this.authorities_nav);
			}
	    },
		methods:{
			goAddAccount(){//新增账号
				newAccount({
					user:this.user,
					callback:() => {
						this.getAccountList(1);
					}
				})
			},
			handleEdit(index,data){
				newAccount({
					user:this.user,
					account:data,
					callback:() => {
						this.getAccountList(1);
					}
				})
			},
			handleDelete(index,data){
				console.log(data)
				let msg = "确定要删除账号”"+data.loginName+"“吗？"
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.$store.dispatch('limitStore/account/deleteAccount',{uuid:data.uuid}).then(() => {
		          		this.getAccountList();
					})
		        }).catch(() => {
		                   
		        });
			},
			handleSizeChange(limit){
				this.limit = limit;
				this.getAccountList(1,limit);
			},
			handleCurrentChange(page){
				this.getAccountList(page);
			},
			setHeight(){
		    	var container = this.$refs.container.offsetHeight;
		    	var filter = this.$refs.filter.offsetHeight;
		    	var operate = this.$refs.operate.offsetHeight;
		    	var page = this.$refs.page.offsetHeight;
		    	var tableHeight = container - filter - operate -page -24;
		    	console.log(tableHeight);
		    	this.tableHeight = tableHeight;
		    },
		    resetFilter(){
		    	this.filter = {
					nickname:"",
					authorityGroupId:"",
					authorityGroupOrgType:"",
					status:"",
					orgId:"",
					platId:"",
          unionId:"",
          unionName:"",
					loginName:"",
					mobile:"",
				};
				this.setDefaultOrg();
				this.setDefaultOrg();
				this.getAccountList(1);
		    },
		    changePlat(uuid){
		    	if(uuid){
		    		this.filter.orgId = uuid;
		    	}else{
		    		this.filter.orgId = "";
		    	}
		    	this.filter.unionId = "";
		    	// this.getUnionList(uuid);
          this.parentId = uuid;
		    },
		    changeUnion(uuid){
		    	if(uuid){
		    		this.filter.orgId = uuid;
		    	}else{
		    		if(this.filter.platId){
		    			this.filter.orgId = this.filter.platId;
		    		}
		    	}
		    },
		    getAccountList(currentPage,limit){//获取账号列表
		    	currentPage = currentPage || this.currentPage;
		    	limit = limit || this.limit;
		    	let filter = this.filter;

		    	console.log(filter)



				this.$store.dispatch('limitStore/account/getAccountList',{currentPage,limit,filter}).then(() => {

				})
		    },
		    getAccountGroup(){
		    	this.$store.dispatch('limitStore/limit/getAccountGroup',{currentPage:1,limit:50}).then((resp) => {
		    		/*平台级别只能显示公会账号*/
		    		if(this.user.platId){
		    			var list = [];
		    			for(var items of resp.authorityGroup){
		    				if(items.orgType == 'UNION'){
		    					list.push(items);
		    				}
		    			}
		    			this.authorityGroup = list;
		    		}else{
		    			this.authorityGroup = resp.authorityGroup;
		    		}
				})
		    },
		    getPlatList(){
		    	const orgId = this.user.orgId;
		    	this.$store.dispatch('platStore/platform/getPlatFormList',{orgId,currentPage:1,limit:50}).then((resp) => {
		    		this.platList = resp.list;
				})
		    },
		    filterUnion(key){
		    	this.filter.unionId = '';
		    	this.filter.orgId = this.filter.unionId || this.filter.platId;
		    	let orgId = this.user.orgId;
		    	let parentId = this.user.orgId;
			    this.$store.dispatch('groupStore/group/getGroupList',{orgId,parentId,currentPage:1,limit:50,searchKey:key}).then((resp) => {
			    		this.unionList = resp.list;
					})
		    },
		    getUnionList(parentId){
		    	let orgId = this.user.orgId;
		    	parentId = parentId ||  this.user.orgId;
		    	this.$store.dispatch('groupStore/group/getGroupList',{orgId,parentId,currentPage:1,limit:50}).then((resp) => {
		    		this.unionList = resp.list;
				})
		    },
        goSelectUnion(){
          selectUnion({
            user:this.user,
            orgId:this.user.orgId,
            parentId:this.parentId ||  this.user.orgId,
            callback:(list) => {
              if(list.length){
                this.filter.unionId = list[0].uuid;
                this.filter.unionName = list[0].name;
              }else{
                this.filter.unionId = '';
                this.filter.unionName = '';
              }
            }
          })
        },
        clearSelectUnion(){
          this.filter.unionId = '';
          this.filter.unionName = '';
        },
		    changeAuthorityGroup(data){
		    	console.log(data)
		    	var obj = this.authorityGroup.filter(function(item) { 
				    return item.uuid == data; 
				});
				console.log(obj);
				if(obj.length > 0){
					this.filter.authorityGroupOrgType = obj[0].orgType;
					this.disabledOrgType = true;
				}else{
					this.disabledOrgType = false;
					this.filter.authorityGroupOrgType = "";
				}
				
		    },
			setDefaultOrg(){
		    	if(this.user){
		    		this.filter.platId = this.user.platId;
		    		this.filter.unionId = this.user.unionId;
		    		if(!this.user.unionId && this.user.managerOrgs && this.user.managerOrgs.length > 0){
		    			this.filter.unionId = this.user.managerOrgs[0].uuid;
		    		}
		    		this.filter.orgId = this.filter.unionId || this.filter.platId;




		    		if(this.filter.platId){//平台级别只能获取公会管理账号
		    			this.disabledOrgType = true;
		    			this.filter.authorityGroupOrgType = 'UNION';
		    		}




		    	}
		    }
	    },
	    watch:{
	    	user(){
	    		this.setDefaultOrg();
	    	}
	    },
		mounted(){
	    	setTimeout(() => {
	    		this.setHeight();
	    		this.setDefaultOrg();
				this.getAccountList();

	    	})
	    },
		created(){

			this.getAccountGroup();

			this.getPlatList();
			this.getUnionList();

		}
	}
</script>
<style rel="stylesheet/less" lang="less" scoped>
  	@import "~@/config/config.less";
  	.account_list{
  		padding-left: 20px;
  		position: absolute;
  		left: 0;
  		top: 0;
  		right: 0;
  		bottom: 0;
  		overflow: auto;
  		.filter{
  			.filter_items{
  				float: left;
  				margin-right: 20px;
  				margin-bottom: 10px;
  				.name{
  					min-width: 60px;
  					height: 30px;
  					line-height: 30px;
  					float: left;
  				}
  				.content{
  					float: left;
            position: relative;
            .el-icon-error{
              position: absolute;
              right: 11px;
              top: 10px;
              font-size: 12px;
              color: #c0c4cb;
              display: none;
            }
            &:hover{
              .el-icon-error{
                display: block !important;
              }
            }
  					/deep/ .el-select{
			  			width: 150px;
			  		}
			  		/deep/ .el-input{
			  			width: 150px;
			  		}
			  		/deep/ .el-input.is-disabled .el-input__inner{
			  			height: 30px !important;
			  		}
  				}
  			}
  			.opt_btn{
  				float: left;
  			}
  		}
  		.operate{
  			padding: 10px 0;
  			/deep/ .el-button{
  				float: left;
  				margin-right: 10px;
  			}
  		}
  		.page{
  			padding: 10px 0;
  		}
  	}
</style>
