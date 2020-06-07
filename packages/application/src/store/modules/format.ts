import { Module } from "vuex";
import { Format } from "../../../../core/src/main";

export const FORMAT_UPDATE = "FORMAT_UPDATE";

export interface CurrencyState {
    active: Format;
}

export const formatModule: Module<CurrencyState, CurrencyState> = {
    state: () => {
        return {
            active: Format.TCG,
        };
    },
    mutations: {
        [FORMAT_UPDATE](state, payload: { format: Format }) {
            state.active = payload.format;
        },
    },
};
