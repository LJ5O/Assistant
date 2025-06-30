<script setup lang="ts">

import { Icon } from "@iconify/vue";

export interface Props{
    title:string,
    content:string,
    type?: 'error'|'confirmation'
}

const model = defineModel<boolean>({required: true})

const props = withDefaults(defineProps<Props>(),{
    type:'confirmation'
});

const close = ()=>{
    model.value = false // TODO : Different actions by buttons ( confirm, cancel, go to settings, ... )
}
</script>

<template>
    <div v-if="model" class="dialog absolute absolute-center bg-neutral-800 p-1.5 rounded-2xl border-neutral-600 border-2 min-w-fit md:w-[400px]">
        <div
        class="dialog-head flex flex-col flex-wrap w-full justify-center items-center gap-3 text-xl md:text-2xl"
        :class="type=='confirmation'?'border-b-blue-600 border-b-2':'border-b-red-600 border-b-2'"
        >
            <Icon
            :icon="type=='confirmation' ? 'solar:check-square-line-duotone' : 'solar:close-square-line-duotone'" class="text-6xl mt-3"
            :class="type=='confirmation' ? 'text-blue-600' : 'text-red-600'"
            />
            <h1 class="mb-3 text-center">{{title}}</h1>
        </div>
        <div class="dialog-content md:text-lg">
            <p class="w-fit md:w-4/5 md:mx-auto md:mt-2">{{content}}</p>
        </div>
        <div class="dialog-buttons flex flex-row flex-wrap gap-2">
            <div v-if="type=='confirmation'" class="dialog-cancel bg-blue-900 cursor-pointer mt-3 flex-1 rounded-2xl" @click="close">
                <p class="text-xl text-center">Confirm</p>
            </div>
            <div v-else class="dialog-cancel bg-red-900 cursor-pointer mt-3 flex-1 rounded-2xl" @click="close">
                <p class="text-xl text-center">Cancel</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .absolute-center{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
    }
</style>