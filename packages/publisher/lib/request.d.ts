interface RequestOptions {
    path: string;
    headers: {
        [key: string]: any;
    };
    body: any;
    host: string;
    method: string;
}
declare const _default: (options: RequestOptions) => Promise<{}>;
export default _default;
