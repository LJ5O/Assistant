<script setup lang="ts">
    import HeaderLink from './HeaderLink.vue'
</script>

<template>
    <div class="w-full min-h-16 h-fit bg-neutral-800 flex flex-row flex-wrap justify-between header-div">
        <div class="h-12 w-12 ml-2 my-auto">
            <img src="https://picsum.photos/75" class="rounded-xs w-full h-full"/>
        </div>
        <div class="w-fit h-12 my-auto mr-2 flex flex-row flex-wrap gap-3">
            <img src="https://picsum.photos/80" class="h-full rounded-[50%]" />

            <HeaderLink icon="solar:user-circle-line-duotone" text="My account"/>
            <HeaderLink icon="solar:settings-line-duotone" text="Settings"/> 
            <HeaderLink icon="solar:logout-3-line-duotone" text="Logout"/> 
            
        </div>
    </div>
</template>

<style scoped>
    @reference "tailwindcss";

    .header-div * {
        @apply my-auto;
    }
</style>