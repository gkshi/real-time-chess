export default {
  namespaced: true,

  state: {
    list: [] as string[]
  },

  actions: {
    open ({ state, commit }, id) {
      if (!id) {
        return
      }
      commit('LIST_UPDATE', [...state.list, id])
    },

    close ({ commit, state, dispatch }, id) {
      if (!id) {
        return dispatch('closeAll')
      }
      commit('LIST_UPDATE', state.list.filter(i => i !== id))
    },

    closeLast ({ commit, state }) {
      commit('LIST_UPDATE', state.list.slice(0, -1))
    },

    closeAll ({ commit }) {
      commit('LIST_UPDATE', [])
    }
  },

  mutations: {
    LIST_UPDATE: (state, list: string[] = []) => {
      state.list = list
    }
  }
}
