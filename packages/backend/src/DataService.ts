import { allItem, TableObject, updateAllItems } from "./utils"
import { pageSize } from "./consts"

export type FilterCriteria = Partial<Record<keyof TableObject, string | number>>

export type UpdatePositions = {
    movedId: number
    newPosition: number
}

export class DataService {

    private idMap = new Map<number, TableObject>()

    constructor() {
        this.syncIdMap()
    }

    private syncIdMap = () => {
        this.idMap.clear()
        for (const item of allItem) {
            this.idMap.set(item.id, item)
        }
    }

    getAllData = (): TableObject[] => allItem

    setAllData = (items: TableObject[]): void => {
        updateAllItems(items)
    }

    getDataLength = (): number => allItem.length

    getPaginateData = (page = 1): { data: TableObject[], haveMore: boolean } => {
        const start = (page - 1) * pageSize
        const data = allItem.slice(start, start + pageSize)

        return {
            data,
            haveMore: page * pageSize < allItem.length
        }
    }

    getFilteredData = (criteria: FilterCriteria): TableObject[] => {
        return allItem.filter(item => {
            return (Object.entries(criteria) as [keyof TableObject, any][])
                .every(([key, value]) => {
                    const field = item[key]
                    return field.toString().toLowerCase().includes(value.toString().toLowerCase())
                })

        })
    }

    getPaginateFilteredData = (page = 1, criteria: FilterCriteria): { data: TableObject[], haveMore: boolean } => {
        const start = (page - 1) * pageSize
        const filteredData = this.getFilteredData(criteria)
        const haveMore = ((page) * pageSize) < filteredData.length
        return { data: filteredData.slice(start, start + pageSize), haveMore }
    }

    updatePositions = (movedId: number, newPostion: number): void => {
        const items = [...allItem] 
        const movedIdItem = this.idMap.get(movedId)
        if (!movedIdItem) return
        const moveIdItemIndex = movedIdItem.order // буквально order это текущий индекс

        const [movedItem] = items.splice(moveIdItemIndex, 1)
        items.splice(newPostion, 0, movedItem)

        const startUpdateIndex = Math.min(moveIdItemIndex, newPostion)
        const endUpdateIndex = Math.max(moveIdItemIndex, newPostion)
        
        for (let i = startUpdateIndex; i < endUpdateIndex; i++) {
            items[i].order = i
        }

        updateAllItems(items)
    }

    updateMultiplePostions = (updates: Array<UpdatePositions>): void => {
        let items = [...allItem]

        updates.forEach(({ movedId, newPosition }) => {
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

    sortDataByField = (field: keyof TableObject): TableObject[] => {
        const data = this.getAllData()

        data.sort((a, b) => {
            if (a[field] < b[field]) return -1
            if (a[field] > b[field]) return 1
            return 0
        })

        this.setAllData(data)

        data.forEach((item, index) => {
            item.order = index
        })

        return data.slice(0, pageSize)
    }
}
