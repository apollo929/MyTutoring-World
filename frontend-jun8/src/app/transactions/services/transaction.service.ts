import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class TransactionService {
  constructor(private restangular: Restangular) {}
  search(params: any): Promise<any> {
    return this.restangular.one('payment/transactions').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('payment/transactions', id).get().toPromise();
  }

  findOneTransactionCourse(tutorId: string, transactionId: string): Promise<any> {
    return this.restangular.one(`courses/${tutorId}/transaction/${transactionId}`).get().toPromise();
  }

  getTransactionsOfTutor(params: any): Promise<any> {
    return this.restangular.one('payment/transactions-of-tutor').get(params).toPromise();
  }
}
