import {config} from 'dotenv';
import convict from 'convict';
import validators from 'convict-format-with-validator';

config();

const requiredEnvironmentVariables = ['PORT', 'DB_HOST', 'SALT', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

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
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
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
  dbPort: {
    doc: 'Порт базы данных',
    format: 'port',
    default: 27017,
    env: 'DB_PORT',
  },
  dbName: {
    doc: 'Имя базы данных',
    format: String,
    default: 'six-cities',
    env: 'DB_NAME',
  },
  dbUser: {
    doc: 'Имя пользователя базы данных',
    format: String,
    default: 'admin',
    env: 'DB_USER',
  },
  dbPassword: {
    doc: 'Пароль для подключения к базе данных',
    format: String,
    default: '',
    env: 'DB_PASSWORD',
  },
});

configSchema.validate({allowed: 'strict'});
