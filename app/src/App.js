import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import deploy from './deploy';
import './App.css'; 

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}


function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    if (!account) {
      getAccounts();
    }
  }, [account]);

  const handleApprove = async (address) => {
    const escrowContract = escrows.find(e => e.address === address);
    await approve(escrowContract.contract, signer);
    setEscrows(escrows => escrows.map(e => {
      if (e.address === address) {
        return { ...e, approved: true };
      }
      return e;
    }));
  };

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseEther(document.getElementById('ETH').value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    const formattedDateTime = new Date().toISOString();

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      formattedDateTime,
      value: ethers.utils.formatEther(value),
      approved: false,
      contract: escrowContract
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <div className="app">
      <div className="contract-form">
        <h1>New Contract</h1>
        <div className="form-field">
          <label>Arbiter Address</label>
          <input type="text" id="arbiter" className="input-field" />
        </div>
        <div className="form-field">
          <label>Beneficiary Address</label>
          <input type="text" id="beneficiary" className="input-field" />
        </div>
        <div className="form-field">
          <label>Deposit Amount (in ETH)</label>
          <input type="text" id="ETH" className="input-field" />
        </div>
        <button className="deploy-button" onClick={newContract}>
          Deploy
        </button>
      </div>
      

      <div className="existing-contracts">
        <h1>Existing Contracts</h1>
        <table className="contracts-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Beneficiary</th>
              <th>Arbiter</th>
              <th>Amount (ETH)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {escrows.map((escrow, index) => (
              <tr key={index} id={escrow.address}>
                <td>{escrow.formattedDateTime}</td>
                <td>{escrow.beneficiary}</td>
                <td>{escrow.arbiter}</td>
                <td>{escrow.value}</td>
                <td>
                {escrow.approved ? (
                  <span className="status approved">✓ Approved</span>
                ) : (
                  <button className="approve-button" onClick={() => handleApprove(escrow.address)}>
                    Approve
                  </button>
                )}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
);
}

export default App;