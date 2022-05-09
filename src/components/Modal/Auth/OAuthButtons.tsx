import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { User } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../../../firebase/clientApp';

function OAuthButtons() {
    const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth);

    //Copy the logic of firebase functions 
    const createUserDocument = async (user: User) => {
        const userDocRef = doc(firestore, 'users')
        await setDoc(userDocRef, JSON.parse(JSON.stringify(user)))
    }
    //Copy the logic of firebase functions 
    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user)
        }
    }, [userCred])

    return (
        <Flex direction='column' width='100%' mb={4}>
            <Button
                variant='oauth'
                mb={2}
                isLoading={loading}
                onClick={() => signInWithGoogle()}
            >
                <Image src='/images/googlelogo.png' height='20px' mr={4} />
                Continue with Google
            </Button>
            <Button variant='oauth'>
                Some Other Provider
            </Button>
            {error && (<Text>{error.message}</Text>)}
        </Flex>
    )
}

export default OAuthButtons