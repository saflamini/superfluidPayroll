// import web3 from "web3";

// import SuperfluidSDK from "@superfluid-finance/js-sdk";
// import TruffleContract from "@truffle/contract"; 
// import detectEthereumProvider from '@metamask/detect-provider';
import BigNumber from "bignumber.js";


export const fUSDC_address = "0xc94dd466416A7dFE166aB2cF916D3875C049EBB7";
export const fUSDCx_address = "0x8aE68021f6170E5a766bE613cEA0d75236ECCa9a";
export const CFAv1_address = "0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8";


export function calculateFlowRate(salary) {
    let fr = salary / (86400 * 30)
    return Math.floor(fr);
}

export function calculateSalary(flowRate) {
    const sal = new BigNumber(flowRate * (86400 * 30)).shiftedBy(-18);
    return sal.toFixed(2);
}

//hard coded to monthly
export function calculateSalPerSecond(sal) {
    let salSecond = sal / (86400 * 30);
    return salSecond;
}

export function calculateEndDate(bal, outflow) {
    let t = Number(bal) / (Number(outflow) * -1);
    let secondsLeft = t * 86400 * 30;
    let end = new Date(Date.now() + (secondsLeft * 1000));
    let endDay = end.toLocaleString();
    return endDay;
}


