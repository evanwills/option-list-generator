
export interface ISingleInputOptionSimple {
  /**
   * The value of the option
   * (Also used as the label for the option if the label is empty)
   */
  value : string,
  /**
   * Human readable label for the option (what users see)
   */
  label ? : string,
  /**
   * Whether or not this option should be checked/selected by default
   * [default: `false`]
   */
  selected ? : boolean,
  /**
   * Whether or not this option will be rendered for end users
   * [default: `true`]
   */
  hide ? : boolean,
  /**
   * Group the option belongs to
   */
  group ? : string,
  /**
   * ISO 8601 date/time string
   * Allows users to provide a date, before which, the option is
   * hidden
   */
  hideBefore ? : string,
  /**
   * ISO 8601 date/time string
   * Allows users to provide a date, after which, the option is
   * hidden
   */
  hideAfter ? : string,
  /**
   * Title attribute for `<OPTION>`
   *
   * Sometimes it's useful to have some explanitory text to give
   * users more information about an option.
   *
   * `<OPTION>` title
   * attributes are shown to the user on hover and read aloud by
   * screen readers.
   */
  title ? : string
}

export interface ISingleInputOption extends ISingleInputOptionSimple {
  /**
   * The value of the option
   * (Also used as the label for the option if the label is empty)
   */
  value : string,
  /**
   * Human readable label for the option (what users see)
   */
  label : string,
  /**
   * Whether or not this option should be checked/selected by default
   * [default: `false`]
   */
  selected : boolean,
  /**
   * Whether or not this option will be rendered for end users
   * [default: `true`]
   */
  hide : boolean,
  /**
   * Group the option belongs to
   */
  group : string,
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
   * Title attribute for `<OPTION>`
   *
   * Sometimes it's useful to have some explanitory text to give
   * users more information about an option.
   *
   * `<OPTION>` title
   * attributes are shown to the user on hover and read aloud by
   * screen readers.
   */
  title: string
}


/**
 * Data about the most recent event within `<option-list-editor>`
 * that resulted in a externally relevent change
 */
export interface IEventData {
  /**
   * Index of the option that triggered the event
   *
   * > __NOTE:__ This will be -1 for actions that don't apply to
   *             individual options:
   *             * ADD
   *             * SORT
   *             * APPEND_IMPORTED
   *             * IMPORT_REPLACE
   */
  index: number,
  /**
   * Action that `<option-list-editor>` wants the client to know about
   *
   * > __NOTE:__ Only actions that result in valid outcomes will
   *             trigger an event
   */
  action: string,
  /**
   * For UPDATE & TOGGLE events the field represents the option
   * property that was changed. For all other events field is empty
   */
  field: string,
  /**
   * For UPDATE events value is the new value after update
   */
  value: string
}

export interface IOptionGroup {
  label: string,
  options: Array<ISingleInputOption>
}

/**
 * Index of known columns in the import data
 */
export interface IInputOptionImportHead {
  value : number,       // 0
  label : number,       // 1
  selected : number,    // 2
  hide : number,        // 3
  group : number,       // 4
  hideBefore : number,  // 5
  hideAfter : number,   // 6
  title : number,       // 7
}
