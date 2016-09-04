# Recent Updates

We improve the Graphcool platform every day by releasing new features, squashing bugs, and delivering fresh documentation. Here's a list of what's recently happened.

## Work In Progress

## September 2016

### [Milestone M4](https://github.com/graphcool/dashboard/milestone/4)
* You seem to spend most of your time in the data browser, so in order to improve it, we've taken the time to completely reimplement it. It was worth it! Introducing many new features and improvements such as:
	* Smooth infinite scrolling ⚡️
	* Improved UX when editing and creating nodes (supports tab key)
	* *Fixed:* Reloading doesn't reset the data browser any more
* Setting up relations should be a lot easier now. You will be guided through the process and see directly which mutations will be added to the GraphQL schema.

## August 2016

### [Milestone M3](https://github.com/graphcool/dashboard/milestone/3)
* Working with Actions just got a whole lot easier through the power of some fancy new UI. 🎊
* *Fixed*: You will no longer get stuck during onboarding when you've been asked to "Add a Todo model". 
* *Fixed*: If you create a new model, you will be automatically redirected.

### [Milestone M2](https://github.com/graphcool/dashboard/milestone/2)
* You can finally set values to `null` if they are not required by the field.
* Working with scalar list values is now a lot easier in the data browser.
* The number of models can grow pretty fast in a project which hides the rest of the side navigation. We now auto-collapse the list of models when you don't need them.
* We added a new way of authentication called "Permanent Auth Tokens" which is especially useful for server-side scripts. You can create and revoke tokens from our new project settings page. 🔑
* We simplified the process of adding a new model.
* Unsaved changes? We will prompt you to make sure you don't discard them accidentally.
* Instead of showing everybody the hash of password fields, we now hide it behind a rows of `*`s. (Double-click to reveal the hash. 🎩)
* *Fixed*: The dashboard now looks the same in Safari.

### [Milestone M1](https://github.com/graphcool/dashboard/milestone/1)

* Managing relations between models was not as straightforward as it should be. This is a lot easier now with the new **Relations Page**. Give your data model some relation love ❣️.
* The colors of the dashboard looked a bit washed out over time, so we decided to repaint it. The paint still needs to dry... 🖌
* You're now automatically redirected to a newly created project.
* Migration and default values now also work for lists.
* Something special happend to our codebase: Javascript evolved into **Typescript**. It was very effective against Bug-Type Pokemons. 🔥
* *Fixed*: You can now edit list values in the Data Browser.
* *Fixed*: Sometimes deleted nodes remained visible in the Data Browser. Now you won't see them again. We promise.
* *Fixed*: We finally defeated the infinite loop monster which showed up after renaming a project.
