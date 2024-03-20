import { AccountDetail } from "./Account";
import { EdgeboxDetail } from "./Edgebox";
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
  requestStatus: string;
  account: AccountDetail;
  shop: ShopDetail;
  edgeBox: EdgeboxDetail;
};
