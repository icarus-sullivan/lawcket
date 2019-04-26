interface SigningParams {
    stage: string;
    domainName: string;
    connectionId: string;
    data: any;
}
declare const _default: ({ data, stage, domainName, connectionId }: SigningParams) => any;
export default _default;
