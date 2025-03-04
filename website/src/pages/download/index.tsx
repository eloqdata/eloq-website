import React, { useEffect } from "react";
import { useHistory } from "@docusaurus/router";

export default function DownloadIndex() {
  const history = useHistory();

  useEffect(() => {
    history.replace("/download/eloqkv");
  }, []);

  return null;
}
