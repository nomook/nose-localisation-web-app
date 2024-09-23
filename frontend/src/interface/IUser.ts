export interface IPosition {
    x: number,
    y: number
}

export interface IUser {
    name: string,
    firstName: string,
    pictureURL: string,
    nosePosition?: IPosition,
    lastUpdateDate: Date,
    birthDate: Date,
}