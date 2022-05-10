import { Flex, Icon } from '@chakra-ui/react'
import { BiPoll } from 'react-icons/bi'
import { BsLink45Deg, BsMic } from 'react-icons/bs'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5'
import { AiFillCloseCircle } from 'react-icons/ai'
import TabItem from './TabItem'
import { ChangeEvent, useState } from 'react'
import { async } from '@firebase/util'
import TextInput from './PostForm/TextInput'

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

function NewPostForm() {
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
    const [textInputs, setTextInputs] = useState({
        title: '',
        body: ''
    })
    const [selectedFile, setSelectedFile] = useState<string>()
    const [loading, setLoading] = useState(false)

    const handleCreatePost = async () => { }

    const onSelectImage = () => { }

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
                        <TabItem item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab} />
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

            </Flex>
        </Flex>
    )
}

export default NewPostForm