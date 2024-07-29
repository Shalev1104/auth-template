import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { datasourceOptions } from '../config/datasource-options';

const dataSource = new DataSource(datasourceOptions);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
