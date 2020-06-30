import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import loadCsv from '../util/loadCsv';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const importedTransactions = await loadCsv(filename);
    const createTransaction = new CreateTransactionService();
    const importedIncomesTransactions = importedTransactions.filter(
      transaction => transaction.type === 'income',
    );
    const importedOutcomeTransactions = importedTransactions.filter(
      transaction => transaction.type === 'outcome',
    );
    const createdIncomeTransactions = await Promise.all(
      importedIncomesTransactions.map(createTransaction.execute),
    );
    const createdOutcomeTransactions = await Promise.all(
      importedOutcomeTransactions.map(createTransaction.execute),
    );

    return [...createdIncomeTransactions, ...createdOutcomeTransactions];
  }
}

export default ImportTransactionsService;
