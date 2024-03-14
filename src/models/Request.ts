import { AccountDetail } from "./Account";
import { EdgeBox } from "./EdgeBox";
import { ShopDetail } from "./Shop";

export type Request = {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    requestType: string;
    accountId: string;
    shopId: string;
    edgeBoxId: string;
    detail: string;
    reply: string;
    requestStatus: string
    account: AccountDetail;
    shop: ShopDetail;
    edgeBox: EdgeBox;
};