import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { IEventData, ISingleInputOption, IInputOptionImportHead, IOptionGroup, ISingleInputOptionSimple } from './types/option-list-editor.d';

/**
 * `<option-list-editor>` Is a web component for editing HTML
 * `<SELECT>` input field options and/or lists of
 * `<INPUT type="radio">` or `<INPUT type="checkbox">` fields
 *
 * You provide the component with a list of option elements and
 * `<option-list-editor>` provides an edit interface for those
 * options.
 *
 * While this element doesn't contain a `<slot>` it looks for child
 * `<option>` & `<optgroup>` HTML elements which it then parses to
 * extract the data it needs to build up an edit interface for the
 * provided options.
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
   * Whether or not to show the "Save" button
   */
  @property({ type: Boolean })
  showSave : boolean = false;

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
  allowImport : boolean = false;

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

  private _changed : boolean = false;

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

    --wc-btn-bg-colour: var(--wc-bg-colour);
    --wc-btn-txt-colour: var(--wc-text-colour);
    --wc-btn-weight: bold;
    --wc-btn-padding: 0.3rem 0.5rem;
    --wc-btn-border-style: solid;

    --wc-btn-toggle-bg-colour: var(--wc-btn-bg-colour);
    --wc-btn-toggle-txt-colour: var(--wc-btn-txt-colour);

    --wc-btn-visible-bg-colour: var(--wc-btn-toggle-bg-colour);
    --wc-btn-visible-txt-colour: var(--wc-btn-toggle-txt-colour);
    --wc-btn-selected-bg-colour: var(--wc-btn-toggle-bg-colour);
    --wc-btn-selected-txt-colour: var(--wc-btn-toggle-txt-colour);
    --wc-btn-showvalue-txt-bg-colour: var(--wc-btn-toggle-bg-colour);
    --wc-btn-showvalue-txt-colour: var(--wc-btn-toggle-txt-colour);
    --wc-btn-showgroup-txt-bg-colour: var(--wc-btn-toggle-bg-colour);
    --wc-btn-showgroup-txt-colour: var(--wc-btn-toggle-txt-colour);
    --wc-btn-hidebydate-bg-colour: var(--wc-btn-toggle-bg-colour);
    --wc-btn-hidebydate-txt-colour: var(--wc-btn-toggle-txt-colour);
    --wc-btn-hidebefore-bg-colour: var(--wc-btn-hidebydate-bg-colour);
    --wc-btn-hidebefore-txt-colour: var(--wc-btn-hidebefore-txt-colour);
    --wc-btn-hideafter-bg-colour: var(--wc-btn-hidebefore-bg-colour);
    --wc-btn-hideafter-txt-colour: var(--wc-btn-hidebefore-txt-colour);

    --wc-btn-save-bg-colour: var(--wc-btn-bg-colour);
    --wc-btn-save-txt-colour: var(--wc-btn-txt-colour);
    --wc-btn-delete-bg-colour: var(--wc-btn-bg-colour);
    --wc-btn-delete-txt-colour: var(--wc-btn-txt-colour);
    --wc-btn-sort-txt-bg-colour: var(--wc-btn-bg-colour);
    --wc-btn-sort-txt-colour: var(--wc-btn-txt-colour);
    --wc-btn-add-txt-bg-colour: var(--wc-btn-bg-colour);
    --wc-btn-add-txt-colour: var(--wc-btn-txt-colour);

    --wc-btn-mv-bg-colour: var(--wc-btn-bg-colour);
    --wc-btn-mv-txt-colour: var(--wc-btn-txt-colour);
    --wc-btn-mv-up-bg-colour: var(--wc-btn-mv-bg-colour);
    --wc-btn-mv-up-txt-colour: var(--wc-btn-mv-txt-colour);
    --wc-btn-mv-down-bg-colour: var(--wc-btn-mv-bg-colour);
    --wc-btn-mv-down-txt-colour: var(--wc-btn-mv-txt-colour);

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
  }
  h1, h2, h3, h4 {
    font-family: var(--wc-heading-font);
  }
  button {
    border-radius: var(--wc-border-radius);
    border-width: var(--wc-line-width);
    border-color: var(--wc-btn-colour);
    border-style: var(--wc-btn-border-style);
    color: var(--wc-btn-colour);
    background-color: var(--wc-btn-bg-colour);
    padding: var(--wc-btn-padding);
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
  .toggle-btn--show {
    background-color: var(--wc-btn-visible-bg-colour);
    border-color: var(--wc-btn-visible-txt-colour);
    color: var(--wc-btn-visible-txt-colour);
  }
  .toggle-btn--selected {
    background-color: var(--wc-btn-selected-bg-colour);
    border-color: var(--wc-btn-selected-txt-colour);
    color: var(--wc-btn-selected-txt-colour);
  }
  .toggle-btn--value {
    background-color: var(--wc-btn-showvalue-bg-colour);
    border-color: var(--wc-btn-showvalue-txt-colour);
    color: var(--wc-btn-showvalue-txt-colour);
  }
  .toggle-btn--group {
    background-color: var(--wc-btn-showgroup-bg-colour);
    border-color: var(--wc-btn-showgroup-txt-colour);
    color: var(--wc-btn-showgroup-txt-colour);
  }
  .toggle-btn--delete {
    background-color: var(--wc-btn-delete-bg-colour);
    border-color: var(--wc-btn-delete-txt-colour);
    color: var(--wc-btn-delete-txt-colour);
  }
  .toggle-btn--hideBeforeShow {
    background-color: var(--wc-btn-hidebefore-bg-colour);
    border-color: var(--wc-btn-hidebefore-txt-colour);
    color: var(--wc-btn-hidebefore-txt-colour);
  }
  .toggle-btn--hideAfterShow {
    background-color: var(--wc-btn-hideafter-bg-colour);
    border-color: var(--wc-btn-hideafter-txt-colour);
    color: var(--wc-btn-hideafter-txt-colour);
  }
  .action-btn--add {
    background-color: var(--wc-btn-add-bg-colour);
    border-color: var(--wc-btn-add-txt-colour);
    color: var(--wc-btn-add-txt-colour);
  }
  .action-btn--import {
    background-color: var(--wc-btn-import-bg-colour);
    border-color: var(--wc-btn-import-txt-colour);
    color: var(--wc-btn-import-txt-colour);
  }
  .action-btn--sort {
    background-color: var(--wc-btn-sort-bg-colour);
    border-color: var(--wc-btn-sort-txt-colour);
    color: var(--wc-btn-sort-txt-colour);
  }
  .action-btn--save {
    background-color: var(--wc-btn-save-bg-colour);
    border-color: var(--wc-btn-save-txt-colour);
    color: var(--wc-btn-save-txt-colour);
    position: absolute;
    right: 0.5rem;
    top: 0.3rem;
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
    width: 2.35rem;
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
    display: flex;
    padding: 0 0.5rem 1rem;
  }
  .extra-controls__other {
    flex-grow: 1;
    text-align: right;
    display: flex;
    justify-content: end;
    gap: 1rem;
  }
  .extra-controls__other > button {
    margin: 0;
  }
  .extra-controls__other > button:last-child {
  }
  .demo {
    display: flex;
    padding: 0.5rem;
    border: var(--wc-line-width) solid var(--wc-bg-colour);
    margin: 0;
  }
  .demo, .demo * {
    background-color: var(--wc-text-colour);
    color: var(--wc-bg-colour);
  }
  .demo > label {
    font-weight: bold;
    padding-right: 1rem;
  }
  .demo > div {
    flex-grow: 1;
    padding-right: 4rem;
  }
  .demo select {
    border: var(--wc-line-width) solid var(--wc-bg-colour);
  }
  .demo-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
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

      this.mode = this.mode.trim().toLowerCase().replace(/[^a-z]+/ig, '');

      if (this.mode !== 'radio' && this.mode !== 'checkbox') {
        this.mode = 'select'
      }

      this._parseInitialOptions();

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
   * Parse all the options nested within the `<option-list-editor>`
   * to build the internal state of the component.
   */
  private _parseInitialOptions() {
    const tmp = this.getElementsByTagName('option');

    /**
     * Used to detect whether multiple options have been selected
     * by default
     */
    let _selected = false;

    for (let a = 0; a < tmp.length; a += 1) {
      const _tmp = tmp[a] as HTMLOptionElement;
      let groupLabel = '';

      // See if we need and are able to get the group name for this option
      if (this.allowGroup) {
        if (typeof _tmp.dataset.group === 'string') {
          groupLabel = (_tmp.dataset.group as string).trim();
        } else if (_tmp.parentElement instanceof HTMLOptGroupElement) {
          const optGrp = _tmp.parentElement as HTMLOptGroupElement;

          groupLabel = (typeof optGrp.label === 'string')
            ? optGrp.label.trim()
            : '';
        }

        this._groupNames = addToGroupNames(this._groupNames, groupLabel);
      }

      if (_tmp.selected === true) {
        if (_selected === true) {
          // This one is selected by default and we've previously seen
          // at least one is also selected by default.
          // We'll let allow multi decide the current selected state
          _tmp.selected = this.allowMulti;
        }

        _selected = true;
      }

      const option : ISingleInputOption = {
        value: _tmp.value,
        label: (_tmp.innerText !== '')
          ? _tmp.innerText
          : _tmp.value,
        selected: _tmp.selected,
        hide: !_tmp.disabled,
        group: groupLabel,
        hideBefore: (typeof _tmp.dataset.hidebefore === 'string')
          ? _tmp.dataset.hidebefore as string
          : '',
        hideAfter: (typeof _tmp.dataset.hideafter === 'string')
          ? _tmp.dataset.hidebefore as string
          : '',
        title: (typeof _tmp.dataset.title === 'string')
          ? _tmp.dataset.title as string
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
    return (option.hide === false || (option.value == '' && option.label === ''));
  }

  private _emptyIsOK(option : ISingleInputOption, index : number) : boolean {
    return (option.value !== '' || (index === 0 && this.allowEmptyFirst));
  }

  /**
   * Check wither it's OK to add another option
   *
   * @returns TRUE if it's OK to add another option, False otherwise
   */
  private _okToAdd() : boolean {
    for (let a = 0; a < this.options.length; a += 1) {
      if (this.options[a].label === '' || !this._emptyIsOK(this.options[a], a)) {
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

    if (this.showGroup) {
      output += colSep + 'group';
    }
    if (this.showHideBefore) {
      output += colSep + 'hideBefore';
    }
    if (this.showHideAfter) {
      output += colSep + 'hideAfter';
    }
    return output;
  }

  /**
   * Get data for a single option.
   *
   * @param index  Index of option whose data is to be returned
   * @param rowSep Output row separator
   * @param colSep Output column separator
   *
   * @returns option data as separated text string
   */
  private _getRowByIndex(index: number, colSep : string, rowSep : string) : string {
    let output = '';

    if (typeof this.options[index] !== 'undefined') {
      output = rowSep + this.options[index].value +
               colSep  + this.options[index].label +
               colSep  + this.options[index].selected +
               colSep  + this.options[index].hide;

      if (this.showGroup) {
        output += colSep + this.options[index].group;
      }
      if (this.showHideBefore) {
        output += colSep + this.options[index].hideBefore;
      }
      if (this.showHideAfter) {
        output += colSep + this.options[index].hideAfter;
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
   * @param colSep Output column separator
   * @param rowSep Output row separator
   *
   * @returns option data as separated text string
   */
  public getOptionData(colSep : string = '', rowSep : string = '\n') : string {
    const sep = (colSep !== '')
      ? colSep
      : this._importSep;
    let output = '';

    let newRow = '';

    for (let a = 0; a < this.options.length; a += 1) {
      output += this._getRowByIndex(a, sep, newRow);
      newRow = rowSep;
    }

    return output;
  }

  /**
   * Extract option data as string with header row
   *
   * @param colSep Output column separator
   * @param rowSep Output row separator
   *
   * @returns String th
   */
  public getOptionDataWithHeader(colSep : string = '', rowSep : string = '\n') : string {
    const sep = (colSep !== '')
      ? colSep
      : this._importSep;

    return this._getHeader(sep) + rowSep + this.getOptionData(sep, rowSep);
  }

  /**
   * Get list of options as JSON object
   *
   * > __NOTE:__ By default, this method omits
   *
   * @param fullData Whether or not to return full json object for
   *                 each option or a simplified version
   *
   * @returns JSON for list of options.
   */
  public optionsToJson(fullData : boolean = false) : string {
    let output : Array<ISingleInputOptionSimple> = (fullData === true)
      ? [...this.options]
      : getSimplifiedOptionData(this.options);

    return JSON.stringify(output);
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
      hide : -1,
      group : -1,
      hideBefore : -1,
      hideAfter : -1,
      title : -1
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
          cols.hide = a;
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
        case 'title':
          cols.title = a;
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
    };

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
      hide : 3,
      group : 4,
      hideBefore : 5,
      hideAfter : 6,
      title : 7
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
      const b = a - start;
      const opt : ISingleInputOption = {
        value: this._getStr(tmp, a, cols.value, 128),
        label: this._getStr(tmp, a, cols.label, 512),
        selected: this._str2bool(this._getStr(tmp, a, cols.selected, 4)),
        hide: this._str2bool(this._getStr(tmp, a, cols.hide, 4)),
        group: this._getStr(tmp, a, cols.group).substring(0, 64),
        hideBefore: this._getValidDate(this._getStr(tmp, a, cols.hideBefore, 64)),
        hideAfter: this._getValidDate(this._getStr(tmp, a, cols.hideAfter, 64)),
        title: this._getValidDate(this._getStr(tmp, a, cols.title, 255))
      }

      if (!this._emptyIsOK(opt, b) && opt.label !== '') {
        // value must not be empty so we'll use the label as the value
        opt.value = opt.label;
      }
      if (opt.value !== '' && opt.label === '') {
        // label must not be empty so we'll use the value as the label
        opt.label = opt.value;
      }

      // Make sure the option is usable and unique
      if (this._emptyIsOK(opt, b) &&
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
      let external = false;
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
        // --------------------------------------
        // START: Public actions

        case 'toggle':
          if (field === 'show') {
            external = data._toggleShow(ind);
          } else if (field === 'selected') {
            external = this._toggleSelected(ind);
          }
          output = {
            index: ind,
            action: 'TOGGLE',
            field: field,
            value: ''
          }
          break;

        case 'update':
          external = data._update(ind, field, input.value);
          output = {
            index: ind,
            action: 'UPDATE',
            field: field,
            value: input.value
          }
          break;

        case 'move':
          external = data._move(ind, input.value);
          output.action = 'MOVE';
          output.index = ind;
          break;

        case 'delete':
          external = data._delete(output.index);
          output.action = 'DELETE';
          output.index = ind;
          break;

        case 'add':
          external = data._add();
          output.action = 'ADD';
          break;

        case 'sort':
          external = data._sort();
          output.action = 'SORT';
          break;

        case 'importAppend':
          external = data._import('append');
          output.action = 'APPENDIMPORTED';
          break;

        case 'importReplace':
          external = data._import('replace');
          output.action = 'IMPORTREPLACE';
          break;

        case 'save':
          // ok = data.options.filter(item => item.error !== '');
          external = true;
          output.action = 'SAVE';
          break;

        //  END:  Public actions
        // --------------------------------------
        // START: Private actions

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
          output.value = this._getImportSep(input.value);
          break;

        case 'toggleImportHasHead':
          this._importHasHeader = !this._importHasHeader;
          this.requestUpdate();
          break;

        case 'updateImportData':
          this._importIsValid = false;
          this._importData = input.value;
          this.requestUpdate();
          break;

        case 'validateImport':
          this._parseImport();
          if (this._importIsValid) {
            this.requestUpdate();
          }
          break;

        //  END:  Private actions
        // --------------------------------------
      }

      if (external === true) {
        // Update event data
        this.eventData = output;

        this._changed = (output.action !== 'SAVE');

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
    this.options = moveSelectedOption(this.options, index, direction);

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
          hide: !output[a].hide
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
    this.options = toggleSelectedOption(
      this.options, index, this.allowMulti
    );

    return true;
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
            this._groupNames = addToGroupNames(this._groupNames, val);
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
   * Sort options alphabetically by label (case insensitive)
   *
   * @returns TRUE if options were sorted
   */
  private _sort() : boolean {
    this.options = sortOptions(this.options, this.showGroup);

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
        hide: false,
        hideAfter: '',
        hideBefore: '',
        value: '',
        title: ''
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
    const len = this.options.length;

    this.options = deleteSelectedOption(this.options, index);

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
      if (data.hideHidden && option.hide === true) {
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
                ${this._getShowLabel(!option.hide, pos)}
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
      if (data.hideHidden && option.hide === true) {
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
        <li class="single-option cols-${data._colCount} is-${(!option.hide) ? 'shown' : 'hidden'}${(data.readonly ? 'is-readonly' : '')}${data._getColClass()}${isMid}">

          ${data._getEditableTextField(option.value as string, 'value', pos, id, !data.hideValue, handler)}
          ${data._getEditableTextField(option.label as string, 'label', pos, id, true, handler)}
          ${data._getEditableTextField(option.group as string, 'group', pos, id, (data.allowGroup && data.showGroup && option.value !== ''), handler)}
          <div class="toggle-block">
            ${(!data.hideHidden) ? data._getToggleBtn(id, !option.hide, 'show', pos, handler) : ''}
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
    const mid = action.substring(0, 4) === 'hide'
      ? 'hide-by'
      : action.substring(0, 5)

    return html`
    <button id="${id}${action}" class="toggle-btn toggle-btn--${mid} toggle-btn--${action}" @click=${handler}>${str} ${label}</button>`
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
      ? html`<span class="extra-controls__add"><button id="${this.id}____0__add" class="action-btn action-btn--add" @click=${handler} class="add">
        Add ${(this.options.length === 0)
          ? 'first'
          : 'another'
        } option</button></span>`
      : '';
    const sortTitle = this.showGroup
        ? 'group then '
        : '';
    this._firstIsEmpty = (typeof this.options[0] !== 'undefined' && this.options[0].value === '');

    return html`
      <ul class="single-option__wrap">
        ${repeat(this.options, item => item.value, this._getSingleEditableOption())}
      </ul>
      <div class="extra-controls">
        ${addBtn}
        <span class="extra-controls__other">
          <button id="${this.id}____0__sort" class="action-btn action-btn--sort" @click=${handler} title="Sort options alphabetically by ${sortTitle}label">Sort options</button>
          ${this._getShowHideBtn(id, 'valueShow', 'value input', !this.hideValue, handler)}
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
          ${(this.allowImport)
            ? html`
                <button id="${this.id}____0__showImportModal" class="action-btn action-btn--import" @click=${handler}>
                  Import
                </button>`
            : ''
          }
        </span>
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
        return (item.hide === false && this._emptyIsOK(item, index));
      }
    );

    let grouped : Array<IOptionGroup> = [];
    let ungrouped : Array<IOptionGroup>;
    let all : Array<IOptionGroup> = []

    if (typeof tmp[0] !== 'undefined' && tmp[0].value === '' && this.allowEmptyFirst) {
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
      (item : ISingleInputOption) => (item.hide === false && item.value !== '')
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
    return html`<div class="demo"><label for="demo">Example:</label> <div>${demo}</div></div>`;
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
    };

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
                ? this.getOptionDataWithHeader()
                : this.getOptionData()
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
    // console.group('render()');
    // console.log('this.showSave:', this.showSave)
    // console.groupEnd();

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
      ${(this.showSave && this._changed)
        ? html`<button id="${this.id}____0__save" class="action-btn action-btn--save" @click=${this._getHandler()}>Save</button>`
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





// ========================================================
// START:  Shared state manipulation methods

// --------------------------------------------------------
// The following collection of pure functions are used to
// manage state changes for certain actions within
// `<option-list-editor>`.
//
// If the `<option-list-editor>` client (e.g. Redux) is
// managing its own state (rather than just accepting the
// contents of `OptionListEditor.options`) it can use
// these functions to perform the same action on its own
// (external) state.
// --------------------------------------------------------


/**
 * Move an option up or down the list relative to its current position
 *
 * @param options   List of all options in the option list
 * @param index     Index of option to be moved
 * @param direction Direction to move ("up" or "down")
 *
 * @returns TRUE if option was moved up or down
 */
export const moveSelectedOption = (
  options: Array<ISingleInputOption>, index: number, direction: string
) : Array<ISingleInputOption> => {
  const option = options.filter(
    (_option : ISingleInputOption, i : number) => (index === i)
  );
  const allOptions = options.filter(
    (_option : ISingleInputOption, i : number) => (index !== i)
  );
  const newInd = (direction.toLowerCase() === 'up')
    ? index - 1
    : index + 1;

  return [
    ...allOptions.slice(0, newInd),
    option[0],
    ...allOptions.slice(newInd)
  ];
};

/**
 * Toggle Selected status of the specified option
 *
 * @param options    List of all options in the option list
 * @param index      Index of option to be deleted
 * @param allowMulti Which option property should be updated
 *
 * @returns Updated version of `options` where the specified
 *          option has had its `selected` value toggled and
 *          potentially where all other option's `selected` value
 *          is set to `FALSE`.
 */
export const toggleSelectedOption = (
  options: Array<ISingleInputOption>, index: number, allowMulti: boolean = false
) : Array<ISingleInputOption> => {
  const output = [...options];

  if (allowMulti) {
    for (let a = 0; a < output.length; a += 1) {
      if (index === a) {
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

  return output;
};

/**
 * Toggle Selected status of the specified option
 *
 * @param options List of all options in the option list
 * @param index   Index of option to be deleted
 *
 * @returns TRUE if option's property was updated, FALSE otherwise
 */
export const deleteSelectedOption = (
  options: Array<ISingleInputOption>, index: number
) : Array<ISingleInputOption> => {
  let i = index;

  return options.filter(
    (option:ISingleInputOption, index: number) => {
      if (index === i && _canBeDeleted(option)) {
        i = -1;
        return false;
      } else {
        return true;
      }
    }
  );
}

/**
 * Check whether a single item can be deleted
 *
 * @param option Option to be tested
 *
 * @returns TRUE if the option is hidden of both value & label are empty
 */
const _canBeDeleted = (option : ISingleInputOption) : boolean => {
  return (option.hide === true || (option.value == '' && option.label === ''));
}


/**
 * Sort options alphabetically by label (case insensitive)
 *
 * @param options     List of all options in the option list
 * @param sortByGroup Whether or not to sort by group first or
 *                    label only
 *
 * @returns Sorted list of options
 */
export const sortOptions = (
  options: Array<ISingleInputOption>, sortByGroup: boolean = false
) : Array<ISingleInputOption> => {
  const output = [...options];

  output.sort(
    (sortByGroup === true)
      ? _sortInnerGroupLabel
      : _sortInnerLabel
  );

  return output
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
const _sortInnerLabel = (a: ISingleInputOption, b: ISingleInputOption) : number => {
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
const _sortInnerGroupLabel = (a: ISingleInputOption, b: ISingleInputOption) : number => {
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
 * Add a new group name to the list of known group names
 *
 * @param allGroupNames List of group names already known in option list
 * @param newName       New group name to be added to the list
 *
 * @returns Update list of group names if newName was unknown or
 *          original list if newName was already in the list
 */
export const addToGroupNames = (allGroupNames: Array<string>, newName: string) : Array<string> => {

  if (newName !== '' && allGroupNames.indexOf(newName) === -1) {
    const output = [...allGroupNames];

    output.push(newName);

    output.sort((a : string, b : string) : number => {
      const aLow = a.toLowerCase();
      const bLow = b.toLowerCase();

      if (aLow < bLow) {
        return -1;
      } else if (aLow > bLow) {
        return 1;
      } else {
        return 0;
      }
    });

    return output;
  }

  return allGroupNames;
}

/**
 * Strip unneeded properties from option objects
 *
 * `hide` & `selected` are omitted if FALSE
 * `label` is omitted if `value` & `label` are identical
 * `group`, `hideBefore` & `hideAfter` are omitted if they are empty
 *
 * @param options List of options containing full data
 *
 * @returns List of options containing only the minimum required
 *          properties to accurately represent the data
 */
export const getSimplifiedOptionData = (options : Array<ISingleInputOption>) : Array<ISingleInputOptionSimple> => {
  return options.filter(
    (option : ISingleInputOption) => (option.label !== '')
  ).map((option : ISingleInputOption) => {
    const tmp : ISingleInputOptionSimple = {
      value: option.value
    };

    if (option.value !== option.label) {
      tmp.label = option.label
    }

    if (option.hide === true) {
      tmp.hide = true;
    }

    if (option.selected === true) {
      tmp.selected = true;
    }

    if (option.group !== '') {
      tmp.group = option.group;
    }

    if (option.hideBefore !== '') {
      tmp.hideBefore = option.hideBefore;
    }

    if (option.hideAfter !== '') {
      tmp.hideAfter = option.hideAfter;
    }

    if (option.title !== '') {
      tmp.title = option.title;
    }
    return tmp;
  });
}

/**
 * Make sure each option in list has all the properties available
 * to it.
 *
 * To save disc space option data is simplified for storage. This
 * ensures that all options have the properties that are expected
 *
 * @param options Options with simplified data
 *
 * @returns List of options with full data.
 */
export const getFullOptionData = (
  options : Array<ISingleInputOptionSimple>
) : Array<ISingleInputOption> => {
  return options.map((option: ISingleInputOptionSimple) : ISingleInputOption => {
    return {
      value: option.value,
      label: (typeof option.label === 'string' && option.label !== '')
        ? option.label
        : option.value,
      selected: (typeof option.selected === 'boolean' && option.selected === true),
      hide: (typeof option.hide === 'boolean' && option.hide === true),
      group: (typeof option.group === 'string')
        ? option.group
        : '',
      hideBefore: (typeof option.hideBefore === 'string')
        ? option.hideBefore
        : '',
      hideAfter: (typeof option.hideAfter === 'string')
        ? option.hideAfter
        : '',
      title: (typeof option.title === 'string')
        ? option.title
        : ''
    }
  })
}

// START:  Shared state manipulation methods
// ======================================================
