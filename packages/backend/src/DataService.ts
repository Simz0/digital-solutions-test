import { allItem, TableObject } from "./utils"
import { pageSize } from "./consts"

export type FilterCriteria = Partial<Record<keyof TableObject, string | number>>

export class DataService {
    getAllData = (): TableObject[] => {
        return allItem
    }

    getDataLength = (): number => {
        return allItem.length
    }

    getPaginateData = (page=1): {data: TableObject[], haveMore: boolean} => {
        const start = (page - 1) * pageSize
        const haveMore = ((page) * pageSize) < allItem.length 

        return {data: allItem.slice(start, start + pageSize), haveMore}
    }

    getFilteredData = (criteria: FilterCriteria): TableObject[] => {
        return allItem.filter(item => {
            return (Object.entries(criteria) as [keyof TableObject, any][])
                .every(([key, value]) => {
                    const field = item[key]

                    if (typeof value === 'string' && typeof field === 'string') {
                        return field.includes(value)
                    }

                    if (typeof value === 'number' && typeof field === 'number') {
                        return field === value
                    }

                    return false
                })
            
        })
    }

    getPaginateFilteredData = (page=1, criteria: FilterCriteria): {data: TableObject[], haveMore: boolean} => {
        const start = (page - 1) * pageSize
        const filteredData = this.getFilteredData(criteria)
        const haveMore = ((page) * pageSize) < filteredData.length 
        return {data: filteredData.slice(start, start + pageSize), haveMore}
    }
}
