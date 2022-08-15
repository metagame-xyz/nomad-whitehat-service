import { WEBSITE_URL } from '@utils/constants';

export interface MetaProps {
    description?: string;
    image?: string;
    title: string;
    type?: string;
}

const description = 'An NFT only mintable by the real ones';

export const headMetadata: MetaProps = {
    title: 'Heartbeat',
    description,
    image: `https://${WEBSITE_URL}/site-preview.png`,
    type: 'website',
};

export const copy = {
    title: 'Welcome, whitehats',
    nameLowercase: 'heartbeat',
    heroSubheading: description,
    heading1: 'White Hat Prize',
    text1: `Reputation and contribution are the lifeblood of a sustainable crypto
                        revolution. We're here to offer our thanks to anyone who returns 90% or
                        more of their withdrawal from the Nomad Bridge during the Bridge hack Claim
                        an NFT endorsed by Nomad that proves your on-chain return of 90%+ funds
                        after your withdrawal.`,
    heading2: 'Multi-chain',
    text2: 'Activity is tracked across Ethereum, Polygon, Fantom, and Avalanche.',
    heading3: 'Earned Attributes',
    text3: 'The layers, speed, colors, and spikes are each based on a different length of time. What can you do to make yours more unique?',
    bottomSectonHeading: 'EARNED NFTS ARE THE FUTURE',
    bottomSectionText: `Earned NFTs reward the best in crypto communities, granting them access, permissions and status that can’t be bought. They crystallize our achievements, contributions, sacrifices and convictions and help others know who is more trustworthy, more knowledgeable, more helpful. Interested in bringing these to your community?`,
    metagameCta: 'Play the game',
};
