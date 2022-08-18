import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
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

import BigButton from '@components/BigButton';
import CustomConnectButton from '@components/ConnectButton';
import { Etherscan, Opensea } from '@components/Icons';
import { maxW } from '@components/Layout';
import MintButton, { MintStatus } from '@components/MintButton';

import { ioredisClient } from '@utils';
import {
    blackholeAddress,
    CONTRACT_ADDRESS,
    METABOT_BASE_API_URL,
    NETWORK,
    networkStrings,
    WEBSITE_URL,
} from '@utils/constants';
import { copy } from '@utils/content';
import useWindowDimensions, { debug, event } from '@utils/frontend';
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
    const [error, setError] = useState<string | undefined>();
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
                    // TODO: uncomment these next parts
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
                        .catch((err) => {
                            if (err.response?.data?.errorCode === 1) {
                                localMintStatus = MintStatus.not_whitehat;
                            } else {
                                localMintStatus = MintStatus.error;
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

    const textAboveButton = () => {
        if (!address) {
            return (
                <Text fontSize="lg" align="left" fontWeight={'bold'} mt={10} color={'white'}>
                    Connect your wallet to see if you&apos;re eligible.
                </Text>
            );
        } else if (mintStatus === MintStatus.can_mint) {
            return (
                <Text fontSize="lg" align="left" fontWeight={'bold'} mt={10} color={'white'}>
                    Congratulations! You&apos;re a whitehat.
                </Text>
            );
        } else if (mintStatus === MintStatus.minted) {
            return (
                <Text fontSize="lg" align="left" fontWeight={'bold'} mt={10} color={'green'}>
                    You&apos;ve minted your whitehat! Thank you again
                </Text>
            );
        } else if (mintStatus === MintStatus.not_whitehat) {
            return (
                <Text fontSize="lg" align="left" fontWeight={'bold'} mt={10} color={'orange'}>
                    Looks like you either didn&apos;t participate in the Nomad bridge event, or
                    haven&apos;t returned enough funds to qualify for the White Hat. If you think
                    this message is in error, please contact{' '}
                    <Link href="mailto:recovery@nomad.xyz">recovery@nomad.xyz</Link>.
                </Text>
            );
        } else if (mintStatus === MintStatus.error) {
            return (
                <Text fontSize="lg" align="left" fontWeight={'bold'} mt={10} color={'red'}>
                    Oops! Looks like something went wrong on our end. Try reloading the page or{' '}
                    <Link href="https://twitter.com/messages/compose?recipient_id=1453867148514926600">
                        contact us
                    </Link>
                    .
                </Text>
            );
        } else {
            return <></>;
        }
    };

    let mintButtonAction = () => {};
    switch (mintStatus) {
        case MintStatus.can_mint:
            mintButtonAction = () => mint();
            break;
        case MintStatus.error:
            mintButtonAction = () => {};
            break;
        case MintStatus.minted:
            mintButtonAction = () => {
                window.open(
                    `https://${NETWORK === 'rinkeby' ? 'testnets.' : ''}opensea.io/assets/${
                        NETWORK === 'rinkeby' ? 'rinkeby' : 'ethereum'
                    }/${CONTRACT_ADDRESS}/${userTokenId}`,
                    '_blank',
                );
            };
        case MintStatus.unknown:
        default:
            break;
    }

    const { height, width } = useWindowDimensions();
    let thankYouAssetSize;
    if (width < 500) {
        thankYouAssetSize = 'Large';
    } else if (width < 2000) {
        thankYouAssetSize = 'Medium';
    } else {
        thankYouAssetSize = 'Small';
    }

    return (
        <Box align="center" backgroundImage={`url("/static/assets/gridBackground.svg") !important`}>
            <HStack w="100%" p={10} justify="space-between" direction="row">
                <Text color="white" fontSize="xl" as="u" textAlign="left">
                    <Link href="https://themetagame.xyz" target="_blank">
                        {copy.metagamePlug}
                    </Link>
                </Text>

                <HStack>
                    {thankYouAssetSize !== 'Large' ? <CustomConnectButton isNavbar /> : null}
                    <HStack>
                        <Etherscan />
                        <Opensea />
                    </HStack>
                </HStack>
            </HStack>
            <Flex
                direction={['column', 'column', 'column', 'row']}
                w={['xs', 'sm', 'md', '5xl']}
                spacing={5}
                mt={20}>
                <Flex
                    direction="column"
                    align="flex-start"
                    w={['100%', '100%', '100%', '50%']}
                    minW="50%">
                    <Flex width="100%" bgColor="rgba(0, 0, 0, 0)" boxShadow="md"></Flex>
                    <Image src={`/static/assets/nomadLogo.svg`} alt="Nomad" />
                    <Text fontSize={['4xl', '4xl', '6xl', '7xl']}>{copy.heading1}</Text>

                    {thankYouAssetSize === 'Large' ? (
                        <Flex
                            direction="column"
                            spacing={10}
                            align="center"
                            pl={[0, 0, 0, 20]}
                            mt={[10, 10, 10, 0]}>
                            <Image
                                borderRadius={50}
                                src={`/static/assets/whitehat.svg`}
                                alt="White hat NFT preview"
                            />
                        </Flex>
                    ) : null}
                    <Text fontSize="lg" align="left" mt={10}>
                        {copy.text1}
                    </Text>
                    <Text fontSize="lg" align="left" mt={10}>
                        {copy.text2}
                    </Text>
                    {textAboveButton()}
                    <VStack
                        justifyContent={['center', 'center', 'center', 'start']}
                        alignItems="left"
                        spacing={4}
                        w="100%"
                        mt={10}>
                        {!address || thankYouAssetSize === 'Large' ? <CustomConnectButton /> : null}
                        {![MintStatus.unknown, MintStatus.error].includes(mintStatus) && (
                            <MintButton mintStatus={mintStatus} action={mintButtonAction} />
                        )}
                    </VStack>
                </Flex>

                {thankYouAssetSize !== 'Large' ? (
                    <Flex
                        direction="column"
                        spacing={10}
                        align="center"
                        pl={[0, 0, 0, 20]}
                        mt={[10, 10, 10, 0]}>
                        <Image
                            borderRadius={50}
                            src={`/static/assets/whitehat.svg`}
                            alt="White hat NFT preview"
                        />
                    </Flex>
                ) : null}
            </Flex>
            <Image
                src={`/static/assets/thankYou${thankYouAssetSize}.svg`}
                alt="Thank you from all of us."
                width="100%"
                pt="20"
                pb="5"
            />

            <Head>
                <title>{copy.title}</title>
            </Head>
            <Box
                align="center"
                backgroundImage={`url("/static/assets/forefrontBackground.svg") !important`}
                backgroundPosition={'center center'}
                py={100}>
                <Text fontSize={['md', 'lg']} mb={[3, 5]}>
                    {copy.forefront}
                </Text>
                <Image
                    src={`/static/assets/forefrontLogo.svg`}
                    alt="Mountains"
                    fit="fill"
                    maxW="90%"
                    mb={[3, 5]}
                />
                <Box
                    as="button"
                    onClick={() => window.open('https://twitter.com/Metagame', '_blank')}
                    type="button"
                    borderRadius={'xl'}
                    borderColor="white"
                    borderWidth="1px"
                    px={8}
                    py={4}
                    mt={4}
                    _hover={{
                        background: 'rgba(255, 255, 255, 0.3)',
                    }}>
                    <Heading as="p" size={'lg'} color="white" fontWeight="400">
                        {copy.forefrontCta}
                    </Heading>
                </Box>
            </Box>
            <Box px={8} py={20} bgColor="white">
                <Box w={['xs', 'sm', 'md', '5xl']}>
                    <Heading
                        as="h1"
                        fontSize={['20', '20', '28', '36']}
                        textAlign="center"
                        textColor="brand.900">
                        {copy.bottomSectonHeading}
                    </Heading>
                    <Text
                        mt={[12, 12, 12, 16]}
                        textColor="brand.900"
                        textAlign="left"
                        fontSize={['lg', 'xl']}>
                        {copy.bottomSectionText}
                    </Text>
                    <Text
                        mt={[8, 8, 8, 12]}
                        textColor="brand.900"
                        textAlign="left"
                        fontSize={['lg', 'xl']}>
                        {copy.bottomSectionText2}
                    </Text>
                    <BigButton
                        onClick={() => window.open('https://twitter.com/Metagame', '_blank')}
                        mt={[8, 8, 8, 12]}
                        bgColor="white"
                        _hover={{
                            background: 'rgba(0, 0, 0, 0.1)',
                        }}
                        label={copy.metagameCta}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
