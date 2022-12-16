import React, { useEffect, useState, useContext } from "react";
import { getSdk } from "./extension-sdk";

const defaultParams = {};

const defaultExtensionState = {
  params: {
    ...defaultParams,
  },
};

const ExtensionContext = React.createContext();

const mapContentTypes = (types) => {
  const result = {
    cards: {},
    icons: {},
  };

  if (types != null) {
    for (let type of types) {
      if (type.card) result.cards[type.id] = type.card;
      if (type.icon) result.icons[type.id] = type.icon;
    }
  }

  return result;
};

export function ExtensionContextProvider({ children }) {
  const [state, setState] = useState(defaultExtensionState);

  useEffect(() => {
    getSdk().then(async (sdk) => {
      sdk.frame.startAutoResizer();
      const field = await sdk.field.getValue();
      const schema = sdk.field.schema;
      const params = {
        title: schema.title,
        ...defaultParams,
        ...sdk.params.installation,
        ...sdk.params.instance,
      };
      const contentTypes = mapContentTypes(params.contentTypes);

      if (schema["ui:extension"] == null) {
        schema["ui:extension"] = {};
      }

      if (schema["ui:extension"].params == null) {
        schema["ui:extension"].params = {};
      }

      schema["ui:extension"].params.contentTypes = contentTypes;

      let state = {
        ...defaultExtensionState,
        field,
        schema,
        sdk,
        params,
        contentTypes: mapContentTypes(params.contentTypes)
      };

      state.setField = () => {
        sdk.field.setValue(state.field);
      };

      setState({ ...state });
    });
  }, [setState]);

  return (
    <ExtensionContext.Provider value={state}>
      {children}
    </ExtensionContext.Provider>
  );
}

export function useExtension() {
  return useContext(ExtensionContext);
}
