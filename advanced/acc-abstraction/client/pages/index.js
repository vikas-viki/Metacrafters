// main
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useState } from 'react';

export default function Home() {

  const contractAddress = process.env.FACTORY_ADDRESS;
  const abi = process.env.FACTORYABI;
  const swabi = process.env.SMART_WALLET_ABI;

  const [factory, setFactory] = useState(null);
  const [smartWallet, setSmartWallet] = useState(null);
  const [signer, setSigner] = useState(null);
  const [smartWalletAdd, setSmartWalletAdd] = useState("");
  const [salt, setSalt] = useState("");
  const [recievrAddr, setRecievrAddr] = useState("");
  const [recievVal, setRecievVal] = useState("");
  const [depositVal, setDepositVal] = useState("");
const [balance, setBalance] = useState(0);

  function checkIfConnected() {
    if (signer == null) {
      initWallet();
    }
  }

  async function getBalanceSWT(_contract = smartWallet, _signer, addr){
    try{

      const blns = await ethers.formatEther(await _contract.getDeposit());
      const accountBlns = await ethers.formatEther(await _signer.provider.getBalance(addr));
      console.log(blns, accountBlns);
      if(blns > accountBlns){
        setBalance(blns);
      }else{
        setBalance(accountBlns);
      }
    }catch(e){
      console.log(e);
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
        const _signer = await providerVar.getSigner();
        setSigner(_signer);
        const smartContract = new ethers.Contract(contractAddress, abi, _signer);
        await setFactory(smartContract);
        const address = await smartContract.getAcount(await _signer.getAddress());
        if(address != '0x0000000000000000000000000000000000000000'){
          const smtwlt = new ethers.Contract(address, swabi, _signer);
          setSmartWallet(smtwlt);
          setSmartWalletAdd(address);
          await getBalanceSWT(smtwlt, _signer, address);
        }
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
      console.log(factory);
      const tx = await factory.createAccount(signer.getAddress(), salt);
      await tx.wait();
      const address = await factory.getAcount(await signer.getAddress());
      setSmartWalletAdd(address);
      const smtwlt = new ethers.Contract(address, swabi, signer);
      await setSmartWallet(smtwlt);
      await getBalanceSWT();
    } catch (error) {
      console.log(error);
    }
  }

  async function send() {
    checkIfConnected();
    try {
      const tx = await smartWallet.withdrawDepositTo(recievrAddr, await ethers.parseEther(recievVal));
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  }

  async function deposit() {
    // here when sender contract sends the amount the balance gets updated not the deposits.
    checkIfConnected();
    try {
      await smartWallet.addDeposit({value: await ethers.parseEther(depositVal)});
      await getBalanceSWT(smartWallet);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="w-full h-full flex items-center justify-center py-5 flex-col gap-3">
      {
        signer == null ? (
          <>
            <h1 className="p-4 text-[28px]  text-indigo-500">Connect Wallet to create a smart wallet</h1>
            <button className="p-4 rounded bg-indigo-500 text-[15px] font-bold " onClick={initWallet}>Connect wallet</button>
          </>
        ) : (
          smartWalletAdd.length <= 0 ? (
            <>
              <input type="number" name="salt" placeholder="Enter salt" className="p-4 outline-none rounded border-2 border-indigo-500 " value={salt} onChange={(e) => { setSalt(e.target.value); }} />
              <button className="rounded bg-indigo-500 text-[15px] font-bold p-4" onClick={createWallet}>Create Wallet</button>
            </>
          ) : (
            <>
              <h1 className="font-bold text-[28px]  text-indigo-500">Wallet address: {smartWalletAdd}</h1>
              <h1 className="font-bold text-[28px]  text-indigo-500">Wallet balance: {balance} ETH</h1>
              <div className="flex gap-[20px] py-[30px] justify-center items-start">
                <div className="flex flex-col gap-4">
                  <input type="text" placeholder="Enter reciever address" className=" p-4 outline-none rounded border-2 border-indigo-500 " value={recievrAddr} onChange={(e) => { setRecievrAddr(e.target.value); }} />
                  <input type="text" placeholder="Enter amount" className=" p-4 outline-none rounded border-2 border-indigo-500 " value={recievVal} onChange={(e) => { setRecievVal(e.target.value); }} />
                  <button className=" p-4 rounded bg-indigo-500  text-[15px] font-bold " onClick={send}>Send</button>
                </div>
                <div className="flex flex-col gap-4">
                  <input type="text" placeholder="Enter deposit amount" className=" p-4 outline-none rounded border-2 border-indigo-500 " value={depositVal} onChange={(e) => { setDepositVal(e.target.value); }} />
                  <button className="p-4 rounded bg-indigo-500 text-[15px] font-bold " onClick={deposit}>Deposit</button>
                </div>
              </div>
            </>
          )
        )
      }
    </div>
  )
}
