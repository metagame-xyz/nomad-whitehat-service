import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { LogData, logSuccess } from 'utils/logging';
import { generateSignature, validateWhitehat } from 'utils/nomadWhitehat';

import { addMetadata } from '@utils/addMetadata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const address = req.query.address as string;
    const tokenId = req.query.id as string;
    const result = await addMetadata(address, tokenId);
    res.status(200).json(result);
}
