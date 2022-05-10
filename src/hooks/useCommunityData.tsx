import { useEffect, useState } from "react"
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil"
import { Community, CommunitySnippet, communityState } from "../atoms/communitiesAtom"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from "../firebase/clientApp"
import { collection, doc, getDocs, increment, writeBatch } from "firebase/firestore"
import { authModalState } from "../atoms/authModal"

function useCommunityData() {
    const [user] = useAuthState(auth)
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const setAuthModalState = useSetRecoilState(authModalState)

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
        //is the user signed in?
        //if not => open auth modal
        if (!user) {
            setAuthModalState({
                open: true,
                view: 'login'
            })
            return
        }

        if (isJoined) {
            leaveCommunity(communityData.id)
            return
        }
        joinCommunity(communityData)
    }

    const getMySnippets = async () => {
        setLoading(true)
        try {
            // get users snippets
            const snippetDocs = await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`))
            const snippets = snippetDocs.docs.map(doc => ({ ...doc.data() }))
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[]
            }))
        } catch (error: any) {
            console.log('getMySnippets error', error)
            setError(error.message)
        }
        setLoading(false)
    }

    const joinCommunity = async (communityData: Community) => {
        //batch write
        //creating a new community snippet
        //updating the numberOfMembers (+1)
        try {
            const batch = writeBatch(firestore)

            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageUrl: communityData.imageUrl || ''
            }

            batch.set(
                doc(
                    firestore,
                    `users/${user?.uid}/communitySnippets`,
                    communityData.id
                ),
                newSnippet
            )

            batch.update(doc(firestore, 'communities', communityData.id), {
                numberOfMembers: increment(1)
            })

            await batch.commit()

            //update recoil state - communityType.mySnippets
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet]
            }))
        } catch (error: any) {
            console.log('joinCommunity error', error)
            setError(error.message)
        }
        setLoading(false)
    }

    const leaveCommunity = async (communityId: string) => {
        //batch write
        //deleting a new community snippet
        //updating the numberOfMembers (-1)
        try {
            const batch = writeBatch(firestore)
            //deleting the community snippet from user
            batch.delete(
                doc(
                    firestore,
                    `users/${user?.uid}/communitySnippets`,
                    communityId
                )
            )

            batch.update(doc(firestore, 'communities', communityId), {
                numberOfMembers: increment(-1)
            })

            await batch.commit()

            //update recoil state - communityType.mySnippets
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: prev.mySnippets.filter(item => item.communityId !== communityId)
            }))

        } catch (error: any) {
            console.log('leaveCommunity', error)
            setError(error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (!user) return
        getMySnippets()
    }, [user])

    return {
        //data and functions
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading
    }
}

export default useCommunityData