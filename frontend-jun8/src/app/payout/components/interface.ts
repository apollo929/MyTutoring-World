export interface IPayoutAccount{
    _id?: string;
    type?: string;
    paypalAccount?: string;
    accountHolderName?: string;
    accountNumber?: string;
    iban?: string;
    bankName?: string;
    bankAddress?: string;
    sortCode?: string;
    routingNumber?: string;
    swiftCode?: string;
    ifscCode?: string;
    routingCode?: string;
    createdAt?: string;
}

export interface IPayoutRequest{
    _id?: string;
    createdAt?: string;
    total?: number;
    commission?: number;
    balance?: number;
    status?: string;
}
