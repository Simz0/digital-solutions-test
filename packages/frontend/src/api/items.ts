import axios from "axios";
import type { TableObject, FilterCriteria } from "../types";


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

