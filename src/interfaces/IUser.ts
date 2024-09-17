interface IPosition {
    x: number,
    y: number
}

export interface IUser {
    uid: string,
    name: string,
    firstName: string,
    pictureURL: string,
    nosePosition?: IPosition,
    lastUpdateDate: Date,
    birthDate: Date,
}
