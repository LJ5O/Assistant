<script setup lang="ts">
    
    import {ref, watch} from 'vue';
    import { Icon } from "@iconify/vue";
    import { useRoute } from 'vue-router'
    const route = useRoute()

    import Input from '../Form/Input.vue'
    import Message from './ChatComponent/Message.vue'
    import Dialog from '../ui/Dialog.vue'
    import { sendMessage, getHistory } from '../../API/Messages'
    import type { HumanMessage, AIMessage, ToolMessage, UserAnswer, History } from '../../API/Types/Types'

    const userMessage = ref<string>('')
    const messagesList = ref<(HumanMessage|AIMessage|ToolMessage)[]>([])
    const inputDisabled = ref<boolean>(false)

    const dialogDisplay = ref<boolean>(false)
    const dialogTitle = ref<string>('')
    const dialogContent = ref<string>('')

    watch(() => route.params.id, (newId) => {
        console.log("Opened new conv, "+newId)
        getPastMessages()
    })

    const sendUserMessageToBack = async ()=>{
        inputDisabled.value = true;
        try{
            const answer:UserAnswer = await sendMessage(userMessage.value, route.params.id as string) //TODO try catch
            messagesList.value = []
            answer.fields.steps.forEach(message => {
                messagesList.value.push(message)
            });
            userMessage.value = '';
        }catch(err){
            console.error(err)
            dialogTitle.value = "We are unable to send this message !"
            dialogContent.value = "Sorry, something went wrong. Please, try again !"
            dialogDisplay.value = true
        }finally{
            inputDisabled.value = false;
        }
    }

    const getPastMessages = ()=>{
        getHistory(route.params.id as string)
        .then((hist:History) => {
            messagesList.value = []
            hist.messages.forEach(message => {
                messagesList.value.push(message)
            });
        })
        .catch(err=>{
            console.error(err)
            dialogTitle.value = "Messages history can't be retrieved !"
            dialogContent.value = "Sorry, we could not load the previous messages from this conversation. Please, try again !"
            dialogDisplay.value = true
        })
    }
    getPastMessages()

</script>

<template>
    <div class="w-full h-95/100 border-1 border-neutral-200 flex flex-col flex-nowrap justify-between">
        <Dialog v-model="dialogDisplay" :title="dialogTitle" :content="dialogContent" type="error" />
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