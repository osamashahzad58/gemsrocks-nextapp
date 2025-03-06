import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { arbitrum } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [arbitrum],
    connectors: [
      metaMask(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '202a3d538b088d735b99722b0cea4910' }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [arbitrum.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}

export const config = createConfig({
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http(),
  },
})
