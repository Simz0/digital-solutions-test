export type TableObject = {
    name: string,
    value: number,
    id: number
}

export type FilterCriteria = Partial<Record<keyof TableObject, string | number>>

export type UpdatePositions = {
    movedId: number
    newPosition: number
}