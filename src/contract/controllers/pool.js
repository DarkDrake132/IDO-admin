import Pool from "../class/Pool"
import Big from "big.js";

let decimals = 18

export async function deployContract(
    web3,
    tokenAddress,
    tokenForSale,
    tradeValue,
    startTime,
    endTime,
    minimumAmount,
    ownerAddress,
    feePercent
) {
    try {
        const address = await Pool.create(
            web3,
            tokenAddress,
            (new Big(tokenForSale)).mul(new Big(10 ** decimals)).toFixed().toString(),
            (new Big(tradeValue)).mul(new Big(10 ** decimals)).toFixed().toString(),
            startTime.toString(),
            endTime.toString(),
            (new Big(minimumAmount)).mul(new Big(10 ** decimals)).toFixed().toString(), 
            ownerAddress,
            (process.env.REACT_APP_FEETAKER_ADDRESS).toString(),
            feePercent
        )

        console.log("Pool address: " + address)
        return address;
    } catch (error) {
        console.log('deploy pool err: ', error)
    }
}

export const getPool = async (web3, poolAddress) => {
    const pool = new Pool()
    await pool.init(web3, poolAddress, true)
    return pool;
}

export const addWhitelist = async (web3, poolAddress, whitelist) => {
    try {
      const pool = await getPool(web3, poolAddress)

      let accounts = [];
      let maxAmount = [];
      for (let i = 0; i < whitelist.length; i++) {
          accounts.push(whitelist[i]["UserAddress"])
          maxAmount.push((new Big(whitelist[i]["MaxAmount"])).mul(new Big(10 ** decimals)).toFixed().toString())
      }

      await pool.addToWhitelist(accounts, maxAmount)
    }
    catch(err) {
      throw err
    }
    
    //console.log(await pool.whitelist)
}

export const getSignerAddress = async (web3, poolAddress) => {
    const pool = new Pool()
    await pool.init(web3, poolAddress, true)
    return await pool.signer;
}

export const isWhitelisted = async (web3, poolAddress, address ) => {
    const pool = await getPool(web3, poolAddress)
    return await pool.isWhitelisted(address)
    //console.log(await pool.isWhitelisted(address))
}