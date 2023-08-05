import { type AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp = ({
  // AppType<{ session: Session | null }>
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const getLayout = Component.getLayout ?? ((page: React.ReactNode) => page);

  return getLayout(
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp as any);
