import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

export const enum MintStatus {
    unknown = 'unknown',
    loading = 'Loading...',
    can_mint = 'Mint',
    minting = 'Minting...',
    minted = 'See your logbook',
    not_whitehat = 'Not a whitehat',
    processing = 'Processing...',
}

const MintButton = ({ mintStatus, clickable, action = (a) => a }) => (
    <div style={{ width: '100%' }}>
        <Button
            onClick={action}
            loadingText="Minting..."
            fontWeight="normal"
            colorScheme="brand"
            bgColor="brand.600"
            // color="brand.900"
            _hover={{ bg: 'brand.500' }}
            size="lg"
            height="60px"
            minW="xs"
            boxShadow="lg"
            fontSize="4xl"
            borderRadius="full">
            {mintStatus}
        </Button>
    </div>
);

export default MintButton;
