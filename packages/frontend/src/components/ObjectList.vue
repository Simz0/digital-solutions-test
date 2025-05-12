<template>
    <div class="container">
        <!-- Боковая панель с выбранными элементами -->
        <div class="sidebar">
            <h3>Выбранные элементы</h3>
            <draggableComponent 
                v-model="selected" 
                group="{name: 'items', pull: 'clone', put: true}"
                @end="saveState"
                class="selected-list"
                ghost-class="ghost"
            >
                <template #item="{element}">
                    <SmallCard :item="element" @remove="toggleSelect"/>
                </template>
            </draggableComponent>
        </div>

        <!-- Основной контент -->
        <div class="main-content">
            <div class="search-wrapper">
                <input class="search-input" v-model="searchQuery" placeholder="Поиск...">
                <button class="search-button" @click="fetchData()">Обновить</button>
            </div>

            <draggableComponent 
                v-model="localItems" 
                handle=".drag-handle" 
                item-key="uuid" 
                @end="saveState"
                class="vertical-list"
                group="{name: 'items', pull: 'clone', put: true}"
                ghost-class="ghost"
            >
                <template #item="{element}">
                    <ObjectCard 
                        :item="element"
                        :selected="isSelected(element)"
                        @toggle="toggleSelect"
                        class="list-item"
                    />
                </template>
            </draggableComponent>

            <div class="load-more-wrapper">
                <button v-if="haveMore" @click="loadMore()" class="load-more">Загрузить ещё</button>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import ObjectCard from './ObjectCard.vue'
import SmallCard from './SmallCard.vue'
import { fetchItems } from '../api/items'
import type { TableObject, FilterCriteria } from '../types'
import draggableComponent from 'vuedraggable'

const page = ref(1)
// const items = ref<TableObject[]>([])
const haveMore = ref(false)
const searchQuery = ref('')

const initial: TableObject[] = []
const localItems = useLocalStorage<TableObject[]>('items', initial)
const selected = useLocalStorage<TableObject[]>('selected', [])

const originalPositions = useLocalStorage<Record<string, number>>('item-positions', {});

function toggleSelect(item: TableObject) {
    const selectedIndex = selected.value.findIndex(i => i.uuid === item.uuid);
    const localIndex = localItems.value.findIndex(i => i.uuid === item.uuid);
    
    if (selectedIndex > -1) {
        // Восстанавливаем позицию из оригинального положения
        const originalIndex = originalPositions.value[item.uuid] ?? localItems.value.length;
        selected.value.splice(selectedIndex, 1);
        localItems.value.splice(originalIndex, 0, item);
        delete originalPositions.value[item.uuid];
    } else {
        // Сохраняем оригинальную позицию перед удалением
        if (localIndex > -1) {
            originalPositions.value[item.uuid] = localIndex;
            localItems.value.splice(localIndex, 1);
        }
        selected.value.push(item);
    }
    
    // Форсируем обновление
    localItems.value = [...localItems.value];
    selected.value = [...selected.value];
}

function isSelected(item: TableObject) {
    return selected.value.some(i => i.uuid === item.uuid)
}

function saveState() {

}

async function fetchData() {
    const criteria: FilterCriteria = {}
    if (searchQuery.value) criteria.name = searchQuery.value
    const { data, haveMore: more } = await fetchItems(page.value, criteria)
    localItems.value = page.value === 1 ? data : [...localItems.value, ...data]
    haveMore.value = more
}

function loadMore() {
    page.value++
    fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
h3 {
    color: black;
}
.container {
    display: flex;
    gap: 2rem;
    padding: 1rem;
    min-height: 100vh;
}

.sidebar {
    width: 300px;
    min-width: 300px;
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    height: calc(100vh - 2rem);
    overflow-y: auto;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 800px;
}

.vertical-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.list-item {
    width: 100%;
    margin-bottom: 0.5rem;
}

.load-more {
    align-self: center;
    padding: 0.5rem 2rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
}

.selected-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
}

.main-list {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}


.list-container {
    width: 80%;
    /* задаём относительную ширину 80% от родителя :contentReference[oaicite:2]{index=2} */
    max-width: 800px;
    /* ограничиваем максимальную ширину :contentReference[oaicite:3]{index=3} */
    align-items: center;
    margin: 0 auto;
    /* центрируем контейнер по горизонтали :contentReference[oaicite:4]{index=4} */
    display: flex;
    flex-direction: column;
    /* колонки друг под другом :contentReference[oaicite:5]{index=5} */
    gap: 1rem;
    /* расстояние между элементами внутри списка :contentReference[oaicite:6]{index=6} */
}

.search-wrapper {
  display: flex;            /* выстраиваем input + button в ряд */
  align-items: center;      /* выравниваем по центру по вертикали */
  max-width: 800px;         /* максимальная ширина обёртки */
  margin: 1rem auto;        /* центрируем обёртку на странице */
  gap: 0.5rem;              /* расстояние между input и button */
}

.search-input {
  /* Вместо flex:1 можно задать фиксированную ширину */
  flex: 0 0 250px;        /* «поуже» — ширина ~250px */
  height: 2.5rem;         /* «чуть толще» — высота 2.5rem */
  padding: 0 1rem;        /* отступы по горизонтали */
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: #66afe9;
  box-shadow: 0 0 5px rgba(102,175,233,0.6);
}

.search-button {
  flex: 0 0 auto;          /* не растягивается, держит свой размер */
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}
.search-button:hover {
  background-color: #0056b3;
}

.list-item {
    transition: all 0.3s ease;
    opacity: 1;
}

.list-item.ghost {
    opacity: 0.5;
    transform: scale(0.95);
}

.load-more {
    width: calc(100% - 2rem); /* Ширина как у карточек */
    max-width: 800px;         /* Совпадает с max-width карточек */
    margin: 1rem auto;        /* Центрирование */
    align-self: center;       /* Для flex-контейнера */
}

.load-more-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0 1rem; /* Совпадает с отступами карточек */
}
</style>