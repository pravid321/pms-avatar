
export interface IRoom {
    "roomID"?: 1,
    "roomCode"?: string,
    "roomName"?: string,
    "roomDesc"?: string,
    "roomType"?: string,
    "basePax"?: number,
    "maxPax"?: number,
    "extraBedsAllowed"?: number,
    "isBaseRoom"?: boolean,
    "roomNumber"?: string,
    "roomNumbers"?: any
}

export interface IRatePlan {
    "ratePlanID": number,
    "ratePlanCode": string,
    "ratePlanName": string,
    "rateplanType": string,
    "ratePlanDesc": string,
    "los": number,
    "cancelPolicyID": number,
    "isBaseRate": number,
    "hotelId": number,
    "weight": number
}
