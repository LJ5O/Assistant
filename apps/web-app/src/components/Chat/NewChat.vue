<script setup lang="ts">
    
    import {ref} from 'vue';
    import { Icon } from "@iconify/vue";
    import { useRouter } from 'vue-router'
    const router = useRouter()

    import Input from '../Form/Input.vue'
    import Dialog from '../ui/Dialog.vue'
    import { sendMessage } from '../../API/Messages'
    import type { UserAnswer } from '../../API/Types/Types'

    const userMessage = ref<string>('')
    const inputDisabled = ref<boolean>(false)

    const dialogDisplay = ref<boolean>(false)
    const dialogTitle = ref<string>('')
    const dialogContent = ref<string>('')

    const sendUserMessageToBack = async ()=>{
        inputDisabled.value = true;
        try{
            const answer:UserAnswer = await sendMessage(userMessage.value,  Date.now()+'') //TODO : Find a better UUID solution
            router.push("/talk/"+Date.now())
            userMessage.value = '';
        }catch(err){
            console.error(err)
            dialogTitle.value = "We are unable to send this message !"
            dialogContent.value = "Sorry, something went wrong. Please, try again !"
            dialogDisplay.value = true
            inputDisabled.value = false;
        }
    }

</script>

<template>
    <div class="w-full h-95/100">
        <Dialog v-model="dialogDisplay" :title="dialogTitle" :content="dialogContent" type="error" />
        
        <div class="w-full h-full overflow-y-scroll flex flex-col flex-nowrap justify-center items-center gap-2">
            <Icon icon="solar:pen-new-square-line-duotone" class="text-5xl"/>
            <h1 class="text-lg md:text-xl lg:text-3xl">Create a new Conversation</h1>
            <h2 class="text-xs md:text-base text-neutral-600">Send your first message here to begin talking !</h2>

            <div class="input-div flex flex-row bg-neutral-900 rounded-xl p-3 min-w-fit w-2/5">
                <Input
                    v-model="userMessage"
                    :long="true"
                    class="h-fit bg-transparent resize-none border-none outline-none ring-0 flex-1"
                    placeholder="Type something..."
                    :disabled="inputDisabled"
                    id="message-input"
                />
                <Icon @click="sendUserMessageToBack" icon="solar:plain-2-line-duotone" class="h-full text-4xl mr-2 hover:text-neutral-500 text-center"/>
            </div>

        </div>
    </div>
</template>

<style scoped>

</style>