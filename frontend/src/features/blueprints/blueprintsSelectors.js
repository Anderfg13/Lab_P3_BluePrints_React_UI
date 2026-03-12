// Selector memoizado para el top-5 de blueprints por cantidad de puntos
import { createSelector } from 'reselect';

const selectBlueprintsByAuthor = (state) => state.blueprints.byAuthor;

export const selectAllBlueprints = createSelector(
  [selectBlueprintsByAuthor],
  (byAuthor) => Object.values(byAuthor).flat()
);

export const selectTop5Blueprints = createSelector(
  [selectAllBlueprints],
  (blueprints) => {
    // Ordena por cantidad de puntos (descendente) y toma los primeros 5
    return blueprints
      .slice() // copia para no mutar
      .sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0))
      .slice(0, 5);
  }
);
