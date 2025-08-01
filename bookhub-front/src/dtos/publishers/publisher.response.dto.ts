export interface PublisherResponseDto{
    publisherId : number;
    publisherName: string;
}


export interface PublisherListResponseDto{
    publisherList : PublisherResponseDto[];
}