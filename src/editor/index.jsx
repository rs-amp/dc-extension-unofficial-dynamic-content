import { useExtension } from "../extension-context";
import "./editor.css";
import {
  Editor,
  forExtensionName,
  getDefaultRegistry,
  SdkContext,
  withTheme,
} from "unofficial-dynamic-content-ui";
import React from "react";
import EmptyEditor from "../empty-editor";
import { useEffect } from "react";
import EditorExtensionField from "../extension";

let registry = null;

export default function GridEditor() {
  const { field, schema, sdk, setField, params } = useExtension();

  const updateField = (newValue) => {
    for (let key of Object.keys(field)) {
      delete field[key];
    }

    Object.assign(field, newValue);
    setField();
  };

  if (schema == null) {
    return <EmptyEditor />;
  }

  if (registry == null) {
    registry = getDefaultRegistry();
    if (params.extensions) {
      for (let extension of params.extensions) {
        registry.fieldProviders.splice(0, 0,
          forExtensionName(extension.name, EditorExtensionField)
        );
      }
    }
  }

  return (
    <div className="editor">
      <SdkContext.Provider value={{ sdk }}>
        {withTheme(
          <Editor
            schema={schema}
            value={field}
            registry={registry}
            onChange={updateField}
          />
        )}
      </SdkContext.Provider>
    </div>
  );
}
