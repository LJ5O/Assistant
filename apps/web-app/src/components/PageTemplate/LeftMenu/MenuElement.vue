<script setup lang="ts">
    import { Icon } from "@iconify/vue";

    interface Props {
        icon:string,
        text:string,
        currentTab?:boolean
    }
    const props = withDefaults(defineProps<Props>(),{
        currentTab:false
    });

</script>

<template>
    <div class="
        flex flex-row gap-2 p-1.5 text-neutral-300 h-fit justify-start w-7/8 mx-auto hover:bg-neutral-500/50
        border-neutral-600 border-b-2 border-b-solid rounded-lg
    "
    :class="currentTab ? 'bg-neutral-700' : ''">
        <Icon :icon="icon" class="text-3xl"/>
        <p class="text-2xl hidden [@container(min-width:120px)]:block">{{text}}</p>
    </div>
</template>

<style scoped>

</style>