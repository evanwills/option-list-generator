
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
  /**
   * Error message to show user
   */
  error: string
}
export interface IInputOptionImportHead {
  value : number,       // 0
  label : number,       // 1
  default : number,     // 2
  show : number,        // 3
  group : number,       // 4
  hideBefore : number,  // 5
  hideAfter : number,   // 6
}


export interface IEventData {
  index: number,
  action: string,
  field: string,
  value: string
}


/**
 * List of key/value pairs where the value is always a string
 *
 * Often used for Redux Action lists for a given slice of state
 */
 export interface IObjNum {
  [index: string]: number
}
