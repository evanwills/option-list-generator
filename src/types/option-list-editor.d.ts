
export interface ISingleInputOption {
  /**
   * Whether or not this option should be checked/selected by default
   */
  default : boolean,
  /**
   * Group the option belongs to
   */
  group : string,
  /**
   * Human readable label for the option (what users see)
   */
  label : string|number,
  /** Whether or not this option will be rendered for end users */
  show : boolean,
  /**
   * The value of the option
   * (Also used as the label for the option if the label is empty)
   */
  value : string|number,
  /**
   * ISO 8601 date/time string
   * Allows users to provide a date, before which, the option is
   * hidden
   */
  hideBefore : string,
  /**
   * ISO 8601 date/time string
   * Allows users to provide a date, after which, the option is
   * hidden
   */
  hideAfter : string,
}


export interface IEventData {
  index: number,
  action: string,
  field: string,
  value: string
}
