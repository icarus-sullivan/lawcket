import publisher, { builder } from './';
import request from './request';

jest.mock('./request');

const defaultFramework = (eventType: string) => publisher({
  requestContext: {
    eventType,
    stage: 'unit',
    domainName: 'test.execute-api.us-west-2.amazonaws.com',
    connectionId: 'testId',
  },
});

const builderFramework = () => builder({
  stage: 'unit',
  domainName: 'test.execute-api.us-west-2.amazonaws.com',
  connectionId: 'testId',
});

beforeEach(() => {
  jest.resetAllMocks();
});

test('builder', async () => {
  const publish = builderFramework();
  await publish({ foo: 'bar' });
  expect(publish).toBeDefined();
  expect(request).toHaveBeenCalled();
});

describe('publisher', () => {
  test('connect', () => {
    const publish = defaultFramework('CONNECT');
    expect(publish).not.toBeDefined();
    expect(request).not.toHaveBeenCalled();
  });

  test('disconnect', () => {
    const publish = defaultFramework('DISCONNECT');
    expect(publish).not.toBeDefined();
    expect(request).not.toHaveBeenCalled();
  });

  test('message', async () => {
    const publish = defaultFramework('MESSAGE');
    await publish({ foo: 'bar' });
    expect(publish).toBeDefined();
    expect(request).toHaveBeenCalled();
  });
});
