<template>
    <div class="small-card">
        <div class="content">
            <h4>{{ item.name }}</h4>
            <small class="uuid">{{ shortUuid }}</small>
        </div>
        <button class="remove-btn" @click.stop="$emit('remove', item)">×</button>
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { TableObject } from '../types'

const props = defineProps<{
    item: TableObject
}>()

const shortUuid = computed(() => {
    return props.item.uuid.substring(0, 8) + '...'
})
</script>

<style scoped>
.small-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin: 0.25rem 0;
    transition: all 0.2s ease;
}

.small-card:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

.content {
    flex: 1;
    overflow: hidden;
}

h4 {
    margin: 0;
    font-size: 0.9rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.uuid {
    color: #666;
    font-size: 0.75rem;
}

.remove-btn {
    background: none;
    border: none;
    color: #ff4444;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0 0.5rem;
    line-height: 1;
}

.remove-btn:hover {
    color: #cc0000;
}
</style>