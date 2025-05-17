import axios from "axios";
import type { TableObject, FilterCriteria, UpdatePositions } from "../types";


const api = axios.create({
    baseURL: __API_URL__,
    timeout: 5000
})

export async function fetchItems(page: number, criteria: FilterCriteria) {
    const response = await api.post<{
        data: TableObject[]
        haveMore: boolean
    }>(`/data/filter/page?page=${page}`, criteria)

    return response.data
}

export async function dataElementsSequensUpdate(params: UpdatePositions) {
    const response = await api.put<{
        message: string,
        data: undefined
    }>(`/data/update`, params)

    return response.data
}

export async function dataElementsSequensUpdateBatch(params: Array<UpdatePositions>) {
    const response = await api.put<{
        message: string,
        data: undefined
    }>(`/data/update/batch`, params)

    return response.data
}
