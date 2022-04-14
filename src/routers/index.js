
import {Equipment} from "../component/equipment";
import {EdgeOrder} from "../component/edgeOrder";

export const router = [
    {
        path:'/equipment',
        name:'设备',
        item:true,
        component:<Equipment/>
    },
    {
        path:'/edgeOrder',
        name:'订单',
        item:true,
        component:<EdgeOrder/>
    },
]
