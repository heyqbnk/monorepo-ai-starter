import type { PageNavOptions } from '~pages/types';

export function navigateToHomePage(navOptions?: PageNavOptions) {
  return navigateTo(createHomePageNavParams(), navOptions);
}
