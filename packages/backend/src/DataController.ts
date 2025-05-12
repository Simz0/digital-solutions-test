import { DataService, FilterCriteria } from "./DataService";
import { Request, Response } from "express";
import { TableObject } from "./utils";

const Service = new DataService()

type ResultType<T> = {
    data: T;
    message: string;
}

type PaginatedResult = {
    data: TableObject[],
    haveMore: boolean,
    message: string
};

export class DataController {
    getAllData = async (req: Request, res: Response): Promise<void> => {
        const result: ResultType<TableObject[]> = {
            data: [],
            message: "success"
        };
        try {
            result.data = Service.getAllData();
        } catch (error) {
            result.data = [];
            result.message = "Server error";
        }

        res.json(result);
    };

    getDataLength = async (req: Request, res: Response): Promise<void> => {
        const result: ResultType<number> = {
            data: 0,
            message: "success"
        };
        try {
            result.data = Service.getDataLength();
        } catch (error) {
            result.data = 0;
            result.message = "Server error";
        }
        res.json(result);
    };

    //    ожидаем в query параметре 'page'
    getPaginateData = async (req: Request, res: Response): Promise<void> => {
        const result: PaginatedResult = {
            data: [],
            haveMore: true,
            message: "success"
        };
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const paginateResult = Service.getPaginateData(page); 
            result.data = paginateResult.data;
            result.haveMore = paginateResult.haveMore;
        } catch (error) {
            result.data = [];
            result.message = "Server error";
        }
        res.json(result);
    };

    //    критерии передаются в теле запроса (JSON)
    getFilteredData = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const result: ResultType<TableObject[]> = {
            data: [],
            message: "success"
        };
        try {
            const criteria = req.body as FilterCriteria;
            result.data = Service.getFilteredData(criteria);
        } catch (error) {
            result.data = [];
            result.message = "Server error";
        }
        res.json(result);
    };

    //    критерии в теле, page в query
    getPaginateFilteredData = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const result: PaginatedResult = {
            data: [],
            haveMore: true,
            message: "success"
        };
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const criteria = req.body as FilterCriteria;
            const filterResult = Service.getPaginateFilteredData(page, criteria); 
            result.data = filterResult.data;
            result.haveMore = filterResult.haveMore;
        } catch (error) {
            result.data = [];
            result.message = "Server error";
        }
        res.json(result);
    };
}