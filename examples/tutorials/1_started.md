# Tutorial: Getting started

## General
`Invenio-Statistics-Js` helps you visualize statistics expressed in `JSON` format.

This module is designed to cooperate with the [Invenio-Stats](https://github.com/inveniosoftware/invenio-stats) module, in order to visualize CDS statistics
coming from the ES cluster.

It currently supports the following types of graphs:

* Single Line/Area graph
* Multi Line/Area graph
* Single Bar graph
* Grouped Bar graph

## Initialization
Every graph of the `Invenio-Statistics-Js` module requires three parameters in order to be correctly
rendered inside the `DOM`:

* A `JSON` object as the **input data**. *If no data object is specified, the graph will be blank.*

* A `string` indicating the **class** of the placeholder element. *If no such element exists in the `DOM`,
a new classed `div` element will be created as the placeholder of the graph.*

* A `JSON` object as the **configuration**. *If no configuration object is specified, the default one is used.*

## Usage
* [Line Graph](https://github.com/CERNDocumentServer/invenio-statistics-js/2_line.md)
* [Bar Graph](https://github.com/CERNDocumentServer/invenio-statistics-js/3_bar.md)
