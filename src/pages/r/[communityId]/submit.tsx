import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import PageContent from '../../../components/Layout/PageContent'
import NewPostForm from '../../../components/Posts/NewPostForm'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../firebase/clientApp'
import { useRecoilValue } from 'recoil'
import { communityState } from '../../../atoms/communitiesAtom'
import About from '../../../components/Community/About'
import useCommunityData from '../../../hooks/useCommunityData'

function SubmitPage() {
    const [user] = useAuthState(auth)
    const { communityStateValue } = useCommunityData()

    return (
        <PageContent>
            <>
                <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
                    <Text>Create a post</Text>
                </Box>
                {user && <NewPostForm user={user} />}
            </>
            <>
                {communityStateValue.currentCommunity && (
                    <About communityData={communityStateValue.currentCommunity} />
                )}
            </>
        </PageContent>
    )
}

export default SubmitPage