import { ref, watchEffect } from "vue";

export type Theme = "blue" | "green" | "gray";

const currentTheme = ref<Theme>("blue");

export function useTheme() {
	// Efecto para aplicar la clase al body
	watchEffect(() => {
		// Remover clases anteriores
		document.body.classList.remove("theme-blue", "theme-green", "theme-gray");
		// Agregar clase actual
		document.body.classList.add(`theme-${currentTheme.value}`);
	});

	const setTheme = (theme: Theme) => {
		currentTheme.value = theme;
	};

	return {
		currentTheme,
		setTheme,
	};
}
