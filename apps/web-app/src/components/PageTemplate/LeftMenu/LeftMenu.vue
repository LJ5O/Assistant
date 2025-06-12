<script setup lang="ts">

    import { useRoute } from 'vue-router'
    import MenuElement from './MenuElement.vue'

    const route = useRoute();

</script>

<template>
    <div class="flex flex-col justify-between bg-neutral-800">

        <div class="flex flex-col gap-2 mt-4 @container">
            <MenuElement icon="solar:dialog-2-line-duotone" text="Talk"/>
            <MenuElement icon="solar:dialog-2-line-duotone" text="Talk" :currentTab="route.name === 'control'"/>
            <MenuElement icon="solar:dialog-2-line-duotone" text="Talk"/>
        </div>
        
    </div>
</template>

<style scoped>
    @reference "tailwindcss";

</style>