"use client";

import { RouterBuilder } from "@paraspell/xcm-router";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useEffect, useState } from "react";

const RouterTest = () => {
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [loading, setLoading] = useState(false);

  const onSwap = async () => {
    if (!account) {
      return;
    }

    const injector = await web3FromAddress(account?.address);

    setLoading(true);

    await RouterBuilder()
      .from("Hydration")
      .exchange("HydrationDex")
      .to("Hydration")
      .currencyFrom({ symbol: "DOT" })
      .currencyTo({ symbol: "HDX" })
      .amount(BigInt(100000000))
      .senderAddress(account.address)
      .recipientAddress("7LR8z5RhCWwweSUqomH68fn63e5CbSqAoLAU8qQM7gxXs7Mk")
      .signer(injector.signer)
      .slippagePct("0.1")
      .build();

    setLoading(false);
  };

  const init = async () => {
    const allInjected = await web3Enable("my cool dapp");

    if (allInjected.length === 0) {
      console.log("no injected sources available");
    }

    const allAccounts = await web3Accounts();

    if (allAccounts.length === 0) {
      console.log("no accounts available");
    }

    setAccount(allAccounts[0]);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <button style={{ padding: 24, cursor: "pointer" }} onClick={onSwap}>
      {loading ? "Loading..." : "Swap"}
    </button>
  );
};

export default RouterTest;
