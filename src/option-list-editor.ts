import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { IEventData, ISingleInputOption, IObjNum } from './types/option-list-editor.d';

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
   * ID of the parent object
   */
  @property({ reflect: true, type: Number })
  parentId : number = 0;

  /**
   * How options are to be rendered
   */
  @property({ reflect: true, type: String })
  mode : string = 'select';

  /**
   * Label for empty option
   */
  @property({ reflect: true, type: String })
  emptyOptionTxt : string = '';

  /**
   * Label for empty option
   */
  @property({ reflect: true, type: String })
  otherOptionTxt : string = '';

  /**
   * Label for empty option
   */
  @property({ reflect: true, type: String })
  otherFieldTxt : string = '';

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
   * Whether or not options can be sorted by client
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
   * Whether or not to allow multiple options to be
   * selected/checked by default
   */
  @property({ type: Boolean })
  allowHideByDate : boolean = false;

  /**
   * Whether or not to allow multiple options to be
   * selected/checked by default
   */
  @property({ type: Boolean })
  allowGroup : boolean = false;

  /**
   * Whether or not options are editable
   */
  @property({ type: Boolean })
  readonly : boolean = false;

  /**
   * Whether or not options are editable
   */
  @property({ type: Boolean })
  showHideBefore : boolean = false;

  /**
   * Whether or not options are editable
   */
  @property({ type: Boolean })
  showHideAfter : boolean = false;


  //  END:  Attribute declarations
  // ======================================================
  // START: Property declarations


  /**
   * Whether or not to do basic component initialisation stuff
   */
  @state()
  public doInit : boolean = true;


  /**
   * Whether or not import modal should be visible
   */
  private _showImportModal : boolean = false;

  /**
   * Whether or not import data includes header row
   */
  private _importHasHeader : boolean = true;

  /**
   * Import data TSV/CSV text
   */
  private _importData : string = '';

  /**
   * Column separator for import data
   */
  private _importSep : string = '\t';

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
   * List of options
   */
  @state()
  public options : Array<ISingleInputOption> = [];



  private _colCount : number = 2;

  // private _canAdd : boolean = true;
  // private _focusIndex : number = -1;
  // private _focusField : string = '';


  //  END:  Property declarations
  // ======================================================
  // START: Styling


  static styles = css`
  :host {
    --font-family: Arial, Helvetica, sans-serif;
    font-family: var(--font-family);
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
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0 0 1rem 0;
    counter-reset: option
  }
  li {
    margin-top: 1rem;
    display: grid;
    grid-template-areas: 'pos value move'
                         'pos label move'
                         'pos group move'
                         'pos toggle move'
                         'pos date move';
    grid-template-columns: 1.5rem 1fr 6rem;
    column-gap: 0.4rem;
    /* row-gap: 0.4rem; */
  }
  li.is-shown::before {
    content: counter(option);
  }
  li::before {
    grid-area: pos;
    text-align: right;
    /* padding-top: 0.1rem; */
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
    width: 3rem;
  }
  .label::after {
    content: ':';
  }
  .input {
    width: calc(100% - 4rem);
    font-family: 'Courier New', Courier, monospace;
  display: inline-block;
  }
  .toggle-btn {
    text-transform: capitalize;
    display: inline-block;
    margin-right: 1rem;
  }
  .toggle-btn:last-child {
    margin-right: 0;
  }
  .value-block {
    grid-area: value;
    padding-bottom: 0.4rem;
  }
  .label-block {
    grid-area: label;
    padding-bottom: 0.4rem;
  }
  .group-block {
    grid-area: group;
    padding-bottom: 0.4rem;
  }
  .toggle-block {
    grid-area: toggle;
  }
  .date-block {
    grid-area: date;
    padding-bottom: 0.4rem;
  }
  .move-block {
    grid-area: move;
    align-self: center;
  }
  .move-block > button {
    display: inline-block;
    width: 100%;
    margin-top: 0.2rem;
  }
  .move-block > button:first-child {
    margin-top: 0;
  }
  .hide-block .label {
    display: inline-block;
    width: 6rem;
  }
  .hide-block .input {
    display: inline-block;
    width: 13.5rem;
  }
  @media screen and (min-width: 48rem) {
    .has-value {
      grid-template-areas: 'pos value label move'
                           'pos toggle toggle move';
      grid-template-columns: 1.5rem 0.5fr 1.5fr 6rem;
    }
    .has-group {
      grid-template-areas: 'pos label  group move'
                           'pos toggle toggle move';
      grid-template-columns: 1.5rem 1.5fr 0.5fr 6rem;
    }
    .has-value-and-group {
      grid-template-areas: 'pos value  label  group  move'
                           'pos toggle toggle toggle move';
      grid-template-columns: 1.5rem 0.6fr 1fr 0.6fr 6rem;
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
    .value-block {
      padding-right: 0.5rem;
    }
    .group-block {
      padding-left: 0.5rem;
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

      const _tmp = this.getElementsByTagName('option');

      this.options = [];
      for (let a = 0; a < _tmp.length; a += 1) {
        const option = {
          default: _tmp[a].selected,
          group: (typeof _tmp[a].dataset.group === 'string')
            ? _tmp[a].dataset.group as string
            : '',
          label: (_tmp[a].innerText !== '')
            ? _tmp[a].innerText
            : _tmp[a].value,
          show: !_tmp[a].disabled,
          value: _tmp[a].value,
          hideBefore: (typeof _tmp[a].dataset.hidebefore === 'string')
            ? _tmp[a].dataset.hidebefore as string
            : '',
          hideAfter: (typeof _tmp[a].dataset.hideafter === 'string')
            ? _tmp[a].dataset.hidebefore as string
            : '',
          error: ''
        };
        this.options.push(option)
        // if (option.value === '' && option.label === '') {
        //   this._canAdd = false
        // }
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

  /**
   * Check wither it's OK to add another option
   *
   * @returns TRUE if it's OK to add another option, False otherwise
   */
  private _okToAdd() : boolean {
    for (let a = 0; a < this.options.length; a += 1) {
      if (this.options[a].value === '' || this.options[a].label === '') {
        // this._canAdd = false;
        return false;
      }
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

    const _tmp = new Date(input);

    return (_tmp.toString() !== 'Invalid Date')
      // looks like we have a valid date/time string
      ? _tmp.toISOString().replace(/\.[0-9]+[a-z]$/i, '')
      // Out of luck
      : '';
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

      // Document stuff from the event that the outside world needs
      // to know about
      const _output = {
        index: parseInt(bits[0]),
        action: bits[1],
        field: (typeof bits[2] === 'string')
          ? bits[2]
          : '',
        value: input.value
      }

      switch(_output.action) {
        case 'toggle':
          const _field = _output.field.toLowerCase();
          if (_field === 'show') {
            ok = data._toggleShow(_output.index);
          } else if (_field === 'default') {
            ok = this._toggleDefault(_output.index);
          }
          break;

        case 'update':
          ok = data._update(_output.index, _output.field, _output.value);
          break;

        case 'move':
          ok = data._move(_output.index, _output.value);
          break;

        case 'add':
          ok = data._add();
          break;

        case 'delete':
          ok = data._delete(_output.index);
          break;

        case 'sort':
          ok = data._sort();
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

        case 'importModal':
          this._showImportModal = !this._showImportModal;
          break;

        case 'importSep':
          this._importSep = _output.value;
          break;

        case 'importHasHead':
          this._importHasHeader = !this._importHasHeader;
          break;

        case 'importData':
          this._importData = _output.value;
          break;

        case 'importAppend':
          ok = data._import('append');
          break;

        case 'importReplace':
          ok = data._import('replace');
          break;
      }
      this.eventData = _output;
      data.dispatchEvent(new Event('change'));
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
    const _option = this.options.filter(
      (option : ISingleInputOption, _index : number) => (index === _index)
    )
    const allOptions = this.options.filter(
      (option : ISingleInputOption, _index : number) => (index !== _index)
    )
    const newInd = (direction.toLowerCase() === 'up')
      ? index - 1
      : index + 1;

    this.options = [
      ...allOptions.slice(0, newInd),
      _option[0],
      ...allOptions.slice(newInd)
    ]
    return true;
  }

  /**
   * Toggle show/hide status of the specified option.
   *
   * @param index Index of option to be deleted
   * @param prop  Which option property should be updated
   *
   * @returns TRUE if option's property was updated, FALSE otherwise
   */
  private _toggleShow(index: number) : boolean {
    let ok = false;

    const _output = this.options.map(
      (option : ISingleInputOption, _index : number) => {
        if (index === _index) {
          ok = true;
          return {
            ...option,
            show: !option.show
          }
        }
        return option;
      }
    )

    if (ok === true) {
      this.options = _output;
      return true;
    }
    return false;
  }

  /**
   * Toggle default status of the specified option
   *
   * @param index Index of option to be deleted
   * @param prop  Which option property should be updated
   *
   * @returns TRUE if option's property was updated, FALSE otherwise
   */
  private _toggleDefault(index: number) : boolean {
    let ok = false;
    let _output = []

    if (this.allowMulti) {
      _output = this.options.map(
        (option : ISingleInputOption, _index : number) => {
          if (index === _index) {
            ok = true;
            return {
              ...option,
              default: !option.default
            }
          }
          return option;
        }
      )
    } else {
      _output = this.options.map(
        (option : ISingleInputOption, _index : number) => {
          if (index === _index) {
            ok = true;
            return {
              ...option,
              default: !option.default
            }
          }
          return {
            ...option,
            default: false
          };
        }
      )
    }

    if (ok === true) {
      this.options = _output;
      return true;
    }
    return false;
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
    let ok = false;
    let _val = value.trim();

    const options = this.options.map(
      (option:ISingleInputOption, _index: number) => {
        if (index !== _index) {
          return option;
        } else {
          const output = { ...option }
          switch (prop.toLowerCase()) {
            case 'label':
              output.label = _val;
              ok = true;
              break;
            case 'value':
              output.value = _val;
              ok = true;
              break;
            case 'group':
              output.group = _val;
              ok = true;
              break;
            case 'hidebefore':
              output.hideBefore = _val;
              ok = true;
              break;
            case 'hideafter':
              output.hideAfter = _val;
              ok = true;
          }

          return output
        }
      }
    )

    if (ok === true && this._noDuplicates(options)) {
      this.options = options;
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
  private _sortInner(a: ISingleInputOption, b: ISingleInputOption) : number {
    const _labelA = (a.label as string).toLowerCase()
    const _labelB = (b.label as string).toLowerCase()
    const _groupA = (b.label as string).toLowerCase()
    const _groupB = (b.label as string).toLowerCase()

    if (_groupA < _groupB) {
      return -1;
    } else if (_groupA > _groupB) {
      return 1;
    } else {
      if (_labelA < _labelB) {
        return -1;
      } else if (_labelA > _labelB) {
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
    let _options = [...this.options];

    _options.sort(this._sortInner);
    this.options = _options

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
        default: false,
        group: '',
        label: '',
        show: true,
        hideAfter: '',
        hideBefore: '',
        value: '',
        error: ''
      })
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
      (option:ISingleInputOption, _index: number) => {
        if (_index === i && this._canBeDeleted(option)) {
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
   * Parse separated value text into a list of `ISingleInputOption`s
   *
   * @returns An array of `ISingleInputOption`s
   */
  private _parseImport() : Array<ISingleInputOption> {
    const output : Array<ISingleInputOption> = [];
    const _tmp : Array<Array<string>> = [];

    if (this._importData.trim() !== '') {
      // Nothing to do so lets get out of here
      return output;
    }

    const sep = (this._importSep !== '')
      ? this._importSep
      : '\t';
    const _tmp1 = this._importData.split('\n');

    for (let a = 0; a < _tmp1.length; a += 1) {
      if (_tmp1[a].trim() !== '') {
        const _tmp2 : Array<string> = _tmp1[a].split(sep);
        const _tmp3 : Array<string> = [];

        for (let b = 0; b < _tmp2.length; b += 1) {
          _tmp3.push(_tmp2[b].trim().replace(/\s+/g, ' '));

          if (b > 10) {
            // We only want seven columns.
            // If they can't get it right in eleven we'll
            // give up for this row
            continue;
          }
        }

        _tmp.push(_tmp3);
      }
    }

    let _start = 0;
    let _cols : IObjNum = {
      value : 0,
      label : 1,
      default : 2,
      show : 3,
      group : 4,
      hideBefore : 5,
      hideAfter : 6
    }

    if (this._importHasHeader) {
      // Try and process the header row

      // Start processing data at the second row
      _start = 1;
      // reset cols to make sure we don't get anything we don't want
      _cols = {
        value : -1,
        label : -1,
        default : -1,
        show : -1,
        group : -1,
        hideBefore : -1,
        hideAfter : -1
      }

      for (let a = 0; a < _tmp[0].length; a += 1) {
        switch (_tmp[0][a].toLowerCase()) {
          case 'value':
            _cols.value = a;
            break;
          case 'label':
            _cols.label = a;
            break;
          case 'default':
          case 'selected':
          case 'checked':
            _cols.default = a;
            break;
          case 'visable':
          case 'show':
            _cols.show = a;
            break;
          case 'group':
            _cols.group = a;
            break;
          case 'hidebefore':
            _cols.hideBefore = a;
            break;
          case 'hideafter':
            _cols.hideAfter = a;
            break;
        }
      }
    }

    if (_cols.value === -1 || _cols.label === -1) {
      // we don't have enough info to keep going
      return output;
    }

    for (let a = _start; a < _tmp.length; a += 1) {
      const _opt : ISingleInputOption = {
        value: this._getStr(_tmp, a, _cols.value, 128),
        label: this._getStr(_tmp, a, _cols.label, 512),
        default: this._str2bool(this._getStr(_tmp, a, _cols.default, 4)),
        show: this._str2bool(this._getStr(_tmp, a, _cols.show, 4)),
        group: this._getStr(_tmp, a, _cols.group).substring(0, 64),
        hideBefore: this._getValidDate(this._getStr(_tmp, a, _cols.hideBefore, 64)),
        hideAfter: this._getValidDate(this._getStr(_tmp, a, _cols.hideAfter, 64)),
        error: ''
      }

      if (_opt.value === '' && _opt.label !== '') {
        _opt.value = _opt.label;
      } else if (_opt.value !== '' && _opt.label === '') {
        _opt.label = _opt.value;
      }

      if (_opt.value !== '' && _opt.label !== '') {
        // We have enough to be going on with
        output.push(_opt);
      }
    }

    // Give back what we have
    return output;
  }

  /**
   * Import option fields as delimited text
   *
   * @param mode Append to or Replace current options
   *
   * @returns TRUE if options were imported. FALSE otherwise
   */
  private _import(mode: string) : boolean {
    const data = this._parseImport();

    if (data.length > 0) {
      if (mode === 'append') {
        this.options = [
          ...this.options,
          ...data
        ];
      } else {
        this.options = data;
      }

      return true;
    }
    return false;
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

    let _value = '';
    if (value !== '') {
      const _tmp = new Date(value);
      _value = _tmp.toLocaleString();
    }
    return html`
      <div class="hide-block hide${which}-block">
        <span class="label">Hide <span class="sr-only">option ${pos}</span> ${which}</span>
        <span class="input">${_value}"
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
            <span class="label"><span class="sr-only">Option ${pos}</span> ${which}</span>
            <span class="input">${value}</span>
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
    console.log('data:', data)

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
        ${this._getReadonlyDateField(option.hideBefore, 'before', pos, data.showHideBefore)}
        ${this._getReadonlyDateField(option.hideAfter, 'after', pos, data.showHideAfter)}
        <div class="toggle-block">
          ${(!data.hideHidden)
            ? html`
              <span class="toggle-btn toggle-btn--show">
                ${this._getShowLabel(option.show, pos)}
              </span>`
            : ''
          }
          <span class="toggle-btn toggle-btn--default">
            ${this._getDefaultLabel(option.default, pos)}
          </span>
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
    return (show === true)
      ? html`
        <div class="${which}-block">
          <label for="${id}${which}" class="label"><span class="sr-only">Option ${pos}</span> ${which}</label>
          <input type="text"
                 id="${id}update__${which}"
                .value="${value}"
                 class="input"
                 placeholder="Option ${pos} ${which}"
                @change=${handler} />
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

    let _value = '';
    if (value !== '') {
      const _tmp = new Date(value);
      _value = _tmp.toLocaleString();
    }

    return html`
        <div class="hide-block hide${which}-block" class="label">
          <label for="${id}hide${which}" class="label">Hide <span class="sr-only">option ${pos}</span> ${which}</label>
          <input type="datetime-local"
                id="${id}update__hide${which}"
               .value="${_value}"
                class="input"
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
        : this._getDefaultLabel(value, pos)}
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
      const _id = data.id + '____' + index + '__';

      return html`
        <li class="cols-${data._colCount} is-${(option.show) ? 'shown' : 'hidden'}${(data.readonly ? 'is-readonly' : '')}${data._getColClass()}">

          ${data._getEditableTextField(option.value as string, 'value', pos, _id, !data.hideValue, handler)}
          ${data._getEditableTextField(option.label as string, 'label', pos, _id, true, handler)}
          ${data._getEditableTextField(option.group as string, 'group', pos, _id, (data.allowGroup && data.showGroup), handler)}
          <div class="date-block">
            ${data._getEditableDateField(option.hideBefore, 'before', pos, _id, (data.allowHideByDate && data.showHideBefore), handler)}
            ${data._getEditableDateField(option.hideAfter, 'after', pos, _id, (data.allowHideByDate && data.showHideAfter), handler)}
          </div>
          <div class="toggle-block">
            ${(!data.hideHidden) ? data._getToggleBtn(_id, option.show, 'show', pos, handler) : ''}
            ${data._getToggleBtn(_id, option.default, 'default', pos, handler)}
            ${(this._canBeDeleted(option))
              ? html`
                  <button id="${_id}delete" class="toggle-btn toggle-btn--delete" @click=${handler}>
                    Delete option ${index}
                  </button>`
              : ''
            }
          </div>
          <div class="move-block">
            ${this._getMoveBtn(_id, 'up', index, (index > 0), handler)}
            ${this._getMoveBtn(_id, 'down', index, (pos < data.options.length), handler)}
          </div>
        </li>
      `;
    }
  }


  /**
   * Get a HTML for list of options in the component
   *
   * @returns HTML Template of all options in this component of a
   *          message saying there are no options
   */
  private _renderEditable() : TemplateResult {
    const handler = this._getHandler();
    const addBtn = (this._okToAdd())
      ? html`<button id="${this.id}____0__add" @click=${handler}>
        Add ${(this.options.length === 0)
          ? 'first'
          : 'another'
        } option</button>`
      : '';

    return html`
        <ul>
          ${repeat(this.options, item => item.value, this._getSingleEditableOption())}
        </ul>
    ${addBtn}
    <div class="extra-controls">
      <button id="${this.id}____0__sort" @click=${handler}>Sort options</button>
      ${(this.allowGroup)
        ? html`
            <button id="${this.id}____0__groupShow" @click=${handler}>
              ${(this.showGroup) ? 'Hide' : 'Show'} Group input
            </button>`
        : ''
      }
      <button id="${this.id}____0__valueShow" @click=${handler}>
        ${(!this.hideValue) ? 'Hide' : 'Show'} value input
      </button>
      ${(this.allowHideByDate)
        ? html`
        <button id="${this.id}____0__hideBeforeShow" @click=${handler}>
          ${(this.showHideBefore) ? 'Hide' : 'Show'} hide before
        </button>
        <button id="${this.id}____0__hideAfterShow" @click=${handler}>
          ${(this.showHideAfter) ? 'Hide' : 'Show'} hide after
        </button>`
        : ''
      }
      ${(!this.alllowImport)
        ? html`
            <button id="${this.id}____0__importModal" @click=${handler}>
              Import
            </button>`
        : ''
      }
    </div>`;
  }


  //  END:  Editable render methods
  // ======================================================
  // START: Demo render methods

  private _getDemoOption(option:ISingleInputOption): TemplateResult|string {
    if (!option.show) {
      return '';
    } else {
      return html`<option value="${option.value}" ?selected=${option.default}>${option.label}</option>`
    }
  }

  private _getDemoSelect()  : TemplateResult {
    return html`
      <select id="demo">
        ${repeat(this.options, item => item.value, this._getDemoOption)}
      </select>
    `;
  }

  private _getDemo() : TemplateResult|string {
    let demo : TemplateResult|string = '';
    switch (this.mode) {
      case 'radio':
        return '';
      case 'checkbox':
        return '';
      default:
        demo = this._getDemoSelect();
    }
    return html`<p><label for="demo">Demo:</label> ${demo}</p>`;
  }

  //  END:  Demo render methods
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
   * Get text/label for "Default" status of opton
   *
   * @param isDefault Whether or not options is set as
   *                  selected/checked by default
   * @param pos       Index/position of option with the list of
   *                  options
   * @returns HTML tempalte for "Default" toggle button text
   */
  private _getDefaultLabel(isDefault : boolean, pos : number) : TemplateResult {
    return html`
      <span class="sr-only">Option ${pos} is </span>
        ${isDefault ? '' : 'not'}
        <span class="sr-only">selected by</span>
      default`;
  }

  /**
   * Get text/label for "Show" status of opton
   *
   * @param isDefault Whether or not options is set as
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

    // console.log('this.warningCount:', this._warningCount);

    return html`
      ${(!this.hideDemo)
        ? this._getDemo()
        : ''
      }
      ${(this.readonly)
        ? this._renderReadOnly()
        : this._renderEditable()
      }`;
  }


  //  END:  Shared render methods
  // ======================================================
 }

 declare global {
   interface HTMLElementTagNameMap {
     'option-list-editor': OptionListEditor
   }
 }
