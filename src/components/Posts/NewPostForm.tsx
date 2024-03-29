import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex, Icon, Text } from '@chakra-ui/react'
import { BiPoll } from 'react-icons/bi'
import { BsLink45Deg, BsMic } from 'react-icons/bs'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5'
import { AiFillCloseCircle } from 'react-icons/ai'
import TabItem from './TabItem'
import { ChangeEvent, useState } from 'react'
import TextInput from './PostForm/TextInput'
import ImageUpload from './PostForm/ImageUpload'
import { Post } from '../../atoms/postsAtom'
import { User } from 'firebase/auth'
import { useRouter } from 'next/router'
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import { firestore, storage } from '../../firebase/clientApp'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import useSelectFile from '../../hooks/useSelectFile'

interface NewPostFormProps {
    user: User
    communityImageUrl?: string
}

const formTabs: TabItem[] = [
    {
        title: 'Post',
        icon: IoDocumentText
    },
    {
        title: 'Images & Video',
        icon: IoImageOutline
    },
    {
        title: 'Link',
        icon: BsLink45Deg
    },
    {
        title: 'Poll',
        icon: BiPoll
    },
    {
        title: 'Talk',
        icon: BsMic
    }
]

export type TabItem = {
    title: string
    icon: typeof Icon.arguments
}

function NewPostForm({ user, communityImageUrl }: NewPostFormProps) {
    const router = useRouter()
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
    const [textInputs, setTextInputs] = useState({
        title: '',
        body: ''
    })
    const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleCreatePost = async () => {
        const { communityId } = router.query
        // create new post object => type Post
        const newPost: Post = {
            communityId: communityId as string,
            communityImageUrl: communityImageUrl || '',
            creatorId: user?.uid,
            creatorDisplayName: user.email!.split('@')[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            createAt: serverTimestamp() as Timestamp
        }

        setLoading(true)
        try {
            //store the post in db
            const postDocRef = await addDoc(collection(firestore, 'posts'), newPost)

            //check for selectedFile
            if (selectedFile) {
                //store in storage => getDownloadUrl ( return imageUrl)
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
                await uploadString(imageRef, selectedFile, 'data_url')
                const downloadUrl = await getDownloadURL(imageRef)
                //update post doc by adding imageUrl
                await updateDoc(postDocRef, {
                    imageUrl: downloadUrl
                })
            }
            //redirect the user back to the communityPage using the router
            router.back()
        } catch (error: any) {
            console.log('handleCreatePost error', error.message)
            setError(true)
        }
        setLoading(false)
    }

    const onTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target: { name, value } } = event
        setTextInputs(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <Flex direction='column' bg='white' borderRadius={4} mt={2}>
            <Flex width='100'>
                {formTabs.map(item => (
                    <>
                        <TabItem
                            key={item.title}
                            item={item}
                            selected={item.title === selectedTab}
                            setSelectedTab={setSelectedTab}
                        />
                    </>
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab === 'Post' && (
                    <TextInput
                        textInputs={textInputs}
                        handleCreatePost={handleCreatePost}
                        onChange={onTextChange}
                        loading={loading}
                    />
                )}
                {selectedTab === 'Images & Video' && (
                    <ImageUpload
                        selectedFile={selectedFile}
                        onSelectImage={onSelectFile}
                        setSelectedTab={setSelectedTab}
                        setSelectedFile={setSelectedFile}
                    />
                )}
            </Flex>
            {error && (
                <Alert status='error'>
                    <AlertIcon />
                    <Text mr={2}>Error creating post</Text>
                </Alert>
            )}
        </Flex>
    )
}

export default NewPostForm