import express, {Router} from 'express'
import { DataController } from './src/DataController'

const router = Router()

const ctrl = new DataController();

// GET /data/all
router.get("/data/all", ctrl.getAllData);

// GET /data/length
router.get("/data/length", ctrl.getDataLength);

// GET /data/page?page=2
router.get("/data/page", ctrl.getPaginateData);

// POST /data/filter   { uuid?:..., name?:..., value?:... }
router.post("/data/filter", ctrl.getFilteredData);

// POST /data/filter/page?page=2  { ...criteria }
router.post("/data/filter/page", ctrl.getPaginateFilteredData);

export default router