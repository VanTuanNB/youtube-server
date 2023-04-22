export default interface IBlackList {
    _id: string;
    userId: string;
    token: string;
    tokenFamily?: string[];
    exp?: Date;
}
