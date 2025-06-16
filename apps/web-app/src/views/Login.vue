<script setup lang="ts">
    import {ref} from 'vue'
    import axios from 'axios';
    import { useRouter } from 'vue-router';

    import Input from "../components/Form/Input.vue"
    import Button from "../components/Form/Button.vue"

    const router = useRouter()

    const login = ref<string>('')
    const password = ref<string>('')
    const failed = ref<boolean>(false)
    const errCode = ref<string>('')

    function getToken(){
        axios.post('http://127.0.0.1:3000/login', {
          username: login.value,
          password: password.value
        }).then((answer)=>{
          sessionStorage.setItem('jwt', answer.data.token)
          console.log("Login OK ! ")
          console.warn("TODO : remove me. Token is "+answer.data.token)
          router.push('/control');

        }).catch((err)=>{
          console.error(err)
          failed.value = true;
          errCode.value = err.code; // ERR_BAD_REQUEST for 401 (login/password), ERR_NETWORK if backend unreachable
        })
    }
</script>

<template>
    <div class="w-full h-full flex justify-center content-center flex-wrap flex-col gap-4">
        <h1 class="text-white w-1/4 min-w-80 text-center text-2xl lg:text-5xl">Application</h1>
        <div class="
            w-1/4 h-fit min-w-80 bg-blue-600 border-2 border-gray-500 rounded-lg shadow-2xl/80 shadow-black
            flex flex-col content-center text-center
        ">

            <div v-if="failed" class="bg-red-700 w-fit mx-auto mt-2 p-2 rounded-2xl text-white text-lg" id="login-error-div">
                <p v-if="errCode === 'ERR_BAD_REQUEST'" id="login-401-error">Your login/password seems to be wrong !<br>Sorry, try again.</p>
                <p v-else id="login-other-error">An error occured, please try again later !</p>
            </div>

            <p class="text-white mt-3 text-2xl font-bold">Please, login to continue</p>

            <label class="login-input">
                <h2>Login</h2>
                <Input v-model="login" class="w-3/4 mr-auto ml-auto" id="input-login"/>
            </label>

            <label class="login-input">
                <h2>Password</h2>
                <Input v-model="password" class="w-3/4 mr-auto ml-auto" type="password" id="input-password"/>
            </label>

            <Button content="Login" class="content-end my-3 self-end mr-5" @click="getToken" id="input-submit" />
        </div>
    </div>
</template>

<style scoped>
    @reference "tailwindcss";
    .login-input{
        @apply flex flex-col justify-center content-center flex-wrap gap-2 mt-5;
    }
    .login-input h2{
        @apply text-white text-2xl text-left w-3/4;
    }
</style>
