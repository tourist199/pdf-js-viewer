import React from "react";
import PropTypes from "prop-types";
import * as PdfJs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { FixedSizeList as Document } from "react-window";
//
import DocumentView from "./DocumentView";
import DocumentSize from "./DocumentMeasure";

import styles from "./styles.module.css";

PdfJs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const defaultUrl = "/Eloquent_JavaScript.pdf";

class DocumentViewer extends React.Component {
  static displayName = "Viewer";

  static propTypes = {
    initialScrollOffset: PropTypes.number
  };

  static defaultProps = {
    initialScrollOffset: 0
  };

  state = {
    documentBody: {},
    documentSize: {
      width: 0,
      height: 0
    },
    documentZoom: 1,
    scrollOffset: this.props.initialScrollOffset
  };

  documentContainer = React.createRef();
  document = React.createRef();
  scroller = React.createRef();

  componentDidMount() {
    const { documentZoom } = this.state;

    PdfJs.getDocument(
      defaultUrl
    ).then(pdf => {
      pdf.getPage(1).then(page => {
        /**
         * Get size of the first page for total document size estmation.
         */
        const { width, height } = page.getViewport(documentZoom);
        // debugger
        this.setState({
          documentBody: pdf,
          documentSize: {
            width,
            height
          }
        });
      });
    }, (reason) => {
      console.log(reason);
    });
  }

  handleDocumentScroll = ({
    scrollDirection,
    scrollOffset,
    scrollUpdateWasRequested
  }) => {
    this.setState({ scrollOffset });
  };

  render() {
    const { initialScrollOffset, ...other } = this.props;
    const {
      documentBody,
      documentZoom,
      documentSize
      // scrollOffset
    } = this.state;
    const { numPages } = documentBody;
    const { height: pageHeight } = documentSize;

    return (
      <div
        className={styles.viewer}
        tabIndex={0}
      >
        <div className={styles.content}>
          <div className={styles.document} ref={this.documentContainer}>
            {this.documentContainer.current && (
              <DocumentSize>
                {({ width, height }) => (
                  <Document
                    className={styles.scroller}
                    ref={this.scroller}
                    innerRef={this.document}
                    initialScrollOffset={initialScrollOffset}
                    height={height}
                    width={width}
                    itemCount={numPages}
                    itemData={{ documentBody, documentZoom, ...other }}
                    itemSize={pageHeight}
                    onScroll={this.handleDocumentScroll}
                  >
                    {DocumentView}
                  </Document>
                )}
              </DocumentSize>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DocumentViewer;
