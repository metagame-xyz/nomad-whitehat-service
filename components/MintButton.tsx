import { Box, Button, Heading } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import BigButton from './BigButton';

export const enum MintStatus {
    unknown = 'unknown',
    loading = 'Loading...',
    can_mint = 'Mint',
    minting = 'Minting...',
    minted = 'See your NFT',
    not_whitehat = 'Not a whitehat',
    error = 'Get help',
}

const MintButton = ({ mintStatus, action = (a) => a }) => (
    <BigButton
        disabled={![MintStatus.can_mint, MintStatus.error, MintStatus.minted].includes(mintStatus)}
        onClick={action}
        label={mintStatus}
        _hover={{
            background: 'rgba(255, 255, 255, 0.7)',
        }}
    />
);

export default MintButton;
