import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Link,
    SimpleGrid,
    Text,
    useBreakpointValue,
    VStack,
} from '@chakra-ui/react';
import { datadogRum } from '@datadog/browser-rum';
import { parseEther } from '@ethersproject/units';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import { getGPUTier } from 'detect-gpu';
import { BigNumber, Contract, ethers } from 'ethers';
import { AddressZ } from 'evm-translator/lib/interfaces/utils';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import nomadWhitehatAbi from 'utils/nomadWhitehatAbi';
import { useAccount, useEnsName, useNetwork, useProvider, useSigner } from 'wagmi';

import { useEthereum, wrongNetworkToast } from '@providers/EthereumProvider';

import CustomConnectButton from '@components/ConnectButton';
import { maxW } from '@components/Layout';
import MintButton, { MintStatus } from '@components/MintButton';

import { ioredisClient } from '@utils';
import {
    blackholeAddress,
    CONTRACT_ADDRESS,
    METABOT_BASE_API_URL,
    networkStrings,
    WEBSITE_URL,
} from '@utils/constants';
import { copy } from '@utils/content';
import { debug, event } from '@utils/frontend';
import { Metadata } from '@utils/metadata';
import { getParametersFromTxnCounts } from '@utils/parameters';

import heartbeat from '../heartbeat.json';

export const getServerSideProps = async () => {
    const metadata = await ioredisClient.hget('2', 'metadata');
    return {
        props: {
            metadata: JSON.parse(metadata),
        },
    };
};

function About({ heading, text }) {
    return (
        <VStack maxW={['sm', 'md', 'md', 'full']}>
            <Heading as="h2" fontSize="24px">
                {heading}
            </Heading>
            <Text align="center">{text}</Text>
        </VStack>
    );
}

const toastErrorData = (title: string, description: string) => ({
    title,
    description,
    status: 'error',
    position: 'top',
    duration: 8000,
    isClosable: true,
});

function heartbeatShowerLink(tokenId: number): string {
    return `https://${WEBSITE_URL}/heart/${tokenId}`;
}

const Home = ({ metadata }) => {
    const { userName, eventParams, openWeb3Modal, toast } = useEthereum();
    const {
        address: uncleanAddress,
        isConnecting,
        isDisconnected,
    } = useAccount({ onDisconnect: datadogRum.removeUser });
    const { chain } = useNetwork();

    const address = uncleanAddress ? AddressZ.parse(uncleanAddress) : uncleanAddress;

    let [mintCount, setMintCount] = useState<number>(null);

    const provider = useProvider();

    const { data: signer } = useSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, nomadWhitehatAbi, provider);
    const contractWithSigner = contract.connect(signer);

    const [expandedSignature, setExpandedSignature] = useState({ v: null, r: null, s: null });
    const [contentContainer, setContentContainer] = useState<HTMLElement | null>(null);
    const [mintStatus, setMintStatus] = useState<MintStatus>(MintStatus.unknown);

    const [userTokenId, setUserTokenId] = useState<number>(null);

    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [showMintedModal, setShowMintedModal] = useState(false);

    let [hasGPU, setHasGPU] = useState<boolean>(true);

    useEffect(() => {
        async function getUserMintedTokenId() {
            // userAddress has changed. TokenId defaults to null
            let tokenId = null;
            let allowlist = false;
            let signature = { v: null, r: null, s: null };
            let errorCode = null;
            let localMintStatus = MintStatus.loading;
            setMintStatus(localMintStatus);

            try {
                if (address) {
                    const filter = contract.filters.Transfer(blackholeAddress, address);
                    const [event] = await contract.queryFilter(filter); // get first event, should only be one
                    if (event) {
                        tokenId = event.args[2].toNumber();
                        localMintStatus = MintStatus.minted;
                    }
                }

                if (address && localMintStatus !== MintStatus.minted) {
                    axios
                        .get(`${METABOT_BASE_API_URL}nomadWhitehatCheck/${address}`)
                        .then(({ data }) => {
                            localMintStatus = MintStatus.can_mint;
                            setExpandedSignature(data.signature);
                        })
                        .catch(({ response }) => {
                            const { errorCode } = response?.data;
                            if (errorCode === 1) {
                                localMintStatus = MintStatus.not_whitehat;
                            } else if (errorCode === 2) {
                                localMintStatus = MintStatus.processing;
                                setShowProcessingModal(true);
                            }
                        })
                        .finally(() => {
                            setMintStatus(localMintStatus);
                        });
                }

                if (!address) {
                    localMintStatus = MintStatus.unknown;
                }
            } catch (error) {
                console.error(error);
                // toast(toastErrorData('Get User Minted Token Error', JSON.stringify(error)))
            } finally {
                setUserTokenId(tokenId);
                setMintStatus(localMintStatus);
            }
        }
        getUserMintedTokenId();
    }, [address, chain?.id]);

    // Mint Count
    // useEffect(() => {
    //     async function getMintedCount() {
    //         try {
    //             console.log('getting mint count');
    //             const mintCount: BigNumber = await heartbeatContract.mintedCount();
    //             setMintCount(mintCount.toNumber());
    //         } catch (error) {
    //             debug({ error });
    //         }
    //     }
    //     const interval = setInterval(getMintedCount, 4000);
    //     return () => clearInterval(interval);
    // }, []);

    const mint = async () => {
        // const provider = new ethers.providers.Web3Provider(provider)
        // const signer = provider.getSigner()
        const previousMintStatus = mintStatus;
        setMintStatus(MintStatus.minting);

        try {
            const tx = await contractWithSigner.mintWithSignature(
                address,
                expandedSignature.v,
                expandedSignature.r,
                expandedSignature.s,
            );
            const txReceipt = await tx.wait();
            const [fromAddress, toAddress, tokenId] = txReceipt.events.find(
                (e) => (e.event = 'Transfer'),
            ).args as [string, string, BigNumber];

            datadogRum.addAction('mint success', {
                txHash: tx.hash,
                tokenId: tokenId.toString(),
            });

            console.log('Transaction:', tx.hash);

            setUserTokenId(tokenId.toNumber());
            setMintStatus(MintStatus.minted);
            setShowMintedModal(true);
        } catch (error) {
            console.error(error);
            setMintStatus(previousMintStatus);
        }
    };

    const textUnderButton = () => {
        if (userTokenId || !address) {
            return <></>;
            // } else if (freeMintsLeft === null || freeMintsLeft > 0) {
            //     return (
            //         <Text fontWeight="light" fontSize={['2xl', '3xl']} color="white">
            //             {`${freeMintsLeft || '?'}/${freeMints} free mints left`}
            //         </Text>
            //     );
        } else {
            return (
                <div>
                    <Text fontWeight="light" fontSize={['xl', '2xl']} color="white">
                        Free to mint
                    </Text>
                    {mintCount && (
                        <Text fontWeight="light" fontSize={['sm', 'md']} color="white">
                            {`${mintCount} ${copy.title}s have been minted`}
                        </Text>
                    )}
                </div>
            );
        }
    };

    let mintButtonAction = () => {};
    switch (mintStatus) {
        case MintStatus.can_mint:
            mintButtonAction = () => mint();
            break;
        case MintStatus.processing:
            mintButtonAction = () => setShowProcessingModal(true);
            break;
        case MintStatus.minted:
            mintButtonAction = () => {
                window.open(`/logbook/${userTokenId}`, '_blank');
            };
        case MintStatus.unknown:
        default:
            break;
    }

    const isMobile = !useBreakpointValue({ base: false, md: true });

    return (
        <Box align="center">
            <Image
                src={`/static/assets/thankYou.svg`}
                alt="Thank you from all of us."
                width="100%"
                pt="20"
                pb="20"
            />
            <Flex direction={isMobile ? 'column' : 'row'} w="5xl" spacing={5}>
                <Flex direction="column" align="flex-start" w="60%">
                    <Image src={`/static/assets/nomadLogo.svg`} alt="Nomad" />
                    <Text fontSize="7xl">{copy.heading1}</Text>
                    <Text fontSize="lg" align="left">
                        {copy.text1}
                    </Text>
                </Flex>
                <Flex direction="column" spacing={10} align="center" px={20}>
                    <Image src={`/static/assets/robloxHat.svg`} alt="White hat NFT preview" />
                    <VStack justifyContent="center" spacing={4} w="100%">
                        {!address ? <CustomConnectButton /> : null}
                        {mintStatus !== MintStatus.unknown && (
                            <MintButton mintStatus={mintStatus} action={mintButtonAction} />
                        )}
                        {textUnderButton()}
                    </VStack>
                </Flex>
            </Flex>
            <Image
                src={`/static/assets/thankYou.svg`}
                alt="Thank you from all of us."
                width="100%"
                pt="20"
                pb="20"
            />

            <Head>
                <title>{copy.title}</title>
            </Head>
            <Box px={8} py={20} bgColor="white">
                <Box w="5xl">
                    <Heading
                        as="h1"
                        fontSize={['24', '24', '36']}
                        textAlign="center"
                        textColor="brand.900">
                        {copy.bottomSectonHeading}
                    </Heading>
                    <Text mt={4} textColor="brand.900" textAlign="left" fontSize="xl">
                        {copy.bottomSectionText}
                    </Text>
                    <Box
                        as="button"
                        disabled={
                            ![
                                MintStatus.can_mint,
                                MintStatus.processing,
                                MintStatus.minted,
                            ].includes(mintStatus)
                        }
                        onClick={() => window.open('https://twitter.com/Metagame', '_blank')}
                        type="button"
                        bgColor="white"
                        borderRadius={'xl'}
                        borderColor="brand.800"
                        borderWidth="1px"
                        px={8}
                        py={4}
                        mt={4}
                        _hover={{
                            background: '#e8e8e8',
                        }}>
                        <Heading as="p" size={'lg'} color="brand.800">
                            {copy.metagameCta}
                        </Heading>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
