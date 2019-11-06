# Gate
SlimIO Gate built-in addon. This addon is an abstraction of core (as Addon).

> Note: it use global.slimio_core (registered as global by the core) to work.

## Features
- Expose core data to callback(s).
- Expose available addons.

## Getting Started
This package is available in the SlimIO Package Registry and can be easily installed with [SlimIO CLI](https://github.com/SlimIO/CLI).

```bash
$ slimio --add gate
# or
$ slimio --add https://github.com/SlimIO/Gate
```

> Note: this addon is automatically installed with the slimio -i command.

## Callbacks

<details><summary>global_info</summary>
<br />

Retrieve informations about the Agent itself. Like some of the constructor parameters or versions of used libs in Node.js (like V8 Engine version etc).

```ts
{
    root: string;
    silent: boolean;
    coreVersion: string;
    versions: string;
}
```
</details>

<details><summary>list_addons</summary>
<br />

Return an Array of string that contains addons name (in lowercase).

</details>

<details><summary>get_routing_table</summary>
<br />

Return the complete core routing table. A route is the composition of the addon name and a callback name (what we often call a **target**).

For example `gate.status` is a **target** (that how the core deal with the incomming requests).

</details>

<details><summary>get_config(path?: string)</summary>
<br />

Get a given key **path** from the Agent configuration file. Return any payload requested. If no path is given, the complete configuration is returned.

</details>

<details><summary>set_config(path: string, value: string)</summary>
<br />

Set a new configuration in the Agent configuration. **path** and **value** must be valid JS strings.

</details>

<details><summary>dump_list</summary>
<br />

Return the complete list of dump names (Array of string). These can be used to retrieve each dump with the `gate.get_dump` callback.

</details>

<details><summary>get_dump(name: string)</summary>
<br />

Return a given dump.

</details>

<details><summary>start_addon(addonName: string)</summary>
<br />

Start a given addon (currently in use for Prism addon).

</details>

<details><summary>get_lock_state</summary>
<br />

Return the complete list of linked addons states for the Addon who request the callback.

</details>

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/addon](https://github.com/SlimIO/Addon#readme)|Minor|Low|Addon Container|

## Licence
MIT
