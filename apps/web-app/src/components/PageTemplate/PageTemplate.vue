<script setup lang="ts">
    
    import Header from "./Header/Header.vue"
    import LeftMenu from "./LeftMenu/LeftMenu.vue"

</script>

<template>
    <div class="w-full h-full">
        <Header class="h-18" />
        
        <div class="flex flex-row flex-nowrap h-[calc(100%-var(--spacing)*18)]">
            <LeftMenu class="h-full w-1/10 min-w-[50px]" />
            
            <div class="w-9/10 h-full overflow-x-scroll overflow-y-hidden">
                <div class="w-98/100 h-full m-auto mt-4 text-neutral-100">
                    <slot /><!-- Main content -->
                </div>
            </div>
            
        </div>
    </div>
</template>

<style scoped>

</style>