import { PolicyType } from "@/apis/enums/PolicyType";

export interface PolicyCreateRequestDto{
    policyTitle: string;
    policyDescription? : string;
    policyType: PolicyType;
    totalPriceAchieve? : number;
    discountPercent? : number;
    startDate? : string;
    endDate? : string;
}

export interface PolicyUpdateRequestDto{
    policyDescription? : string;
    totalPriceAchieve? : number;
    discountPercent? : number;
    startDate? : string;
    endDate? : string;
}