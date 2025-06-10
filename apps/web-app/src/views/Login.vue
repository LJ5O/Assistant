<script setup lang="ts">
    import {ref} from 'vue'

    import Input from "../components/Form/Input.vue"

    const value = ref('')
</script>

<template>
    <div class="w-full h-full flex justify-center content-center flex-wrap flex-col gap-4">
        <h1 class="text-white w-1/4 min-w-80 text-center text-2xl lg:text-5xl">Application</h1>
        <div class="
            w-1/4 h-2/4 min-w-80 min-h-[400px] bg-blue-600 border-2 border-gray-500 rounded-lg shadow-2xl/80 shadow-black
            flex flex-col content-center text-center
        ">
            <p>Login</p>
            <Input v-model="value" class="w-3/4 mr-auto ml-auto"/>
        </div>
    </div>
</template>

<style scoped>

</style>