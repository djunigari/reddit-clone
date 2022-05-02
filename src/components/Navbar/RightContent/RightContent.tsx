import { Button, Flex } from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import React from 'react'
import { auth } from '../../../firebase/clientApp'
import AuthModal from '../../Modal/Auth/AuthModal'
import AuthButtons from './AuthButtons'

interface RightContentProps {
    user: any
}
function RightContent({ user }: RightContentProps) {
    return (
        <>
            <AuthModal />
            <Flex justify='center' align='center'>
                {user ? (
                    <>
                        <Button onClick={() => signOut(auth)}>Logout</Button>
                    </>
                ) : (
                    <AuthButtons />
                )}
            </Flex>
        </>
    )
}

export default RightContent