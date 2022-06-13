import { Pipe, PipeTransform } from '@angular/core';

/*
 * show default photo if it is not provided
 */
@Pipe({
  name: 'defaultImage'
})
export class DefaultImagePipe implements PipeTransform {
  transform(value: string): any {
    if (value) {
      return value;
    }

    return '/assets/images/no-image.jpg';
  }
}
