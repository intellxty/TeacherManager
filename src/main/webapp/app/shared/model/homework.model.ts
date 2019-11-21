import { Moment } from 'moment';

export interface IHomework {
  id?: string;
  fileName?: string;
  owner?: string;
  className?: string;
  editTime?: Moment;
}

export const defaultValue: Readonly<IHomework> = {};
