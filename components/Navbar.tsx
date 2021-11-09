import { Button, Center, Flex, Heading, HStack, Link, Spacer, Stack, Text } from '@chakra-ui/react';
import React from 'react';

import { useEthereum } from '@providers/EthereumProvider';

import { Etherscan, Logo, Opensea, Twitter } from '@components/Icons';

import { NETWORK } from '@utils/constants';

export const etherscanNetworkString = NETWORK.toLowerCase() == 'ethereum' ? '' : `${NETWORK}.`;

function Navbar(props) {
    const { userName, openWeb3Modal } = useEthereum();

    return (
        <Flex width="100%" bgColor="transparent" boxShadow="md">
            <Stack
                direction={['column', 'column', 'row', 'row']}
                as="nav"
                width="100%"
                margin="auto"
                justify="center"
                align="center"
                p={4}
                {...props}>
                <HStack align="center" spacing={2} pr={2}>
                    <Logo boxSize={10} />
                    <Heading as="h1" fontSize="34px">
                        Birthblock
                    </Heading>
                </HStack>
                <Spacer />
                <HStack align="center" spacing={[4, 4, 5, 6]}>
                    <Twitter />
                    <Opensea />
                    <Etherscan />
                    {userName ? (
                        <Center as="h1" fontSize="32px" fontWeight="light">
                            {userName}
                        </Center>
                    ) : (
                        <Button
                            onClick={openWeb3Modal}
                            fontWeight="normal"
                            colorScheme="teal"
                            bg="teal.700"
                            size="lg"
                            boxShadow="lg"
                            fontSize="2xl"
                            borderRadius="full">
                            Connect
                        </Button>
                    )}
                </HStack>
            </Stack>
        </Flex>
    );
}

export default Navbar;
