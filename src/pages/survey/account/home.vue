<script setup>
import {onMounted, ref, watch} from "vue";
import {cMessage} from "/src/custom/message";
import surveyApi from "/src/api/userInfo"
import operator_table_simple from '/src/static/json/survey/character_table_simple.json'
import "/src/assets/css/survey/home.scss";
import "/src/assets/css/survey/home.phone.scss";
import {getUserInfo} from '/src/pages/survey/service/userData.js'

let avatar = []
for (const char_id in operator_table_simple) {
  const operator = {
    charId: char_id,
    time: operator_table_simple[char_id].date
  }
  avatar.push(operator)
}


avatar.sort((a, b) => a.time - b.time)

let userData = ref({});


let inputData = ref({
  userName: '',
  cred: '',
  newPassWord: "",
  confirmPassWord: '',
  oldPassWord: "",
  email: '',
  emailCode: ''
})


function checkPassWord() {
  if (inputData.value.newPassWord.length > 5 && inputData.value.confirmPassWord.length > 5) {
    if (inputData.value.newPassWord === inputData.value.confirmPassWord) {
      return ''
    }
    return '两次密码不一致'
  }
}

function updatePassWord() {
  const data = {
    token: userData.value.token,
    newPassWord: inputData.value.newPassWord,
    oldPassWord: inputData.value.oldPassWord,
    property: "passWord"
  }

  surveyApi.updateUserDataV2(data).then(response => {
    cMessage('修改密码成功')
    getUserInfoByToken()
  })
}

function sendEmailCode() {
  const data = {
    token: userData.value.token,
    email: inputData.value.email,
    mailUsage: 'updateEmail'
  }


  // eslint-disable-next-line no-unused-vars
  surveyApi.sendVerificationCodeV2(data).then(response => {
    cMessage('验证码已发送')
  })

}

function updateEmail() {
  const data = {
    token: userData.value.token,
    email: inputData.value.email,
    emailCode: inputData.value.emailCode,
    property: "email"
  }
  surveyApi.updateUserDataV2(data).then(response => {
    cMessage('邮箱绑定成功')
    getUserInfoByToken()
  })
}


function updateUserName() {
  const data = {
    token: userData.value.token,
    userName: inputData.value.userName,
    property: "userName"
  }
  surveyApi.updateUserDataV2(data).then(response => {
    cMessage('用户名更改成功')
    userData.value.userName = response.data.userName

  })
}

//登出
function logout() {
  localStorage.removeItem('globalUserData')
  setTimeout(() => {
    location.reload()
  }, 1000);
}



async function getUserInfoByToken() {
  userData.value = await getUserInfo()
  inputData.value.userName = userData.value.userName
}

let avatar_visible = ref(false)

function avatarPopupVisible() {
  avatar_visible.value = !avatar_visible.value
  selected_avatar.value = userData.value.avatar
}

let selected_avatar = ref(userData.value.avatar)

function chooseAvatar(avatar) {
  selected_avatar.value = avatar
}

function updateAvatar() {
  const data = {
    token: userData.value.token,
    avatar: selected_avatar.value,
    property: "avatar"
  }

  surveyApi.updateUserDataV2(data).then(response => {
    cMessage('头像更新成功')
    userData.value.avatar = response.data.avatar

  })

}

function getSprite(id) {
  return "bg-" + id;
}

onMounted(() => {
  getUserInfoByToken()


})




</script>
<template>
  <div class="account-home-page">
    <div class="user-info-card-container">

      <!--    <div class="user_info_card">-->
      <!--      <div class="user_info_title">身份验证</div>-->
      <!--      <div class="user_input_bar">-->
      <!--        <div class="user_input_label">请输入森空岛CRED</div>-->
      <!--        <input class="user_input" v-model="inputData.cred"/>-->
      <!--        <button class="btn btn-blue" @click="authentication()">验证身份</button>-->
      <!--      </div>-->
      <!--    </div>-->

      <div class="user-info-card">
        <h2 class="user-info-card-title">用户信息</h2>
        <h4>头像</h4>
        <div class="user-info-card-line">
           <span>点击头像修改</span>
          <div class="user-avatar-sprite" @click="avatarPopupVisible()">
            <div :class="getSprite(userData.avatar)" ></div>
          </div>
        </div>

        <h4>用户名</h4>
        <div class="user-info-card-line">

          <input class="user-info-card-input" v-model="inputData.userName"/>
          <a v-show="inputData.userName.length>0">{{ inputData.userName.length }}/20</a>
          <button class="btn btn-blue btn_position" @click="updateUserName()">更新用户名</button>
        </div>
        <div class="user-info-card-line">
          <span>绑定邮箱</span>
          <span>{{ userData.email }}</span>
        </div>
        <!--        <div class="user_info_bar">-->
        <!--          <div class="user_input_label">明日方舟昵称</div>-->
        <!--          <div class="user_info"> {{ user_data.nickName }}</div>-->
        <!--        </div>-->
        <!--        <div class="user_info_bar">-->
        <!--          <div class="user_input_label">明日方舟UID</div>-->
        <!--          <div class="user_info">{{ user_data.uid }}</div>-->
        <!--        </div>-->
      </div>

      <c-popup :visible="avatar_visible" v-model:visible="avatar_visible">

        <div class="update-avatar-popup">
          <div class="user-now-avatar-wrap">
            <span>当前头像</span>
            <div class="user-avatar-sprite">
              <div :class="getSprite(selected_avatar)"></div>
            </div>
            <button class="btn btn-green" @click="updateAvatar()"> 保存修改</button>
          </div>
          <div class="user_avatar_popup_wrap">
            <div class="user-avatar-sprite" style="margin: 8px" v-for="(avatar,index) in avatar" :key="index">
              <div :class="getSprite(avatar.charId)" ></div>
            </div>
          </div>
        </div>
      </c-popup>



      <div class="user-info-card">
        <h2 class="user-info-card-title">修改密码</h2>
        <div class="user-info-card-tip" v-show="!userData.hasPassword">
          您还没有设置密码，密码长度最低为6个数字或字母
        </div>

        <h4 v-show="userData.hasPassword">旧密码</h4>
        <div class="user-info-card-input-line"
             v-show="userData.hasPassword">
          <input class="user-info-card-input" type="password" v-model="inputData.oldPassWord"/>
          <a v-show="inputData.oldPassWord.length>0">{{ inputData.oldPassWord.length }}/20</a>
        </div>

        <h4>密码</h4>
        <div class="user-info-card-input-line">
          <input class="user-info-card-input" type="password" v-model="inputData.newPassWord"/>
          <!--          <span v-show="inputData.newPassWord.length>0">{{ inputData.newPassWord.length }}/20</span>-->
        </div>

        <h4>确认密码</h4>
        <div class="user-info-card-input-line">
          <input class="user-info-card-input" type="password" v-model="inputData.confirmPassWord"/>
          <!--          <span v-show="inputData.confirmPassWord.length>0">{{ inputData.confirmPassWord.length }}/20</span>-->
          <button class="btn btn-blue btn_position" @click="updatePassWord()">更新密码</button>
        </div>
        <div class="user-info-card-tip" style="color: #f83333">{{ checkPassWord() }}</div>
      </div>

      <div class="user-info-card">
        <h2 class="user-info-card-title">修改邮箱</h2>
        <div class="user-info-card-tip" v-show="!userData.hasEmail">
          绑定邮箱后也可通过邮箱作为账号登录
        </div>
        <div class="user-info-card-tip" v-show="userData.hasEmail">
          修改邮箱请输入新邮箱点击发送，将向您的新邮箱发送验证码
        </div>

        <h4>输入新邮箱</h4>
        <div class="user-info-card-input-line">
          <input class="user-info-card-input" v-model="inputData.email"/>
          <button class="btn btn-blue btn_position" @click="sendEmailCode()">发送验证码</button>
        </div>

        <h4>输入邮件验证码</h4>
        <div class="user-info-card-input-line">
          <input class="user-info-card-input" v-model="inputData.emailCode"/>
          <button class="btn btn-blue btn_position" @click="updateEmail()">修改邮箱</button>
        </div>
      </div>
      <div class="user-info-card">
        <button class="btn btn-red " style="margin: auto" @click="logout()">退出登录</button>
      </div>
    </div>
  </div>
</template>



<style scoped>

</style>
