import React from 'react'
import { AdminLayout } from '../../components/layouts'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material'
import { Box, Button, CardMedia, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IProduct} from '../../interfaces';
import NextLink from 'next/link';

const columns:GridColDef[] = [
    {
        field: 'img', 
        headerName: 'Foto',
        renderCell:({ row }:GridRenderCellParams) => {
            return (
                <a href={` /product/${ row.slug }`} target='_blank' rel='noreferrer' >
                    <CardMedia
                        component='img'
                        className='fadeIn'
                        image={ row.img}
                    />
                </a>
            )
        }
    },
    {
        field: 'title', 
        headerName: 'Title', 
        width: 200,
        renderCell: ({row}:GridRenderCellParams ) =>{
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref color='#fffff'>
                    <Link underline='always'>
                        {row.title}
                    
                    </Link>
                </NextLink>
            )
        }
    
    },
    {field: 'gender', headerName: 'Gender', width: 200},
    {field: 'type', headerName: 'Tipo', width: 200},
    {field: 'inStock', headerName: 'Inventario', width: 200},
    {field: 'price', headerName: 'Precio', width: 200},
    {field: 'sizes', headerName: 'Tallas', width: 200},
];


const ProductsPage = () => {
    

    const {data, error} = useSWR<IProduct[]>('/api/admin/products')

    if(!data && !error) return (<></>);

    const rows = data!.map( product => ({
        id: product._id,
        img: product.images[0] ,
        title: product.title ,
        gender: product.gender ,
        type: product.type ,
        inStock: product.inStock ,
        price: product.price ,
        sizes: product.sizes.join(', ') ,
        slug: product.slug ,
    }));

  return (
    <AdminLayout 
        title={`Productos (${data?.length})`} 
        subTitle={'Mantenimientos de productos'}
        icon={<CategoryOutlined/>}
    >

        <Box display='flex' justifyContent='end' sx={{mb: 2}}>
            <Button
                startIcon={<AddOutlined/>}
                color='secondary'
                href='/admin/products/new'
            >
                Crear Producto
            </Button>

        </Box>

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

export default ProductsPage