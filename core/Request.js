

export class Request {
    constructor(req){
        this.raw = req;
    }
    get method(){
        return this.raw.method;
    }

    get url(){
        return this.raw.url;
    }

    get headers(){
        return this.raw.headers;
    }
}