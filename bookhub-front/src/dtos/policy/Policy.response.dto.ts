import { PolicyType } from "@/apis/enums/PolicyType";

export interface PolicyDetailResponseDto{
    policyTitle: string;
    policyDescription : string;
    policyType: PolicyType;
    totalPriceAchieve : number;
    discountPercent : number;
    startDate : string;
    endDate : string;
}

export interface PolicyListResponseDto{
    policyId: number;
    policyTitle: string;
    policyType: PolicyType;
    startDate : string;
    endDate : string;
}