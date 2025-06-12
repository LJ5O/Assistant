<script setup lang="ts">
import { computed } from 'vue'

export interface Props{
    content:string,
    type?:'primary'|'secondary'|'danger'
}

const props = withDefaults(defineProps<Props>(), {
    type: 'primary'
})

const buttonClass = computed(()=>{
    switch(props.type){
        case 'secondary':
            return 'bg-gray-500 hover:bg-gray-600 text-white'
        case 'danger':
            return 'bg-red-600 hover:bg-red-700 text-white'
        case 'primary':
        default:
            return 'bg-green-600 hover:bg-green-700 text-white'
    }
});
</script>

<template>
    <button
        class="cursor-pointer w-fit pl-8 pr-8 pt-2 pb-2 border-1 border-neutral-300 rounded-xl"
        :class="buttonClass"
    >
        {{content}}
    </button>
</template>