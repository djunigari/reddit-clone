import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Icon, Image, Menu, MenuButton, MenuList, Text } from '@chakra-ui/react'
import { TiHome } from 'react-icons/ti'
import useDirectory from '../../../hooks/useDirectory'
import Communities from './Communities'

function Directory() {
    const { directoryState, toogleMenuOpen } = useDirectory()
    return (
        <Menu isOpen={directoryState.isOpen}>
            <MenuButton
                cursor='pointer'
                padding='0px 6px'
                borderRadius={4}
                mr={2}
                ml={{ base: 0, md: 2 }}
                _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
                onClick={toogleMenuOpen}
            >
                <Flex align='center' justify='space-between' width={{ base: 'auto', lg: '200px' }}>
                    <Flex align='center'>
                        {directoryState.selectedMenuItem.imageUrl ? (
                            <Image
                                src={directoryState.selectedMenuItem.imageUrl}
                                borderRadius='full'
                                boxSize='24px'
                                mr={2}
                            />
                        ) : (
                            <Icon fontSize={24} mr={{ base: 1, md: 2 }} as={directoryState.selectedMenuItem.icon} />
                        )}
                        <Flex display={{ base: 'none', lg: 'flex' }}>
                            <Text fontSize='10pt' fontWeight={600}>
                                {directoryState.selectedMenuItem.displayText}
                            </Text>
                        </Flex>
                    </Flex>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList>
                <Communities />
            </MenuList>
        </Menu >
    )
}

export default Directory