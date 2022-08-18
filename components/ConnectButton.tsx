import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';

const CustomConnectButton = ({ isNavbar = false }) => {
    const [connectLabel, setConnectLabel] = useState('Connect wallet');
    const [displayName, setDisplayName] = useState('');
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                return (
                    <div
                        {...(!isNavbar && { style: { width: '90%' } })}
                        {...(!mounted && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}>
                        {(() => {
                            if (!mounted || !account || !chain) {
                                return (
                                    <Box
                                        as="button"
                                        onClick={openConnectModal}
                                        type="button"
                                        bgColor="white"
                                        borderRadius={'xl'}
                                        px={isNavbar ? 4 : 8}
                                        py={isNavbar ? 3 : 4}
                                        w="100%"
                                        _hover={{
                                            background: '#e8e8e8',
                                        }}>
                                        <Heading
                                            as="p"
                                            size={isNavbar ? 'sm' : 'lg'}
                                            color="brand.800"
                                            outline="none">
                                            Connect Wallet
                                        </Heading>
                                    </Box>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <Button onClick={openAccountModal} type="button">
                                        {account.displayName}
                                        {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ''}
                                    </Button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};

export default CustomConnectButton;
