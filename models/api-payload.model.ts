interface VerifyWallet {
    words: string;
    walletAddress: string;
    signature: string;
}

export interface CompanyVerifyWallet extends VerifyWallet {
    name: string;
    description: string;
    email: string;
    pointName: string;
    pointSymbol: string;
}

export interface  CustomerVerifyWallet extends VerifyWallet {

}