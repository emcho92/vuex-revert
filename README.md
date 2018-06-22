# Vuex Revert (WIP)

Vuex plugin for easy mutation reverting.


## Installation
```js
npm i --save-dev vuex-revert
```


## Requirements

Since this plugin utilises decorators you need to have **Babel** set up, along with the [transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) plugin.


## Usage

Being a Vuex plugin, first you need to specify it in the array of plugin functions when defining the Vuex store.

```js
import { vuexRevert } from 'vuex-revert';

const store = new Vuex.Store({
  // ...
  plugins: [vuexRevert]
})
```

You also need to apply the revert decorator to the actions that contain mutations you want to be able to revert.

```js
import { revert } from 'vuex-revert';

class PostActions {

	@revert // <- 1. Add decorator
	async createPost({ commit, dispatch }, payload) {
		try {
			// ... some own logic
			var toRevert = commit(`CREATE_POST`, post); // <- 2. Target mutation (commit returns the mutation ID)
			commit('someModule/ANOTHER_MUTATION', data, { root: true });

			await PostService().create(post);
		} catch(err) {
			dispatch('vuexRevert/revertMutation', revertMutation, { root: true }); // <- 3. Dispatch the revertMutation action with the mutation ID
		}
	}
}
```

1. The decorator is required since it adds additional functionality to the store `commit` function. The "enhanced" commit, now has a return value which represents the `id` of the mutation. All mutations in the decorated action get assigned an `id`.
2. Store the returned mutation id for later use
3. When you want to revert a mutation dispatch the `revertMutation` action and forward the `id` of the mutation you want to revert as payload. You need to specify the full name of the action, including the module `vuexRevert/revertMutation`, and add `root: true` to the options object as the module is on the state root level.

Note:

 - Decorators can only be added to class methods
 - This plugin adds a dynamic module to your store, on the root level, hence the existing `revertMutation` action


## Use case

A full use case/article is in the works. But for now, this best fits situations where you have lots of actions, and lots of mutations per action, which do state manipulation in advance, before receiving responses from you API source - so for projects implementing [Optimistic UI](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/) principles.
When requests fails, having a quick, order conscious way of reverting the pre-executed mutations is a good thing.


## API

### Decorators
`@revert` "enhances" the Vuex commit function

### Vuex actions
`vuexRevert/revertMutation` reverts the mutation with the `id` passed as payload


## TODO

 - Add ways to configure the plugin
 - Demos
 - Tests
