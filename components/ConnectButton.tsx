import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';

import BigButton from './BigButton';

const CustomConnectButton = ({ isNavbar = false }) => {
    const [connectLabel, setConnectLabel] = useState('Connect wallet');
    const [displayName, setDisplayName] = useState('');
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                return (
                    <div
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
                                    <BigButton
                                        onClick={openConnectModal}
                                        _hover={{
                                            background: 'rgba(255, 255, 255, 0.7)',
                                        }}
                                        label="Connect Wallet"
                                        px={isNavbar ? 4 : 8}
                                        py={isNavbar ? 3 : 4}
                                        textSize={isNavbar ? 'sm' : 'lg'}
                                    />
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
                                    <Button
                                        onClick={openAccountModal}
                                        type="button"
                                        fontWeight="400"
                                        w="100%"
                                        bgColor={!isNavbar ? 'rgba(255, 255, 255, 0.5)' : 'white'}>
                                        <Text color="brand.900">
                                            {account.displayName}
                                            {account.displayBalance
                                                ? ` (${account.displayBalance})`
                                                : ''}
                                        </Text>
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
