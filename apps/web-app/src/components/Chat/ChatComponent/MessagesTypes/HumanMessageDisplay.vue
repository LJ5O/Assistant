<script setup lang="ts">

import { Icon } from "@iconify/vue";

import type { HumanMessage } from '../../../../API/Types/Types'

interface Props{
    message: HumanMessage
    avatar?: string
}
const props = defineProps<Props>()
const avatarIcon = props.avatar || 'solar:user-circle-line-duotone'
</script>

<template>
    <div 
        class="human-message flex gap-5 mb-4 mt-2 flex-row-reverse ml-5 mr-2 lg:ml-30 lg:mr-5"
    >
        <div class="shrink-0">
            <img v-if="avatar" :src="avatarIcon" class="rounded-full w-[28px] sm:w-[40px] lg:w-[60px]" />
            <Icon v-else :icon="avatarIcon" class="text-[28px] sm:text-[40px] lg:text-[60px]" />
        </div>
        <div class="text-xs sm:text-sm lg:text-lg">
            <p>{{message.content}}</p>
        </div>
    </div>
</template>