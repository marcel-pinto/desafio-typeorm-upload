import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

interface Data {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

export default async function loadCsvTransaction(
  filename: string,
): Promise<Data[]> {
  const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp', filename);
  const csvStream = fs.createReadStream(csvFilePath);
  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCsv = csvStream.pipe(parseStream);

  const data: Data[] = [];
  parseCsv.on('data', ([title, type, value, category]) => {
    data.push({
      title,
      type,
      value,
      category,
    });
  });

  await new Promise(resolve => parseCsv.on('end', resolve));
  return data;
}
