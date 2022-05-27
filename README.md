# `<option-list-editor>`

## Introduction

`<option-list-editor>` Is a web component for editing HTML `<SELECT>` input field options and/or lists of `<INPUT type="radio">` or `<INPUT type="checkbox">`  fields

You provide the component with a list of option elements and `<option-list-editor>` provides an edit interface for those options.



## Installation

Clone this repo then in a terminal
```
npm install;
npm run dev;
```

-----

## Usage

> __NOTE:__ To ensure that there is no conflict with IDs within and outside the component, the `id` attribute is the only required attribute. If an ID is not supplied, the component will throw an error.

```html
<option-list-editor id="option-list"></option-list-editor>
```
or

```html
<option-list-editor id="option-list">
    <option value="foo" selected>Foo</option> <!-- Option is selected by default -->
    <option value="bar">Bar</option>
    <option value="baz" disabled>Baz</option> <!-- Option is not visable to end user -->

    <!-- The following two options belong to the *code* group -->
    <option value="if" group="code">If</option>
    <option value="while" group="code">While</option>
    
    <!-- Option will be hidden before the 11:45am on the 11th of May 2022 -->
    <option value="early" hidebefore="2022-05-27T11:45:00">Too early</option>
    
    <!-- Option will be hidden after 2022 -->
    <option value="early" hidebefore="2022-12-31T23:59:59">Too late</option>
</option-list-editor>
```

When processing the options nested within the `<option-list-editor>` component, up to six attributes are looked for:

1. `value` If value is not present or is empty and the innerText of the option is not empty, that will be used for both the option value and label
2. `selected` This is used to set the "default" status of the option. This can be toggled on or off via the edit interface once the component is instantiated
3. `disabled` This is used to define the show/hide status of the option
4. `data-group` If the option is part of an option-group, this can be used for defining which group.
5. `data-hidebefore` (This probably has almost no usecase outside of my own but...) This expectis an ISO 8601 date/time string intending for making the options visibilty time sensitive
6. `data-hideafter` (This probably has almost no usecase outside of my own but...) This expectis an ISO 8601 date/time string intending for making the options visibilty time sensitive.

> __NOTE:__ While there is an option with either value or label empty, new options cannot be added and existing options cannot be moved.

-----
## Attributes

* `mode` -  [string - Default: `"select"`]<br />
            How options are to be rendered:
    * "select"
    * "radio"
    * "checkbox"`

* `hidevalue` - [boolean - Default: `FALSE`]<br />
            Whether or not to hide the `value` input field.
            (Causes value and label to be the same)

* `hidehidden` - [boolean - Default: `FALSE`]<br />
            Whether or not to hide disabled options
            i.e. Never render disabled options
            Also removes the Hidden/Visible toggle button from UI

* `hidedemo` - [boolean - Default: `FALSE`]<br />
            Whether or not to hide demo of options<br />
            By default a demo of the input field (as the end user 
            would see) it is shown at the top of the component.

* `showgroup` - [boolean - Default: `FALSE`]<br />
            Whether or not to show the option group field<br />
            In HTML `<SELECT>` field `<OPTIONS>` can be grouped 
            together in `<OPTGROUP>` block. If `TRUE` an extra 
            *"Group"* input field is rendered allowing editors to 
            specify groups an input field will be in.

* `nosort` - [boolean - Default: `FALSE`]<br />
            Whether or not options can be sorted by the editor
            Sorting is done alpahabetically by `label` 
            (if `showgroup` is `FALSE`) or by `group` then `label` 
            (if `showgroup` is `TRUE`)

    > __NOTE:__ Regardless of whether `nosort` is `TRUE` or `FALSE`, 
            editors can move options up and down the list as they see fit.

* `alllowimport` - [boolean - Default: `FALSE`]<br />
            Whether or not to allow editors to bulk import options 
            using delimited text

* `allowduplicate` - [boolean - Default: `FALSE`]<br />
            Whether or not to allow options with duplicate labels or 
            values.
    > __NOTE:__ Allowing options duplicate values or labels is a bad 
            idea.

* `allowmulti` - [boolean - Default: `FALSE`]<br />
            Whether or not to allow multiple options to be 
            *selected*/*checked* by default
    > __NOTE:__ If `mode` = "*checkbox*" then `allowMulti` is forced to `TRUE`

* `allowhidebydate` - [boolean - Default: `FALSE`]<br />
            Whether or not to allow "Hide before" & "Hide after" 
            date/time input field to be shown/hidden
    > __NOTE:__ If `showHideBefore` or `showHideAfter` are `TRUE` 
            then `allowHideByDate` is forced to `TRUE`

* `allowgroup` - [boolean - Default: `FALSE`]<br />
            Whether or not to allow options to be grouped

* `allowemptyfirst` - [boolean - Default: `FALSE`]<br />
            Whether or not to allow the first option in the list to 
            have an empty value
   
   By default, options are forced to have a non-empty value and
   label. If `allowEmptyDefault` is `TRUE`, the first option will
   only be required to have a non-empty label

* `readonly` - [boolean - Default: `FALSE`]<br />
            Whether or not options are editable

* `showhidebefore` - [boolean - Default: `FALSE`]<br />
            Whether or not "Hide before" date/time input field is shown.

* `showhideafter` - [boolean - Default: `FALSE`]<br />
            Whether or not "Hide after" date/time input field is shown.

* `otheroptiontxt` - [boolean - Default: `FALSE`]<br />
            Option for "Other" final option

    *Other* option when you wish to allow users who don't 
    like any of the predefined options to specify their own 
    value

* `otherfieldtxt` - [boolean - Default: `FALSE`]<br />
            Label for "Other - please specify" input text field


-----

## Public properties

### `doInit` - *[default: `FALSE`]*

If the client wishes to force the rerun the initialisation process, they can set this to true. E.g. They have updated the list of options within the component but have not rerendered the component itself.

### `options` - *`Array<ISingleInputOption>`*

Current state of the list of options the component is editing.

### `eventData` - *`IEventData`*

Information about the last internal event that triggered a public change event


-----

## Actions that trigger change events

* `UPDATE` - One of the text fields for a single option was updated
   * `value`
   * `label`
   * `group`
   * `hideBefore`
   * `hideAfter`

* `TOGGLE` - One of the boolean fields for a single option was 
             toggled between `TRUE` & `FALSE`

   * `default`
   * `show`

* `MOVE` - A single option was moved up or down one place relative 
           to its last position

* `DELETE` - A single option was deleted

* `ADD` - A new empty option was added to the end of the list of 
          options

* `SORT` -  The full list of options was sorted alphabetically 
            `label` (if `allowGroup` is `FALSE`) *or*
            by `group` then  `label` (if `allowGroup` is `TRUE`)

* `APPEND_IMPORTED` - Add multiple valid options to the existing 
                      list of options

* `IMPORT_REPLACE` - Replace all existing options with imported list 
                     of valid options


-----

## Type definitions

### `ISingleInputOption`

`ISingleInputOption` holds all the data for a single input option

```typescript
interface ISingleInputOption {
  value : string,
  label : string,
  selected : boolean,
  show : boolean,
  group : string,
  hideBefore : string,
  hideAfter : string
}
```

* `value` - The value of the option. (Also used as the label for the 
            option if the label is empty)

* `label` - Human readable label for the option (what users see)

* `selected` - Whether or not this option should be selected/checked 
            by default

* `show` -  Whether or not this option will be rendered for end users

* `group` - Group the option belongs to

* `hideBefore` - ISO 8601 date/time string
            Allows users to provide a date, before which, the option 
            is hidden

* `hideAfter` - ISO 8601 date/time string
            Allows users to provide a date, after which, the option 
            is hidden

### `IEventData`

`IEventData` holds data from the most recent event within `<option-list-editor>` that 
resulted in a externally relevent change

```typescript
export interface IEventData {
  index: number,
  action: string,
  field: string,
  value: string
}
```

* `index` - Index of the option that triggered the event:
  * *UPDATE*
  * *TOGGLE*
  * *MOVE*
  * *DELETE*
   
  > __NOTE:__ `index` will be -1 for actions that don't apply to
  >            existing individual options:
  >
  >  * *ADD*
  >  * *SORT*
  >  * *APPEND_IMPORTED*
  >  * *IMPORT_REPLACE*

* `action` - Action that `<option-list-editor>` wants the client to 
             know about
   
   > __NOTE:__ Only actions that result in valid outcomes will
               trigger an event
        
* `field` - For *UPDATE* & *TOGGLE events*, `field` represents the 
            property that was changed. For all other events `field`
            is empty.

* `value` - For *UPDATE* events value is the new value after update.
            For all other events `value` is an empty string
