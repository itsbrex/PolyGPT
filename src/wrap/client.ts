import { Workspace } from "../sys";
import { workspacePlugin } from "./workspace-plugin";

import {
  PolywrapClient,
  PolywrapClientConfigBuilder,
  IWrapPackage
} from "@polywrap/client-js";
import * as Sys from "@polywrap/sys-config-bundle-js";
import { dateTimePlugin } from "@polywrap/datetime-plugin-js";
import * as EthProvider from "@polywrap/ethereum-provider-js";
import { Wallet } from "ethers"
import { PluginPackage } from "@polywrap/plugin-js";

export function getWrapClient(
  workspace: Workspace,
  ethereumPrivateKey: string | undefined
): PolywrapClient {
  const builder = new PolywrapClientConfigBuilder()
    .addBundle("web3")
    .addBundle("sys")
    .setPackage(
      Sys.bundle.fileSystem.uri,
      workspacePlugin(workspace)({}) as IWrapPackage
    ) 
    .addEnv("ipfs/Qmf9mRhNvKN1wfN52VdiZkjQiRw1WWEBYnwkuwzFg1ZjQn", { 
      safeAddress: "0x0a083b47e4270be3467e16540380b130a6d9a09f", 
      connection: { 
        networkNameOrChainId: "goerli", 
      },
    })
    .setPackage("plugin/user", PluginPackage.from(module => ({
      onGoalAchieved: async () => {
        console.log("Goal achieved!");
        process.exit(0);
      }
    })));

  if (ethereumPrivateKey) {
    builder.setPackages({
      "plugin/datetime":
        dateTimePlugin({}) as IWrapPackage,

      "plugin/ethereum-provider@2.0.0":
        EthProvider.plugin({
          connections: new EthProvider.Connections({
            networks: {
              goerli: new EthProvider.Connection({
                signer: new Wallet(ethereumPrivateKey),
                provider:
                  "https://goerli.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
              }),
              mainnet: new EthProvider.Connection({
                signer: new Wallet(ethereumPrivateKey),
                provider:
                  "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
              }),
            },
            defaultNetwork: "mainnet"
          }),
        }) as IWrapPackage}
    );
  }

  const config = builder.build();

  return new PolywrapClient(config);
}
