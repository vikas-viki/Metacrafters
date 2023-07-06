// imports
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useEffect, useState } from 'react';
import Head from 'next/head';
export default function Home() {

  const contractAddress = process.env.CONTRACT_ADDRESS;
  const abi = process.env.ABI;

  const [contract, setContract] = useState(null);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [vestingPeriod, setVestingPeriod] = useState({ days: "", hours: "", minutes: '' });
  const [type, setType] = useState(null);
  const [isOrg, setIsOrg] = useState(false);
  const [signer, setSigner] = useState(null);
  const [registerClicked, setRegisterClicked] = useState(false);
  const [vestors, setVestors] = useState([{ address: "", type: "founder", whiteListed: false, amount: "" }]);
  const [org, setOrg] = useState();
  const [loading, setLoading] = useState(false);
  const [orgs, setOrgs] = useState(null);
  const [withdrawOrg, setWithdrawOrg] = useState("");
  const [remainingTime, setRemainingTime] = useState("");

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
        console.log(smartContract);
        setContract(smartContract);
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async function checkIfConnected() {
    if (contract == null) {
      initWallet();
    }
  }

  async function checkIfOrg() {
    try {
      await checkIfConnected();
      setLoading(true);
      const tx = await contract.isOrg(signer.address);
      if (tx == true) {
        setIsOrg(true);
        const _org = await contract.getOrgDetails(signer.address);
        console.log(_org);
        setOrg(_org);
      }
      setLoading(false);
    } catch (error) {

    }
  }

  async function getOrg(_org) {
    try {
      const tx = await contract.getOrgDetails(_org);
      const timestamp = Number(tx[6]); // Replace with your actual timestamp
      const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
      const formattedDate = date.toString();
      setRemainingTime(formattedDate);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    initWallet();
  }, []);

  function changeVestors(e, index, field) {
    const vests = vestors.map((attribute, i) => {
      if (i === index) {
        return {
          ...attribute,
          [field]: field === "whiteListed" ? e.target.checked : e.target.value,
        };
      }
      return attribute;
    });
    setVestors(vests);
    console.log(vests);
  }

  function convertToTimestamp(obj) {
    const secondsPerMinute = 60;
    const secondsPerHour = 60 * 60;
    const secondsPerDay = 24 * (60 * 60);

    const { days, hours, minutes } = obj;
    const timestamp = (Number(days) * secondsPerDay) + (Number(hours) * secondsPerHour) + (Number(minutes) * secondsPerMinute);
    return timestamp;
  }

  async function registerOrg() {
    try {
      checkIfConnected();
      var whitelist = [];
      var stakeholders = [];
      var holderType = [];
      var vesterAmt = [];
      var vestingTime = convertToTimestamp(vestingPeriod);
      console.log({ vestingPeriod })
      var totalVestAmt = 0;
      vestors.map(el => {
        whitelist.push(el.whiteListed);
        stakeholders.push(el.address);
        holderType.push(el.type);
        vesterAmt.push(el.amount);
        totalVestAmt += el.amount;
      });
      if (totalVestAmt > tokenSupply) {
        alert('Vested amount is greater than total supply.');
        return;
      }
      console.log(signer.address, tokenName, tokenSupply, tokenSymbol, vestingTime, whitelist, stakeholders, holderType, vesterAmt)
      const tx = await contract.register(signer.address, tokenName, tokenSupply, tokenSymbol, vestingTime, whitelist, stakeholders, holderType, vesterAmt);
      console.log(tx);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  function getDate(_timeStamp) {
    const timestamp = Number(_timeStamp) * 1000; // Convert to milliseconds
    console.log(_timeStamp);
    const date = new Date(timestamp);

    return String(date).split(" (")[0];
  }

  async function getOrgs() {
    try {
      checkIfConnected();
      const tx = await contract.getOrgs();
      setOrgs(tx);
      getOrg(tx[0][0]);
    } catch (error) {
      console.log(error);
    }
  }

  async function withdraw() {
    try {
      if (withdrawOrg.length == 0) {
        console.log(signer.address, orgs[0][0]);
        const tx = await contract.withdrawTokens(signer.address, orgs[0][0]);
        console.log(tx);
      } else {
        console.log(signer.address, withdrawOrg);
        const tx = await contract.withdrawTokens(signer.address, withdrawOrg);
        console.log(tx);
      }
    } catch (error) {
      alert(error.message.split(": \"")[1].split("\" (")[0]);
      console.log(error);
    }
  }

  return (
    <main className="flex w-full items-center justify-center flex-col flex-wrap">
      <Head>
        <title>Vesting</title>
      </Head>
      <h1 className="font-bold text-[40px] leading-4 p-[20px] mt-[20px] mb-[40px]">Vesting</h1>
      <div className="flex w-full flex-col gap-[30px] items-center justify-center border-b-2 py-[20px] border-indigo-500">
        <div className="flex gap-[30px]">
          <button className="border-2 rounded-[6px] border-indigo-500 bg-indigo-500 p-[10px] font-semibold" onClick={() => { setType("stakeholder"); getOrgs(); }}>Stakeholder</button>
          <button className="border-2 rounded-[6px] border-indigo-500 bg-indigo-500 p-[10px] font-semibold" onClick={() => { setType("Organization"); checkIfOrg(); }}>Organization</button>
        </div>
      </div>
      <hr />
      <div className="my-[50px] ">
        {type !== null && (
          type === "stakeholder" ? (
            (orgs != null && orgs[0].length > 0) ? (
              <div className="flex gap-[30px] w-full justify-center items-center">
                <span>{remainingTime}</span>
                <select className="p-[7px] text-[15px] border-2 border-black outline-none rounded" onChange={(e) => { setWithdrawOrg(e.target.value); getOrg(e.target.value); }}>
                  {orgs[0].map((el, i) => {
                    return <option value={el} key={i}>{orgs[1][i]}</option>
                  })}
                </select>
                <button className="border-2 rounded-[6px] border-sky-600 bg-sky-600 p-[10px] font-semibold m-auto w-full" onClick={withdraw}>Withdraw</button>
              </div>
            ) : (
              <h1 className="text-[20px]">No Organisations has registered yet.</h1>
            )

          ) : (
            (isOrg == true && org !== undefined && loading == false) ? (
              <div className="flex flex-col items-center justofy-center gap-[30px]">
                <h1 className="text-[24px] font-bold">Welcome back!</h1>
                <div className="flex flex-col gap-[20px] items-start justify-start">
                  <span className="text-[20px] font-semibold">Name: {org[0]}</span>
                  <span className="text-[20px] font-semibold">Symbol: {org[1]}</span>
                  <span className="text-[20px] font-semibold">Total Supply: {Number(org[2])}</span>
                  <span className="text-[20px] font-semibold">Vesting time: {getDate(org[6])}</span>
                  <table className="border-collapse border-2 border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 border-b-2 border-gray-300">Address</th>
                        <th className="p-2 border-b-2 border-gray-300">Whitelisted</th>
                        <th className="p-2 border-b-2 border-gray-300">Type</th>
                        <th className="p-2 border-b-2 border-gray-300">Amount</th>
                        <th className="p-2 border-b-2 border-gray-300">Withdrawn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {org[3].map((el, i) => (
                        <tr key={i} className={`${i % 2 === 0 ? "bg-gray-100" : "bg-white"} items-center justify-center text-center`}>
                          <td className="p-2 border-2 border-gray-300">{el}</td>
                          <td className="p-2 border-2 border-gray-300">{String(org[4][i])}</td>
                          <td className="p-2 border-2 border-gray-300">{org[5][i]}</td>
                          <td className="p-2 border-2 border-gray-300">{Number(org[8][i])}</td>
                          <td className="p-2 border-2 border-gray-300">
                            {org[7][i] === true ? (
                              <span className="font-bold text-[20px] rounded-[50%] py-[3px] px-[12px] cursor-pointer select-none bg-green-500 text-white">+</span>
                            ) : (
                              <span className="font-bold text-[20px] rounded-[50%] py-[3px] px-[12px] cursor-pointer select-none bg-orange-500 text-white">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>


                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col flex-wrap gap-[30px] justify-center items-center">
                <button className="border-2 rounded-[6p6] border-sky-600 bg-sky-500 p-[10px] font-semibold" onClick={() => { setRegisterClicked(true); }}>Register as Organization</button>
                {
                  registerClicked === true && (
                    <form className="flex flex-col flex-wrap gap-[30px] justify-start items-start" onSubmit={(e) => { e.preventDefault(); registerOrg(); }}>
                      <div className="flex flex-col flex-wrap gap-[10px] justify-center items-start">
                        <h2 className="font-semibold">Token details*</h2>
                        <div className="w-full flex justify-around gap-[30px]">
                          <input type="text" className="p-[7px] text-[15px] border-2 border-black outline-none rounded" required placeholder="Token name" value={tokenName} onChange={(e) => { setTokenName(e.target.value); }} />
                          <input type="text" className="p-[7px] text-[15px] border-2 border-black outline-none rounded" required placeholder="Token Supply" value={tokenSupply} onChange={(e) => { setTokenSupply(e.target.value); }} />
                          <input type="text" className="p-[7px] text-[15px] border-2 border-black outline-none rounded" required placeholder="Token Symbol" value={tokenSymbol} onChange={(e) => { setTokenSymbol(e.target.value); }} />
                        </div>
                      </div>
                      <div className="flex flex-col flex-wrap gap-[10px] justify-center items-start">
                        <h2 className="font-semibold">Vesting period*</h2>
                        <div className="w-full flex justify-around gap-[30px]">
                          <input type="number" className="p-[7px] text-[15px] border-2 border-black outline-none rounded" min={'0'} placeholder="Days" value={vestingPeriod.days} onChange={(e) => { setVestingPeriod({ ...vestingPeriod, days: Number(e.target.value) }); }} />
                          <input type="number" className="p-[7px] text-[15px] border-2 border-black outline-none rounded" min={'0'} placeholder="Hours" value={vestingPeriod.hours} onChange={(e) => { setVestingPeriod({ ...vestingPeriod, hours: Number(e.target.value) }); }} />
                          <input type="number" className="p-[7px] text-[15px] border-2 border-black outline-none rounded" min={'0'} placeholder="Minutes" value={vestingPeriod.minutes} onChange={(e) => { setVestingPeriod({ ...vestingPeriod, minutes: Number(e.target.value) }); }} />
                        </div>
                      </div>
                      <div className="flex flex-col flex-wrap gap-[15px] justify-center items-start">
                        <h2 className="font-semibold">Stake holders*</h2>

                        {vestors?.map((el, i) => (
                          <div className="w-full flex justify-around gap-[30px]" key={i}>
                            <input type="text" className="p-[7px] text-[15px] border-2 border-black outline-none rounded" value={el.address} onChange={(e) => { changeVestors(e, i, 'address'); }} placeholder="Address" />
                            <select className="p-[7px] text-[15px] border-2 border-black outline-none rounded" onChange={(e) => { changeVestors(e, i, 'type'); }} >
                              <option value="founder">Founder</option>
                              <option value="investor">Investor</option>
                              <option value="pre-sale-buyer">Pre sale Buyer</option>
                              <option value="community">Community</option>
                            </select>
                            <div className="flex gap-[5px] items-center justify-center">
                              <input type="checkbox" id={`whitelist${i}`} onChange={(e) => { changeVestors(e, i, 'whiteListed'); }} className="p-[7px] text-[20px] w-[25px] h-[25px] border-2 border-black outline-none rounded" checked={el.whiteListed} />
                              <label htmlFor={`whitelist${i}`}>Whitelist</label>
                            </div>
                            <input type="number" className="p-[7px] text-[15px] border-2 border-black outline-none rounded" value={el.amount} required onChange={(e) => { changeVestors(e, i, 'amount'); }} placeholder="Vested Amount" />
                            <span className="font-bold text-[20px] rounded-[50%] py-[3px] px-[12px] cursor-pointer select-none bg-slate-500" onClick={() => { setVestors([...vestors, { address: "", type: "investor", whiteListed: false, amount: 0 }]); }}>+</span>
                          </div>
                        ))}
                      </div>
                      <button type="submit" className="border-2 rounded-[6px] border-sky-500 bg-sky-500 p-[10px] font-semibold m-auto w-full">Register</button>
                    </form>
                  )
                }
              </div>
            )
          )
        )}
      </div>
    </main>
  );
}

/*
  re factor the uri of org dertails andd verification that vested amount for anybody must not be 0.
*/