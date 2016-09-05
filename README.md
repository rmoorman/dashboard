# Graphcool Dashboard

🚀  Official source of [dashboard.graph.cool](https://dashboard.graph.cool/) written in Typescript 2 and based on React & Relay

## Changelog

### [Milestone M4](https://github.com/graphcool/dashboard/milestone/4)
* You seem to spend most of your time in the data browser, so in order to improve it, we've taken the time to completely reimplement it. It was worth it! Introducing many new features and improvements such as:
	* Smooth infinite scrolling ⚡️
	* Improved UX when editing and creating nodes (supports tab key)
	* *Fixed:* Reloading doesn't reset the data browser any more
* Setting up relations should be a lot easier now. You will be guided through the process and see directly which mutations will be added to the GraphQL schema.
See **[here](CHANGELOG.md)** for a full list of all changes (features/bug fixes).

## Development


master | dev
--- | ---
[![CircleCI](https://circleci.com/gh/graphcool/dashboard/tree/master.svg?style=svg)](https://circleci.com/gh/graphcool/dashboard/tree/master) | [![CircleCI](https://circleci.com/gh/graphcool/dashboard/tree/dev.svg?style=svg)](https://circleci.com/gh/graphcool/dashboard/tree/dev)

```sh
# install dependencies
npm install
# run local server on :4000 using the offical Graphcool API
BACKEND_ADDR="https://api.graph.cool" npm start
```
### IDE Setup (Webstorm)

We use a different version of TypeScript than the default Webstorm TypeScript compiler. That's why you have to do the following to get rid of all TypeScript errors.
Please run `npm install` before the setup.

1. Go to the `Preferences` _(macOS: "⌘ + ,")_ window
2. In the left list menu **select** `Languages & Frameworks > TypeScript`
3. **Click** on the `Edit...` button in the `Common` Panel
4. **Select** `Custom directory`
5. **Browse** to your `project directory` and then **select** `node_modules/typescript/lib` and **click** `OK`
6. **Click** `OK` again in the `Configure TypeScript Compiler`
7. **Click** `OK` in the `Preference` window



## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)
