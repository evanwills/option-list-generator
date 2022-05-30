# `<option-list-editor>`

* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
* [Attributes](#attributes)
* [Public properties](#public-properties)
* [Actions that trigger change events](#actions-that-trigger-change-events)
* [Type definitions](#type-definitions)
    * [`ISingleInputOption`](#isingleinputoption)
    * [`IEventData`](#ieventdata)
* [Exported functions and helper methods](#exported-functions-and-helper-methods)
    * [Exported functions](#exported-functions)
    * [Helper methods](#helper-methods)


-----
## Introduction

`<option-list-editor>` Is a web component for editing HTML `<SELECT>` 
input field options and/or lists of `<INPUT type="radio">` or 
`<INPUT type="checkbox">`  fields

You provide the component with a list of option elements and 
`<option-list-editor>` provides an edit interface for those options.

While this element doesn't contain a `<slot>` it looks for child
`<option>` & `<optgroup>` HTML elements which it then parses to 
extract the data it needs to build up an edit interface for the 
provided options.



## Installation

Clone this repo then in a terminal
```
npm install;
npm run dev;
```

-----

## Usage

> __NOTE:__ To ensure that there is no conflict with IDs within and 
>           outside the component, the `id` attribute is the only 
>           required attribute. If an ID is not supplied, the 
>           component will throw an error.

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
    <option value="if" data-group="code">If</option>
    <option value="while" data-group="code">While</option>
    
    <!-- Option will be hidden before the 11:45am on the 11th of May 2022 -->
    <option value="early" data-hidebefore="2022-05-27T11:45:00">Too early</option>
    
    <!-- Option will be hidden after 2022 -->
    <option value="early" data-hidebefore="2022-12-31T23:59:59">Too late</option>
</option-list-editor>
```
or if you already have code that can generate option groups

```html
<option-list-editor id="option-list">
    <optgroup label="Birds">
        <!-- The following two options belong to the *code* group -->
        <option value="plover">Plover</option>
        <option value="sooty oyster catcher">Sooty oyster catcher</option>
        <option value="pacific gull">Pacific gull</option>
    </optgroup>
    <optgroup label="Mammals">
        <option value="bandicoot">Bandicoot</option>
        <option value="brush tail possum">Brush tail possum</option>
        <option value="ring tail possum">Ring tail possum</option>
        <option value="pigmy possum">Pigmy possum</option>
    </optgroup>
</option-list-editor>
```

When processing the options nested within the `<option-list-editor>` 
component, up to six attributes are looked for:

1. `value` If value is not present or is empty and the innerText of 
            the option is not empty, that will be used for both the 
            option value and label
2. `selected` This is used to set the "default" status of the option. 
            This can be toggled on or off via the edit interface once 
            the component is instantiated
3. `disabled` This is used to define the show/hide status of the option
4. `data-group` If the option is part of an option-group, this can be 
    used for defining which group.
    > __NOTE:__ `group` handling only allows for one level of 
                grouping. If the external client wants more deeply 
                nested grouping, it should do so by having a 
                separator character between the group names within 
                the group string
5. `data-hidebefore` (This probably has almost no usecase outside of 
            my own but...) This expects an ISO 8601 date/time string 
            intending for making the options visibilty time sensitive
6. `data-hideafter` (This probably has almost no usecase outside of 
            my own but...) This expects an ISO 8601 date/time string 
            intending for making the options visibilty time sensitive.

> __NOTE:__ While there is an option with either value or label empty, 
            new options cannot be added and existing options cannot 
            be moved.

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

* `groupedLast` - [boolean - Default: `FALSE`]<br />
            Whether or not to put grouped options after ungrouped 
            options


-----

## Public properties

* `doInit` - *[default: `FALSE`]*

    If the client wishes to force the rerun the initialisation 
    process, they can set this to true. E.g. They have updated the 
    list of options within the component but have not rerendered the 
    component itself.

* `options` - *`Array<ISingleInputOption>`*

    Current state of the list of options the component is editing.

* `eventData` - *`IEventData`*

    Information about the last internal event that triggered a public 
    change event


-----

## Actions that trigger change events

Depending on how the client is using `<option-list-editor>`, it may
wish to know when small updates

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

* `APPENDIMPORTED` - Add multiple valid options to the existing 
                      list of options

* `IMPORTREPLACE` - Replace all existing options with imported list 
                     of valid options

* `SAVE` - The user wishes to save all the changes they've made


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

-----

## Exported functions and helper methods

For clients wishing to manage state in parallel to 
`<option-list-editor>`, there are a couple of bundled pure functions 
and one helper method to make this easier

### Exported functions

Because client applications may wish to handle changes to 
`<option-list-editor>` in different ways, it offers a number of pure 
functions to perform state changes both within the custom element and 
to be used by client code.

The following functions are used by `<option-list-editor>` to manage 
it's internal state changes but the can also be used by clients to 
replicate the changes in their own state.

* __`moveSelectedOption()`__ - which is used to move a single option 
            up or down the list of options relative to its starting 
            position.
    
    It accepts three arguments:
    * `options` {Array<ISingleInputOption>} - List of all options in 
      the option list
    * `index` {number} - The starting postion of the option to be 
      moved
    * `direction` {"up" or "down"} which direction the option should 
      be moved

    Returns an updated version of `options` where the specified 
    option has been moved

    ```typescript
    const newOptions = moveSelectedOption(options, 2, 'up');
    ```
    
* __`toggleSelectedOption()`__ toggles the selected option.
    > __NOTE:__ If `allowMulti` is `FALSE` all other options will 
                have their `selected` value set to `FALSE`
    
    It accepts three arguments:
    * `options` {Array<ISingleInputOption>} - List of all options in 
      the option list
    * `index` {number} - The starting postion of the option to be 
      moved
    * `allowMulti` {boolean} Whether or not multiple options can be 
      selected at one time by default

    Returns an updated version of `options` where the specified 
    option has had its `selected` value toggled and potentially where 
    all other option's `selected` value is set to `FALSE`.

    ```typescript
    const newOptions = toggleSelectedOption(options, 1, false);
    ```
    
* __`deleteSelectedOption()`__ Deletes the option specified by the 
                index.
    
    It accepts two arguments:
    * `options` {Array<ISingleInputOption>} - List of all options in 
      the option list
    * `index` {number} - Index of the option to be deleted

    Returns an updated version of `options` where the specified 
    option has been deleted

    ```typescript
    const newOptions = deleteSelectedOption(options, 5);
    ```
    
* __`sortOptions()`__ Sort options alphabetically by `label` or 
            `group` then `label`

    > __NOTE:__ Sorting is case insensitive
    
    It accepts two arguments:
    * `options` {Array<ISingleInputOption>} - List of all options in 
      the option list
    * `sortByGroup` {boolean} - Whether or not to sort by group first
                or label only

    Returns a sorted list of options

    ```typescript
    const newOptions = sortOptions(options, 5);
    ```
### Helper methods

For clients that want to allow `<option-list-editor>` to do all of 
the minor changes internally and only do bulk updates using the 
entire state of `<option-list-editor>` there are three helper methods
to extract option data in different format.

* __`OptionListEditor.optionsToJson()`__ - Export the state of 
        `<option-list-editor>` as a JSON array.
    
    This is intended for when management of the options list state is 
    left entirely up to `<option-list-editor>` and the client just 
    accepts the full option list state each time an update is made.

    Returns JSON string
    ```typescript
    OptionListEditor.optionsToJson()
    ```

* __`getOptionData()`__ - Get option data as separate text
   
    By default this outputs Tab delimited text but can be
    configured to any sort of delimited format

    Accepts two arguments:
    * `colSep` {string} - Character to separate column values
    * `rowSep` {string} - Character to separate rows of data

    Returns a string with each option as a row and data for each 
    option in columns

    ```typescript
    OptionListEditor.getOptionData() // Tab separated values
    OptionListEditor.getOptionData(',') // Comma separated values
    OptionListEditor.getOptionData('^', '~') // Carot separated values with tilda separated rows
    ```

* __`getOptionDataWithHeader()`__ - Get option data as separate text 
        with header row
   
    By default this outputs Tab delimited text but can be
    configured to any sort of delimited format

    Accepts two arguments:
    * `colSep` {string} - Character to separate column values
    * `rowSep` {string} - Character to separate rows of data

    Returns a string with each option as a row and data for each 
    option in columns

    ```typescript
    OptionListEditor.getOptionDataWithHeader()
    ```
