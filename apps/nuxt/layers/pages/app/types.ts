/**
 * Options controlling *how* a navigation is performed, as opposed to *where* it leads.
 *
 * Every `navigateToXxxPage` function accepts this as its last argument, so a caller can
 * replace the current navigation entry instead of pushing a new one, without the page's
 * own parameters and the navigation behaviour getting mixed into a single object.
 */
export interface PageNavOptions {
  /**
   * Replace the current navigation entry instead of pushing a new one.
   *
   * Use it when returning to the current page makes no sense — for example, after
   * completing a flow, so the back button skips the step that is already done.
   * @default false
   */
  replace?: boolean;
}
