import React, {useEffect, useState} from 'react'
import { userProps } from '../components/user'
import { useGet } from '../services/get.service'

export const UserContext = React.createContext({} as userProps | undefined)
export const UserContextProvider = (props:any) => {
    const [users, setUsers] = useState<userProps[]>()
    const [activeUser, setactiveUser] = useState<userProps>()
    
    let data = useGet('users')

    !data.loading && setUsers(data.data)

    useEffect(() => {
        users && users.forEach( el => {
            el.signedIn && setactiveUser(el)
        })
    },[users])

    console.log(users);
    
    return (
        <>
            {users && (
                <UserContext.Provider value={activeUser}>{props.children}</UserContext.Provider>
            )}
        </>
    )
}