import * as migration_20261013_021037_initial from './20261013_021037_initial';
import * as migration_20261013_024129_validate_en from './20261013_024129_validate_en';
import * as migration_20261013_053959_content_collections from './20261013_053959_content_collections';
import * as migration_20261013_111929_contact_solutions_globals from './20261013_111929_contact_solutions_globals';
import * as migration_20261013_124501_measurement_forms from './20261013_124501_measurement_forms';
import * as migration_20261013_130318_english_only_required from './20261013_130318_english_only_required';

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
    name: '20261013_053959_content_collections',
  },
  {
    up: migration_20261013_111929_contact_solutions_globals.up,
    down: migration_20261013_111929_contact_solutions_globals.down,
    name: '20261013_111929_contact_solutions_globals',
  },
  {
    up: migration_20261013_124501_measurement_forms.up,
    down: migration_20261013_124501_measurement_forms.down,
    name: '20261013_124501_measurement_forms',
  },
  {
    up: migration_20261013_130318_english_only_required.up,
    down: migration_20261013_130318_english_only_required.down,
    name: '20261013_130318_english_only_required'
  },
];
