export function vuexRevert(store) {
  let mutations = [];
  let initialState;

  // Register own module for storing the mutation id and revert action
  store.registerModule('vuexRevert', {
    namespaced: true,
    state: {
      mutationId: null
    },
    mutations: {
      MUTATION_ID(state, payload) {
        state.mutationId = payload;
      }
    },
    actions: {
      revertMutation(context, payload) {
        revert(payload);
      }
    }
  });

  // Create a copy of the bare store state for reset purposes (after the dynamically registered module)
  initialState = JSON.parse(JSON.stringify(store.state));

  // Record mutations and append an id to mutations within decorated actions
  store.subscribe((mutation) => {
    if (mutation.type === 'vuexRevert/MUTATION_ID') {
      mutations[mutations.length - 1] = { ...mutations[mutations.length - 1], id: mutation.payload };
    } else {
      mutations.push(mutation);
    }
  });

  function resetStore() {
    store.replaceState(initialState);
  }

  // Remove the mutation to revert, from the list of all mutations
  function revert(id) {
    const mutation = mutations.filter(mutation => mutation.id && mutation.id === id)[0];

    if (mutation) {
      runMutations(mutation);
    }
  }

  // Reset the store and execute the saved mutations
  function runMutations(mutation) {
    mutations = mutations.filter(mutationObject => !mutationObject.id || mutationObject.id !== mutation.id);
    resetStore();

    mutations.forEach((mutationObject) => {
      store.commit(`${mutationObject.type}`, mutationObject.payload);
      mutations.pop();
    });
  }
}
