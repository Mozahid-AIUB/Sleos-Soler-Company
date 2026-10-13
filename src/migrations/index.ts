import * as migration_20261013_021037_initial from './20261013_021037_initial';
import * as migration_20261013_024129_validate_en from './20261013_024129_validate_en';
import * as migration_20261013_053959_content_collections from './20261013_053959_content_collections';

export const migrations = [
  {
    up: migration_20261013_021037_initial.up,
    down: migration_20261013_021037_initial.down,
    name: '20261013_021037_initial',
  },
  {
    up: migration_20261013_024129_validate_en.up,
    down: migration_20261013_024129_validate_en.down,
    name: '20261013_024129_validate_en',
  },
  {
    up: migration_20261013_053959_content_collections.up,
    down: migration_20261013_053959_content_collections.down,
    name: '20261013_053959_content_collections'
  },
];
