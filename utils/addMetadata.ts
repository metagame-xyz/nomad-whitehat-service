import axios, { AxiosResponse } from 'axios';

import { getUserName, ioredisClient } from '@utils';
import { formatNewMetadata, Metadata } from '@utils/metadata';

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

    const logData: LogData = {
        level: 'info',
        token_id: tokenId,
        function_name: 'addMetadata',
        message: `begin`,
        wallet_address: address,
    };

    let userName: string;
    try {
        logData.third_party_name = 'ethers getUserName';
        userName = await getUserName(address);

        logData.third_party_name = 'redis get metadata';

        logData.third_party_name = 'get whitehat data';
        let returnedEverything;
        let tokensReturned;
        try {
            const response = await axios.get(
                `${METABOT_BASE_API_URL}nomadWhitehatCheck/${address}`,
            );
            const { data } = response as AxiosResponse;
            returnedEverything = data.returnedEverything;
            tokensReturned = data.tokensReturned;
        } catch (err) {
            logError(logData, err);
            returnedEverything = false;
            tokensReturned = {};
        }

        logData.third_party_name = 'formatNewMetadata';
        let metadata = formatNewMetadata(address, userName, returnedEverything, tokensReturned);

        logData.third_party_name = 'redis set metadata';

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
