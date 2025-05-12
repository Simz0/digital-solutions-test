<template>
    <div class="card">


        <div class="drag-handle" @mousedown.stop>
            <span></span>
            <span></span>
            <span></span>
        </div>

        <label class="select-toggle" @click.stop>
            <input 
                type="checkbox" 
                :checked="selected" 
                @change="$emit('toggle', item)"
            />
        </label>

        <div class="card-content" @click.prevent="$emit('toggle', item)">
            <h3>{{ item.name }}</h3>
            <p>{{ item.value }}</p>
            <small>{{ item.uuid }}</small>
        </div>
    </div>
</template>


<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { TableObject } from '../types';

const props = defineProps<{
    item: TableObject
    selected: boolean
}>()

const emit = defineEmits<{
    (e: 'toggle', item: TableObject): void
}>()
</script>

<style scoped>
.card {
    position: relative;
    display: flex;
    align-items: center;
    padding: 1rem;
    margin: 0.5rem 0;
    background-color: #f5f5f5;
    border-radius: 0.5rem;
    cursor: default;
    color: black;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Ручка перетаскивания */
.drag-handle {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 8px;
    height: 24px;
    margin-right: 1rem;
    cursor: move;
}

.drag-handle span {
    display: block;
    width: 100%;
    height: 3px;
    background-color: #ccc;
    border-radius: 1px;
}

/* Чекбокс выбора */
.select-toggle {
    margin-right: 1rem;
}

.select-toggle input {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

/* Контент карточки */
.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.card-content h3,
.card-content p,
.card-content small {
    margin: 0;
}

.select-toggle:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
}

.card-ghost {
    opacity: 0.5;
    transform: scale(0.95);
}
</style>