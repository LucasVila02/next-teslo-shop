import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';



const PageCategoryWomen: NextPage = () => {


   const {products, isError, isLoading} = useProducts('/products?gender=women')

  return (
    <ShopLayout title={'Teslo-Shop - Mujeres'} pageDescription={'Encuentra los mejores productos de Teslo para Mujeres'}>
        <Typography variant='h1' component='h1'>Mujeres</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

        {isLoading
          ? <FullScreenLoading/>
          : <ProductList products={products}/>
          }

     

    </ShopLayout>
  )
  
}

export default PageCategoryWomen
