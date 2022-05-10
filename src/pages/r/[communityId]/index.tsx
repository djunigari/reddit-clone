import { doc, getDoc } from "firebase/firestore"
import { GetServerSidePropsContext } from "next"
import { Community } from "../../../atoms/communitiesAtom"
import { firestore } from "../../../firebase/clientApp"
import safeJsonStringify from 'safe-json-stringify'
import CommunityNotFound from "../../../components/Community/NotFound"
import Header from "../../../components/Community/Header"
import PageContent from "../../../components/Layout/PageContent"
import CreatePostLink from "../../../components/Community/CreatePostLink"

interface CommunityPageProps {
    communityData: Community

}

function CommunityPage({ communityData }: CommunityPageProps) {
    if (!communityData) {
        return <CommunityNotFound />
    }
    return (
        <>
            <Header communityData={communityData} />
            <PageContent>
                <>
                    <CreatePostLink />
                </>
                <>
                    <div>RHS</div>
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