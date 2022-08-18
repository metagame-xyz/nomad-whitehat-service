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
    text1: `This Whitehat NFT, using Metagame's open-source evm-translator, is only mintable by addresses that whitehatted the Nomad Bridge by returning 90%+ of the funds they took from the bridge.`,
    text2: `We support people doing the right thing even if it's for the wrong reason. More of the right things happen, and just maybe, more people will start doing the right thing for the right reasons, too.`,
    forefront: 'EVERY WHITEHAT CAN CLAIM 100 $FF FROM',
    forefrontCta: 'Claim',
    bottomSectonHeading: 'EARNED NFTS ARE THE FUTURE',
    bottomSectionText: `Earned NFTs reward and recognize the best in crypto communities, granting them access, permissions and status that can't be bought. They crystallize our contributions and achievements.`,
    bottomSectionText2: `Check out Metagame's generative art NFTs based on your on-chain activity!`,
    metagameCta: 'Play the game',
};
