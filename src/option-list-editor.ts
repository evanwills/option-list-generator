import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { IEventData, ISingleInputOption } from './types/option-list-editor';

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


  private _canAdd : boolean = true;

  private _colCount : number = 2;

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

      // Document stuff from the event that the outside world needs
      // to know about
      this.eventData = {
        index: parseInt(bits[0]),
        action: bits[1],
        field: (typeof bits[2] === 'string')
          ? bits[2]
          : '',
        value: input.value
      }

      data.dispatchEvent(new Event('change'));
    }
  }

  /**
   * Do basic initialisation stuff...
   *
   * Mostly validating attribute values and doing anything that would
   * normally be triggered by user input
   */
   private _init() : void {
     if (this.doInit) {
      console.group('OptionListEditor._init()');
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
        };
        this.options.push(option)
        if (option.value === '' && option.label === '') {
          this._canAdd = false
        }
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
      // if (this.showHideBefore) {
      //   c += 1;
      // }
      // if (this.showHideAfter) {
      //   c += 1;
      // }
      this._colCount = c;


      console.log('this.options:', this.options)
      console.groupEnd();
    }
  }


  //  END:  Helper methods
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
    console.log('data:', data)
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
          ${data._getEditableTextField(option.group as string, 'group', pos, _id, data.showGroup, handler)}
          <div class="date-block">
            ${data._getEditableDateField(option.hideBefore, 'before', pos, _id, data.showHideBefore, handler)}
            ${data._getEditableDateField(option.hideAfter, 'after', pos, _id, data.showHideAfter, handler)}
          </div>
          <div class="toggle-block">
            ${(!data.hideHidden) ? data._getToggleBtn(_id, option.show, 'show', pos, handler) : ''}
            ${data._getToggleBtn(_id, option.default, 'default', pos, handler)}
            ${(!option.show)
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
    const addBtn = (this._canAdd)
      ? html`<button>
        Add ${(this.options.length === 0)
          ? 'first'
          : 'another'
        } option</button>`
      : '';

    return html`
        <ul>
          ${repeat(this.options, item => item.value, this._getSingleEditableOption())}
        </ul>
    ${addBtn}`;
  }

  //  END:  Readonly render methods
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

    return (this.readonly)
      ? this._renderReadOnly()
      : this._renderEditable();
  }


  //  END:  Shared render methods
  // ======================================================
 }

 declare global {
   interface HTMLElementTagNameMap {
     'option-list-editor': OptionListEditor
   }
 }
