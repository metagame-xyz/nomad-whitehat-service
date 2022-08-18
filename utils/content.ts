import { WEBSITE_URL } from '@utils/constants';

export interface MetaProps {
    description?: string;
    image?: string;
    title: string;
    type?: string;
}

const description = 'an Earned NFT for Whitehats';

export const headMetadata: MetaProps = {
    title: 'Nomad whitehat',
    description,
    image: `https://${WEBSITE_URL}/site-preview.png`,
    type: 'website',
};

export const copy = {
    title: 'Nomad whitehat',
    heroSubheading: description,
    nameLowercase: 'nomad whitehat',
    metagamePlug: 'Powered by Metagame',
    heading1: 'Whitehat Prize',
    text1: `Reputation and contribution are the lifeblood of a sustainable crypto revolution. We're offering a big thank-you to everyone who returned 90% or more of their withdrawal from the Nomad Bridge during the Bridge hack.`,
    text2: `Now, claim your NFT endorsed by Nomad that proves your on-chain return of 90%+ funds.`,
    forefront: 'EVERY WHITEHAT CAN CLAIM 100 $FF FROM',
    forefrontCta: 'Claim',
    bottomSectonHeading: 'EARNED NFTS ARE THE FUTURE',
    bottomSectionText: `Earned NFTs reward and recognize the best in crypto communities, granting them access, permissions and status that can't be bought. They crystallize our achievements, contributions.`,
    bottomSectionText2: `Interested in bringing these to your community?`,
    metagameCta: 'Play the game',
};
