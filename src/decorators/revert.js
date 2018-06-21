import uuid from 'uuid';

export function revert(target, name, descriptor) {
  const original = descriptor.value;

  if (typeof original === 'function') {
    descriptor.value = function(...args) {
      const commit = args[0].commit;

      args[0].commit = function() {
        const id = uuid();

        const mutationArgs = ['vuexRevert/MUTATION_ID', id, { root: true }];
        commit.apply(this, mutationArgs);
        commit.apply(this, arguments);

        return id;
      };

      return original.apply(this, args);
    };
  }

  return descriptor;
}