import React from 'react'
import { AdminLayout } from '../../components/layouts'
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Chip, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IOrder, IUser } from '../../interfaces';

const columns:GridColDef[] = [
    {field: 'id', headerName: 'Order ID', width: 250},
    {field: 'email', headerName: 'Correo', width: 200},
    {field: 'name', headerName: 'Nombre Completo', width: 200},
    {field: 'total', headerName: 'Monto Total', width: 200},
    {
        field: 'isPaid',
        headerName: 'Pagada',
        renderCell: ({ row }:GridRenderCellParams) => {
            return row.isPaid 
            ? (<Chip variant='outlined' label='Pagada' color='success'/>)
            : (<Chip variant='outlined' label='Pendiente' color='error'/>)
        }
    },
    {field: 'noProducts', headerName: 'No. Productos', align: 'center'},
    {
        field: 'check',
        headerName: 'Ver Orden',
        renderCell: ({ row }:GridRenderCellParams) => {
            return ( 
                <a href = { `/admin/orders/${row.id}`} target='_black'>
                  Ver Orden  
                </a>
            )
        }
    },
    {field: 'createdAt', headerName: 'Creada en', width: 300},

] 


const OrdersPage = () => {

    const {data, error} = useSWR<IOrder[]>('/api/admin/orders')

    if(!data && !error) return (<></>);

    const rows = data!.map( order => ({
        id: order._id,
        email: (order.user as IUser).email, 
        name: (order.user as IUser).name, 
        total: order.total, 
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt: order.createdAt
    }));

  return (
    <AdminLayout 
        title={'Ordenes'} 
        subTitle={'Mantenimiento de ordenes'}
        icon={<ConfirmationNumberOutlined/>}
    >
         <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    // initialState={{
                    //     pagination: { 
                    //       paginationModel: { pageSize: 5 } 
                    //     },
                    //   }}
                    //   pageSizeOptions={[5, 10, 25]}
                
                />
            </Grid>
        </Grid>

    </AdminLayout>
  )
}

export default OrdersPage