import { Button, Flex, Input, Text } from '@chakra-ui/react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { authModalState } from '../../../atoms/authModal'
import { auth } from '../../../firebase/clientApp'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { FIREBASE_ERRORS } from '../../../firebase/errors'

function Login() {
    const setAuthModalState = useSetRecoilState(authModalState)
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        signInWithEmailAndPassword(loginForm.email, loginForm.password)
    }
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }
    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name='email'
                placeholder='email'
                type='email'
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                bg='gray.50'
            />
            <Input
                required
                name='password'
                placeholder='password'
                type='password'
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                bg='gray.50'
            />
            {error && (
                <Text textAlign='center' color='red' fontSize='10pt'>
                    {FIREBASE_ERRORS[error?.code as keyof typeof FIREBASE_ERRORS]}
                </Text>
            )}
            <Button
                width='100%'
                height='36px'
                mt={2} mb={2}
                type='submit'
                isLoading={loading}
            >
                Log In
            </Button>
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr={2}>New here?</Text>
                <Text
                    color='blue.500'
                    fontWeight={700}
                    cursor='pointer'
                    onClick={() => setAuthModalState(prev => ({
                        ...prev,
                        view: 'signup'
                    }))}
                >
                    SIGN UP
                </Text>
            </Flex>
        </form>
    )
}

export default Login