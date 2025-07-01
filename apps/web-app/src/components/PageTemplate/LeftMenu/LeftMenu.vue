<script setup lang="ts">

    import { useRoute } from 'vue-router'
    import MenuElement from './MenuElement.vue'
    import SubMenuElement from './MenuSubElement.vue'

    const route = useRoute();

</script>

<template>
    <div class="flex flex-col justify-between bg-neutral-800">

        <div class="flex flex-col gap-2 mt-4 @container">
            <MenuElement icon="solar:dialog-2-line-duotone" text="Talk" :currentTab="route.name === 'talk'">
                <SubMenuElement icon="solar:dialog-2-line-duotone" text="Example talk"/>
            </MenuElement>
            <MenuElement icon="solar:letter-line-duotone" text="Emails" />
            <MenuElement icon="solar:documents-line-duotone" text="Notes"/>
            <MenuElement icon="solar:calendar-line-duotone" text="Calendar"/>
        </div>
        
    </div>
</template>

<style scoped>
    @reference "tailwindcss";

</style>