
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number,
    paidOrders: number, // isPaid true
    numberOfProducts: number,
    numberOfClient: number,// role: client
    notPaidOrders: number,
    productsWithNoInventory: number, // 0
    losInventory: number, // productos con menos de 10 articulos
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

     await db.connect();


    // const numberOfOrders =  await Order.count()
    // const paidOrders = await Order.find({count()
    // const numberOfClient = await User.find({role: 'client'}).count()
    // const numberOfProducts = await Product.count()
    // const productsWithNoInventory = await Product.find({inStock: 0}).count()
    // const losInventory = await Product.find({inStock: {$lte: 10} }).count()

    const [
        numberOfOrders,
        paidOrders,
        numberOfClient,
        numberOfProducts,
        productsWithNoInventory,
        losInventory,
    ] = await Promise.all([
            await Order.count(),
            await Order.find({isPaid: true}).count(),
            await User.find({role: 'client'}).count(),
            await Product.count(),
            await Product.find({inStock: 0}).count(),
            await Product.find({inStock: {$lte: 10} }).count(),
    ])
    await db.disconnect()
     

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        numberOfClient,
        numberOfProducts,
        productsWithNoInventory,
        losInventory,
        notPaidOrders: numberOfOrders - paidOrders,
     })
}