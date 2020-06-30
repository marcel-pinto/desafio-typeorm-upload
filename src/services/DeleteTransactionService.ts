import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    try {
      await transactionRepository.delete({ id });
    } catch {
      throw new AppError('Invalid transaction id.');
    }
  }
}

export default DeleteTransactionService;
