<template>
  <el-row class="container">
    <div>
      <div>{{ username }}</div>
      <Logout></Logout>
    </div>

    <el-col :span="24" class="breadcrumb-container">
      <Breadcrumb></Breadcrumb>
    </el-col>

    <el-col :span="24" class="main">
      <el-col :span="4" class="main">
        <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
          <!--导航菜单-->
          <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
             unique-opened router v-show="!collapsed">
            <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
              <el-submenu :index="index+''" v-if="!item.leaf">
                <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
              </el-submenu>
              <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
            </template>
          </el-menu>

          <!--导航菜单-折叠后-->
          <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
            <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
              <template v-if="!item.leaf">
                <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
                  <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
                </ul>
              </template>
              <template v-else>
                <li class="el-submenu">
                  <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
                </li>
              </template>
            </li>
          </ul>
        </aside>
      </el-col>
     
      <el-col :span="20" class="content-wrapper">
        <section class="content-container">
          <div class="grid-content bg-purple-light">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </section>
      </el-col>

    </el-col>
  </el-row>
</template>

<script>
import Logout from '@/components/Logout'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'app',
  data () {
    return {
      username: this.$store.state.user.username,
      collapsed: false
    }
  },
  methods: {
    handleopen () {
    },
    handleclose () {
    },
    handleselect: function (a, b) {
    }
  },
  components: {Logout, Breadcrumb}
}
</script>

<style scoped>
.container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header {
      height: 60px;
      line-height: 60px;
      background: $color-primary;
      color:#fff;
      .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
        .userinfo-inner {
          cursor: pointer;
          color:#fff;
          img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 0px 10px 10px;
            float: right;
          }
        }
      }
      .logo {
        //width:230px;
        height:60px;
        font-size: 22px;
        padding-left:20px;
        padding-right:20px;
        border-color: rgba(238,241,146,0.3);
        border-right-width: 1px;
        border-right-style: solid;
        img {
          width: 40px;
          float: left;
          margin: 10px 10px 10px 18px;
        }
        .txt {
          color:#fff;
        }
      }
      .logo-width{
        width:230px;
      }
      .logo-collapse-width{
        width:60px
      }
      .tools{
        padding: 0px 23px;
        width:14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
      }
    }
    .main {
      display: flex;
      position: absolute;
      top: 60px;
      bottom: 0px;
      overflow: hidden;
      aside {
        flex:0 0 230px;
        width: 230px;
        .el-menu{
          height: 100%;
        }
        .collapsed{
          width:60px;
          .item{
            position: relative;
          }
          .submenu{
            position:absolute;
            top:0px;
            left:60px;
            z-index:99999;
            height:auto;
            display:none;
          }
        }
      }
      .menu-collapsed{
        flex:0 0 60px;
        width: 60px;
      }
      .menu-expanded{
        flex:0 0 230px;
        width: 230px;
      }
      .content-container {
        flex:1;
        overflow-y: scroll;
        padding: 20px;
        .breadcrumb-container {
          //margin-bottom: 15px;
          .title {
            width: 200px;
            float: left;
            color: #475669;
          }
          .breadcrumb-inner {
            float: right;
          }
        }
        .content-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
