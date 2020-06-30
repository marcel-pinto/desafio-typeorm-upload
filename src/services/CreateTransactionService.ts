import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CategoryRepository from '../repositories/CategoriesRepository';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    const balance = await transactionRepository.getBalance();

    if (balance.total < value && type === 'outcome') {
      throw new AppError('You do not have enough balance to this transaction');
    }
    const transactionCategory = await categoryRepository.createIfNotExists(
      category,
    );

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
