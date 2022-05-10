import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Community } from "../../atoms/communitiesAtom"
import { Post } from "../../atoms/postsAtom"
import { auth, firestore } from "../../firebase/clientApp"
import usePosts from "../../hooks/usePosts"
import PostItem from "./PostItem"
import { useAuthState } from 'react-firebase-hooks/auth'
import { Stack } from "@chakra-ui/react"
import PostLoader from "./PostLoader"

interface PostsProps {
    communityData: Community
}

function Posts({ communityData }: PostsProps) {
    const [user] = useAuthState(auth)
    const [loading, setLoading] = useState(false)
    const { postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost } = usePosts()

    const getPosts = async () => {
        try {
            setLoading(true)
            //get posts for this community
            const postsQuery = query(
                collection(firestore, 'posts'),
                where('communityId', '==', communityData.id),
                orderBy('createAt', 'desc')
            )

            const postDocs = await getDocs(postsQuery)

            //store in postState
            const posts = postDocs.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setPostStateValue(prev => (
                {
                    ...prev,
                    posts: posts as Post[]
                }
            ))
        } catch (error: any) {
            console.log('getPosts error', error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        getPosts()
    }, [])
    return (
        <>
            {loading ? (
                <PostLoader />
            ) : (
                <Stack>
                    {postStateValue.posts.map(item => (
                        <PostItem
                            key={item.id}
                            post={item}
                            userIsCreator={user?.uid === item.creatorId}
                            userVoteValue={undefined}
                            onVote={onVote}
                            onSelectPost={onSelectPost}
                            onDeletePost={onDeletePost}
                        />
                    ))}
                </Stack>
            )}
        </>
    )
}

export default Posts