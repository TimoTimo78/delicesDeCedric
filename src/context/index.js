import React from "react";
export const Context = React.createContext();

const FiltersProvider = ({ children }) => {
  const categories = React.useMemo(
    () => ["Women", "Men", "Kids", "Accessories"],
    []
  );
  const filters = React.useMemo(() => ["Top", "Bottom", "Jacket"], []);
  const [category, setCategory] = React.useState(categories[0].toLowerCase());
  const [filtersChecked, setFiltersChecked] = React.useState({
    Top: false,
    Bottom: false,
    Jacket: false,
  });
  const updateCategory = (value) => setCategory(value.toLowerCase());
  const updateFilters = (e) =>
    setFiltersChecked((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked,
    }));
  const value = React.useMemo(() => {
    const calculatedFiltersKeys = Object.entries(filtersChecked)
    .map(([key, value]) => value && key)
    .filter((obj) => !!obj);
    return {
      categories,
      category,
      filters,
      updateCategory,
      updateFilters,
      filtersChecked: calculatedFiltersKeys,
    };
  }, [category, filters, categories, filtersChecked ]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const withContext = (Component) => () => {
  return (
    <Context.Consumer>
      {(value) => <Component value={value} />}
    </Context.Consumer>
  );
};

export default FiltersProvider;
