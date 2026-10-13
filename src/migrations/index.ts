import * as migration_20261013_021037_initial from './20261013_021037_initial';
import * as migration_20261013_024129_validate_en from './20261013_024129_validate_en';

export const migrations = [
  {
    up: migration_20261013_021037_initial.up,
    down: migration_20261013_021037_initial.down,
    name: '20261013_021037_initial',
  },
  {
    up: migration_20261013_024129_validate_en.up,
    down: migration_20261013_024129_validate_en.down,
    name: '20261013_024129_validate_en'
  },
];
