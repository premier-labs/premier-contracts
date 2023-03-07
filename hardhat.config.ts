/* eslint-disable indent */

import process from 'process';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';

import 'hardhat-deploy';

import 'tsconfig-paths/register';

import { HardhatUserConfig } from 'hardhat/config';
import { forkConfig } from './hardhat.fork.config';

// Paths
const DEFAULT_DEPLOY_DIR = './deploy/_default/';
const DEFAULT_SETUP_TEST_DIR = './deploy/_setup/';

interface EnvOptions {
    HARDHAT_DEPLOYER?: string;
    HARDHAT_USER?: string;
    ETHERSCAN_API?: string;
    MAINNET_ENDPOINT?: string;
    GOERLI_ENDPOINT?: string;
}

const {
    HARDHAT_DEPLOYER = '',
    HARDHAT_USER = '',
    ETHERSCAN_API = '',
    MAINNET_ENDPOINT = '',
    GOERLI_ENDPOINT = ''
}: EnvOptions = process.env as any as EnvOptions;

const config: HardhatUserConfig = {
    networks: {
        hardhat: {
            forking: forkConfig,
            chainId: 1337,
            accounts:
                HARDHAT_DEPLOYER && HARDHAT_USER
                    ? [
                          {
                              privateKey: HARDHAT_DEPLOYER, // deployer
                              balance: '10000000000000000000000000000000000000000000000'
                          },
                          {
                              privateKey: HARDHAT_USER, // user
                              balance: '10000000000000000000000000000000000000000000000'
                          }
                      ]
                    : undefined,
            allowUnlimitedContractSize: true,
            deploy: [DEFAULT_DEPLOY_DIR, DEFAULT_SETUP_TEST_DIR]
        },
        localhost: {
            deploy: [DEFAULT_DEPLOY_DIR]
        },
        mainnet: {
            url: MAINNET_ENDPOINT,
            deploy: [DEFAULT_DEPLOY_DIR, './deploy/mainnet']
        },
        goerli: {
            url: GOERLI_ENDPOINT,
            chainId: 5,
            deploy: [DEFAULT_DEPLOY_DIR, './deploy/goerli'],
            accounts: HARDHAT_DEPLOYER ? [HARDHAT_DEPLOYER] : undefined,
            gasPrice: 10000000 // 0.01 Gwei
        }
    },

    etherscan: {
        apiKey: ETHERSCAN_API
    },

    namedAccounts: {
        deployer: 0,
        user: 1
    },

    solidity: {
        compilers: [
            {
                version: '0.8.14',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    },
                    metadata: {
                        bytecodeHash: 'none'
                    },
                    outputSelection: {
                        '*': {
                            '*': ['storageLayout'] // Enable slots, offsets and types of the contract's state variables
                        }
                    }
                }
            },
            {
                version: '0.4.11',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            }
        ]
    },

    typechain: {
        outDir: 'typechain'
    },

    mocha: {
        timeout: 600000,
        color: true
    }
};

export default config;
