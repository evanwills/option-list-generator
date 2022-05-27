import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { IEventData, ISingleInputOption, IInputOptionImportHead, IOptionGroup } from './types/option-list-editor.d';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
 @customElement('option-list-editor')
 export class OptionListEditor extends LitElement {

  // ======================================================
  // START: Attribute declarations

  /**
   * How options are to be rendered
   */
  @property({ reflect: true, type: String })
  mode : string = 'select';

  /**
   * Whether or not to hide the value input field
   */
  @property({ type: Boolean })
  hideValue : boolean = false;

  /**
   * Whether or not to hide disabled options
   *
   * i.e. Never render disabled options
   */
  @property({ type: Boolean })
  hideHidden: boolean = false;

  /**
   * Whether or not to hide demo of options
   */
  @property({ type: Boolean })
  hideDemo: boolean = false;

  /**
   * Whether or not to show the option group field
   */
  @property({ type: Boolean })
  showGroup : boolean = false;

  /**
   * Whether or not options can be sorted by client
   */
  @property({ type: Boolean })
  noSort : boolean = false;

  /**
   * Whether or not to allow editors to bulk import options using
   * delimited text
   */
  @property({ type: Boolean })
  alllowImport : boolean = false;

  /**
   * Whether or not to allow options with duplicate labels or values
   */
  @property({ type: Boolean })
  allowDuplicate : boolean = false;

  /**
   * Whether or not to allow multiple options to be
   * selected/checked by default
   */
  @property({ type: Boolean })
  allowMulti : boolean = false;

  /**
   * Whether or not to allow "Hide before" & "Hide after" date/time
   * input field to be shown/hidden
   */
  @property({ type: Boolean })
  allowHideByDate : boolean = false;

  /**
   * Whether or not to allow options to be grouped
   */
  @property({ type: Boolean })
  allowGroup : boolean = false;

  /**
   * Whether or not to allow the first option in the list to have an
   * empty value
   *
   * By default, options are forced to have a non-empty value and
   * label. If `allowEmptyDefault` is `TRUE`, the first option will
   * only be required to have a non-empty label
   */
  @property({ type: Boolean })
  allowEmptyFirst : boolean = false;

  /**
   * Whether or not options are editable
   */
  @property({ type: Boolean })
  readonly : boolean = false;

  /**
   * Whether or not "Hide before" date/time input field is shown
   */
  @property({ type: Boolean })
  showHideBefore : boolean = false;

  /**
   * Whether or not "Hide after" date/time input field is shown
   */
  @property({ type: Boolean })
  showHideAfter : boolean = false;

  /**
   * Whether or not to put grouped options after ungrouped options
   */
  @property({ type: Boolean })
  groupedLast : boolean = false;


  //  END:  Attribute declarations
  // ======================================================
  // START: Property declarations


  /**
   * Whether or not to do basic component initialisation stuff
   */
  @state()
  public doInit : boolean = true;

  /**
   * List of options
   */
  @state()
  public options : Array<ISingleInputOption> = [];

  /**
   * Whether or not to do basic component initialisation stuff
   */
   @state()
  public eventData : IEventData = {
    index: -1,
    action: '',
    field: '',
    value: ''
  };


  /**
   * Whether or not import modal should be visible
   */
  private _showImportModal : boolean = false;

  /**
   * Whether or not import data includes header row
   */
  private _importHasHeader : boolean = false;

  /**
   * Whether or not import data is valid
   */
  private _importIsValid : boolean = false;

  /**
   * Import data TSV/CSV text
   */
  private _importData : string = '';

  /**
   * Column separator for import data
   */
  private _importSep : string = '\t';


  private _colCount : number = 2;

  private _groupNames : Array<string> = [];

  private _firstIsEmpty : boolean = false;

  // private _canAdd : boolean = true;
  // private _focusIndex : number = -1;
  // private _focusField : string = '';


  //  END:  Property declarations
  // ======================================================
  // START: Styling


  static styles = css`
  :host {
    --wc-font-size: 1rem;
    --wc-border-radius: 0.9rem;
    /* --wc-text-colour: rgb(0, 0, 0); */
    --wc-text-colour: rgb(255, 255, 255);
    --wc-bg-colour: #2d2b2b;

    --wc-line-width: 0.075rem;
    --wc-max-width: 30rem;

    --wc-error-bg-colour: rgb(150, 0, 0);
    --wc-error-text-colour: rgb(255, 255, 255);

    --wc-font: Arial, Helvetica, sans-serif;
    --wc-heading-font: Verdana, Geneva, Tahoma, sans-serif;
    --wc-input-font: 'Courier New', Courier, monospace;

    --wc-outline-width: 0.25rem;
    --wc-outline-style: dotted;
    --wc-outline-offset: 0.2rem;

    font-size: var(--wc-font-size);
    background-color: var(--wc-bg-colour);
    color:  var(--wc-text-colour);
    font-family: inherit;
    font-size: inherit;s
    --font-family: Arial, Helvetica, sans-serif;
    font-family: var(--font-family);
    background-color: var(--wc-bg-colour);
  }
  * {
    background-color: var(--wc-bg-colour);
    color: var(--wc-text-colour);
    font-family: var(--wc-font);
    box-sizing: border-box;
  }
  .whole {
    position: relative;
    padding-bottom: 2rem;
  }
  h1, h2, h3, h4 {
    font-family: var(--wc-heading-font);
  }
  button {
    border-radius: var(--wc-border-radius);
    border-width: var(--wc-line-width);
    border-color: var(--wc-text-colour);
    padding: 0.3rem 0.5rem;
    display: inline-block;
  }
  input , textarea {
    padding: 0.3rem 0.5rem;
    font-family: var(--wc-input-font);
  }
  .sr-only {
    border: 0;
    clip: rect(0, 0, 0, 0);
    clip-path: inset(100%);
    height: 1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
  .single-option__wrap {
    list-style-type: none;
    padding: 0;
    margin: 0 0 1rem 0;
    counter-reset: option
  }
  .single-option {
    border-bottom: var(--wc-line-width) solid var(--wc-text-colour);
    column-gap: 0.6rem;
    display: grid;
    grid-template-areas: 'pos value move'
                         'pos label move'
                         'pos group move'
                         'pos toggle move'
                         'pos date move';
    grid-template-columns: 1.5rem 1fr 6rem;
    /* margin-top: 1rem; */
    padding: 1rem 0.5rem 1rem 0;
    row-gap: 0.4rem;
  }
  li.is-shown::before {
    content: counter(option);
  }
  li::before {
    grid-area: pos;
    text-align: right;
    padding-top: 0.2rem;
    padding-right: 0.3rem;
  }
  li.is-hidden::before {
    content: '-';
  }
  li.is-readonly {
    grid-template-areas: 'pos value'
                         'pos label'
                         'pos group'
                         'pos toggle'
                         'pos date';
    grid-template-columns: 2rem 1fr;
  }
  .is-shown {
    counter-increment: option;
  }
  .label {
    display: inline-block;
    text-transform: capitalize;
  }
  .label::after {
    content: ':';
  }
  .input {
    display: inline-block;
    font-family: 'Courier New', Courier, monospace;
  }
  .label--value { width: 3rem; }
  .input--value { width: calc(100% - 3.3rem); }
  .label--label { width: 2.8rem; }
  .input--label { width: calc(100% - 3.1rem); }
  .label--group { width: 3.2rem; }
  .input--group { width: calc(100% - 4rem); }
  .toggle-btn {
    display: inline-block;
    text-transform: capitalize;
    margin-right: 1rem;
  }
  /* .toggle-btn:last-child {
    margin-right: 0;
  } */
  .value-block {
    grid-area: value;
    padding-bottom: 0.4rem;
  }
  .label-block {
    grid-area: label;
    /* padding-bottom: 0.4rem; */
  }
  .group-block {
    grid-area: group;
    /* padding-bottom: 0.4rem; */
  }
  .toggle-block {
    grid-area: toggle;
    display: flex;
    /* align-content: center; */
  }
  .toggle-block > button {
    align-self: center;
  }

  .date-block {
    /* grid-area: date; */
    /* padding-bottom: 0.4rem; */
    flex-grow: 1;
    text-align: center;
  }
  .move-block {
    grid-area: move;
    align-self: center;
    /* padding-left: 0.3rem; */
  }
  .move-block > button {
    display: inline-block;
    width: 100%;
    margin-top: 0.2rem;
  }
  .move-block > button:first-child {
    margin-top: 0;
  }
  .is-middle .move-block > button:first-child {
    border-top-left-radius: calc(var(--wc-border-radius) * 3);
    border-top-right-radius: calc(var(--wc-border-radius) * 3);
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-width: calc(var(--wc-line-width / 2));
    margin-bottom: calc(var(--wc-line-width * -1));
  }
  .is-middle .move-block > button:last-child {
    margin-top: 0;
    border-top-width: calc(var(--wc-line-width / 2));
    border-bottom-left-radius: calc(var(--wc-border-radius) * 3);
    border-bottom-right-radius: calc(var(--wc-border-radius) * 3);
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }
  .hide-block {
    display: inline-block;
    white-space: nowrap;
  }
  .hide-block .label {
    display: inline-block;
    width: 6rem;
    text-align: right;
  }
  .hide-block .input {
    display: inline-block;
    width: 13.5rem;
  }
  .close-bg {
    background-color: #000;
    bottom: -2rem;
    left: -2rem;
    opacity: 0.7;
    position: fixed;
    right: -2rem;
    top: -2rem;
    width: 150%;
    z-index: 100;
  }
  .close {
    position: absolute;
    top: -0.75rem;
    right: -1.5rem;
  }
  .import-ui {
    border-radius: calc(var(--wc-border-radius) * 0.8);
    background-color: var(--wc-bg-colour);
    box-shadow: 0.5rem 0.5rem 1.5rem rgba(0, 0, 0, 0.8);
    border: var(--wc-line-width) solid var(--wc-text-colour);
    /* display: flex; */
    left: 4rem;
    /* min-height: 30rem; */
    padding: 1rem;
    position: fixed;
    right: 4rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 110;
  }
  .import-ui-inner {
    /* display: grid; */
    /* grid-template-columns: 1fr 1.5fr; */
    /* grid-template-rows: auto auto auto 1fr; */
    /* grid-template-areas:
      "errors errors"
      "regex regex"
      "sample controls"
      "sample results"; */
    /* grid-gap: 1rem; */
    position: relative;
  }
  .import-sep-input {
    display: inline-block;
    width: 2rem;
    margin-right: 1rem;
  }
  .import-data__wrap {
    width: 100%;
  }
  .import-data__label {
    display: block;
    padding-bottom: 0.3rem;
  }
  .import-data__input {
    display: block;
    width: 100%;
    height: 20rem;
  }
  .import-ui__head {
    margin: 0;
  }
  .add {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
  }
  .extra-controls {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
  }
  .extra-controls > button {
    margin-left: 1rem;
  }
  .demo {
    padding: 0.5rem;
    border: var(--wc-line-width) solid var(--wc-bg-colour);
    margin: 0;
  }
  .demo, .demo * {
    background-color: var(--wc-text-colour);
    color: var(--wc-bg-colour);
  }
  .demo select {
    border: var(--wc-line-width) solid var(--wc-bg-colour);
  }
  .demo-list {
    list-style-type: none;
    margin: 0;
    padding: 0.5rem 0 0 0.5rem;
  }
  .demo-list > li {
    margin: 0  1rem 0.5rem 0;
    padding: 0;
    display: inline-block;
  }

  @media screen and (min-width: 48rem) {
    .has-value {
      grid-template-areas: 'pos value label move'
                           'pos toggle toggle move';
      grid-template-columns: 1.5rem 0.4fr 1.6fr 6rem;
    }
    .has-group {
      grid-template-areas: 'pos label  group move'
                           'pos toggle toggle move';
      grid-template-columns: 1.5rem 1.6fr 0.4fr 6rem;
    }
    .has-value-and-group {
      grid-template-areas: 'pos value  label  group  move'
                           'pos toggle toggle toggle move';
      grid-template-columns: 1.5rem 0.5fr 1.5fr 0.5fr 6rem;
    }
    .has-value.has-date {
      grid-template-areas: 'pos value  label  move'
                           'pos  date   date  move'
                           'pos toggle toggle move';
      grid-template-columns: 1.5rem 0.5fr 1.5fr 6rem;
    }
    .has-group.has-date {
      grid-template-areas: 'pos label  group  move'
                           'pos  date   date  move'
                           'pos toggle toggle move';
      grid-template-columns: 1.5rem 1.5fr 0.5fr 6rem;
    }
    .has-value-and-group.has-date {
      grid-template-areas: 'pos value  label  group  move'
                           'pos  date   date   date  move'
                           'pos toggle toggle toggle move';
      grid-template-columns: 1.5rem 0.6fr 1.8fr 0.6fr 6rem;
    }
  }
  `;


  //  END:  Styling
  // ======================================================
  // START: Helper methods


  /**
   * Do basic initialisation stuff...
   *
   * Mostly validating attribute values and doing anything that would
   * normally be triggered by user input
   */
  private _init() : void {
     if (this.doInit) {
      this.doInit = false;

      if (typeof this.id !== 'string' || this.id === '') {
        throw new Error(
          'For accessibility reasons, <option-list-editor> ' +
          'expects an ID. The ID is prepended to all the IDs of ' +
          'all fields rendered within he <option-list-editor> to ' +
          'minimise the risk of accessibility issues.'
        );
      }

      const tmp = this.getElementsByTagName('option');
      this.mode = this.mode.trim().toLowerCase().replace(/[^a-z]+/ig, '');

      if (this.mode !== 'radio' && this.mode !== 'checkbox') {
        this.mode = 'select'
      }

      this.allowMulti = (this.mode === 'checkbox')
        ? true
        : this.allowMulti;

      this.options = [];

      this.allowGroup = (this.showGroup === true)
        ? true
        : this.allowGroup;

      this.allowHideByDate = (this.showHideBefore === true || this.showHideAfter === true)
        ? true
        : this.allowHideByDate;

      for (let a = 0; a < tmp.length; a += 1) {
        let groupLabel = '';

        // See if we need and are able to get the group name for this option
        if (this.allowGroup && tmp[a].parentElement instanceof HTMLOptGroupElement) {
          const optGrp = tmp[a].parentElement as HTMLOptGroupElement;

          groupLabel = (typeof optGrp.label === 'string')
            ? optGrp.label.trim()
            : '';

          if (groupLabel !== '' && this._groupNames.indexOf(groupLabel) < 0) {
            this._groupNames.push(groupLabel);
          }
        }

        const option : ISingleInputOption = {
          value: tmp[a].value,
          label: (tmp[a].innerText !== '')
            ? tmp[a].innerText
            : tmp[a].value,
          selected: tmp[a].selected,
          show: !tmp[a].disabled,
          group: groupLabel,
          hideBefore: (typeof tmp[a].dataset.hidebefore === 'string')
            ? tmp[a].dataset.hidebefore as string
            : '',
          hideAfter: (typeof tmp[a].dataset.hideafter === 'string')
            ? tmp[a].dataset.hidebefore as string
            : ''
        };

        if (option.label === '') {
          // Only new/added options can have an empty label
          // this option has no label so we'll ignore it.
          continue;
        }

        if (option.value === '') {
          if (this.options.length > 0 || !this.allowEmptyFirst) {
            option.value = option.label;
          }
        }

        this.options.push(option)

        if (option.hideBefore !== '') {
          this.showHideBefore = true;
        }
        if (option.hideAfter !== '') {
          this.showHideAfter = true;
        }
      }

      let c = 1;
      if (!this.hideValue) {
        c += 1;
      }
      if (this.showGroup) {
        c += 1;
      }
      this._colCount = c;
    }
  }

  /**
   *
   * @param options List of options to check
   * @returns
   */
  private _noDuplicates(options: Array<ISingleInputOption>) : boolean {
    if (this.allowDuplicate === true) {
      return true;
    }
    let ok = true;

    const val = [];
    const lab = [];

    for (let a = 0; a < options.length; a += 1) {
      if (val.indexOf(options[a].value) === -1) {
        val.push(options[a].value);
      } else {
        ok = false;
      }
      if (lab.indexOf(options[a].label) === -1) {
        lab.push(options[a].label);
      } else {
        ok = false;
      }
      // if (options[a].value === '' || options[a].label === '') {
      //   this._canAdd = false;
      // }
    }
    return ok;
  }

  /**
   * Check whether a single item can be deleted
   *
   * @param option Option to be tested
   *
   * @returns TRUE if the option is hidden of both value & label are empty
   */
  private _canBeDeleted(option : ISingleInputOption) : boolean {
    return (option.show === false || (option.value == '' && option.label === ''));
  }

  private _emptyIsOK(option : ISingleInputOption, index : number) : boolean {
    return (option.value !== '' || (index === 0 && this.allowEmptyFirst))
  }

  /**
   * Check wither it's OK to add another option
   *
   * @returns TRUE if it's OK to add another option, False otherwise
   */
  private _okToAdd() : boolean {
    for (let a = 0; a < this.options.length; a += 1) {
      if (this.options[a].label === '') {
        return false;
      }
      return this._emptyIsOK(this.options[a], a);
    }
    return true;
  }

  /**
   * Parse a string to see if it can be interpreted as TRUE
   *
   * @param input string that should be boolean
   *
   * @returns TRUE if string could be interpreted as boolean & TRUE
   */
  private _str2bool(input : string) : boolean {
    switch (input.toLowerCase().trim()) {
      case '1':
      case 'true':
      case 'yes':
      case 'on':
        return true;
      default:
        return false;
    }
  }

  /**
   * Get a string from imported data
   *
   * @param all    Whole array of imported data
   * @param index  Index for the row being processed
   * @param col    Column index for specific field
   * @param maxLen Maximum number of characters allowed
   *
   * @returns Column value if found or empty string if not
   */
  private _getStr(all : Array<Array<string>>, index : number, col : number, maxLen : number = 255) : string {
    return (col > -1 && Array.isArray(all[index]) && typeof all[index][col] === 'string')
      ? all[index][col].substring(0, maxLen)
      : '';
  }

  /**
   * Get a valid ISO 8601 date time string
   *
   * @param input Possible Date string
   *
   * @returns Valid ISO 8601 date/time string or empty string if
   *          input was invalid
   */
  private _getValidDate(input: string) : string {
    if (input.trim() === '') {
      return '';
    }

    const tmp = new Date(input);

    return (tmp.toString() !== 'Invalid Date')
      // looks like we have a valid date/time string
      ? tmp.toISOString().replace(/\.[0-9]+[a-z]$/i, '')
      // Out of luck
      : '';
  }

  /**
   * Get the header row for output data as separated text
   *
   * @param colSep Character(s) used to separate column headers
   *
   * @returns Header row for output data
   */
  private _getHeader(colSep : string) : string {
    let output = 'value' + colSep + 'label' + colSep + 'selected' + colSep + 'show';

    if (this.allowGroup) {
      output += colSep + 'group';
    }
    if (this.allowHideByDate) {
      output += colSep + 'hideBefore' +  colSep + 'hideAfter';
    }
    return output;
  }

  /**
   * Get data for a single option.
   *
   * @param index   Index of option whose data is to be returned
   * @param lineSep Output line separator
   * @param colSep  Output column separator
   *
   * @returns option data as separated text string
   */
  private _getRowByIndex(index: number, lineSep : string, colSep : string) : string {
    let output = '';

    if (typeof this.options[index] !== 'undefined') {
      output = lineSep + this.options[index].value +
               colSep  + this.options[index].label +
               colSep  + this.options[index].selected +
               colSep  + this.options[index].show;

      if (this.allowGroup) {
        output += colSep + this.options[index].group;
      }
      if (this.allowHideByDate) {
        output += colSep + this.options[index].hideBefore +
                  colSep + this.options[index].hideAfter;
      }
    }

    return output;
  }

  /**
   * Get option data as separate text
   *
   * By default this outputs Tab delimited text but can be
   * configured to any sort of delimited format
   *
   * @param lineSep Output line separator
   * @param colSep  Output column separator
   *
   * @returns option data as separated text string
   */
  public getData(lineSep : string = '\n', colSep : string = '') : string {
    const sep = (colSep !== '')
      ? colSep
      : this._importSep;
    let output = '';

    let line = '';

    for (let a = 0; a < this.options.length; a += 1) {
      output += this._getRowByIndex(a, line, sep);
      line = lineSep;
    }

    return output;
  }

  /**
   * Extract option data as string with header row
   *
   * @param lineSep Output line separator
   * @param colSep  Output column separator
   *
   * @returns String th
   */
  public getDataWithHeader(lineSep : string = '\n', colSep : string = '') : string {
    const sep = (colSep !== '')
      ? colSep
      : this._importSep;

    return this._getHeader(sep) + lineSep + this.getData(lineSep, sep);
  }

  /**
   * Get list of options as JSON object
   *
   * @returns JSON for list of options.
   */
  public toJSON() : string {
    return JSON.stringify(this.options);
  }

  /**
   * Get the index for each columns relevant to input option detaions
   *
   * @param headerRow Header row of import data
   *
   * @returns Object whos keys match ISingleInputOption keys and
   *          whose values match the column index in the import data
   */
  private _extractColumnIndexes(headerRow: Array<string>) : IInputOptionImportHead {

    // reset cols to make sure we don't get anything we don't want
    const cols = {
      value : -1,
      label : -1,
      selected : -1,
      show : -1,
      group : -1,
      hideBefore : -1,
      hideAfter : -1
    }

    for (let a = 0; a < headerRow.length; a += 1) {
      switch (headerRow[a].toLowerCase()) {
        case 'value':
          cols.value = a;
          break;
        case 'label':
          cols.label = a;
          break;
        case 'default':
        case 'selected':
        case 'checked':
          cols.selected = a;
          break;
        case 'visable':
        case 'show':
          cols.show = a;
          break;
        case 'group':
          cols.group = a;
          break;
        case 'hidebefore':
          cols.hideBefore = a;
          break;
        case 'hideafter':
          cols.hideAfter = a;
          break;
      }
    }

    return cols;
  }

  /**
   * Parse separated value text into a list of `ISingleInputOption`s
   *
   * @returns An array of `ISingleInputOption`s
   */
  private _parseImport() : Array<ISingleInputOption> {
    const output : Array<ISingleInputOption> = [];
    const tmp : Array<Array<string>> = [];
    this._importIsValid = false;

    if (this._importData.trim() === '') {
      // Nothing to do so lets get out of here
      return output;
    }

    const sep = (this._importSep !== '')
      ? this._importSep
      : '\t';
    const tmp1 = this._importData.split('\n');

    for (let a = 0; a < tmp1.length; a += 1) {
      if (tmp1[a].trim() !== '') {
        const tmp2 : Array<string> = tmp1[a].split(sep);
        const tmp3 : Array<string> = [];

        for (let b = 0; b < tmp2.length; b += 1) {
          tmp3.push(tmp2[b].trim().replace(/\s+/g, ' '));
          if (b > 10) {
            // We only want seven columns.
            // If they can't get it right in eleven we'll
            // give up for this row
            continue;
          }
        }

        tmp.push(tmp3);
      }
    }

    let start = 0;
    let cols : IInputOptionImportHead = {
      value : 0,
      label : 1,
      selected : 2,
      show : 3,
      group : 4,
      hideBefore : 5,
      hideAfter : 6
    }

    if (this._importHasHeader) {
      // Try and process the header row
      cols = this._extractColumnIndexes(tmp[0]);

      // Start processing data at the second row
      start = 1;
    }

    if (cols.value === -1 || cols.label === -1) {
      // we don't have enough info to keep going
      return output;
    }
    const uniqueValues : Array<string> = [];
    const uniqueLabels : Array<string> = [];

    for (let a = start; a < tmp.length; a += 1) {
      const opt : ISingleInputOption = {
        value: this._getStr(tmp, a, cols.value, 128),
        label: this._getStr(tmp, a, cols.label, 512),
        selected: this._str2bool(this._getStr(tmp, a, cols.selected, 4)),
        show: this._str2bool(this._getStr(tmp, a, cols.show, 4)),
        group: this._getStr(tmp, a, cols.group).substring(0, 64),
        hideBefore: this._getValidDate(this._getStr(tmp, a, cols.hideBefore, 64)),
        hideAfter: this._getValidDate(this._getStr(tmp, a, cols.hideAfter, 64))
      }

      if (opt.value === '' && opt.label !== '') {
        opt.value = opt.label;
      } else if (opt.value !== '' && opt.label === '') {
        opt.label = opt.value;
      }

      // Make sure the option is usable and unique
      if (opt.value !== '' &&
          opt.label !== '' &&
         (this.allowDuplicate === true ||
         (uniqueValues.indexOf(opt.value) === -1 &&
          uniqueLabels.indexOf(opt.label) === -1))
      ) {
        // We have enough to be going on with
        output.push(opt);

        // Add label and value to the list of unique
        uniqueValues.push(opt.value);
        uniqueLabels.push(opt.label);
      }
    }

    this._importIsValid = (output.length > 0);

    // Give back what we have
    return output;
  }

  /**
   * Get valid import seperator from supplied string
   *
   * @param sep string to be used as column seperator
   *
   * @returns valid import separator.
   */
  private _getImportSep(sep : string) : string {
    if (sep.substring(0, 1) === '\\') {
      switch (sep.toLowerCase()) {
        case '\\t':
          this._importSep = '\t';
          break;
        case '\\n':
          this._importSep = '\n';
          break;
        case '\\r':
          this._importSep = '\r';
          break;
        case '\\l':
          this._importSep = '\l';
          break;
        }
    } else {
      // I don't know why you'd need or want more than one or
      // two characters but just in case I'm allowing up to ten
      this._importSep = sep.substring(0, 10);
    }

    return this._importSep;
  }


  //  END:  Helper methods
  // ======================================================
  // START: Event handler (and sub handlers)


  /**
   * Get an event handler function that can be set as an event
   * listener for all inputs and buttons
   *
   * @returns An event handler function
   */
  private _getHandler() {
    const data = this;
    return (e: Event) => {
      const input = e.target as HTMLInputElement;

      // Get only the bits of the ID that we need
      const bits = input.id.replace(/^.*?____(?=[0-9]+__[a-z]+)/i, '').split('__');
      let ok = false;
      const ind = parseInt(bits[0]);
      const field = (typeof bits[2] === 'string')
        ? bits[2].toLowerCase()
        : ''

      // Document stuff from the event that the outside world needs
      // to know about
      let output = {
        index: -1,
        action: '',
        field: '',
        value: ''
      }

      switch(bits[1]) {
        case 'toggle':
          if (field === 'show') {
            ok = data._toggleShow(ind);
          } else if (field === 'selected') {
            ok = this._toggleSelected(ind);
          }
          output = {
            index: ind,
            action: 'TOGGLE',
            field: field,
            value: ''
          }
          break;

        case 'update':
          ok = data._update(ind, field, input.value);
          output = {
            index: ind,
            action: 'UPDATE',
            field: field,
            value: input.value
          }
          break;

        case 'move':
          ok = data._move(ind, input.value);
          output.action = 'MOVE';
          output.index = ind;
          break;

        case 'delete':
          ok = data._delete(output.index);
          output.action = 'DELETE';
          output.index = ind;
          break;

        case 'add':
          ok = data._add();
          output.action = 'ADD';
          break;

        case 'sort':
          ok = data._sort();
          output.action = 'SORT';
          break;

        case 'groupShow':
          this.showGroup = !this.showGroup;
          break;

        case 'valueShow':
          this.hideValue = !this.hideValue;
          break;

        case 'hideBeforeShow':
          this.showHideBefore = !this.showHideBefore;
          break;

        case 'hideAfterShow':
          this.showHideAfter = !this.showHideAfter;
          break;

        case 'showImportModal':
          this._showImportModal = !this._showImportModal;
          this.requestUpdate();
          break;

        case 'updateImportSep':
          output.value = this._getImportSep(output.value);
          break;

        case 'toggleImportHasHead':
          this._importHasHeader = !this._importHasHeader;
          break;

        case 'updateImportData':
          this._importIsValid = false;
          this._importData = output.value;
          break;

        case 'validateImport':
          this._parseImport();
          break;

        case 'importAppend':
          ok = data._import('append');
          output.action = 'APPENDIMPORTED';
          break;

        case 'importReplace':
          ok = data._import('replace');
          output.action = 'IMPORTREPLACE';
          break;
      }

      if (ok === true) {
        // Update event data
        this.eventData = output;

        // Dispatch a change a event so outside world knows
        // something happened
        data.dispatchEvent(new Event('change'));
      }
    }
  }

  /**
   * Move an option up or down the list relative to its current position
   *
   * @param index     Index of option to be moved
   * @param direction Direction to move ("up" or "down")
   *
   * @returns TRUE if option was moved up or down
   */
  private _move(index : number, direction: string) : boolean {
    const option = this.options.filter(
      (_option : ISingleInputOption, i : number) => (index === i)
    )
    const allOptions = this.options.filter(
      (_option : ISingleInputOption, i : number) => (index !== i)
    )
    const newInd = (direction.toLowerCase() === 'up')
      ? index - 1
      : index + 1;

    this.options = [
      ...allOptions.slice(0, newInd),
      option[0],
      ...allOptions.slice(newInd)
    ]
    return true;
  }

  /**
   * Toggle show/hide status of the specified option.
   *
   * @param index Index of option to be deleted
   *
   * @returns TRUE if option's property was updated, FALSE otherwise
   */
  private _toggleShow(index: number) : boolean {
    const output = [...this.options];
    let ok = false;

    for (let a = 0; a < output.length; a += 1) {
      if (index === a) {
        ok = true;
        output[a] =  {
          ...output[a],
          show: !output[a].show
        }
        break;
      }
    }

    if (ok === true) {
      this.options = output;
      return true;
    }
    return false;
  }

  /**
   * Toggle Selected status of the specified option
   *
   * @param index Index of option to be deleted
   * @param prop  Which option property should be updated
   *
   * @returns TRUE if option's property was updated, FALSE otherwise
   */
  private _toggleSelected(index: number) : boolean {
    const output = [...this.options];
    let ok = false;

    if (this.allowMulti) {
      for (let a = 0; a < output.length; a += 1) {
        if (index === a) {
          ok = true;
          output[a] =  {
            ...output[a],
            selected: !output[a].selected
          }
          break;
        }
      }
    } else {
      for (let a = 0; a < output.length; a += 1) {
        if (index === a) {
          ok = true;
          output[a] =  {
            ...output[a],
            selected: !output[a].selected
          }
        } else {
          output[a] =  {
            ...output[a],
            selected: false
          }
        }
      }
    }

    if (ok === true) {
      this.options = output;
    }

    return ok;
  }

  /**
   * Update one of the specified options text properties.
   *
   * @param index Index of option to be deleted
   * @param prop  Which option property should be updated
   * @param value New value for option property
   *
   * @returns TRUE if option's property was updated, FALSE otherwise
   */
  private _update(index : number, prop: string, value: string) : boolean {
    const output = [...this.options];
    let ok = false;
    let val = value.trim();

    for (let a = 0; a < output.length; a += 1) {
      if (index === a) {
        const tmp = { ...output[a] }

        switch (prop.toLowerCase()) {
          case 'label':
            tmp.label = val;
            ok = true;
            break;
          case 'value':
            tmp.value = val;
            ok = true;
            break;
          case 'group':
            tmp.group = val;
            ok = true;
            break;
          case 'hidebefore':
            tmp.hideBefore = val;
            ok = true;
            break;
          case 'hideafter':
            tmp.hideAfter = val;
            ok = true;
        }

        if (ok === true) {
          output[a] = tmp;
        }
        break;
      }
    }

    if (ok === true && this._noDuplicates(output)) {
      this.options = output;
      this.requestUpdate();
      return true;
    }
    return false;
  }

  /**
   * Sorting function used to sort options
   *
   * @param a First item to compare
   * @param b Second item to compare
   *
   * @returns -1 if option should move up the list,
   *           1 if item should move down the list or
   *           0 if item should not move
   */
   private _sortInnerLabel(a: ISingleInputOption, b: ISingleInputOption) : number {
    const labelA = (a.label as string).toLowerCase()
    const labelB = (b.label as string).toLowerCase()

    if (labelA < labelB) {
      return -1;
    } else if (labelA > labelB) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Sorting function used to sort options
   *
   * @param a First item to compare
   * @param b Second item to compare
   *
   * @returns -1 if option should move up the list,
   *           1 if item should move down the list or
   *           0 if item should not move
   */
  private _sortInnerGroupLabel(a: ISingleInputOption, b: ISingleInputOption) : number {
    const labelA = (a.label as string).toLowerCase()
    const labelB = (b.label as string).toLowerCase()
    const groupA = (a.group as string).toLowerCase()
    const groupB = (b.group as string).toLowerCase()

    if (a.value === '') {
      return -1;
    }

    if (groupA < groupB) {
      return -1;
    } else if (groupA > groupB) {
      return 1;
    } else {
      if (labelA < labelB) {
        return -1;
      } else if (labelA > labelB) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  /**
   * Sort options alphabetically by label (case insensitive)
   *
   * @returns TRUE if options were sorted
   */
  private _sort() : boolean {
    const options = [...this.options];

    options.sort(
      (this.showGroup)
        ? this._sortInnerGroupLabel
        : this._sortInnerLabel
    );

    this.options = options

    return true;
  }

  /**
   * Add a new option to the list of options
   *
   * @returns TRUE if new option could be appended to list,
   *          FALSE otherwise
   */
  private _add() : boolean {
    if (this._okToAdd()) {
      this.options.push({
        selected: false,
        group: '',
        label: '',
        show: true,
        hideAfter: '',
        hideBefore: '',
        value: ''
      });

      this.requestUpdate();

      return true;
    }
    return false;
  }

  /**
   * Delete a hidden or empty option from the list
   *
   * @param index Index of option to be deleted
   *
   * @returns TRUE if option was deleted, FALSE otherwise
   */
  private _delete(index: number) : boolean {
    let i = index;
    const len = this.options.length;

    this.options = this.options.filter(
      (option:ISingleInputOption, index: number) => {
        if (index === i && this._canBeDeleted(option)) {
          i = -1;
          return false;
        } else {
          return true;
        }
      }
    )

    return (len !== this.options.length);
  }

  /**
   * Import option fields as delimited text
   *
   * @param mode Append to or Replace current options
   *
   * @returns TRUE if options were imported. FALSE otherwise
   */
  private _import(mode: string) : boolean {
    const data : Array<ISingleInputOption> = this._parseImport();
    let ok = false;

    if (data.length > 0) {
      if (mode === 'append') {
        const tmp : Array<ISingleInputOption> = [];
        const uniqueValues : Array<string> = [];
        const uniqueLabels : Array<string> = [];

        for (let a = 0; a < this.options.length; a += 1) {
          if (this.allowDuplicate ||
             (uniqueValues.indexOf(this.options[a].value) === -1 &&
              uniqueLabels.indexOf(this.options[a].label) === -1)
          ) {
            uniqueValues.push(this.options[a].value)
            uniqueLabels.push(this.options[a].label)
            tmp.push(this.options[a]);
          }
        }
        for (let a = 0; a < data.length; a += 1) {
          if (this.allowDuplicate ||
             (uniqueValues.indexOf(data[a].value) === -1 &&
              uniqueLabels.indexOf(data[a].label) === -1)
          ) {
            uniqueValues.push(data[a].value)
            uniqueLabels.push(data[a].label)
            tmp.push(data[a]);
            ok = true;
          }
        }

        if (ok === true) {
          this.options = tmp;
        }
      } else {
        ok = true
        this.options = data;
      }

      if (ok === true) {
        this.requestUpdate();
        this._showImportModal = false
        this._importData = '';
      }
    }
    return ok;
  }


  //  END:  Event handler (and sub handlers)
  // ======================================================
  // START: Editable render methods


  /**
   * Get the contents of a date/time field (in read only mode)
   *
   * @param value Value of field
   * @param which Which field is being rendered
   * @param pos   Position of the option
   * @param show  Whether or not to show the text field
   *
   * @returns HTML for a read only text field
   *          (or empty string if show is false)
   */
  private _getReadonlyDateField(value: string, which: string, pos : number, show: boolean = false) : TemplateResult|string {
    if (show === false) {
      return '';
    }

    let val = '';
    if (value !== '') {
      const tmp = new Date(value);
      val = tmp.toLocaleString();
    }
    return html`
      <div class="hide-block hide${which}-block">
        <span class="label label--${which}">Hide <span class="sr-only">option ${pos}</span> ${which}</span>
        <span class="input input--${which}">${val}"
                class="input"
                placeholder="Hide option ${pos} ${which}" />
      </div>`;
  }

  /**
   * Get the HTML for the contents of a text field (in read only mode)
   *
   * @param value Value of field
   * @param which Which field is being rendered
   * @param pos   Position of the option
   * @param show  Whether or not to show the text field
   *
   * @returns HTML for a read only text field
   *          (or empty string if show is false)
   */
  private _getReadonlyTextField(value: string, which: string, pos : number, show: boolean = true) : TemplateResult|string {
    return (show === true)
      ? html`
          <div class="${which}-block">
            <span class="label label--${which}"><span class="sr-only">Option ${pos}</span> ${which}</span>
            <span class="input input--${which}">${value}</span>
          </div>`
      : '';
  }

  /**
   * Get all the HTML for a single readonly option
   *
   * @returns HTML template for readonly option
   */
  private _getSingleReadonlyOption() {
    const data = this;

    if (data.options.length === 0) {
      return
    }

    return (option: ISingleInputOption, index: number) : TemplateResult|string => {
      if (data.hideHidden && option.show === false) {
        return '';
      }

      const pos = index + 1;

      return html`
      <li class="cols-${data._colCount}${data._getColClass()}">
        ${this._getReadonlyTextField(option.value as string, 'value', pos, !data.hideValue)}
        ${this._getReadonlyTextField(option.label as string, 'label', pos)}
        ${this._getReadonlyTextField(option.group as string, 'group', pos, data.showGroup)}
        <div class="toggle-block">
          ${(!data.hideHidden)
            ? html`
              <span class="toggle-btn toggle-btn--show">
                ${this._getShowLabel(option.show, pos)}
              </span>`
            : ''
          }
          <span class="toggle-btn toggle-btn--selected">
            ${this._getSelectedLabel(option.selected, pos)}
          </span>
          ${this._getReadonlyDateField(option.hideBefore, 'before', pos, data.showHideBefore)}
          ${this._getReadonlyDateField(option.hideAfter, 'after', pos, data.showHideAfter)}
        </div>
      </li>`
    }
  }

  /**
   * Get a HTML for list of options in the component
   *
   * @returns HTML Template of all options in this component of a
   *          message saying there are no options
   */
  private _renderReadOnly() {
    return (this.options.length > 0)
      ? html`
        <ul>
          ${repeat(this.options, item => item.value, this._getSingleReadonlyOption())}
        </ul>`
      : html`<p><em>No options</em></p>`;
  }


  //  END:  Readonly render methods
  // ======================================================
  // START: Editable render methods


  /**
   * Get the HTML for the contents of a text field (in edit mode)
   *
   * @param value Value of field
   * @param which Which field is being rendered
   * @param pos   Position of the option
   * @param show  Whether or not to show the text field
   *
   * @returns HTML for an editable text field
   *          (or empty string if show is false)
   */
  private _getEditableTextField(value: string, which: string, pos : number, id: string, show: boolean, handler: Function) : TemplateResult|string {
    const listID = (this._groupNames.length > 0)
      ? '${id}${which}--options'
      : undefined

    return (show === true)
      ? html`
        <div class="${which}-block">
          <label for="${id}${which}" class="label label--${which}"><span class="sr-only">Option ${pos}</span> ${which}</label>
          <input type="text"
                 id="${id}update__${which}"
                .value="${value}"
                 class="input input--${which}"
                 placeholder="Option ${pos} ${which}"
                @change=${handler}
                 list="${ifDefined(listID)}" />
          ${(this._groupNames.length > 0)
            ? html`
              <datalist id="${listID}">
                ${this._groupNames.map(item => html`<option value="${item}">`)}
              </datalist>
            `
            : ''
          }
        </div>`
      : '';
  }

  /**
   * Get the HTML for the contents of a date/time field (in edit mode)
   *
   * @param value   Value of field
   * @param which   Which field is being rendered
   * @param pos     Position of the option within the list of all
   *                options in this component
   * @param show    Whether or not to show the text field
   * @param handler Event handler for the button
   *
   * @returns HTML for an editable date/time field
   *          (or empty string if show is false)
   */
  private _getEditableDateField(value: string, which: string, pos : number, id: string, show: boolean, handler: Function) : TemplateResult|string {

    if (show === false) {
      return '';
    }

    let val = '';
    if (value !== '') {
      const tmp = new Date(value);
      val = tmp.toLocaleString();
    }

    const fieldID = id + 'update__hide' + which

    return html`
        <div class="hide-block hide-block--${which}">
        <label for="${id}" class="label label--${which}">Hide <span class="sr-only">option ${pos}</span> ${which}</label>
          <input type="datetime-local"
                id="${fieldID}"
               .value="${val}"
                class="input input--${which}"
                placeholder="Hide option ${pos} ${which}"
               @change=${handler} />
        </div>`;
  }

  /**
   * Get a button element to move an option up or down
   *
   * @param id      ID of option
   * @param where   Direction to move the option (either "up" or
   *                "down")
   * @param pos     Position of the option within the list of all
   *                options in this component
   * @param show    Whether or not this buttion should be rendered
   * @param handler Event handler for the button
   *
   * @returns An HTML template button for moving the option
   */
  private _getMoveBtn(id: string, where : string, pos: number, show: boolean, handler: Function) : TemplateResult|string {
    return (show === true)
      ? html`
      <button id="${id}move" value="${where}" class="mv-btn mv-btn--${where}" @click=${handler}>
        Move
        <span class="sr-only">option ${pos}</span>
        ${where}
      </button>`
      : '';
  }

  /**
   * Get a button element to toggle an option property
   *
   * @param id      ID of option
   * @param value   Current state of the option property
   * @param which   Which option property is to be toggled
   * @param pos     Position of the option within the list of all
   *                options in this component
   * @param handler Event handler for the button
   *
   * @returns An HTML template button for toggling the option property
   */
  private _getToggleBtn(id: string, value: boolean, which: string, pos: number, handler: Function) : TemplateResult {
    return html`
      <button id="${id}toggle__${which}" class="toggle-btn toggle-btn--${which}" @click=${handler} value="${which}">
        ${(which === 'show')
        ? this._getShowLabel(value, pos)
        : this._getSelectedLabel(value, pos)}
      </button>`;
  }

  /**
   * Get the HTML for all the inputs & buttons for a single options
   *
   * @returns HTML Template for editing a single options
   */
  private _getSingleEditableOption() {
    const data = this;
    const handler = data._getHandler();

    return (option: ISingleInputOption, index: number): TemplateResult|string => {
      if (data.hideHidden && option.show === false) {
        return '';
      }
      const pos = index + 1;
      const id = data.id + '____' + index + '__';

      const start = (this._firstIsEmpty)
        ? 1
        : 0;

      const isMid = (index > start && (pos < data.options.length))
        ? ' is-middle'
        : '';

      const down = (index > 0 || option.value !== '')
      const up = (index !== 1 || !this._firstIsEmpty)

      return html`
        <li class="single-option cols-${data._colCount} is-${(option.show) ? 'shown' : 'hidden'}${(data.readonly ? 'is-readonly' : '')}${data._getColClass()}${isMid}">

          ${data._getEditableTextField(option.value as string, 'value', pos, id, !data.hideValue, handler)}
          ${data._getEditableTextField(option.label as string, 'label', pos, id, true, handler)}
          ${data._getEditableTextField(option.group as string, 'group', pos, id, (data.allowGroup && data.showGroup && option.value !== ''), handler)}
          <div class="toggle-block">
            ${(!data.hideHidden) ? data._getToggleBtn(id, option.show, 'show', pos, handler) : ''}
            ${data._getToggleBtn(id, option.selected, 'selected', pos, handler)}
            ${(this._canBeDeleted(option))
              ? html`
                  <button id="${id}delete" class="toggle-btn toggle-btn--delete" @click=${handler}>
                    Delete option ${index}
                  </button>`
              : ''
            }
            <div class="date-block">
              ${data._getEditableDateField(option.hideBefore, 'Before', pos, id, (data.allowHideByDate && data.showHideBefore), handler)}
              ${data._getEditableDateField(option.hideAfter, 'After', pos, id, (data.allowHideByDate && data.showHideAfter), handler)}
            </div>
          </div>
          <div class="move-block">
            ${this._getMoveBtn(id, 'up', index, (up && (index > 0)), handler)}
            ${this._getMoveBtn(id, 'down', index, (down && (pos < data.options.length)), handler)}
          </div>
        </li>
      `;
    }
  }

  /**
   * Get a button to do show/hide toggling;
   *
   * @param id      parent ID
   * @param action  What is to be shown/hidden
   * @param label   Label for thing that is to be shown/hidden
   * @param show    Whether or not thing is in "Show" state
   * @param handler Event hanlder function
   *
   * @returns A single button that performs an action
   */
  private _getShowHideBtn(id: string, action: string, label: string, show: boolean, handler: Function) : TemplateResult {
    const str = (show === true)
      ? 'Hide'
      : 'Show';

    return html`
    <button id="${id}____0__${action}" @click=${handler}>${str} ${label}</button>`
  }

  /**
   * Get a HTML for list of options in the component
   *
   * @returns HTML Template of all options in this component of a
   *          message saying there are no options
   */
  private _renderEditable() : TemplateResult {
    const handler = this._getHandler();
    const id = this.id + '____0__';
    const addBtn = (this._okToAdd())
      ? html`<button id="${this.id}____0__add" @click=${handler} class="add">
        Add ${(this.options.length === 0)
          ? 'first'
          : 'another'
        } option</button>`
      : '';
    const sortTitle = this.showGroup
        ? 'group then '
        : '';
    this._firstIsEmpty = (this.options[0].value === '');

    return html`
        <ul class="single-option__wrap">
          ${repeat(this.options, item => item.value, this._getSingleEditableOption())}
        </ul>
    ${addBtn}
    <div class="extra-controls">
      <button id="${this.id}____0__sort" @click=${handler} title="Sort options alphabetically by ${sortTitle}label">Sort options</button>
      ${this._getShowHideBtn(id, 'valueShow', 'value input', this.hideValue, handler)}
      ${(this.allowGroup)
        ? this._getShowHideBtn(id, 'groupShow', 'group input', this.showGroup, handler)
        : ''
      }
      ${(this.allowHideByDate)
        ? html`
          ${this._getShowHideBtn(id, 'hideBeforeShow', 'hide before', this.showHideBefore, handler)}
          ${this._getShowHideBtn(id, 'hideAfterShow', 'hide after', this.showHideAfter, handler)}
        `
        : ''
      }
      ${(this.alllowImport)
        ? html`
            <button id="${this.id}____0__showImportModal" @click=${handler}>
              Import
            </button>`
        : ''
      }
    </div>`;
  }


  //  END:  Editable render methods
  // ======================================================
  // START: Demo render methods

  /**
   * Get a single <OPTION> element
   *
   * @param option Option data for a single option
   *
   * @returns HTML for a single <OPTION> element
   */
  private _getDemoOption(option: ISingleInputOption) : TemplateResult {
    return html`
      <option value="${option.value}" ?selected=${option.selected}>
        ${option.label}
      </option>`
  }

  /**
   * Get all the options for a group wrapped in <OPTGROUP> tags
   *
   * @param optGroup Single option group containing a label & a list
   *                 of options for that group
   *
   * @returns HTML for option group (or just list of options if not
   *          part of a group)
   */
  private _getDemoAllOptions(optGroup: IOptionGroup) : TemplateResult {
    const options = html`${repeat(optGroup.options, item => item.value, this._getDemoOption)}`;

    if (optGroup.label === '[[FIRST]]' || optGroup.label === '[[UNGROUPED]]') {
      return options;
    } else {
      return html`<optgroup label="${optGroup.label}">${options}</optgroup>`;
    }
  }

  /**
   * Get a select (dropdown) field with all the options listed in
   * component
   *
   * @returns HTML template for <SELECT> field
   */
  private _getDemoSelect()  : TemplateResult {
    let tmp = this.options.filter(
      (item : ISingleInputOption, index: number) => {
        return item.show === true && this._emptyIsOK(item, index)
      }
    );

    let grouped : Array<IOptionGroup> = [];
    let ungrouped : Array<IOptionGroup>;
    let all : Array<IOptionGroup> = []

    if (tmp[0].value === '' && this.allowEmptyFirst) {
      all.push({
        label: '[[FIRST]]',
        options: [tmp[0]]
      })

      tmp = tmp.slice(1);
    }

    if (this.showGroup) {
      grouped = this._groupNames.map(
        name => {
          return {
            label: name,
            options: tmp.filter(option => option.group === name)
          }
        }
      );
      ungrouped = [{
        label: '[[UNGROUPED]]',
        options: tmp.filter(item => item.group === '')
      }];
    } else {
      ungrouped = [{
        label: '[[UNGROUPED]]',
        options: tmp
      }];
    }

    if (this.groupedLast === true) {
      all = [...all, ...ungrouped, ...grouped];
    } else {
      all = [...all, ...grouped, ...ungrouped];
    }

    return html`
      <select id="demo">
        ${all.map(item => {
          return this._getDemoAllOptions(item)
        })}
      </select>
    `;
  }

  /**
   * Get a list of checkable inputs
   *
   * @returns HTML Template for unordered list of radio or checkbox
   *          inputs
   */
  private _getDemoCheckable() : TemplateResult|string {
    let tmp = this.options.filter(
      (item : ISingleInputOption) => (item.show === true && item.value !== '')
    ).map(
      (item : ISingleInputOption, index: number) : TemplateResult => html`
          <li>
            <label>
              <input type="${this.mode}"
                     value="${item.value}"
                     name="${this.id}__radio"
                     id="${this.id}__radio--${index}"
                    ?checked=${item.selected} />
              ${item.label}
            </label>
          </li>`
      );

    return (tmp.length > 0)
      ? html`
        <ul class="demo-list">
          ${tmp}
        </ul>
      `
      : '';

  }

  /**
   * Get demo input(s) for this list of options
   *
   * @returns HTML for select, radio or checkbox inputs.
   */
  private _getDemo() : TemplateResult|string {
    let demo : TemplateResult|string = '';
    switch (this.mode) {
      case 'radio':
      case 'checkbox':
        demo = this._getDemoCheckable();
        break;
      default:
        demo = this._getDemoSelect();
    }
    return html`<div class="demo"><label for="demo">Demo:</label> ${demo}</div>`;
  }


  //  END:  Demo render methods
  // ======================================================
  // START: Import render methods

  private _getImportBtn(id: string, action: string, label: string, handler: Function) : TemplateResult {
    return html`
      <button id="${id}${action}" @click=${handler}>${label}</button>
    `;
  }

  private _renderImportUI() : TemplateResult {
    const id = this.id + '____0__';
    const handler = this._getHandler();
    console.group('_renderImportUI()')

    let sep = this._importSep;
    switch (sep) {
      case '\t':
        sep = '\\t';
        break;
      case '\n':
        sep = '\\n';
        break;
      case '\r':
        sep = '\\r';
        break;
      case '\l':
        sep = '\\l';
        break;
    }
    console.groupEnd();

    return html`
      <button id="${this.id}____1__showImportModal" class="close-bg" @click=${handler}>Close import</button>
      <section class="import-ui">
        <button id="${this.id}____2__showImportModal" class="close" @click=${handler}>Close</button>
        <div class="import-ui-inner">
          <h2 class="import-ui__head">Import options</h2>
          <p class="import-dep__wrap">
            <label for="${id}updateIportSep">Column seperator</label>
            <input type="text"
                  id="${id}importSep"
                  name="${id}importSep"
                  class="import-sep-input"
                  value="${sep}"
                  maxlength="10"
                  @change=${handler} />
            <button id="${id}toggleImportHasHead" @click=${handler}>
              Import ${(this._importHasHeader) ? 'has' : 'does not include'} header row
            </button>
          </p>
          <p class="import-data__wrap">
            <label for="${id}updateImportData" class="import-data__label">Separated value text (e.g. TSV or CSV)</label>
            <textarea id="${id}updateImportData" name="${id}updateImportData" @change=${handler} class="import-data__input">${(this._importHasHeader)
                ? this.getDataWithHeader()
                : this.getData()
            }</textarea>
          </p>
          <p class="import-buttons_wrap">
          ${(this._importData.trim() !== '')
            ? (this._importIsValid)
              ? html`
                ${this._getImportBtn(id, 'importAppend', 'Add imported options to existing list', handler)}
                ${this._getImportBtn(id, 'importReplace', 'Replace all existing options', handler)}`
              : this._getImportBtn(id, 'validateImport', 'Validate import data', handler)
            : 'You must change the import data before you can validate it'
          }
          </p>
        </div>
      </section>
    `;
  }


  //  END:  Import render methods
  // ======================================================
  // START: Shared render methods


  /**
   * Get list of class names to augment grid layout based on what
   * is being rendered
   *
   * @returns list of class names for wrapping list item
   */
  private _getColClass() : string {
    let colClass = '';
    if (!this.hideValue && this.showGroup) {
      colClass = ' has-value-and-group';
    } else if (!this.hideValue) {
      colClass = ' has-value';
    } else if (this.showGroup) {
      colClass = ' has-group';
    }
    if (this.showHideAfter || this.showHideBefore) {
      colClass += ' has-date';
    }
    return colClass
  }

  /**
   * Get text/label for "Selected" status of opton
   *
   * @param isSelected Whether or not options is set as
   *                  selected/checked by default
   * @param pos       Index/position of option with the list of
   *                  options
   * @returns HTML tempalte for "Selected" toggle button text
   */
  private _getSelectedLabel(isSelected : boolean, pos : number) : TemplateResult {
    return html`
      <span class="sr-only">Option ${pos} is </span>
        ${isSelected ? '' : 'not'}
        <span class="sr-only">selected by</span>
      default`;
  }

  /**
   * Get text/label for "Show" status of opton
   *
   * @param isSelected Whether or not options is set as
   *                  show or hide from end users
   * @param pos       Index/position of option with the list of
   *                  options
   * @returns HTML tempalte for "Show" toggle button text
   */
  private _getShowLabel(show : boolean, pos : number) : TemplateResult {
    return html`
      <span class="sr-only">Option ${pos} is</span>
      ${show
        ? html`visible <span class="sr-only">to</span>`
        : html`hidden <span class="sr-only">from</span>`
      }
      <span class="sr-only"> end users</span>`;
  }

  /**
   * The main render function for this component
   *
   * @returns {TemplateResult}
   */
   render() : TemplateResult {
    this._init();

    return html`
      <div class="whole">
        ${(!this.hideDemo)
        ? this._getDemo()
        : ''
      }
      ${(this.readonly)
        ? this._renderReadOnly()
        : this._renderEditable()
      }
      ${(this._showImportModal)
        ? this._renderImportUI()
        : ''
      }
      </div>
    `;
  }


  //  END:  Shared render methods
  // ======================================================
 }

 declare global {
   interface HTMLElementTagNameMap {
     'option-list-editor': OptionListEditor
   }
 }
