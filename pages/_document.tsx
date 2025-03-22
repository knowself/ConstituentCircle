import { Html, Head, Main, NextScript } from 'next/document';
import Document from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.ENV = window.ENV || {};
                window.ENV.CONVEX_URL = "${process.env.NEXT_PUBLIC_CONVEX_URL || ''}";
                window.ENV.ENV = "${process.env.NEXT_PUBLIC_ENV || 'dev'}";
              `,
            }}
          />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
