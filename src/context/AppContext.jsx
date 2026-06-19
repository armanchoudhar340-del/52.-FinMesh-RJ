import React, { createContext, useState, useEffect, useContext } from 'react';
import { Stack } from '../utils/Stack';
import { Queue } from '../utils/Queue';
import { CustomHashMap } from '../utils/HashMap';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// Helper to convert map to standard array of objects for easier rendering
const mapToArray = (map) => {
  const arr = [];
  map.forEach((value, key) => {
    arr.push({ address: key, ...value });
  });
  return arr;
};

// Initial Wallets Seed
const initialWallets = [
  { address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy", owner: "Arman Choudhary", BTC: 1.45, ETH: 15.2, SOL: 124.5, USDT: 12500 },
  { address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", owner: "Satoshi Nakamoto", BTC: 50.0, ETH: 250.0, SOL: 1500.0, USDT: 95000 },
  { address: "3EQ4GzB8q9mZ5F87tC17482hNmQviecrny", owner: "Vitalik Buterin", BTC: 0.1, ETH: 1240.5, SOL: 450.0, USDT: 420000 },
  { address: "3CdfGzB8q9mZ5F87tC17482hNmQviecrny", owner: "Elon Musk", BTC: 12.4, ETH: 80.0, SOL: 5200.0, USDT: 150000 }
];

export const AppProvider = ({ children }) => {
  // --- 1. FEATURE A: Wallet Balance Tracker (Map State) ---
  const [walletsMap, setWalletsMap] = useState(() => {
    const saved = localStorage.getItem('finmesh_wallets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const map = new Map();
        parsed.forEach(([key, val]) => {
          map.set(key, val);
        });
        return map;
      } catch (e) {
        console.error("Failed to parse local wallets:", e);
      }
    }
    const map = new Map();
    initialWallets.forEach(w => {
      map.set(w.address, { owner: w.owner, BTC: w.BTC, ETH: w.ETH, SOL: w.SOL, USDT: w.USDT });
    });
    return map;
  });

  // Convert map to array for standard view rendering
  const wallets = mapToArray(walletsMap);

  // Synchronize with localStorage on every state transition
  useEffect(() => {
    const entries = Array.from(walletsMap.entries());
    localStorage.setItem('finmesh_wallets', JSON.stringify(entries));
  }, [walletsMap]);

  const addWallet = (address, owner, BTC = 0, ETH = 0, SOL = 0, USDT = 0) => {
    if (walletsMap.has(address)) {
      throw new Error("Wallet address already exists in system!");
    }
    setWalletsMap(prev => {
      const next = new Map(prev);
      next.set(address, { owner, BTC, ETH, SOL, USDT });
      return next;
    });
    // Update hash map as well
    accountHashMap.set(address, { owner, created: new Date().toISOString().split('T')[0], type: "Retail Client", status: "Active" });
  };

  const editWallet = (address, owner, BTC, ETH, SOL, USDT) => {
    if (!walletsMap.has(address)) {
      throw new Error("Wallet not found!");
    }
    setWalletsMap(prev => {
      const next = new Map(prev);
      next.set(address, { owner, BTC, ETH, SOL, USDT });
      return next;
    });
  };

  const deleteWallet = (address) => {
    if (!walletsMap.has(address)) {
      throw new Error("Wallet not found!");
    }
    setWalletsMap(prev => {
      const next = new Map(prev);
      next.delete(address);
      return next;
    });
    accountHashMap.delete(address);
  };

  // --- 2. FEATURE D: Account ID Checker (Hash Map State) ---
  const [accountHashMap] = useState(() => {
    const hm = new CustomHashMap(12);
    initialWallets.forEach(w => {
      hm.set(w.address, { owner: w.owner, created: "2024-03-12", type: w.owner === "Satoshi Nakamoto" ? "Genesis Account" : "VIP Client", status: "Active" });
    });
    return hm;
  });

  const checkAccount = (address) => {
    return accountHashMap.get(address);
  };

  // --- 3. FEATURE B: Transaction Undo Log (Stack State) ---
  const [transactionStack, setTransactionStack] = useState(() => {
    return new Stack([
      { id: 1001, sender: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", receiver: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy", asset: "BTC", amount: 1.0, timestamp: Date.now() - 18000000, status: "SUCCESS" },
      { id: 1002, sender: "3EQ4GzB8q9mZ5F87tC17482hNmQviecrny", receiver: "3CdfGzB8q9mZ5F87tC17482hNmQviecrny", asset: "ETH", amount: 10.0, timestamp: Date.now() - 7200000, status: "SUCCESS" }
    ]);
  });

  const [rolledBackTransactions, setRolledBackTransactions] = useState([]);

  const executeTransaction = (sender, receiver, asset, amount, status = "SUCCESS") => {
    // Basic verification
    if (amount <= 0) {
      throw new Error("Transaction amount must be positive!");
    }
    if (sender !== "EXTERNAL") {
      const senderData = walletsMap.get(sender);
      if (!senderData) throw new Error("Sender wallet not found!");
      if (senderData[asset] < amount) throw new Error(`Insufficient ${asset} balance!`);
    }
    
    // Deduct and add
    setWalletsMap(prev => {
      const next = new Map(prev);
      if (sender !== "EXTERNAL") {
        const sData = next.get(sender);
        next.set(sender, { ...sData, [asset]: parseFloat((sData[asset] - amount).toFixed(6)) });
      }
      if (receiver !== "EXTERNAL" && next.has(receiver)) {
        const rData = next.get(receiver);
        next.set(receiver, { ...rData, [asset]: parseFloat((rData[asset] + amount).toFixed(6)) });
      }
      return next;
    });

    const txId = Math.floor(1000 + Math.random() * 9000);
    const newTx = {
      id: txId,
      sender,
      receiver,
      asset,
      amount,
      timestamp: Date.now(),
      status
    };

    setTransactionStack(prev => {
      const next = new Stack(prev.toBottomUpArray());
      next.push(newTx);
      return next;
    });

    return newTx;
  };

  const undoLastTransaction = () => {
    if (transactionStack.isEmpty()) {
      throw new Error("No transactions left to undo!");
    }

    let undoneTx = null;
    setTransactionStack(prev => {
      const bottomUp = prev.toBottomUpArray();
      const next = new Stack(bottomUp);
      undoneTx = next.pop();
      return next;
    });

    if (undoneTx) {
      // Revert balances if status was success
      if (undoneTx.status === "SUCCESS") {
        setWalletsMap(prev => {
          const next = new Map(prev);
          
          // Revert Sender (add back)
          if (undoneTx.sender !== "EXTERNAL" && next.has(undoneTx.sender)) {
            const sData = next.get(undoneTx.sender);
            next.set(undoneTx.sender, { 
              ...sData, 
              [undoneTx.asset]: parseFloat((sData[undoneTx.asset] + undoneTx.amount).toFixed(6)) 
            });
          }
          
          // Revert Receiver (deduct back)
          if (undoneTx.receiver !== "EXTERNAL" && next.has(undoneTx.receiver)) {
            const rData = next.get(undoneTx.receiver);
            next.set(undoneTx.receiver, { 
              ...rData, 
              [undoneTx.asset]: parseFloat((rData[undoneTx.asset] - undoneTx.amount).toFixed(6)) 
            });
          }
          
          return next;
        });
      }

      setRolledBackTransactions(prev => [
        { ...undoneTx, undoneAt: Date.now(), status: "UNDONE" },
        ...prev
      ]);
    }
    return undoneTx;
  };

  // Rollback a specific failed transaction (removes it or flips status)
  const rollbackFailedTx = (id) => {
    let targetTx = null;
    setTransactionStack(prev => {
      const list = prev.toBottomUpArray();
      const idx = list.findIndex(t => t.id === id);
      if (idx !== -1) {
        targetTx = list[idx];
        list.splice(idx, 1); // delete it from stack
      }
      return new Stack(list);
    });

    if (targetTx) {
      setRolledBackTransactions(prev => [
        { ...targetTx, undoneAt: Date.now(), status: "ROLLED_BACK" },
        ...prev
      ]);
    }
    return targetTx;
  };

  // --- 4. FEATURE C: Trade Settlement Queue (Queue State) ---
  const [tradeQueue, setTradeQueue] = useState(() => {
    return new Queue([
      { id: 3001, type: "BUY", asset: "BTC", quantity: 0.25, price: 67100, timestamp: Date.now() - 60000, walletAddress: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy" },
      { id: 3002, type: "SELL", asset: "ETH", quantity: 3.0, price: 3450, timestamp: Date.now() - 30000, walletAddress: "3EQ4GzB8q9mZ5F87tC17482hNmQviecrny" },
      { id: 3003, type: "BUY", asset: "SOL", quantity: 15.0, price: 145.5, timestamp: Date.now() - 10000, walletAddress: "3CdfGzB8q9mZ5F87tC17482hNmQviecrny" }
    ]);
  });

  const [settledTradesCount, setSettledTradesCount] = useState(14); // Simulated historical settled count
  const [totalTradesCount, setTotalTradesCount] = useState(17);

  const placeTrade = (type, asset, quantity, price, walletAddress) => {
    if (quantity <= 0 || price <= 0) {
      throw new Error("Quantity and price must be greater than zero!");
    }
    if (!walletsMap.has(walletAddress)) {
      throw new Error("Selected wallet address does not exist!");
    }

    const tradeId = Math.floor(3000 + Math.random() * 1000);
    const newTrade = {
      id: tradeId,
      type,
      asset,
      quantity,
      price,
      timestamp: Date.now(),
      walletAddress
    };

    setTradeQueue(prev => {
      const next = new Queue(prev.toArray());
      next.enqueue(newTrade);
      return next;
    });
    setTotalTradesCount(prev => prev + 1);
    return newTrade;
  };

  const processNextTrade = () => {
    if (tradeQueue.isEmpty()) {
      throw new Error("No pending trades in the settlement queue!");
    }

    let processedTrade = null;
    setTradeQueue(prev => {
      const next = new Queue(prev.toArray());
      processedTrade = next.dequeue();
      return next;
    });

    if (processedTrade) {
      // Execute the balance change
      const totalCost = processedTrade.quantity * processedTrade.price;
      const addr = processedTrade.walletAddress;
      const asset = processedTrade.asset;

      try {
        if (processedTrade.type === "BUY") {
          // Deduct USDT, add Crypto
          const walletData = walletsMap.get(addr);
          if (walletData.USDT < totalCost) {
            throw new Error(`Insufficient USDT (needs $${totalCost.toFixed(2)})`);
          }
          
          setWalletsMap(prev => {
            const next = new Map(prev);
            const data = next.get(addr);
            next.set(addr, {
              ...data,
              USDT: parseFloat((data.USDT - totalCost).toFixed(2)),
              [asset]: parseFloat((data[asset] + processedTrade.quantity).toFixed(6))
            });
            return next;
          });

          // Log transaction
          executeTransaction("EXTERNAL", addr, asset, processedTrade.quantity, "SUCCESS");
        } else {
          // SELL: Deduct Crypto, add USDT
          const walletData = walletsMap.get(addr);
          if (walletData[asset] < processedTrade.quantity) {
            throw new Error(`Insufficient ${asset} balance (needs ${processedTrade.quantity})`);
          }

          setWalletsMap(prev => {
            const next = new Map(prev);
            const data = next.get(addr);
            next.set(addr, {
              ...data,
              USDT: parseFloat((data.USDT + totalCost).toFixed(2)),
              [asset]: parseFloat((data[asset] - processedTrade.quantity).toFixed(6))
            });
            return next;
          });

          // Log transaction
          executeTransaction(addr, "EXTERNAL", asset, processedTrade.quantity, "SUCCESS");
        }

        setSettledTradesCount(prev => prev + 1);
        return { success: true, trade: processedTrade };
      } catch (err) {
        // Enqueue error as a failed transaction on the stack
        const txId = Math.floor(1000 + Math.random() * 9000);
        const failedTx = {
          id: txId,
          sender: processedTrade.type === "SELL" ? addr : "EXTERNAL",
          receiver: processedTrade.type === "BUY" ? addr : "EXTERNAL",
          asset: asset,
          amount: processedTrade.quantity,
          timestamp: Date.now(),
          status: `FAILED: ${err.message}`
        };

        setTransactionStack(prev => {
          const next = new Stack(prev.toBottomUpArray());
          next.push(failedTx);
          return next;
        });

        throw new Error(`Trade Settlement Failed: ${err.message}`);
      }
    }
  };

  // --- 5. FEATURE F: Price Difference Hub (Exchange Prices) ---
  const [exchangePrices, setExchangePrices] = useState({
    BTC: { A: 67120.50, B: 67180.00, C: 67090.20 },
    ETH: { A: 3450.40, B: 3445.10, C: 3458.60 },
    SOL: { A: 145.20, B: 146.10, C: 144.80 }
  });

  const [arbitrageLogs, setArbitrageLogs] = useState([]);

  // Price Feed Ticking Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangePrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(asset => {
          Object.keys(next[asset]).forEach(ex => {
            // Fluctuate prices by a small margin (-0.15% to +0.15%)
            const percent = (Math.random() * 0.3 - 0.15) / 100;
            next[asset][ex] = parseFloat((next[asset][ex] * (1 + percent)).toFixed(2));
          });
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const triggerArbitrage = (asset, amount, bestBuyEx, bestSellEx, profit) => {
    // Add profit to the first wallet (Arman's Wallet)
    const targetAddress = "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy";
    
    setWalletsMap(prev => {
      const next = new Map(prev);
      if (next.has(targetAddress)) {
        const data = next.get(targetAddress);
        next.set(targetAddress, {
          ...data,
          USDT: parseFloat((data.USDT + profit).toFixed(2))
        });
      }
      return next;
    });

    // Create a transaction record
    const tx = executeTransaction("EXTERNAL", targetAddress, "USDT", profit, "SUCCESS");

    // Add log
    setArbitrageLogs(prev => [
      {
        id: Math.floor(8000 + Math.random() * 1000),
        asset,
        amount,
        buyFrom: bestBuyEx,
        sellTo: bestSellEx,
        profit,
        timestamp: Date.now(),
        txId: tx.id
      },
      ...prev
    ]);
  };

  // Safe conversions / state calculations
  const totalWalletsCount = wallets.length;
  
  // Custom price lookup helper
  const getAssetPrice = (asset) => {
    if (exchangePrices[asset]) {
      // average price across exchanges
      const p = exchangePrices[asset];
      return (p.A + p.B + p.C) / 3;
    }
    // fallbacks
    if (asset === 'USDT') return 1;
    if (asset === 'ADA') return 0.45;
    if (asset === 'DOGE') return 0.12;
    return 10;
  };

  const getPortfolioValue = () => {
    let total = 0;
    wallets.forEach(w => {
      total += w.BTC * getAssetPrice('BTC');
      total += w.ETH * getAssetPrice('ETH');
      total += w.SOL * getAssetPrice('SOL');
      total += w.USDT * 1;
    });
    return parseFloat(total.toFixed(2));
  };

  const totalPortfolioValue = getPortfolioValue();

  return (
    <AppContext.Provider value={{
      // Feature A (Wallets)
      wallets,
      walletsMap,
      totalWalletsCount,
      totalPortfolioValue,
      addWallet,
      editWallet,
      deleteWallet,
      getAssetPrice,

      // Feature B (Undo transaction stack)
      transactionStack,
      rolledBackTransactions,
      executeTransaction,
      undoLastTransaction,
      rollbackFailedTx,

      // Feature C (Trades queue)
      tradeQueue,
      settledTradesCount,
      totalTradesCount,
      placeTrade,
      processNextTrade,

      // Feature D (HashMap Account ID Checker)
      checkAccount,
      accountHashMap,

      // Feature F (Price Difference Hub)
      exchangePrices,
      arbitrageLogs,
      triggerArbitrage
    }}>
      {children}
    </AppContext.Provider>
  );
};
