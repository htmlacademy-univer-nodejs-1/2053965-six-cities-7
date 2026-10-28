import {config} from 'dotenv';
import convict from 'convict';
import validators from 'convict-format-with-validator';

config();

const requiredEnvironmentVariables = ['PORT', 'DB_HOST', 'SALT'];

for (const variableName of requiredEnvironmentVariables) {
  if (!process.env[variableName]) {
    throw new Error(
      `Переменная окружения ${variableName} не задана`,
    );
  }
}

convict.addFormats(validators);

export type RestSchema = {
  port: number;
  dbHost: string;
  salt: string;
};

export const configSchema = convict<RestSchema>({
  port: {
    doc: 'Порт приложения',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  dbHost: {
    doc: 'IP-адрес базы данных',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'DB_HOST',
  },
  salt: {
    doc: 'Соль для хеширования',
    format: String,
    default: '',
    env: 'SALT',
  },
});

configSchema.validate({allowed: 'strict'});
