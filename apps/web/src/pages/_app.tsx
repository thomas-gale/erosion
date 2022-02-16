import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";

import { config } from "../env/config";
import { store } from "../state/store";
import { TopNav } from "../components/elements/TopNav";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>{config.name}</title>
      </Head>

      <ReduxProvider store={store}>
        <div className="flex flex-col h-screen w-screen">
          <div className="flex-shrink">
            <TopNav />
          </div>
          <div className="bg-light h-full">
            <Component {...pageProps} />
          </div>
        </div>
      </ReduxProvider>
    </>
  );
};

export default MyApp;
