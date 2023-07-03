import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const abi = process.env.ABI;

  const [enteredNumber, setEnteredNumber] = useState(0);
  const [storeLoader, setStoreLoader] = useState(false);
  const [contract, setContract] = useState(null);
  const [guessed, setGuessed] = useState(false);

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
        const providerVar = new ethers.providers.Web3Provider(instanceVar);
        const signer = providerVar.getSigner();
        const smartContract = new ethers.Contract(contractAddress, abi, signer);
        setContract(smartContract);
        const balance = await providerVar.getBalance(contractAddress);
        if (!Number(balance._hex).toString().includes('3')) {
          setGuessed(true);
        }

        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async function guessNumber() {
    if (contract == null) {
      await initWallet();
    } else {
      try {
        setStoreLoader(true);
        const guessNumTX = await contract.guessNumber(enteredNumber);
        if (guessNumTX === true) {
          alert("Hurray you guessed it!");
        } else {
          alert("That wasn't correct, try again.");
        }
        setStoreLoader(false);
        return;
      } catch (error) {
        alert(error);
        setStoreLoader(false);
        return;
      }
    }
  }

  function getRandomNumber() {
    const baseNumber = Math.floor(Math.random() * 1001); // 0 to 1000
    const complexity = Math.floor(Math.random() * 51); // Random complexity between 0 and 50
    const direction = Math.random() < 0.5 ? -1 : 1; // Random direction: -1 or 1
    return baseNumber + (complexity * direction);
  }

  async function setNumber() {
    const randomNumber = getRandomNumber();
    if (contract == null) {
      await initWallet();
    } else {
      setStoreLoader(true);
      try {
        const val = ethers.utils.parseEther('3'); // Convert 3 ethers to wei
        const tx = await contract.setNumber(randomNumber, { value: val });
        await tx.wait();
        setStoreLoader(false);
      } catch (error) {
        console.error(error.message);
        setStoreLoader(false);
      }
    }
  }

  useEffect(() => {
    initWallet();
  }, []);

  return (
    <div className='m-6 space-y-4'>
      <Head>
        <title>Check Your Luck</title>
      </Head>
      <h1 className="text-gray-700 text-3xl font-bold">
        Feeling Lucky?
      </h1>
      <h1>{guessed === true ? "Ohh! someone already guessed it." : "The reward is waiting for you."}</h1>
      <h3>Guess the number below (from 0 to 1000) and win <b>3 Sepolia ETH.</b></h3>
      <div>
        <input
          onChange={(e) => {
            setEnteredNumber(e.target.value);
          }}
          className="placeholder-italic transition-all placeholder-gray-500 w-4/6 border border-gray-500 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          placeholder="Enter a number to guess"
          type="text"
          name="guess"
        />
      </div>

      <button
        onClick={guessNumber}
        className='px-4 py-1 bg-slate-300 flex justify-around hover:bg-slate-500 transition-all w-32'
      >
        {storeLoader ? (
          <svg
            className="animate-spin m-1 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75 text-gray-700"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <span>Guess</span>
        )}
      </button>
      <hr /><br />
      <span className="pt-[10px]">For project hoster to reset number and fund the contract again ⚡.</span><br />
      <button
        onClick={setNumber}
        className='px-4 py-1 bg-slate-300 flex justify-around hover:bg-slate-500 transition-all w-32'
      >
        {storeLoader ? (
          <svg
            className="animate-spin m-1 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75 text-gray-700"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <span>Set number</span>
        )}
      </button>

    </div>
  );
}
