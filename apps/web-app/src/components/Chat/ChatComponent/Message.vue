<script setup lang="ts">

import {computed} from 'vue';
import { Icon } from "@iconify/vue";

interface Props{
    content: string,
    role: 'user'|'chatbot',
    avatar?: string
}

const props = defineProps<Props>()

const avatarIcon = computed(() => {
  return props.avatar || (props.role === 'user'
    ? 'solar:user-circle-line-duotone'
    : 'solar:face-scan-square-line-duotone')
})
</script>

<template>
    <div 
        class="flex gap-5 mb-4 mt-2"
        :class="role=='user' ? 'flex-row-reverse ml-5 mr-2 lg:ml-30 lg:mr-5' : 'flex-row mr-5 ml-2 lg:mr-30 lg:ml-5'"
    >
        <div class="shrink-0">
            <img v-if="avatar" :src="avatarIcon" class="rounded-full w-[28px] sm:w-[40px] lg:w-[60px]" />
            <Icon v-else :icon="avatarIcon" class="text-[28px] sm:text-[40px] lg:text-[60px]" />
        </div>
        <div class="text-xs sm:text-sm lg:text-lg">
            {{content}}
        </div>
    </div>
</template>