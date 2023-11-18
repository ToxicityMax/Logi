import { Transform } from 'class-transformer';

export function TransformDateToTimestamp(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value).getTime();
    }
    return value;
  });
}
