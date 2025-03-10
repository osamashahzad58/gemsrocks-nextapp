
// sallu local
// export const api_url = 'http://192.168.30.241:3000';

// staging link
// export const api_url = 'http://54.87.33.204:3000'; 

// abdullah localip
// export const api_url = 'http://192.168.30.38:5000/api/';
// export const socket_api_url = 'http://192.168.30.38:5000/';
// abdullah localipw
// export const api_url = 'http://34.224.7.63:5000/api/';
// export const api_url = 'http://192.168.30.38:3000';
// dev link
// export const chainId = '11155111';
// export const api_url = 'http://52.91.230.95:5001/api/';
// export const socket_api_url = 'http://52.91.230.95:5001/';

// Mainnet link
export const chainId = '42161';

export let api_url: string;
export let socket_api_url: string;

//Updated ARB contracts with ETH
export const wETHContract = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
export const rockRelayerContract = "0xfE469818B770B2a0E8cf0d5CE079cb1fd3B0d358"
export let gemsRouterContract: string;
export let gemsFactoryContract: string;
export let afterGraduationTradingFeeWallet: string;
export const gems = "0x28bc3f91E153CFfAF7f8C895784A8EA3e1730bf3";
export const uniSwapContract = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

const DEV_After_Graduation_Trading_Fee_Wallet = '0xB09540Cdb198d8ae82710e95c53C6CDebc7680a8'
const PROD_After_Graduation_Trading_Fee_Wallet = '0xE3e026217BB49215B229501F8f29Bf5ac6E1a1B2'

const ROUTER_DEV_CONTRACT = '0xd1c6dad1a04ae5be48d0049ccc028ad99b5a2ab0'
const FACTORY_DEV_CONTRACT = '0x0a0C9Ce4104AB89D240F7F786EA52BE661469C94'

const ROUTER_PROD_CONTRACT = '0xa2b032b6aeba3afc2a446dd720e7de1c02381851'
const FACTORY_PROD_CONTRACT = '0xA0e393F0ec413C7dA360EA4a75Fa965132f86630'

const dev = 'development'

const system_ENV = process.env.NEXT_PUBLIC_APP_ENV

if (system_ENV === dev) {
    gemsRouterContract = ROUTER_DEV_CONTRACT
    gemsFactoryContract = FACTORY_DEV_CONTRACT
    afterGraduationTradingFeeWallet = DEV_After_Graduation_Trading_Fee_Wallet
    api_url = 'https://apiroc.tizzew.com/api/'
    socket_api_url = 'https://apiroc.tizzew.com/';
}
else {
    gemsRouterContract = ROUTER_PROD_CONTRACT
    gemsFactoryContract = FACTORY_PROD_CONTRACT
    afterGraduationTradingFeeWallet = PROD_After_Graduation_Trading_Fee_Wallet
    api_url = 'https://prodrocks.quecko.com/api/'
    socket_api_url = 'https://prodrocks.quecko.com/';
}