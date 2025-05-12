import {v4 as uuidv4} from 'uuid'
import {faker} from '@faker-js/faker'

export type TableObject = {
    name: string,
    value: number,
    uuid: string
}


const generateValue = (): TableObject => {
    const newValue: TableObject = {
        name: faker.person.fullName(),
        value: Math.random() * 1000000,
        uuid: uuidv4()
    }

    return newValue
}

const makeList = (range=1000000): TableObject[] => {
    return Array.from({ length: range }, () => generateValue())
}

export const allItem: TableObject[] = makeList()