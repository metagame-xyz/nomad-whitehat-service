import { Center, Flex, Grid, Heading, Link, Stack, Text } from '@chakra-ui/react';

import { Etherscan, Opensea, TwelveCircles, Twitter } from './Icons';

const hover = { color: 'brand.300' };

export default function Footer(props) {
    return (
        <Flex width="100%" bgColor="brand.900">
            <Grid
                as="footer"
                w={'100%'}
                margin="auto"
                p={6}
                gap={1}
                templateColumns="repeat(2, 1fr)"
                color="brand.50"
                {...props}>
                <Stack
                    onClick={() => window.open('https://twitter.com/Metagame', '_blank')}
                    direction={['column', 'column', 'row']}
                    spacing={2}
                    align="center"
                    justify="start">
                    <TwelveCircles boxSize={8} color="white" />
                    <Heading pt={1} fontSize={['sm', 'md', 'xl', 'xl']}>
                        Metagame
                    </Heading>
                </Stack>
                <Stack
                    direction={'row'}
                    spacing={2}
                    align="center"
                    justify="flex-end"
                    color="brand.100">
                    <Twitter boxSize={[6, 8]} _hover={hover} boxShadow={''} />
                    <Opensea boxSize={[6, 8]} _hover={hover} boxShadow={''} />
                    <Etherscan boxSize={[6, 8]} _hover={hover} boxShadow={''} />
                </Stack>
            </Grid>
        </Flex>
    );
}
