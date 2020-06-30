import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class TransactionsRepository extends Repository<Category> {
  public async createIfNotExists(title: string): Promise<Category> {
    const foundCategory = await this.findOne({
      where: { title },
    });

    if (foundCategory) return foundCategory;

    const newCategory = this.create({
      title,
    });
    await this.save(newCategory);

    return newCategory;
  }
}

export default TransactionsRepository;
