

import { rejects } from 'assert'
import jwt from 'jsonwebtoken'
import { resolve } from 'path'

export const signToken = (_id: string, email: string) => {
    if( !process.env.JWT_SECRET_SEED){
        throw new Error('No hay semilla de JWT - Revisar variable de entorno')
    }

    return jwt.sign(
        //payload
        {_id, email},
        //seed
        process.env.JWT_SECRET_SEED,

        //opciones
        {expiresIn: '30d'}
        )
}


export const isValidToken = (token: string):Promise<string> => {
    if( !process.env.JWT_SECRET_SEED){
        throw new Error('No hay semilla de JWT - Revisar variable de entorno')
    }

    if(token.length <= 10) {
        return Promise.reject('JWT no es válido')
    }

    return new Promise(( resolve, rejects) =>{
        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (error, payload)=>{
                if(error) return rejects('JWT no es válido');

                const { _id } = payload as { _id: string};
                
                resolve(_id)
            })
        } catch (error) {
            rejects('JWT no es válido');
        }
    } )
}