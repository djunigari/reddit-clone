import { Button, Flex, Input, Text } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import { authModalState } from '../../../atoms/authModal'
import { auth, firestore } from '../../../firebase/clientApp'
import { FIREBASE_ERRORS } from '../../../firebase/errors'

function SignUp() {
    const setAuthModalState = useSetRecoilState(authModalState)
    const [signUpForm, setSignUpForm] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
    ] = useCreateUserWithEmailAndPassword(auth);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (error) setError('')
        if (signUpForm.password !== signUpForm.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password)
    }
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSignUpForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }
    //Copy the logic of firebase functions 
    const createUserDocument = async (user: User) => {
        await addDoc(collection(firestore, 'users'), JSON.parse(JSON.stringify(user)))
    }
    //Copy the logic of firebase functions 
    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user)
        }
    }, [userCred])

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
            <Input
                required
                name='confirmPassword'
                placeholder='confirm password'
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
            {(error || userError) && (
                <Text textAlign='center' color='red' fontSize='10pt'>
                    {error || (FIREBASE_ERRORS[userError?.code as keyof typeof FIREBASE_ERRORS] || userError?.code)}
                </Text>
            )}
            <Button width='100%' height='36px' mt={2} mb={2} type='submit' isLoading={loading}>
                Sign Up
            </Button>
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr={2}>Already a redditor?</Text>
                <Text
                    color='blue.500'
                    fontWeight={700}
                    cursor='pointer'
                    onClick={() => setAuthModalState(prev => ({
                        ...prev,
                        view: 'login'
                    }))}
                >
                    LOG IN
                </Text>
            </Flex>
        </form>
    )
}

export default SignUp