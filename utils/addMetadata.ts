import axios, { AxiosResponse } from 'axios';

import { getUserName, ioredisClient } from '@utils';
import {
    formatMetadataWithOldMetadata,
    formatNewMetadata,
    generateNewMetadata,
    getTxnData,
    Metadata,
    TxnCounts,
} from '@utils/metadata';
import { generateGIFWithUrlbox } from '@utils/urlbox';

import { METABOT_BASE_API_URL } from './constants';
import { LogData, logError, logSuccess } from './logging';

export type newNftResponse = {
    tokenId: string;
    minterAddress: string;
    userName: string;
    ensName: string;
};

export async function addMetadata(minterAddress: string, tokenId: string): Promise<newNftResponse> {
    const address = minterAddress.toLowerCase();
    console.log('add or update', address, tokenId);

    const logData: LogData = {
        level: 'info',
        token_id: tokenId,
        function_name: 'addOrUpdateNft',
        message: `begin`,
        wallet_address: address,
    };

    let userName: string;
    try {
        logData.third_party_name = 'getTxnData';

        logData.third_party_name = 'ethers getUserName';
        userName = await getUserName(address);

        logData.third_party_name = 'redis';
        const oldMetadata: Metadata = JSON.parse(await ioredisClient.hget(tokenId, 'metadata'));
        if (oldMetadata) {
            // Should never happen in production
            return {
                tokenId,
                minterAddress: address,
                userName,
                ensName: userName,
            };
        }

        let returnedEverything;
        let tokensReturned;
        try {
            const response = await axios.get(
                `${METABOT_BASE_API_URL}nomadWhitehatCheck/${address}?needs_signature=no`,
            );
            const { data } = response as AxiosResponse;
            returnedEverything = data.returnedEverything;
            tokensReturned = data.tokensReturned;
        } catch (err) {
            logError(logData, err);
            returnedEverything = false;
            tokensReturned = {};
        }

        let metadata = generateNewMetadata(address, userName, returnedEverything, tokensReturned);

        await ioredisClient.hset(address, { tokenId, metadata: JSON.stringify(metadata) });
        await ioredisClient.hset(tokenId, { address: address, metadata: JSON.stringify(metadata) });

        logSuccess(logData);
        return {
            tokenId,
            minterAddress: address,
            userName,
            ensName: userName,
        };
    } catch (error) {
        logError(logData, error);
        throw error;
    }
}
