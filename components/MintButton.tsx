import { Button } from 'grommet';
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
            size="large"
            primary
            disabled={!clickable}
            label={mintStatus}
            style={{ width: '100%' }}
        />
    </div>
);

export default MintButton;
