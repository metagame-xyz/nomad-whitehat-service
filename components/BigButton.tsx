import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

const BigButton = ({
    disabled = false,
    onClick = (a) => a,
    label = '',
    textColor = 'brand.800',
    textSize = 'lg',
    _hover = {},
    ...props
}) => {
    return (
        <Box
            as="button"
            onClick={!disabled ? onClick : (a) => a}
            type="button"
            bgColor={!disabled ? 'white' : '#b5b5b5'}
            borderRadius={'xl'}
            borderColor="brand.800"
            borderWidth="1px"
            px={8}
            py={4}
            _hover={!disabled ? _hover : {}}
            w="100%"
            {...props}>
            <Heading
                as="p"
                size={textSize}
                color={!disabled ? textColor : '#696969'}
                fontWeight="400">
                {label}
            </Heading>
        </Box>
    );
};

export default BigButton;
