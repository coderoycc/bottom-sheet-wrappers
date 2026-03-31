import type { App, Plugin } from "vue";
import DynamicBottomSheet from "./components/DynamicBottomSheet.vue";
import FixedBottomSheet from "./components/FixedBottomSheet.vue";

export { DynamicBottomSheet, FixedBottomSheet };

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

export type { FixedBottomSheetProps } from "./components/FixedBottomSheet.vue";
export type {
	DynamicBottomSheetProps,
	DynamicSize,
} from "./components/DynamicBottomSheet.vue";

const plugin: Plugin = {
	install(app: App) {
		app.component("DynamicBottomSheet", DynamicBottomSheet);
		app.component("FixedBottomSheet", FixedBottomSheet);
	},
};

export default plugin;
