import React, { useState, useEffect } from "react";
import DocumentViewer from "../document-viewer";
import styles from "./styles.module.css";
import ReactDOMServer from "react-dom/server";
import { ENUM_SIGNED } from "../../constants";

function ContractViewer() {
  const [signedSignatures, setSignedSignature] = useState([]);
  let age = 1;

  // fake data
  const companySignatures = [
    {
      id: 0,
      name: "XYZ Group",
      page: undefined,
    },
    {
      id: 1,
      name: "ASD OK",
      page: undefined,
    },
  ];

  function onDragStart(e, signatureId) {
    const { top, left } = e.target.getBoundingClientRect();
    const signatureClickOffsetX = left - e.clientX;
    const signatureClickOffsetY = top - e.clientY;

    const payload = {
      signatureId,
      signatureClickOffsetX,
      signatureClickOffsetY,
    };

    e.dataTransfer.setData("payload", JSON.stringify(payload));
  }

  function onDrop(e, type, page) {
    if (type === ENUM_SIGNED) {
      signHandler(e, page);
    } else {
      unsignHandler(e, page);
    }
  }

  function signHandler(e, page) {
    //
    // 1. Get data of signature
    const payload = e.dataTransfer.getData("payload");
    const { signatureId, signatureClickOffsetX, signatureClickOffsetY } =
      (payload && JSON.parse(payload)) || {};
    //
    // 2. Save signed signature
    const companySignature = companySignatures.find(
      (s) => s.id === signatureId
    );
    
    age ++;
    console.log(signedSignatures);
    const data = [...signedSignatures, { name: "ah", age }];
    setSignedSignature(data);

    //
    // 3. Compute dropped signature position
    const pdfContainer = e.currentTarget.parentNode;
    const {
      left: pageOffsetX,
      top: pageOffsetY,
    } = pdfContainer.getBoundingClientRect();

    const posX = e.clientX + signatureClickOffsetX - pageOffsetX;
    const posY = e.clientY + signatureClickOffsetY - pageOffsetY;
    //
    // 4. Clone dropped signature with computed position
    const style = {
      position: "absolute",
      left: posX + "px",
      top: posY + "px",
    };
    const signedSignatureComponent = (
      <Signature company={companySignature} style={style} />
    );

    //
    // 5. Add new signature into correspond pdf page
    // Parse react component into text
    const signatureElementText = ReactDOMServer.renderToStaticMarkup(
      signedSignatureComponent
    );
    // Append signature element into correspond pdf page
    e.currentTarget.insertAdjacentHTML("beforeend", signatureElementText);

    console.log(e.currentTarget);
  }

  function unsignHandler(e, page) {}

  function onDrag(e) {
    e.preventDefault();
  }

  function onDragEnd(e) {
    e.preventDefault();
  }

  function Signature({ company, style }) {
    return (
      <div
        className={styles.signature}
        style={{ ...style }}
        draggable="true"
        onDragStart={(e) => onDragStart(e, company.id)}
        onDrag={onDrag}
      >
        {company.name}
      </div>
    );
  }

  useEffect(() => {
    console.log("Has changed!!");
    console.log(signedSignatures);
  }, [signedSignatures]);

  const props = {
    signedSignatures,
    onDrop,
    onDragEnd,
    signHandler,
  };


  return (
    <div className={styles.root}>
      <div className={styles.signatureContainer}>
        {companySignatures.map((c) => {
          return <Signature key={c.id} company={c} />;
        })}
      </div>

      <div className={styles.contractContainer}>
        <DocumentViewer {...props} />
      </div>
    </div>
  );
}

export default ContractViewer;
