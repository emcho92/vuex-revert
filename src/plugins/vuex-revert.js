export function vuexRevert(store) {
  let mutations = [];
  let tempMutation = {};

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

  store.subscribe((mutation) => {
    tempMutation = { mutation };

    if (mutation.type === 'vuexRevert/MUTATION_ID') {
      tempMutation = { ...tempMutation, id: mutation.payload }
    }

    mutations.push(tempMutation);
    tempMutation = {};
  });

  function resetStore() {
    const state = store.state;
    const resetState = {};

    console.log(store.state);

    Object.keys(state).forEach((key) => {
      resetState[key] = null;
    });

    store.replaceState(resetState);
  }

  function revert(id) {
    const mutation = mutations.filter(mutation => mutation.id && mutation.id === id)[0];
    console.log(mutation);

    if (mutation) {
      undo(mutation);
    }
  }

  function undo(mutation) {
    mutations = excludeById(mutation.id);
    resetStore();

    mutations.forEach((mutationObject) => {
      store.commit(`${mutationObject.mutation.type}`, Object.assign({}, mutationObject.mutation.payload));
      mutations = excludeById(mutationObject.id);
    });
  }

  function excludeById(id) {
    return mutations.filter(mutationObject => !mutationObject.id || mutationObject.id !== id);
  }
}
