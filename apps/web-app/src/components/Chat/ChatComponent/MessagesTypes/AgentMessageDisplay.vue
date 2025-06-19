<script setup lang="ts">

import { Icon } from "@iconify/vue";

import type { AIMessage, ToolCall } from '../../../../API/Types/Types'
import ToolCallDisplay from './ToolCallDisplay.vue'

interface Props{
    message: AIMessage
    avatar?: string
}
const props = defineProps<Props>()
const avatarIcon = props.avatar || 'solar:face-scan-square-line-duotone'

const toolCalls:ToolCall[] = props.message.tool_calls
</script>

<template>
    <div 
        class="agent-message flex gap-5 mb-4 mt-2 flex-row mr-5 ml-2 lg:mr-30 lg:ml-5"
    >
        <div class="shrink-0">
            <img v-if="avatar" :src="avatarIcon" class="rounded-full w-[28px] sm:w-[40px] lg:w-[60px]" />
            <Icon v-else :icon="avatarIcon" class="text-[28px] sm:text-[40px] lg:text-[60px]" />
        </div>
        <div class="text-xs sm:text-sm lg:text-lg flex flex-col gap-1 w-full">
            <!-- Textual part of the message -->
            <p v-if="message.content.trim().length > 0">{{message.content}}</p>
            <!-- Tools calls -->
            <ToolCallDisplay v-for="(tool, index) in toolCalls" :tool="tool"/>
        </div>
    </div>
</template>