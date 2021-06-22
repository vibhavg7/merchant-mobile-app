import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'myDatePipe'
})
export class MyDatePipePipe implements PipeTransform {

transform(value: any, ...args: any[]): any {
  const yourDate = new Date(value).toLocaleString();
  const d = yourDate + ' UTC';
  const utcDate = new Date(d);
  const format = 'dd-MM-yyyy HH:mm';
  console.log(value);
  console.log(yourDate.toLocaleString());
  console.log(new Date(d));
  console.log(new DatePipe('en-US').transform(d, format));
  return new DatePipe('en-US').transform(d, format);
}
}
