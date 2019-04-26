// eslint-disable-next-line import/no-unresolved
const { pipe } = require('@lawcket/fn');
const request = require('./request').default;
const sign = require('./sign').default;

interface BuilderRequirements {
  stage: string,
  domainName: string,
  connectionId: string,
}

interface RequestContext extends BuilderRequirements { eventType: string }

interface PublishEvent { requestContext: RequestContext }

export const builder = ({ stage, domainName, connectionId }: BuilderRequirements) => 
  pipe(
    (data: any) => ({ data, stage, domainName, connectionId }),
    sign,
    request,
  );

export default ({ requestContext }: PublishEvent) =>
  requestContext && requestContext.eventType === 'MESSAGE'
    ? builder(requestContext)
    : undefined;
