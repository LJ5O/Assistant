<script setup lang="ts">
    import { Icon } from "@iconify/vue";

    interface Props {
        icon:string,
        text:string
    }
    const props = defineProps<Props>();

</script>

<template>
    <div class="flex flex-row gap-1 text-white rounded-xl h-fit p-1 hover:bg-neutral-300/50">
        <Icon :icon="icon" class="text-xl"/>
        <p class="text-sm hidden sm:block">{{text}}</p>
    </div>
</template>

<style scoped>
    @reference "tailwindcss";

    .header-div * {
        @apply my-auto;
    }
</style>