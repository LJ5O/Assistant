<script setup lang="ts">

import {computed} from 'vue';
import { Icon } from "@iconify/vue";

import HumanMessageDisplay from './MessagesTypes/HumanMessageDisplay.vue'
import AgentMessageDisplay from './MessagesTypes/AgentMessageDisplay.vue'
import ToolMessageDisplay from './MessagesTypes/ToolMessageDisplay.vue'
import type { HumanMessage, AIMessage, ToolMessage } from '../../../API/Types/Types'

interface Props{
    message: (HumanMessage|AIMessage|ToolMessage)
    avatar?: string
}
const props = defineProps<Props>()

const role = computed(() => {
    switch (props.message.type) {
        case "HumanMessage":
            return "human"
            break;
        case "AIMessage":
            return "agent"
            break;
        case "ToolMessage":
            return "tool"
            break;
        default:
            return ""
            break;
    }
})

</script>

<template>
    <HumanMessageDisplay v-if="role=='human'" :message="(message as HumanMessage)" :avatar="avatar"/>
    <AgentMessageDisplay v-else-if="role=='agent'" :message="(message as AIMessage)" :avatar="avatar"/>
    <ToolMessageDisplay v-else-if="role=='tool'" :message="(message as ToolMessage)" :avatar="avatar"/>
</template>