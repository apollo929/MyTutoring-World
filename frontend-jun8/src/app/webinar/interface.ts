import { ISubject, IUser } from '../user/interface';
import { ICategory } from '../categories/interface';
import { IMylesson } from '../user/interface';

export interface IWebinar {
  _id?: string;
  name?: string;
  tutor?: IUser;
  tutorId?: string;
  price?: number;
  maximumStrength?: number;
  categoryIds?: any;
  isOpen?: boolean;
  mediaIds?: string[];
  mainImageId?: string;
  description?: string;
  category?: ICategory[];
  lastDate?: string;
  createdAt?: string;
  mainImage?: IMainImage;
  lastSlot?: IMylesson;
  coupon?: ICoupon;
  numberParticipants?: number;
  isFavorite?: boolean;
  ratingAvg?: number;
  totalRating?: number;
  ratingScore?: number;
  alias?: string;
  featured?: boolean;
  media?: any[];
  isFree?: boolean;
  gradeIds?: any[];
  booked?: boolean;
  subjectIds?: string[];
  topicIds?: string[];
  latestSlot?: any;
}

export interface IMainImage {
  fileUrl?: string;
  thumbUrl?: string;
}

export interface ICoupon {
  _id?: string;
  type?: string;
  value?: number;
  discountAmount?: number;
  startTime?: string;
  expiredDate?: string;
  targetType?: string;
  code?: string;
  couponCode?: string;
}
