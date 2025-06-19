<script setup lang="ts">

import { Icon } from "@iconify/vue";
import type { ToolCall, ToolMessage } from '../../../../API/Types/Types'

interface Props{
    tool: ToolCall
}
const props = defineProps<Props>()

const getArgValue = (arg:string)=>{
    const [_, ...rest] = arg.split(':')
    return rest.join('')
}
</script>

<template>
    <div
        class="tool-call mt-1 bg-neutral-800 rounded-xl w-1/3 min-w-fit
        flex flex-col justify-center text-center relative"
    >
        <Icon icon="solar:widget-5-line-duotone" class="hidden absolute top-1 right-1 text-4xl lg:block"/>
        <h2 class="font-bold mt-2 mb-2">Tool called : <span class="font-extrabold">{{tool.name}}</span></h2>
        <h3 v-if="tool.args.length>0" class="">Arguments passed to this tool :</h3>
        <p v-for="(arg, index) in tool.args">Arg <span class="font-semibold">{{ arg.split(':')[0] }}</span> = {{ getArgValue(arg) }}</p>
    </div>
</template>