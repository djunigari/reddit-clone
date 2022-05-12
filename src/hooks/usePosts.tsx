import { collection, deleteDoc, doc, writeBatch } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useRecoilState } from 'recoil'
import { Post, postState, PostVote } from '../atoms/postsAtom'
import { auth, firestore, storage } from '../firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth'

function usePosts() {
    const [user] = useAuthState(auth)
    const [postStateValue, setPostStateValue] = useRecoilState(postState)

    const onVote = async (post: Post, vote: number, communityId: string) => {
        // Check for user = if not, open auth model
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

                    voteChange += -1
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
                }
            }
            // update or post document
            const postRef = doc(firestore, 'posts', post.id!)
            batch.update(postRef, {
                voteStatus: vote + voteChange
            })

            await batch.commit()
            //update state with updated values
            const postIdx = postStateValue.posts.findIndex(item => item.id === post.id)
            updatePosts[postIdx] = updatePost
            setPostStateValue(prev => ({
                ...prev,
                posts: updatePosts,
                postVotes: updatePostsVotes,
            }))
        } catch (error: any) {
            console.log('onVote error', error.message)
        }
    }

    const onSelectPost = () => { }

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

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    }
}

export default usePosts