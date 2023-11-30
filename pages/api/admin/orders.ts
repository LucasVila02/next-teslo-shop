import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Order } from '../../../models'
import { IOrder } from '../../../interfaces'

type Data =
| {message: string}
| IOrder[] 

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch( req.method ){
        case 'GET':
            return getOrdersByUser(req, res)
        default:
            return res.status(400).json({message: 'bad request'})
        }
    }
const getOrdersByUser = async(req: NextApiRequest, res: NextApiResponse<Data>) =>  {
    
    await db.connect();

    const orders = await Order.find()
        .sort({createAt: 'desc'})
        .lean()
        .populate('user', 'name email');

    await db.disconnect();

    return res.status(200).json(orders)
}

