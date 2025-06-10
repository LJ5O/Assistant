<script setup lang="ts">

const model = defineModel<string>({required: true})

export interface Props{
    type?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text'
})
</script>

<template>
<input
  v-model="model"
  :type="props.type"
  class="
    rounded-lg px-2 py-1 text-sm whitespace-nowrap outline-none
    shadow-sm
    bg-neutral-950 focus:bg-neutral-900
    border-2 border-neutral-900 focus:border-gray-500
    transition-all duration-200 ease-in-out
    text-neutral-50 disabled:text-neutral-600
    disabled:cursor-not-allowed
  "
/>
</template>