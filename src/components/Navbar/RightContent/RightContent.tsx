import { Flex } from '@chakra-ui/react'
import React from 'react'
import AuthModal from '../../Modal/Auth/AuthModal'
import AuthButtons from './AuthButtons'

function RightContent() {
    return (
        <>
            <AuthModal />
            <Flex justify='center' align='center'>
                <AuthButtons />
            </Flex>
        </>
    )
}

export default RightContent