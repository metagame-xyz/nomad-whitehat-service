import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
    styles: {
        global: {
            'html, body': {
                color: 'brand.900',
            },
        },
    },
    colors: {
        white: '#FDFFFF',
        brand: {
            '100opaque': 'rgba(237, 242, 247, 0.92)',
            '50': '#F7FAFC',
            '100': '#EDF2F7',
            '200': '#E2E8F0',
            '300': '#CBD5E0',
            '400': '#A0AEC0',
            '500': '#718096',
            '600': '#4A5568',
            '700': '#2D3748',
            '800': '#262626',
            '900': '#151515',
        },
    },
    fonts: {
        heading: 'Arimo',
        body: 'Arimo',
    },
    components: {
        Text: {
            baseStyle: {
                color: 'white',
            },
        },
    },
});
