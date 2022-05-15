import { doc, getDoc } from "firebase/firestore"
import { GetServerSidePropsContext } from "next"
import { Community, communityState } from "../../../atoms/communitiesAtom"
import { firestore } from "../../../firebase/clientApp"
import safeJsonStringify from 'safe-json-stringify'
import CommunityNotFound from "../../../components/Community/NotFound"
import Header from "../../../components/Community/Header"
import PageContent from "../../../components/Layout/PageContent"
import CreatePostLink from "../../../components/Community/CreatePostLink"
import Posts from "../../../components/Posts/Posts"
import { useEffect } from "react"
import { useSetRecoilState } from "recoil"
import About from "../../../components/Community/About"

interface CommunityPageProps {
    communityData: Community

}

function CommunityPage({ communityData }: CommunityPageProps) {
    const setCommunityStateValue = useSetRecoilState(communityState)

    if (!communityData) {
        return <CommunityNotFound />
    }

    useEffect(() => {
        setCommunityStateValue(prev => ({
            ...prev,
            currentCommunity: communityData
        }))
    }, [communityData])

    return (
        <>
            <Header communityData={communityData} />
            <PageContent>
                <>
                    <CreatePostLink />
                    <Posts communityData={communityData} />
                </>
                <>
                    <About communityData={communityData} />
                </>
            </PageContent>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    //get community data and pass it to client
    try {
        const communityDocRef = doc(firestore, 'communities', context.query.communityId as string)
        const communityDoc = await getDoc(communityDocRef)

        return {
            props: {
                communityData: communityDoc.exists() ?
                    JSON.parse(
                        safeJsonStringify(
                            {
                                id: communityDoc.id,
                                ...communityDoc.data()
                            })
                    ) : ''
            }
        }
    } catch (error) {
        console.log('getServerSideProps error', error)
    }
}

export default CommunityPage