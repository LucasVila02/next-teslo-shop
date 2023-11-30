
import { useEffect, useState } from 'react'
import { PeopleOutline } from '@mui/icons-material'
import { Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useSWR from 'swr'

import { AdminLayout } from '../../components/layouts'

import { IUser } from '../../interfaces'
import { tesloApi } from '../../api'




const UsersPage = () => {

    const {data, error} = useSWR<IUser[]>('/api/admin/users');

    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
      if( data ) {
        setUsers(data);
      }
    }, [data])
    

    if(!data && !error) return <></>

    const onRoleUpdate = async (userId: string, newRole: string ) => {

        const previosUsers = users.map( user => ({...user}))
        
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }))

        setUsers( updatedUsers )
        try {
            await tesloApi.put( '/admin/users', {userId, role: newRole} );

        } catch (error) {
            setUsers(previosUsers)
            alert('No se pudo actualizar el role del usuario')
        }
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250},
        { field: 'name', headerName: 'Nombre Completo', width:300},
        { 
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ( {row }: GridRenderCellParams ) => {
                return ( 
                    <Select
                        value={row.role}
                        label='Rol'
                        sx={{width: '300px'}}
                        onChange={ ({target}) => onRoleUpdate(row.id, target.value)}
                    >
                        <MenuItem value='admin'> Admin </MenuItem> 
                        <MenuItem value='client'> Client </MenuItem> 
                        
                    </Select>
                )
            }
        },
    ];
    const rows = users.map( user => ({
       id: user._id,
       email: user.email,
       name: user.name,
       role: user.role
    }))
    

    return (
    <AdminLayout title={'Usuarios'} subTitle={'Mantenimiento Usuarios'} icon={<PeopleOutline/>}>

        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    pageSize={10}
                    rowsPerPageOptions={[10]}   
                    // initialState={{
                    // pagination: { 
                    //     paginationModel: { pageSize: 5 } 
                    // },
                    // }}
                    // pageSizeOptions={[5, 10, 25]}
                
                />
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default UsersPage