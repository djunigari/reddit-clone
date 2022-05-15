import { useRouter } from "next/router"
import { useEffect } from "react"
import { FaReddit } from "react-icons/fa"
import { useRecoilState, useRecoilValue } from "recoil"
import { communityState } from "../atoms/communitiesAtom"
import { DirectoryMenuItem, directoryMenuState } from "../atoms/directoryMenuIAtom"

function useDirectory() {
    const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState)
    const communityStateValue = useRecoilValue(communityState)

    const router = useRouter()

    const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
        setDirectoryState(prev => ({
            ...prev,
            selectedMenuItem: menuItem
        }))
        router.push(menuItem.link)
        if (directoryState.isOpen) {
            toogleMenuOpen()
        }
    }

    const toogleMenuOpen = () => {
        setDirectoryState(prev => ({
            ...prev,
            isOpen: !directoryState.isOpen
        }))
    }

    useEffect(() => {
        const { currentCommunity } = communityStateValue

        if (currentCommunity) {
            setDirectoryState(prev => ({
                ...prev,

                selectedMenuItem: {
                    displayText: `r/${currentCommunity.id}`,
                    link: `/r/${currentCommunity.id}`,
                    imageUrl: currentCommunity.imageUrl,
                    icon: FaReddit,
                    iconColor: 'blue.500'
                }
            }))
        }

    }, [communityStateValue.currentCommunity])

    return {
        directoryState, toogleMenuOpen, onSelectMenuItem
    }
}

export default useDirectory