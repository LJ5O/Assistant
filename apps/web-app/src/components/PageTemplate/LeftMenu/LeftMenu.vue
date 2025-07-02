<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRoute,RouterLink } from 'vue-router'
    import {getAvailableConversations} from '@/API/Messages'
    import MenuElement from './MenuElement.vue'
    import SubMenuElement from './MenuSubElement.vue'

    const route = useRoute();

    const conversations = ref<string[]>([]);

    onMounted(async () => { // TODO : names for threads
        const res = await getAvailableConversations();
        conversations.value = res.threads.map(e => e.split('.')[1]);//Remove the username at the beggining
    });

</script>

<template>
    <div class="flex flex-col justify-between bg-neutral-800">

        <div class="flex flex-col gap-2 mt-4 @container">
            <RouterLink to="/talk">
                <MenuElement icon="solar:dialog-2-line-duotone" text="Talk" :currentTab="route.name === 'talk'"/>
            </RouterLink>
                <RouterLink v-for="(e,i) in conversations" :to="'/talk/'+e">
                    <SubMenuElement icon="solar:dialog-2-line-duotone" :text="e"/>
                </RouterLink>
            <MenuElement icon="solar:letter-line-duotone" text="Emails" />
            <MenuElement icon="solar:documents-line-duotone" text="Notes"/>
            <MenuElement icon="solar:calendar-line-duotone" text="Calendar"/>
        </div>
        
    </div>
</template>

<style scoped>

</style>