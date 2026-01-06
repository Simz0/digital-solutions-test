import {faker} from '@faker-js/faker' // Смешные имена ха-ха... ха

export type TableObject = {
    name: string,
    value: number,
    id: number,
    order: number
}


const generateValue = (order: number): TableObject => {
    const newValue: TableObject = {
        name: faker.person.fullName(),
        value: Math.random() * 1000000, // Миллионы миллионы миллионы алых роз....
        id: order,
        order: order
    }

    return newValue
}

const makeList = (range=1000000): TableObject[] => {
    return Array.from({ length: range }, (_, i) => generateValue(i))
}

export function updateAllItems(items: TableObject[]): void {
    allItem = items
}

export let allItem: TableObject[] = makeList() // В целом глобальная переменная - не очень хорошо, но для демо пойдет