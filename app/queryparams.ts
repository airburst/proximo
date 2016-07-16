export class QueryParams {

    params: any;

    // Constructor
    constructor(url: any) {
        this.params = this.processRouter(url, url instanceof Array);
    }

    // Handle if string type or array of strings
    processRouter(url: any, isArray: boolean) {
        if (isArray) {
            let finalArray:any[] = [];
            url.forEach((singleUrl: string) => {
                finalArray.push(this.processUrl(singleUrl));
            }, this);
            return finalArray;
        }
        else {
            return this.processUrl(url);
        }
    }

    // Process urls
    processUrl(singleUrl: string) {
        let paramsArray = (singleUrl.split('?').length > 1) ? singleUrl.split('?')[1].split('&') : [];
        let finalObj: any = {};
        paramsArray.forEach((param) => {
            finalObj[param.split('=')[0]] = param.split('=')[1];
        });
        return finalObj;
    }
}

// console.info('String Input', new QueryParams(myUrl).params, '\n\n');
// console.info('Array Input', new QueryParams(myUrlArray).params, '\n\n');