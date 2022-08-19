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
                    <meta http-equiv="Content-Security-Policy" content="default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;" />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="ESbWCnf04vIus7wQl2BAyzwtWhgcF5UW";;analytics.SNIPPET_VERSION="4.15.3";
                            analytics.load("ESbWCnf04vIus7wQl2BAyzwtWhgcF5UW");
                            analytics.page();`,
                        }}
                    />
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
