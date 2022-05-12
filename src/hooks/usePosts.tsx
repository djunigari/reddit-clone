import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Post, postState, PostVote } from '../atoms/postsAtom'
import { auth, firestore, storage } from '../firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { MouseEvent, useEffect } from 'react'
import { communityState } from '../atoms/communitiesAtom'
import { authModalState } from '../atoms/authModal'
import { useRouter } from 'next/router'

function usePosts() {
    const router = useRouter()
    const [user] = useAuthState(auth)
    const [postStateValue, setPostStateValue] = useRecoilState(postState)
    const currentCommunity = useRecoilValue(communityState).currentCommunity
    const setAuthModelState = useSetRecoilState(authModalState)

    const onVote = async (event: MouseEvent<SVGAElement, MouseEvent>, post: Post, vote: number, communityId: string) => {
        event.stopPropagation()

        // Check for user = if not, open auth model
        if (!user?.uid) {
            setAuthModelState({ open: true, view: 'login' })
            return
        }

        try {
            const { voteStatus } = post
            const existingVote = postStateValue.postVotes.find(vote => vote.postId === post.id)

            const batch = writeBatch(firestore)
            const updatePost = { ...post }
            const updatePosts = [...postStateValue.posts]
            let updatePostsVotes = [...postStateValue.postVotes]
            let voteChange = vote

            //New Vote
            if (!existingVote) {
                // Create a new postVote document
                const postVoteRef = doc(
                    collection(
                        firestore,
                        'users',
                        `${user?.uid}/postVotes`
                    )
                )
                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id!,
                    communityId,
                    voteValue: vote // 1 or -1
                }

                batch.set(postVoteRef, newVote)

                // Add/Subtract 1 to/from post.voteStatus
                updatePost.voteStatus = voteStatus + vote
                updatePostsVotes = [...updatePostsVotes, newVote]

                //Existing vote - they have voted on the post before
            } else {
                const postVoteRef = doc(firestore, `users`, `${user?.uid}/postVotes/${existingVote.id}`)

                //Removing their vote (up => neutral OR down => neutral)
                if (existingVote.voteValue === vote) {
                    // Add/Subtract 1 to/from post.voteStatus
                    updatePost.voteStatus = voteStatus - vote
                    updatePostsVotes = updatePostsVotes.filter(vote => vote.id !== existingVote.id)

                    // Delete the postVote document
                    batch.delete(postVoteRef)

                    voteChange *= -1
                    //Flipping their vote (up => down OR down => up)
                } else {
                    // add/Subtract 2 to/from post.voteStatus
                    updatePost.voteStatus = voteStatus + 2 * vote

                    const voteIdx = postStateValue.postVotes.findIndex(vote => vote.id === existingVote.id)
                    updatePostsVotes[voteIdx] = {
                        ...existingVote,
                        voteValue: vote
                    }
                    // updating the existing postVote document
                    batch.update(postVoteRef, {
                        voteValue: vote
                    })
                    voteChange = 2 * vote
                }
            }

            //update state with updated values
            const postIdx = postStateValue.posts.findIndex(item => item.id === post.id)
            updatePosts[postIdx] = updatePost
            setPostStateValue(prev => ({
                ...prev,
                posts: updatePosts,
                postVotes: updatePostsVotes,
            }))

            if (postStateValue.selectedPost) {
                setPostStateValue(prev => ({
                    ...prev,
                    selectedPost: updatePost
                }))
            }

            // update or post document
            const postRef = doc(firestore, 'posts', post.id!)
            batch.update(postRef, {
                voteStatus: voteStatus + voteChange
            })

            await batch.commit()
        } catch (error: any) {
            console.log('onVote error', error.message)
        }
    }

    const onSelectPost = (post: Post) => {
        setPostStateValue(prev => ({
            ...prev,
            selectedPost: post
        }))
        router.push(`/r/${post.communityId}/comments/${post.id}`)
    }

    const onDeletePost = async (post: Post): Promise<boolean> => {
        try {
            //Check if image, delete if exists
            if (post.imageUrl) {
                const imageRef = ref(storage, `posts/${post.id}/image`)
                await deleteObject(imageRef)
            }
            //Delete post document from firestore
            const postDocRef = doc(firestore, 'posts', post.id!)
            await deleteDoc(postDocRef)

            //update recoil state
            setPostStateValue(prev => ({
                ...prev,
                posts: prev.posts.filter(item => item.id !== post.id)
            }))
            return true
        } catch (error) {
            return false
        }
    }

    const getCommunityVotes = async (communityId: string) => {
        const postVotesQuery = query(
            collection(firestore, 'users', `${user?.uid}/postVotes`),
            where('communityId', '==', communityId)
        )

        const postVoteDocs = await getDocs(postVotesQuery)
        const postVotes = postVoteDocs.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        setPostStateValue(prev => ({
            ...prev,
            postVotes: postVotes as PostVote[]
        }))
    }

    useEffect(() => {
        if (!user || !currentCommunity?.id) return
        getCommunityVotes(currentCommunity?.id)
    }, [currentCommunity, user])


    useEffect(() => {
        if (!user) {
            //clear user post votes
            setPostStateValue(prev => ({
                ...prev,
                postVotes: []
            }))
        }
    }, [user])
    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    }
}

export default usePosts