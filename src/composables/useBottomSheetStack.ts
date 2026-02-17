import { ref } from "vue";

/**
 * Composable para gestionar el apilamiento automático de BottomSheets
 * Cada BottomSheet que se abre recibe un z-index mayor que el anterior
 */

const BASE_Z_INDEX = 9000;
const Z_INDEX_STEP = 100;
let currentOrder = 0;

export function useBottomSheetStack() {
	const zIndex = ref(BASE_Z_INDEX);

	/**
	 * Registra un nuevo BottomSheet y le asigna un z-index
	 */
	const register = () => {
		currentOrder++;
		zIndex.value = BASE_Z_INDEX + currentOrder * Z_INDEX_STEP;
		return zIndex.value;
	};

	/**
	 * Libera el z-index cuando el BottomSheet se cierra
	 */
	const unregister = () => {
		// Opcional: podrías implementar lógica para reutilizar z-indexes
	};

	return {
		zIndex,
		register,
		unregister,
	};
}
