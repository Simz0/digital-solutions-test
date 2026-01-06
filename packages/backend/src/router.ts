import express, {Router} from 'express'
import { DataController } from './DataController'

const router = Router()

const ctrl = new DataController();

// GET /data/all
router.get("/data/all", ctrl.getAllData); // Зачем? Но пусть будет

// GET /data/length
router.get("/data/length", ctrl.getDataLength); // Тоже сомнительно, но ладно

// GET /data/page?page=2
router.get("/data/page", ctrl.getPaginateData); // Дублирование с фильтрацией, но пусть будет

// GET /data/sort?field=name
router.get("/data/sort", ctrl.sortDataByField); // Сортировка по полю

// PUT /data/update {indexFirst: number, indexNext:number}
router.put("/data/update", ctrl.updatePositions) // Обновление позиций

// PUT /data/update/batch  [ {movedId: number, newPosition: number}, ...]
router.put("/data/update/batch", ctrl.updateMultiplePostions) // Обновление нескольких позиций

// GET /data/filter/page?page=2  { ...criteria }
router.get("/data/filter/page", ctrl.getPaginateFilteredData); // Фильтрация с пагинацией

export default router