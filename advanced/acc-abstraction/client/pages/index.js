// main
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useState } from 'react';

export default function Home() {

  const contractAddress = process.env.FACTORY_ADDRESS;
  const abi = process.env.FACTORYABI;

  const [factory, setFactory] = useState(null);
  const [signer, setSigner] = useState(null);
  const [smartWalletAdd, setSmartWalletAdd] = useState("");
  const [salt, setSalt] = useState("");
  const [depositAddr, setDepositAddr] = useState("");
  const [depositVal, setDepositVal] = useState("");

  function checkIfConnected() {
    if (signer == null) {
      initWallet();
    }
  }

  async function initWallet() {
    try {
      if (typeof window.ethereum === 'undefined') {
        console.log("Please install a wallet.");
        alert("Please install a wallet.");
        return;
      } else {
        const web3ModalVar = new Web3Modal({
          cacheProvider: true,
          providerOptions: {
            walletconnect: {
              package: WalletConnectProvider,
            },
          },
        });

        const instanceVar = await web3ModalVar.connect();
        const providerVar = new ethers.BrowserProvider(instanceVar);
        const signer = await providerVar.getSigner();
        setSigner(signer);
        const smartContract = new ethers.Contract(contractAddress, abi, signer);
        setFactory(smartContract);
        const address = smartContract.SmartAccounts(signer.getAddress());
        console.log(address);
        // setSmartWalletAdd(address);
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async function createWallet() {
    checkIfConnected();
    try {
      const address = await factory.createAccount(signer.getAddress(), salt.length > 0 ? salt : "smartWallet");
      setSmartWalletAdd(address);
    } catch (error) {
      console.log(error);
    }
  }

  async function send() {
    checkIfConnected();
    try {
      console.log('send', depositAddr, depositVal);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-3">
      {
        signer == null ? (
          <>
            <h1 className="font-bold text-[28px]  text-indigo-500">Connect Wallet to create a smart wallet</h1>
            <button className="rounded bg-indigo-500 p-2 text-[15px] font-bold " onClick={initWallet}>Connect wallet</button>
          </>
        ) : (
          smartWalletAdd.length <= 0 ? (
            <>
              <input type="text" name="salt" placeholder="Enter salt" className="outline-none rounded border-2 border-indigo-500 " value={salt} onChange={(e) => { setSalt(e.target.value); }} />
              <button className="rounded bg-indigo-500 p-2 text-[15px] font-bold " onClick={createWallet}>Create Wallet</button>
            </>
          ) : (
            <>
              <h1 className="font-bold text-[28px]  text-indigo-500">Wallet address: {smartWalletAdd}</h1>
              <div className="flex gap-[20px] py-[30px] justify-center items-center">
                <div className="flex flex-col">
                  <input type="text" name="salt" placeholder="Enter reciever address" className="outline-none rounded border-2 border-indigo-500 " value={depositAddr} onChange={(e) => { setDepositAddr(e.target.value); }} />
                  <input type="text" name="salt" placeholder="Enter reciever address" className="outline-none rounded border-2 border-indigo-500 " value={depositVal} onChange={(e) => { setDepositVal(e.target.value); }} />
                  <button className="rounded bg-indigo-500 p-2 text-[15px] font-bold " onClick={send}>Send</button>
                </div>
              </div>
            </>
          )
        )
      }
    </div>
  )
}
