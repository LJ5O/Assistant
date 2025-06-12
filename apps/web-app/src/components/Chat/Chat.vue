<script setup lang="ts">
    
    import {ref} from 'vue';
    import { Icon } from "@iconify/vue";

    import Input from '../Form/Input.vue'
    import Message from './ChatComponent/Message.vue'

    const userMessage = ref<string>('')

</script>

<template>
    <div class="w-full h-95/100 border-1 border-neutral-200 flex flex-col flex-nowrap justify-between">
        <div class="w-full flex-1 bg-neutral-900">

            <Message content="Hello World !" role="user"/>
            <Message content="World, Hello !" role="chatbot"/>
            <Message content="World, Hello !" role="chatbot" avatar="https://picsum.photos/100"/>
            <Message content="Hi ! How are you ?" role="user" avatar="https://picsum.photos/101"/>

        </div>
        <div class="w-full h-20 bg-neutral-900 border-t-neutral-200 border-t-1 flex flex-row justify-between whitespace-pre-wrap break-words">
            
            <Input
                v-model="userMessage"
                :long="true"
                class="h-full flex-1 bg-transparent resize-none border-none outline-none ring-0"
                placeholder="Type something..."
            />

            <div class="h-full w-fit ml-2">
                <Icon icon="solar:plain-2-line-duotone" class="h-full text-4xl mr-2 hover:text-neutral-500 text-center"/>
            </div>

        </div>
    </div>
</template>

<style scoped>

</style>