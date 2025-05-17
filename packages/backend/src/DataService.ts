import { allItem, TableObject, updateAllItems } from "./utils"
import { pageSize } from "./consts"

export type FilterCriteria = Partial<Record<keyof TableObject, string | number>>

export type UpdatePositions = {
    movedId: number
    newPosition: number
}

export class DataService {
    getAllData = (): TableObject[] => {
        return allItem
    }

    getDataLength = (): number => {
        return allItem.length
    }

    getPaginateData = (page=1): {data: TableObject[], haveMore: boolean} => {
        const sortedItems = [...allItem].sort((a, b) => a.order - b.order);
        const start = (page - 1) * pageSize;
        const haveMore = start + pageSize < sortedItems.length;
        
        return {
            data: sortedItems.slice(start, start + pageSize),
            haveMore
        };
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

    updatePositions = (movedId: number, newPostion: number): void => {
        const items = [...allItem]
        const moveIdItemIndex = items.findIndex(item => item.id === movedId)
        if (moveIdItemIndex === -1) return
        
        const [movedItem] = items.splice(moveIdItemIndex, 1)
        items.splice(newPostion, 0, movedItem)

        items.forEach((item, index) => {
            item.order = index
        }) 

        updateAllItems(items)
    }

    updateMultiplePostions = (updates: Array<UpdatePositions>): void => {
        let items = [...allItem]

        updates.forEach(({movedId, newPosition}) => {
            const movedIndex = items.findIndex(item => item.id === movedId)
            if (movedIndex === -1) return

            const [movedItem] = items.splice(movedIndex, 1)
            items.splice(newPosition, 0, movedItem)
        })

        items.forEach((item, index) => {
            item.order = index
        })

        updateAllItems(items)
    }
}
