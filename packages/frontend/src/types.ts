export type TableObject = {
    name: string,
    value: number,
    uuid: string
}

export type FilterCriteria = Partial<Record<keyof TableObject, string | number>>
