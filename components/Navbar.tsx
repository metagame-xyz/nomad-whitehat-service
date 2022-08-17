import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Link,
    Spacer,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

import { useEthereum } from '@providers/EthereumProvider';

import { Etherscan, Logo, Opensea, Twitter } from '@components/Icons';

import { copy } from '@utils/content';

import CustomConnectButton from './ConnectButton';

function Navbar(props) {
    const { userName, openWeb3Modal, avatarUrl } = useEthereum();

    const showName = useBreakpointValue({ base: false, md: true });

    return (
        <Flex width="100%" bgColor="rgba(0, 0, 0, 0)" boxShadow="md">
            <HStack
                as="nav"
                width="100%"
                margin="auto"
                justify="space-between"
                align="center"
                p={4}
                {...props}>
                <HStack align="center" spacing={2} pr={[0, 2]}>
                    {showName && (
                        <Text color="white" fontSize="xl" as="u">
                            <Link href="https://themetagame.xyz" target="_blank">
                                Built by Metagame
                            </Link>
                        </Text>
                    )}
                </HStack>
                <HStack align="center" spacing={5} justify="flex-end">
                    <Opensea />
                    <Etherscan />

                    <CustomConnectButton isNavbar />
                </HStack>
            </HStack>
        </Flex>
    );
}

export default Navbar;
