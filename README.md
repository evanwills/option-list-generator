# `<option-list-editor>`

## Introduction

`<option-list-editor>` Is a web component for editing HTML `<SELECT>` input field options.

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
    <option value="foo" selected>Foo</option>
    <option value="bar">Bar</option>
    <option value="baz">Baz</option>
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
