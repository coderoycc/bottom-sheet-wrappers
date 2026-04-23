import "./style.scss";
import type { App, Plugin } from "vue";
import DynamicBottomSheet from "./components/DynamicBottomSheet.vue";
import SimpleBottomSheet from "./components/SimpleBottomSheet.vue";

export { DynamicBottomSheet, SimpleBottomSheet };

export type {
	BottomSheetProps,
	SheetSize,
	SheetMode,
	SheetOptions,
	SheetInstance,
	SheetState,
	GestureState,
	BottomSheetMetadata,
} from "./types";

export type { SimpleBottomSheetProps } from "./components/SimpleBottomSheet.vue";
export type {
	DynamicBottomSheetProps,
	DynamicSize,
} from "./components/DynamicBottomSheet.vue";

const plugin: Plugin = {
	install(app: App) {
		// Registrados como BsDynamic y BsSimple → se usan como <bs-dynamic> y <bs-simple>
		app.component("BsDynamic", DynamicBottomSheet);
		app.component("BsSimple", SimpleBottomSheet);
	},
};

export default plugin;
