// Define token configurations with their associated chains, addresses, ABI methods, parameters, and decimals.
const tokenConfigs = [
  {
    // mintBurnFrom manager use totalSupply
    token: 'usdx-money-usdx',
    address: "0xf3527ef8dE265eAa3716FB312c12847bFBA66Cef",
    method: 'erc20:totalSupply',
    chains: ["ethereum", "bsc", "arbitrum"],
  },
  {
    // lockUnlock check balance of canonical manager
    token: 'aethir',
    address: "0xbe0Ed4138121EcFC5c0E56B40517da27E6c5226B",
    method: 'erc20:balanceOf',
    params: ["0x148F010746c2999Abc3fD5533746632AD9771948"],
    chains: ["ethereum"],
  },
  {
    // mintBurnFrom manager with two different addresses
    token: 'wrapped-centrifuge',
    address: "0xc221b7e65ffc80de234bbb6667abdd46593d34f0",
    method: 'erc20:totalSupply',
    chains: ["ethereum"],
  },
  {
    // mintBurnFrom manager with two different addresses
    token: 'wrapped-centrifuge',
    address: "0x2b51E2Ec9551F9B87B321f63b805871f1c81ba97",
    method: 'erc20:totalSupply',
    chains: ["base"],
  },
  {
    token: "ripple",
    address: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
    method: "erc20:balanceOf",
    params: ["0x4077dC1E7DC1F91De370620B6b6F5D316F28ae09"],
    chains: ["bsc"]
  },
  {
    token: "binance-bitcoin",
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    method: "erc20:balanceOf",
    params: ["0xed5264d5f93f040CE83d4BD979A39B06cf6644E5"],
    chains: ["bsc"]
  },
  {
    token: "klima-dao",
    address: "0x4e78011Ce80ee02d2c3e649Fb657E45898257815",
    method: "erc20:balanceOf",
    params: ["0xDA13CEc4FBA742E123b5093DFD00B9e020D1Be24"],
    chains: ["polygon"],
    decimals: 9, // Klima token uses 9 decimal places
  },
  {
    token: "kip",
    address: "0x946fb08103b400d1c79e07acCCDEf5cfd26cd374",
    method: "erc20:balanceOf",
    params: ["0x08EF516c5Eb9159C6Bea5B87FB902b3B1CDabAf5"],
    chains: ["ethereum"],
  },
  {
    token: "department-of-gov-efficiency",
    address: "0x1121AcC14c63f3C872BFcA497d10926A6098AAc5",
    method: "erc20:balanceOf",
    params: ["0x301db234167c4f6834DcE3f274B18D759D7edDC9"],
    chains: ["ethereum"],
  },
  // {
  //   token: "pell-network-token",
  //   address: "0xC65d8d96cddDB31328186EFA113a460b0Af9Ec63",
  //   method: 'erc20:totalSupply',
  //   chains: ["ethereum"],
  // },
  // {
  //   token: "any-inu",
  //   address: "0x2598c30330D5771AE9F983979209486aE26dE875",
  //   method: 'erc20:totalSupply',
  //   chains: ["ethereum"],
  // },
];

const chainTokenMap = {};

tokenConfigs.forEach(config => {
  config.chains.forEach(chain => {
    if (!chainTokenMap[chain]) {
      chainTokenMap[chain] = [];
    }
    chainTokenMap[chain].push(config);
  });
});

Object.keys(chainTokenMap).forEach(chain => {
  module.exports[chain] = {
    tvl: async (api) => {
      for (const config of chainTokenMap[chain]) {
        const supply = await api.call({
          abi: config.method,
          target: config.address,
          ...(config.params ? { params: config.params } : {})
        });
        // Use the provided decimals, defaulting to 18 if not specified.
        const decimals = config.decimals || 18;
        api.addCGToken(config.token, supply / (10 ** decimals));
      }
    },
  };
});
