interface BuilderRequirements {
    stage: string;
    domainName: string;
    connectionId: string;
}
interface RequestContext extends BuilderRequirements {
    eventType: string;
}
interface PublishEvent {
    requestContext: RequestContext;
}
export declare const builder: ({ stage, domainName, connectionId }: BuilderRequirements) => any;
declare const _default: ({ requestContext }: PublishEvent) => any;
export default _default;
