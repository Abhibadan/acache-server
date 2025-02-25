import store from '../store/store';
const storeInstance = store.createStore();

/*
* this function is a helper function to handle 
* incoming WebSocket request and parse the JSON payload.
* It is the actual communicator between the store and clients.
*
* 
* If the JSON payload is valid then commincate with store instance
* based on instruction available in the request. After successful
* communication with the instance pass the response of the instance.
*/
const handleRequest = (data: string) => {
    let res: string;
    try {
        const parsedData = JSON.parse(data.trim());
        const { event, key, value, ttl } = parsedData;
        let num: number;

        if (key === undefined) {
            res = JSON.stringify('Error: Invalid input. Valid key is required.');
        } else {
            switch (event) {
                case 'sdel':
                    res = JSON.stringify(storeInstance.DELSTRING(key));
                    break;
                case 'ndel':
                    res = JSON.stringify(storeInstance.DELNUMBER(key));
                    break;
                case 'bdel':
                    res = JSON.stringify(storeInstance.DELBOOLEAN(key));
                    break;
                case 'odel':
                    res = JSON.stringify(storeInstance.DELOBJECT(key));
                    break;
                case 'sget':
                    res = JSON.stringify(storeInstance.GETSTRING(key));
                    break;
                case 'nget':
                    res = JSON.stringify(storeInstance.GETNUMBER(key));
                    break;
                case 'bget':
                    res = JSON.stringify(storeInstance.GETBOOLEAN(key));
                    break;
                case 'oget':
                    res = JSON.stringify(storeInstance.GETOBJECT(key));
                    break;
                case 'incr':
                    num = Number(value?.[0] ?? value);
                    res = JSON.stringify(!isNaN(num) ? storeInstance.INCRNUMBER(key, num) : storeInstance.INCRNUMBER(key, 1));
                    break;
                default:
                    if (value === undefined || value.length === 0) {
                        res = JSON.stringify('Error: Invalid input. Valid key and value are required.');
                    } else {
                        switch (event) {
                            case 'sset':
                                if (Array.isArray(value)) {
                                    storeInstance.ADDSTRING(key, value.join(' '), ttl);
                                } else {
                                    storeInstance.ADDSTRING(key, value, ttl);
                                }
                                res = JSON.stringify(1);
                                break;
                            case 'nset':
                                num = Number(value?.[0] ?? value);
                                res = !isNaN(num) ? (storeInstance.ADDNUMBER(key, num, ttl), JSON.stringify(1)) : JSON.stringify('Error: Invalid input. Value must be a valid number.');
                                break;
                            case 'bset':
                                num = Number(value?.[0] ?? value);
                                res = !isNaN(num) ? (storeInstance.ADDBOOLEAN(key, Boolean(num), ttl), JSON.stringify(1)) : JSON.stringify('Error: Invalid input. Value must be 1 for true or 0 for false.');
                                break;
                            case 'oset':
                                try {
                                    if (Array.isArray(value)) {
                                        storeInstance.ADDOBJECT(key, JSON.parse(value.join(' ')), ttl);
                                    } else {
                                        storeInstance.ADDOBJECT(key, value, ttl);
                                    }
                                    res = JSON.stringify(1);
                                } catch {
                                    res = JSON.stringify('Error: Invalid input. Value must be a valid JSON object. Use " " in place of \' \'.');
                                }
                                break;
                            case 'sttl':
                                let ttl_target = value?.[0];
                                num = Number(value?.[1]);
                                res = ttl_target && !isNaN(num) ? (storeInstance.SETTTL(key, ttl_target, num), JSON.stringify(1)) : JSON.stringify('Error: Invalid input. Valid key and TTL are required.');
                                break;
                            case 'gttl':
                                res = JSON.stringify(storeInstance.GETTTL(key, value?.[0]));
                                break;
                            case 'rmttl':
                                res = JSON.stringify(storeInstance.REMOVETTL(key, value?.[0]));
                                break;
                            default:
                                res = JSON.stringify(`Unknown command: ${event}`);
                                break;
                        }
                    }
                    break;
            }
        }
    } catch {
        // console.error('Error processing request:', data.toString());
        res = JSON.stringify('Error: Invalid JSON format.');
    }
    return res;
};

export default handleRequest;
export {
    storeInstance
}
