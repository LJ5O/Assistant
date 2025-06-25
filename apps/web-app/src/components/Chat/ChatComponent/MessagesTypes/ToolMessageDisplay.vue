<script setup lang="ts">

import { Icon } from "@iconify/vue";

import type { ToolMessage } from '../../../../API/Types/Types'
import ToolCallDisplay from './ToolCallDisplay.vue'

interface Props{
    message: ToolMessage
    avatar?: string
}
const props = defineProps<Props>()
const avatarIcon = props.avatar || 'solar:widget-5-line-duotone'

</script>

<template>
    <div
        v-if="!message.display.hidden"
        class="agent-message flex gap-5 mb-4 mt-2 flex-row mr-5 ml-2 lg:mr-30 lg:ml-5"
    >
        <div class="shrink-0">
            <img v-if="avatar" :src="avatarIcon" class="rounded-full w-[28px] sm:w-[40px] lg:w-[60px]" />
            <Icon v-else :icon="avatarIcon" class="text-[28px] sm:text-[40px] lg:text-[60px]" />
        </div>
        <div
            class="tool-answer mt-1 bg-neutral-800 rounded-xl w-1/3 min-w-fit text-xs sm:text-sm lg:text-lg
            flex flex-col justify-center text-center relative"
        >
            <Icon icon="solar:widget-5-line-duotone" class="hidden absolute top-1 right-1 text-4xl lg:block"/>
            <h2 class="font-bold mt-2 mb-2">Answer from Tool : <span class="font-extrabold">{{message.name}}</span></h2>
            <p> Tool returned : <span class="font-semibold"> {{message.content}} </span></p>
        </div>
    </div>
</template>