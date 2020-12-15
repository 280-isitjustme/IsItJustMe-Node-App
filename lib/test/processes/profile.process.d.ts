interface AccessPacket {
    accessToken: string;
    responseStatus?: number;
}
declare function me(data: AccessPacket): Promise<any>;
interface OptionalAccessPacket {
    [key: string]: any;
    accessToken?: string;
    responseStatus?: number;
}
declare function getAll(data: OptionalAccessPacket): Promise<any>;
declare function id(data: OptionalAccessPacket): Promise<any>;
export { getAll, id, me };
