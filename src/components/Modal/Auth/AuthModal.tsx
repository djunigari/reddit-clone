import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Text } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import { authModalState } from '../../../atoms/authModal'
import { auth } from '../../../firebase/clientApp'
import AuthInputs from './AuthInputs'
import OAuthButtons from './OAuthButtons'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect } from 'react'

function AuthModal() {
    const [modalState, setModalState] = useRecoilState(authModalState)
    const [user, loading, error] = useAuthState(auth);

    const handleClose = () => {
        setModalState((prev) => ({
            ...prev,
            open: false
        }))
    }

    useEffect(() => {
        if (user) handleClose()
        console.log('user', user)
    }, [user])
    return (
        <>
            <Modal isOpen={modalState.open} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign='center'>
                        {modalState.view === 'login' && 'Login'}
                        {modalState.view === 'signup' && 'Sign Up'}
                        {modalState.view === 'resetPassword' && 'Reset Password'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                        <Flex
                            direction='column'
                            align='center'
                            justify='center'
                            width='70%'
                            pb={6}
                        >
                            <OAuthButtons />
                            <Text color='gray.500' fontWeight={700}>
                                OR
                            </Text>
                            <AuthInputs />
                            {/* <ResetPassword /> */}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AuthModal