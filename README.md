# NSP Challenge
The Department Management System is a web application built using Angular as the front-end framework. The system allows users to view, create, edit, and delete departments and the users within those departments. The system uses reactive programming to manage the state of the application.

## NX

This workspace is managed with [Nx, a Smart, fast and extensible build system.](https://nx.dev)

## Development server

Run `nx serve` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Styles

This project uses [Sass](https://sass-lang.com) and [PrimeNg](https://primeng.org/) for CSS styling and components.

## Tests

This project uses [Jest](https://jestjs.io), [spectator](https://github.com/ngneat/spectator), and [ng-mocks](https://ng-mocks.sudo.eu) for unit and integration tests.

Run them with: `nx test --watch`

This project uses [Cypress](https://www.cypress.io) for e2e tests.

With the app running on localhost, run them with: `nx run e2e:e2e --watch` and choose a different port for Cypress.

If you are new to Cypress, check out this [brief guide](https://medium.com/@aleixsuau/cypress-the-crash-post-a0c9c2dd3574)

## Project Architecture

### About monorepos

A monorepo is a single repository containing multiple distinct projects, with well-defined relationships. [Read more](https://monorepo.tools)

### About NX

This app uses NX as a build system and follows its guidelines for monorepo workspaces. It also follows the Domain Driving Design (DDD) principles to structure and name the code reflecting the business domain.

A NX workspace is structured into `apps` and `libs`.

#### App

An `app` is a deployable container that links, bundles, and compiles some `libs` together. For example, this `app` aggregates all the `libs` (`subdomains`) needed to provide the functionality of the tool.

#### Libs

A `lib` is a container that groups related functionality/code (`subdomain`).

##### Folder structure

Inside the `libs` folder, the libraries are structured per `scope` (`subdomain`) in the first level, and per `type` in the following levels.

There are 4 `types` of libraries:

* Feature: implements smart UI (with access to data sources) for specific business use cases or pages in an application.
* UI: contains only presentational components (also called "dumb" components).
* Data-access: contains code for interacting with a back-end system. It also includes all the code related to state management.
* Util: contains low-level utilities used by many libraries and applications.

[Read more](https://nx.dev/structure/library-types)

The naming convention for libraries follows its folder path, this is `scope-type-functionality`. So for example, a `lib` placed in `libs/course/feature/certification` is named `course-feature-certification`. This favors a meaningful encapsulation of the code (resembling the real world wording), making it more predictable, understandable, and findable.

All the libs used by multiple `scopes` are placed in the `shared` folder, also organized per `type` (e.g. `shared-data-access-rest-api`).

Tips:

* Use the NX Console VSCode plugin to create your `libs`.

#### Tags & Dependency rules

In order to maintain our code as decoupled as possible, NX provides a way of defining and enforcing dependency boundaries based on `tags` and `dependency rules`.

* Tags: are used to define the `app`, `type` and `scope` (`subdomain`) of the `lib`. For example, `{"course-feature-certification": { "tags": ["app:workshop", "scope:course", "type:feature"] }}`. This is done in the [NX config file](./nx.json).
* Dependency rules: are used to limit the `tags` that a `lib` can depend on. For example, `{ "sourceTag": "scope:course", "onlyDependOnLibsWithTags": ["scope:course", "scope:shared"] }`. This is done in the global [.eslintrc.json file](./.eslintrc.json).

4 dependency rules:

* `app` and `feature` libs can depend on `feature`, `data-access`, `ui` or `util` libs, but not on `app`. Just keep in mind to move to `shared` those `libs` that are used by multiple `scopes`.
* `ui` libs can only depend on other `ui` or `util` libs.
* `data-access` libs can depend on `data-access` and `util` libs.
* `util` libs can depend only on other `util` libs.

Always tag and define dependency rules for the new `libs`.

#### Tips

* Use the [NX Console VSCode plugin](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) to create and tag your `libs`.
* Use the NX Project Graph to visualize the dependency relationships in your code. For example, in the terminal you would run `nx affected:dep-graph --files=libs/[path-to-file].component.ts` to see the graph of the `libs` that would be affected by a change on that component (because they depend on it).
* Use `nx affected:test` to test all the files affected by a change. For example, in the terminal you would run `nx affected:test --files=libs/[path-to-file].component.ts` to test the files affected by a change on that component.
* Move `libs` around with `nx g @nrwl/workspace:move --project [projectName] [destinationPath]`. It will take care of moving and renaming all the files.
* Check out what the [NX CLI can do for you](https://nx.dev/using-nx/nx-cli).
Main commands:
[generate](https://nx.dev/cli/generate) 
[run](https://nx.dev/cli/run)
[run-many](https://nx.dev/cli/run-many)
[affected](https://nx.dev/cli/affected)

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
