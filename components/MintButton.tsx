import { Box, Button, Heading } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

export const enum MintStatus {
    unknown = 'unknown',
    loading = 'Loading...',
    can_mint = 'Mint',
    minting = 'Minting...',
    minted = 'See your NFT',
    not_whitehat = 'Not a whitehat',
    processing = 'Processing...',
}

const MintButton = ({ mintStatus, action = (a) => a }) => (
    <Box
        as="button"
        disabled={
            ![MintStatus.can_mint, MintStatus.processing, MintStatus.minted].includes(mintStatus)
        }
        onClick={action}
        type="button"
        bgColor="white"
        borderRadius={'xl'}
        px={8}
        py={4}
        w="100%"
        _hover={{
            background: '#e8e8e8',
        }}>
        <Heading as="p" size={'lg'} color="brand.800">
            {mintStatus}
        </Heading>
    </Box>
);

export default MintButton;
