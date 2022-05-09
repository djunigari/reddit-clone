import { doc, getDoc } from "firebase/firestore"
import { GetServerSidePropsContext } from "next"
import { Community } from "../../../atoms/communitiesAtom"
import { firestore } from "../../../firebase/clientApp"
import safeJsonStringify from 'safe-json-stringify'

interface CommunityPageProps {
    communityData: Community

}

function CommunityPage({ communityData }: CommunityPageProps) {
    return (
        <div>Welcome to {communityData.id}</div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    //get community data and pass it to client
    try {
        const communityDocRef = doc(firestore, 'communities', context.query.communityId as string)
        const communityDoc = await getDoc(communityDocRef)
        return {
            props: {
                communityData: JSON.parse(safeJsonStringify(
                    {
                        id: communityDoc.id,
                        ...communityDoc.data()
                    }))
            }
        }
    } catch (error) {
        console.log('getServerSideProps error', error)
    }
}

export default CommunityPage