<script setup lang="ts">
    
    import {ref} from 'vue';
    import { Icon } from "@iconify/vue";

    import Input from '../Form/Input.vue'
    import Message from './ChatComponent/Message.vue'
    import { sendMessage, getHistory } from '../../API/Messages'
    import type { HumanMessage, AIMessage, ToolMessage, UserAnswer, History } from '../../API/Types/Types'

    const userMessage = ref<string>('')
    const messagesList = ref<(HumanMessage|AIMessage|ToolMessage)[]>([])
    const inputDisabled = ref<boolean>(false)

    const sendUserMessageToBack = async ()=>{
        inputDisabled.value = true;
        const answer:UserAnswer = await sendMessage(userMessage.value) //TODO try catch
        messagesList.value = []
        answer.fields.steps.forEach(message => {
            messagesList.value.push(message)
        });
        inputDisabled.value = false;
        userMessage.value = '';
    }

    const getPastMessages = ()=>{
        getHistory()
        .then((hist:History) => {
            messagesList.value = []
            hist.messages.forEach(message => {
                messagesList.value.push(message)
            });
        })
        .catch(err=>{
            console.error(err) // TODO : display error
        })
    }
    getPastMessages()

</script>

<template>
    <div class="w-full h-95/100 border-1 border-neutral-200 flex flex-col flex-nowrap justify-between">
        <div class="w-full flex-1 bg-neutral-900 overflow-y-scroll">

            <Message v-for="(message, index) in messagesList" :message="message" />

        </div>
        <div class="w-full min-h-18 h-20 bg-neutral-900 border-t-neutral-200 border-t-1 flex flex-row justify-between whitespace-pre-wrap break-words">
            
            <Input
                v-model="userMessage"
                :long="true"
                class="h-full flex-1 bg-transparent resize-none border-none outline-none ring-0"
                placeholder="Type something..."
                :disabled="inputDisabled"
                id="message-input"
            />

            <div class="h-full w-fit ml-2" id="message-send" @click="sendUserMessageToBack">
                <Icon icon="solar:plain-2-line-duotone" class="h-full text-4xl mr-2 hover:text-neutral-500 text-center"/>
            </div>

        </div>
    </div>
</template>

<style scoped>

</style>