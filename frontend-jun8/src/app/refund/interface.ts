import { IUser, ISubject } from '../user/interface';
import { IWebinar } from '../webinar/interface';

export interface IRefund {
  _id?: string;
  tutor?: IUser;
  webinar?: IWebinar;
  subject?: ISubject;
  amount?: number;
  reason?: string;
  createdAt?: string;
  status?: string;
}
