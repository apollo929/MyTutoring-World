import { IUser, ISubject, IMySubject } from '../user/interface';
import { IWebinar, ICoupon } from '../webinar/interface';

export interface ITransaction {
  _id?: string;
  tutor?: IUser;
  user?: IUser;
  webinar?: IWebinar;
  targetType?: string;
  subject?: ISubject;
  course?: any;
  type?: string;
  code?: string;
  price?: number;
  transaction?: any;
  createdAt?: string;
  status?: string;
  couponCode?: string;
  discountPrice?: number;
  couponInfo?: ICoupon;
  discountAmount?: number;
  balance?: number;
  usedCoupon?: boolean;
  tutorSubject?: IMySubject;
  applicationFee?: number;
}
