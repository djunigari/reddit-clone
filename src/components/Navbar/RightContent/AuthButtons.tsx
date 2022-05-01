import { Button } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { authModalState } from '../../../atoms/authModal'

function AuthButtons() {
    const setAuthModalState = useSetRecoilState(authModalState)
    return (
        <>
            <Button
                variant='outline'
                height='28px'
                display={{ base: 'none', sm: 'flex' }}
                width={{ base: '70px', md: '110px' }}
                mr={2}
                onClick={() => setAuthModalState({ open: true, view: 'login' })}
            >
                Log In
            </Button>
            <Button
                height='28px'
                display={{ base: 'none', sm: 'flex' }}
                width={{ base: '70px', md: '110px' }}
                mr={2}
                onClick={() => setAuthModalState({ open: true, view: 'signup' })}
            >
                Sing Up
            </Button>
        </>
    )
}

export default AuthButtons