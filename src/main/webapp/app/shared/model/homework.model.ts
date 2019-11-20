import { Moment } from 'moment';

export interface IHomework {
  id?: string;
  fileName?: string;
  lastEditTime?: Moment;
}

export const defaultValue: Readonly<IHomework> = {};
