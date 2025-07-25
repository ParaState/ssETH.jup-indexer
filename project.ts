import { EthereumProject, EthereumDatasourceKind, EthereumHandlerKind } from "@subql/types-ethereum";

import * as dotenv from "dotenv";
import path from "path";

const mode = process.env.NODE_ENV || "production";

// Load the appropriate .env file
const dotenvPath = path.resolve(__dirname, `.env${mode !== "production" ? `.${mode}` : ""}`);
dotenv.config({ path: dotenvPath });

const { SSETH_ADDRESS, START_BLOCK } = process.env;

const startBlock = START_BLOCK ? parseInt(START_BLOCK) : 32978180;

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "ssETH",
  description: "This project can be use as a starting point for developing your new Ethereum SubQuery project",
  runner: {
    node: {
      name: "@subql/node-ethereum",
      version: ">=3.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /**
     * chainId is the EVM Chain ID, for Ethereum this is 1
     * https://chainlist.org/chain/1
     */
    chainId: process.env.CHAIN_ID!,
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: process.env.ENDPOINT!?.split(",") as string[] | string,
  },
  dataSources: [
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: startBlock,

      options: {
        // Must be a key of assets
        abi: "erc20",
        // # this is the contract address for wrapped ether https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
        address: SSETH_ADDRESS,
      },
      assets: new Map([["erc20", { file: "./abis/erc20.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Call,
            handler: "handleTransaction",
            filter: {
              /**
               * The function can either be the function fragment or signature
               * function: '0x095ea7b3'
               * function: '0x7ff36ab500000000000000000000000000000000000000000000000000000000'
               */
              function: "approve(address spender, uint256 rawAmount)",
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleLog",
            filter: {
              /**
               * Follows standard log filters https://docs.ethers.io/v5/concepts/events/
               * address: "0x60781C2586D68229fde47564546784ab3fACA982"
               */
              topics: ["Transfer(address indexed from, address indexed to, uint256 amount)"],
            },
          },
        ],
      },
    },
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: startBlock,
      options: {
        abi: "sseth",
        address: SSETH_ADDRESS,
      },
      assets: new Map([["sseth", { file: "./abis/sseth.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleStakedLog",
            filter: {
              topics: ["Staked(address indexed staker, address receiver, uint256 amount, uint256 minted)"],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleUnstakeAcceptedLog",
            filter: {
              topics: [
                "UnstakeAccepted(uint256 accept_id, address indexed staker, address receiver, uint256 unstake_amount, uint256 redeem_earning, uint256 redeem_eth, uint256 redeem_usdc)",
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleUnstakeFinishedLog",
            filter: {
              topics: [
                "UnstakeFinished(uint256 accept_id)",
              ],
            },
          },
        ],
      },
    },
  ],
  repository: "https://github.com/subquery/ethereum-subql-starter",
};

// Must set default to the project instance
export default project;
