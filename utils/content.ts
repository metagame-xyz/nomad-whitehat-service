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
//     Reputation and contribution are the lifeblood of a sustainable crypto revolution. This Whitehat NFT, using Metagame's open-source evm-translator, is only mintable by whitehats of the Nomad Bridge Hack who returned at least 90% of funds.
// We support people doing the right thing even if it's for the wrong reason, and we hope that things like this will encourage more people to do the right thing. Claim an NFT endorsed by Nomad to celebrate your white hat status!
    text1: `Reputation and contribution are the lifeblood of a sustainable crypto revolution. This Whitehat NFT, using Metagame's open-source evm-translator, is only mintable by whitehats of the Nomad Bridge Hack who returned at least 90% of funds.`,
    text2: `We support people doing the right thing even if it's for the wrong reason, and we hope that things like this will encourage more people to do the right thing. Claim now to celebrate your white hat status!`,
    forefront: 'EVERY WHITEHAT CAN CLAIM 100 $FF FROM',
    forefrontCta: 'Claim',
    bottomSectonHeading: 'EARNED NFTS ARE THE FUTURE',
    bottomSectionText: `Earned NFTs reward and recognize the best in crypto communities, granting them access, permissions and status that can't be bought. They crystallize our contributions and achievements.`,
    bottomSectionText2: `Check out Metagame's generative art NFTs based on your on-chain activity!`,
    metagameCta: 'Play the game',
};
