
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';


import {  Box, Card, CardContent, Divider, Grid, Typography, Chip, CircularProgress } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';



import { CartList, OrderSummary } from '../../../components/cart';

import {  dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';
import { AdminLayout } from '../../../components/layouts';


interface Props{
    order: IOrder
}

const OrderPage: NextPage<Props> = ({order}) => {

    const router = useRouter()

    const {shippingAddress} = order

  
  return (
    <AdminLayout title='Resumen de la orden' subTitle={`OrdenId: ${order._id}`}>
       

        {
            order.isPaid
            ?(
                <Chip 
            sx={{ my: 2 }}
            label="Orden ya fue pagada"
            variant='outlined'
            color="success"
            icon={ <CreditScoreOutlined /> }
        />
            ):(
                <Chip 
                   sx={{ my: 2 }}
                   label="Pendiente de pago"
                   variant='outlined'
                   color="error"
                   icon={ <CreditCardOffOutlined /> }
               /> 

            )
         }

        <Grid container className='fadeIn'>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList  products={order.orderItems}/>
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'Productos' : 'Producto'})</Typography>
                        <Divider sx={{ my:1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                        </Box>

                        
                        <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                        <Typography>{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}`: '' }</Typography>
                        <Typography>{shippingAddress.city}, {shippingAddress.zip}</Typography>
                        <Typography>{shippingAddress.country}</Typography>
                        <Typography>{shippingAddress.phone}</Typography>

                        <Divider sx={{ my:1 }} />

                        <OrderSummary orderValues={
                           { numberOfItems: order.numberOfItems,
                            subTotal: order.subTotal,
                            total: order.total,
                            tax: order.tax,}
                        } />

                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>


                           

                            <Box flexDirection='column' display='flex'>
                                {
                                    order.isPaid 
                                    ? (
                                        <Chip 
                                            sx={{ my: 1 }}
                                            label="Orden ya fue pagada"
                                            variant='outlined'
                                            color="success"
                                            icon={ <CreditScoreOutlined /> }
                                        />

                                    ):(
                                        <Chip 
                                            sx={{ my: 1 }}
                                            label="Orden Pendiente"
                                            variant='outlined'
                                            color="error"
                                            icon={ <CreditCardOffOutlined /> }
                                        />
                                    )

                                }
                            </Box>
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>


    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query}) => {
    
    const {id = ''} = query


    const  order = await dbOrders.getOrderById(id.toString())

    if(!order){
        return{
            redirect:{
                destination: '/admin/orders',
                permanent: false
            }
        }
    }


    return {
        props: {
            order
        }
    }
}


export default OrderPage;