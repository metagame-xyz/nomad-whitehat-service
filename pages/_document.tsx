import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

import { GOOGLE_ANALYTICS_ID, WEBSITE_URL } from '@utils/constants';
import { headMetadata as meta } from '@utils/content';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return initialProps;
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="canonical" href={WEBSITE_URL} />
                    <meta name="description" content={meta.description} />
                    <meta property="og:url" content={WEBSITE_URL} />
                    <meta property="og:site_name" content={meta.title} />

                    <meta property="og:title" content={meta.title} />
                    <meta property="og:description" content={meta.description} />
                    <meta property="og:type" content={meta.type} />
                    <meta property="og:image" content={meta.image} />

                    <meta name="twitter:title" content={meta.title} />
                    <meta name="twitter:description" content={meta.description} />
                    <meta name="twitter:image" content={meta.image} />
                    <meta name="twitter:image:alt" content={meta.title} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@metagame" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
