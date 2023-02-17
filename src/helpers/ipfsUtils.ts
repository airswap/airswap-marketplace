import axios from 'axios';

interface IGateway {
  key: string,
  url: string,
  maxRequestsPerSecond: number
}
const defaultGateways: Array<IGateway> = [
  {
    key: 'ipfs',
    url: 'https://ipfs.io/ipfs/',
    maxRequestsPerSecond: 10,
  },
  {
    key: 'cloudflare',
    url: 'https://cloudflare-ipfs.com/ipfs/',
    maxRequestsPerSecond: 1,
  },
];

interface IIpfsRequests {
  [key: string]: Promise<string>;
}
const ipfsRequests: IIpfsRequests = {};

const makeIpfsRequest: (ipfsAddress: string, gatewayIndex: number) => Promise<string> = async (ipfsAddress: string, gatewayIndex: number) => {
  const gateway = defaultGateways[gatewayIndex];
  const url = ipfsAddress.replace('ipfs://', gateway.url);

  if (ipfsRequests[ipfsAddress]) {
    if (process.env.NODE_ENV === 'development') console.log('using cached ipfs request');
    return ipfsRequests[ipfsAddress];
  }

  if (process.env.NODE_ENV === 'development') console.log('making new ipfs request', ipfsAddress);
  ipfsRequests[ipfsAddress] = new Promise<string>((resolve, reject) => {
    axios.get(url, { responseType: 'arraybuffer' }).then((response) => {
      const { data } = response;
      const buffer = Buffer.from(data);
      const base64String = buffer.toString('base64');
      resolve(base64String);
    }).catch((error) => {
      reject(error);
    });
  });
  return ipfsRequests[ipfsAddress];
};

let currentGatewayIndex = 0;
let requestsThisSecond = 0;
let thisSecond = new Date().getSeconds();

const resetGatewayAndRequests: () => void = () => {
  currentGatewayIndex = 0;
  requestsThisSecond = 0;
};

const useNextGateway: () => void = () => {
  currentGatewayIndex += 1;
  if (currentGatewayIndex >= defaultGateways.length) {
    resetGatewayAndRequests();
  } else {
    requestsThisSecond = 0;
  }
};

export const makeRateLimitedIpfsRequest: (ipfsAddress: string) => Promise<string> = (ipfsAddress: string) => {
  const currentSecond = new Date().getSeconds();
  if (currentSecond !== thisSecond) {
    resetGatewayAndRequests();
    thisSecond = currentSecond;
  }

  if (requestsThisSecond >= defaultGateways[currentGatewayIndex].maxRequestsPerSecond) {
    useNextGateway();
  }

  requestsThisSecond += 1;
  return makeIpfsRequest(ipfsAddress, currentGatewayIndex);
};
