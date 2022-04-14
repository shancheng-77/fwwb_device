const baseUrl = '192.168.0.100:8082' ;

export const historyOrderUrl = 'http://' + baseUrl + '/tasks/history/clear';
export const sendErrorUrl = 'http://' + baseUrl + '/device/error';


const userId = Math.floor(Math.random()*10)
export const deviceWebSocket = 'ws://'+baseUrl+'/device/'+userId;
export const taskWebSocket = 'ws://'+baseUrl+'/task/'+userId;
export const noticeWebSocket = 'ws://'+baseUrl+'/notice/'+userId;

export const fetchPost = async (url,data) => {
    const response =  await fetch(url,{
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)
    })
    return await response.json()
}
export const fetchGet = async (url) => {
    const response =  await fetch(url)
    return await response.json()
}
