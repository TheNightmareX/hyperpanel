import { config } from 'dotenv';
import { env } from 'process';

config();

export const PORT = num('PORT');
export const DB_PATH = str('DB_PATH');
export const DEBUG = bool('DEBUG');

function num(name: string) {
  const value = Number(env[name]);
  if (isNaN(value)) throw `Environment variable "${name}" must be a number`;
  return value;
}

function str(name: string) {
  return env[name];
}

function bool(name: string) {
  const raw = env[name];
  const value = raw == 'true' ? true : raw == 'false' ? false : null;
  if (value == null) throw `Environment variable "${name}" must be a boolean`;
  return value;
}
