import fs from 'fs';
import path from 'path';
export default class Store {
    private static instance: Store;
    #string_store:Record<string,{
        data:string,
        ttl:number|null,
    }> ={};
    #number_store:Record<string,{
        data:number,
        ttl:number|null,
    }> ={};
    #boolean_store:Record<string,{
        data:boolean,
        ttl:number|null,
    }> ={};
    #object_store:Record<string,
    {
        data: Record<string,any>|any[],
        ttl:number|null,
    }> ={};

    private constructor(){
        this.loadData();
    };

    // using singleton pattern to create a single instance of the store
    static createStore(){
        if(!Store.instance){
            Store.instance = new Store();
        }
        return Store.instance;
    }
    ADDSTRING(name:string,value:string,ttl:number|null=null){
        this.#string_store[name]={
            data:value,
            ttl:this.#string_store[name]&&this.#string_store[name]['ttl']||(ttl&&Date.now()+(ttl*1000)),
        }
        console.log(this.#string_store);
    }
    ADDNUMBER(name:string,value:number,ttl:number|null=null){
        this.#number_store[name]={
            data:value,
            ttl:this.#number_store[name]&&this.#number_store[name]['ttl']||(ttl&&Date.now()+(ttl*1000)),
        }
        // console.log(this.#number_store);
    }
    ADDBOOLEAN(name:string,value:boolean,ttl:number|null=null){
        this.#boolean_store[name]={
            data:value,
            ttl: this.#boolean_store[name]&&this.#boolean_store[name]['ttl']||(ttl&&Date.now()+(ttl*1000)),
        }
        // console.log(this.#boolean_store);
    }
    ADDOBJECT(name:string,value:Record<string,any>|any[],ttl:number|null=null){
        this.#object_store[name]={
            data:value,
            ttl:this.#object_store[name]&&this.#object_store[name]['ttl']||(ttl&&Date.now()+(ttl*1000)),
        }
        // console.log(this.#object_store);
    }
    GETSTRING(name:string):string|null{
        // console.log(this.#string_store);
        if(this.#string_store[name]){
            let ttl = this.#string_store[name]['ttl'];
            if(ttl && ttl < Date.now()){
                delete this.#string_store[name];
                return null;
            }
            return this.#string_store[name]['data']||null;
        }
        return null;
    }
    GETNUMBER(name:string):number|null{
        // console.log(this.#number_store);
        if(this.#number_store[name]){
            let ttl = this.#number_store[name]['ttl'];
            if(ttl && ttl < Date.now()){
                delete this.#number_store[name];
                return null;
            }
            return this.#number_store[name]['data']||null;
        }
        return null;
    }
    GETBOOLEAN(name:string):boolean|null{
        // console.log(this.#boolean_store);
        if(this.#boolean_store[name]){
            let ttl = this.#boolean_store[name]['ttl'];
            if(ttl && ttl < Date.now()){
                delete this.#boolean_store[name];
                return null;
            }
            return this.#boolean_store[name]['data']||null;
        }
        return null;
    }
    GETOBJECT(name:string):object|null{
        // console.log(this.#object_store);
        if(this.#object_store[name]){
            let ttl = this.#object_store[name]['ttl'];
            if(ttl && ttl < Date.now()){
                delete this.#object_store[name];
                return null;
            }
            return this.#object_store[name]['data']||null;
        }
        return null;
    }
    INCRNUMBER(name:string,value:number):number|null{
        if(this.#number_store[name] === undefined){
            return null;
        }else if(this.#number_store[name]['ttl'] && this.#number_store[name]['ttl']<Date.now()){
            delete this.#number_store[name];
            return null;
        }else{
            this.#number_store[name]['data'] = this.#number_store[name]['data'] + value;
            return this.#number_store[name]['data'];
        }
    }
    DELSTRING(name:string):boolean{
        if(this.#string_store[name]){
            delete this.#string_store[name];
            return true;
        }else{
            return false;
        }
    }
    DELNUMBER(name:string):boolean{
        if(this.#number_store[name]){
            delete this.#number_store[name];
            return true;
        }else{
            return false;
        }
    }
    DELBOOLEAN(name:string):boolean{
        if(this.#boolean_store[name]){
            delete this.#boolean_store[name];
            return true;
        }else{
            return false;
        }
    }
    DELOBJECT(name:string):boolean{
        if(this.#object_store[name]){
            delete this.#object_store[name];
            return true;
        }else{
            return false;
        }
    }
    SETTTL(type:string, key:string,ttl:number):boolean|string{
        switch(type){
            case 'str':
                if(this.#string_store[key]){
                    this.#string_store[key]['ttl'] = Date.now()+(ttl*1000);
                    return true;
                }else return false;
            case 'num':
                if(this.#number_store[key]){
                    this.#number_store[key]['ttl'] = Date.now()+(ttl*1000);
                    return true;
                }else return false;
            case 'bool':
                if(this.#boolean_store[key]){
                    this.#boolean_store[key]['ttl'] = Date.now()+(ttl*1000);
                    return true;
                }else return false;
            case 'obj':
                if(this.#object_store[key]){
                    this.#object_store[key]['ttl'] = Date.now()+(ttl*1000);
                    return true;
                }else return false;
            default:
                return "Invalid Data type";
        }
    }
    GETTTL(type:string, key:string):number|null|string{
        let ttl:number|null;
        switch(type){
            case 'str':
                if(this.#string_store[key] && this.#string_store[key]['ttl']){
                    ttl= this.#string_store[key]['ttl']-Date.now();
                    if (ttl<0){
                        delete this.#string_store[key];
                        return null;
                    }else return ttl/1000;
                }else return null;
            case 'num':
                if(this.#number_store[key] && this.#number_store[key]['ttl']){
                    ttl= this.#number_store[key]['ttl']-Date.now();
                    if (ttl<0){
                        delete this.#number_store[key];
                        return null;
                    }else return ttl/1000;
                }else return null;
            case 'bool':
                if(this.#boolean_store[key] && this.#boolean_store[key]['ttl']){
                    ttl= this.#boolean_store[key]['ttl']-Date.now();
                    if (ttl<0){
                        delete this.#boolean_store[key];
                        return null;
                    }else return ttl/1000;
                }else return null;
            case 'obj':
                if(this.#object_store[key] && this.#object_store[key]['ttl']){
                    ttl = this.#object_store[key]['ttl']-Date.now();
                    if (ttl<0){
                        delete this.#object_store[key];
                        return null;
                    } else return ttl/1000;
                }else return null;
            default:
                return "Invalid Data type";
        }
    }
    REMOVETTL(type:string, key:string):boolean|string {
        switch(type){
            case 'str':
                if(this.#string_store[key]){
                    this.#string_store[key]['ttl'] = null;
                    return true;
                }else return false;
            case 'num':
                if(this.#number_store[key]){
                    this.#number_store[key]['ttl'] = null;
                    return true;
                }else return false;
            case 'bool':
                if(this.#boolean_store[key]){
                    this.#boolean_store[key]['ttl'] = null;
                    return true;
                }else return false;
            case 'obj':
                if(this.#object_store[key]){
                    this.#object_store[key]['ttl'] = null;
                    return true;
                }else return false;
            default:
                return "Invalid Data type";
        }
    }
    
    loadData(){
        let filePath;
        try {
            filePath=path.join(__dirname,'string_dump.json');
            if(fs.existsSync(filePath)){
                this.#string_store = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                // console.log('String data loaded successfully');
            }
        } catch (err) {
            // console.error('Error in reading String dump');
            this.#string_store = {};
        }
        try {
            filePath=path.join(__dirname, 'boolean_dump.json');
            if(fs.existsSync(filePath)){
                this.#boolean_store = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                // console.log('Boolean data loaded successfully');
            }
        } catch (err) {
            // console.error('Error in reading Boolean dump');
            this.#boolean_store = {};
        }
        try {
            filePath=path.join(__dirname, 'number_dump.json');
            if(fs.existsSync(filePath)){
                this.#number_store = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                // console.log('Number data loaded successfully');
            }
        } catch (err) {
            // console.error('Error in reading Number dump');
            this.#number_store = {};
        }
        try {
            filePath=path.join(__dirname, 'object_dump.json');
            if(fs.existsSync(filePath)){
                this.#object_store = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                // console.log('Object data loaded successfully');
            }
        } catch (err) {
            // console.error('Error in reading Object dump');
            this.#object_store = {};
        }
    }

    dump() {
        let filePath;
        try {
            filePath=path.join(__dirname, 'string_dump.json');
            fs.writeFileSync(filePath, JSON.stringify(this.#string_store, null, 2), 'utf8');
            console.log('String dump written successfully');
        } catch (err) {
            // console.error('Error in writing data:', err);
        }
        try {
            filePath=path.join(__dirname, 'boolean_dump.json');
            fs.writeFileSync(filePath, JSON.stringify(this.#boolean_store, null, 2), 'utf8');
            console.log('Boolean dump written successfully');
        } catch (err) {
            // console.error('Error in writing data:', err);
        }
        try {
            filePath=path.join(__dirname, 'number_dump.json');
            fs.writeFileSync(filePath, JSON.stringify(this.#number_store, null, 2), 'utf8');
            console.log('Number dump written successfully');
        } catch (err) {
            // console.error('Error in writing data:', err);
        }
        try {
            filePath=path.join(__dirname, 'object_dump.json');
            fs.writeFileSync(filePath, JSON.stringify(this.#object_store, null, 2), 'utf8');
            console.log('Object dump written successfully');
        } catch (err) {
            // console.error('Error in writing data:', err);
        }
    }
}
