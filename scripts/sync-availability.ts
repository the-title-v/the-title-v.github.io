import { resolve } from 'node:path';
import { createAvailabilityService } from './lib/calendar-source';
import { writeAvailabilitySnapshot } from './lib/availability-snapshot';

const getAvailability = createAvailabilityService({
  getFeedUrl: feed => process.env[feed === 'bright' ? 'AIRBNB_ICAL_BRIGHT' : 'AIRBNB_ICAL_COZY'],
});

try {
  await writeAvailabilitySnapshot(resolve('.cache/availability.json'), getAvailability);
  console.log('Updated all three availability snapshots; only blocked dates and check timestamps will be published.');
} catch {
  console.error('Calendar import incomplete. Check the two private calendar secrets and retry. No deployment should proceed.');
  process.exitCode = 1;
}
