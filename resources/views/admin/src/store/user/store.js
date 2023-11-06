import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export const user = {
    namespaced: true,
    state: {
      user: {},
      meta: {},
    },
    actions,
    getters,
    mutations
}
