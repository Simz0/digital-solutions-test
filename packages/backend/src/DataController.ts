import { DataService, FilterCriteria, UpdatePositions } from "./DataService"
import { Request, Response } from "express"
import { TableObject } from "./utils"

const Service = new DataService()


type PaginatedResult = {
    data: TableObject[],
    haveMore: boolean,
    message: string
}

const sendResponse = (res: Response, status: number, data: any, message = 'success') => {
    return res.status(status).json({ data, message })
}

export class DataController {

    private checkUpdatedPositions = (positions: UpdatePositions): boolean => {
            return !(
                positions.newPosition < 0 || positions.newPosition >= Service.getDataLength() || 
                positions.movedId < 0 || positions.movedId >= Service.getDataLength() || 
                positions.movedId === undefined || positions.newPosition === undefined
            )
    }

    getAllData = async (req: Request, res: Response): Promise<void> => {
        sendResponse(res, 403, Service.getAllData().splice(0, 10), 'Requesting all 1M items is forbidden. Use pagination.')
    }

    getDataLength = async (req: Request, res: Response): Promise<void> => {
        try {
            const length = Service.getDataLength()
            
            sendResponse(res, 200, length)
        } catch (error) {
            sendResponse(res, 500, null, "Server error")
        }
    }

    //    ожидаем в query параметре 'page'
    getPaginateData = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1
            if (page < 1) { 
                sendResponse(res, 400, null, "Page number must be greater than 0")
                return
            }

            const paginateResult = Service.getPaginateData(page) 
            sendResponse(res, 200, paginateResult)
        } catch (error) {
            sendResponse(res, 500, null, "Server error")
        }
    }

    //    критерии и пагинация в query 
    getPaginateFilteredData = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1
            const { id, name, value } = req.query
            
            const criteria: FilterCriteria = {}
            if (id) criteria.id = Number(id)
            if (name) criteria.name = String(name)
            if (value) criteria.value = Number(value)
            const filterResult = Service.getPaginateFilteredData(page, criteria) 
            
            sendResponse(res, 200, filterResult)
        } catch (error) {
            sendResponse(res, 500, null, "Server error")
        }
    }

    updatePositions = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const positions: UpdatePositions = req.body

            if (
                this.checkUpdatedPositions(positions) === false
            ) {
                sendResponse(res, 400, null, "newPosition is out of bounds")
                return
            }


            Service.updatePositions(positions.movedId, positions.newPosition)
        } catch (error) {
            sendResponse(res, 500, null, "Error with save data, pls, check your request body")
        }
        sendResponse(res, 200, null)
    }

    updateMultiplePostions = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const positions: Array<UpdatePositions> = req.body
            positions.forEach(pos => {
                if (
                    this.checkUpdatedPositions(pos) === false
                ) {
                    sendResponse(res, 400, null, "newPosition is out of bounds")
                    return
                }
            })
            Service.updateMultiplePostions(positions)    
        } catch (error) {
            sendResponse(res, 500, null, "Error with save data, pls, check your request body")
        }
        sendResponse(res, 200, null)
    }

    sortDataByField = async (
        req: Request, 
        res: Response
    ): Promise<void> => {
        try {
            const field = req.query.field as any;
            if (!field) {
                sendResponse(res, 400, null, "Field is required");
                return;
            }
            const result = Service.sortDataByField(field);
            sendResponse(res, 200, result, "Sorted successfully");
        } catch (error) {
            sendResponse(res, 500, null, "Sort failed");
        }
    }
}