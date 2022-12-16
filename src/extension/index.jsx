import React from "react";

import { ExtensionBridge } from "dc-extensions-sdk-bridge";
import { useRef } from "react";
import { useEffect } from "react";
import { useExtension } from "../extension-context";

export const styles = {
  root: {
    width: "100%",
  },
};

const EditorExtensionField = (props) => {
  const {
    schema,
    value,
    readonly, // TODO?
    required,
    disabled,
    onChange,
    classes,
    pointer,
    errorReport,
    registry,
  } = props;

  const iframeRef = useRef();
  const { sdk, params } = useExtension();

  useEffect(() => {
    (async () => {
      if (iframeRef?.current) {
        const iframe = iframeRef.current;

        // Yeah, sure.
        const jsonPath = "$" + pointer.replace(/\//g, ".");

        const bridge = new ExtensionBridge(jsonPath, {
          parentConnection: sdk.connection,
          onChange,
          field: value,
        });

        await bridge.init(iframe);

        iframe.src =
          params.extensions.find(
            (ext) => ext.name === schema["ui:extension"].name
          )?.url || schema["ui:extension"].url;
      }
    })();
  }, [iframeRef]);

  return <iframe ref={iframeRef} style={{ border: "none", width: '100%' }}></iframe>;
};

export default EditorExtensionField;
