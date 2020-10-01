import React from "react";
import PropTypes from "prop-types";

import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import { ENUM_SIGNED } from "../../constants";

class DocumentView extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    style: PropTypes.object,
    data: PropTypes.any
  };

  state = {
    page: null,
    width: 0,
    height: 0
  };

  container = React.createRef();
  dropzone = React.createRef();

  componentDidMount() {
    const {
      data: { documentBody, documentZoom: scale, onDrop, onDragEnd },
      index
    } = this.props;

    const pageNumber = index + 1;

    documentBody.getPage(pageNumber).then(page => {
      const { current: container } = this.container;
      const viewport = page.getViewport(scale);
      const { width, height } = viewport;

      this.setState({ page, width, height }, () => {
        const textLayerFactory = new pdfjsViewer.DefaultTextLayerFactory();
        const annotationLayerFactory = new pdfjsViewer.DefaultAnnotationLayerFactory();
        const pageView = new pdfjsViewer.PDFPageView({
          container,
          id: pageNumber,
          scale,
          defaultViewport: page.getViewport(scale),
          textLayerFactory,
          annotationLayerFactory
        });

        pageView.setPdfPage(page);
        pageView.draw();
      });
    });

    // Bind handle drop event
    const { current: container } = this.container
    container.addEventListener("drop", function (event) {
      return onDrop(event, ENUM_SIGNED, pageNumber)
    });
    container.addEventListener("dragover", function (event) {
      event.preventDefault();
      return onDragEnd(event)
    });
  }

  onDragOver(event) {
    event.preventDefault()
  }

  onDragEnter(event) {
    event.preventDefault()
  }

  render() {
    const { width, height } = this.state;
    const { style } = this.props;

    return (
      <div style={style} ref={this.dropzone}>
        <div
          ref={this.container}
          width={width}
          height={height}
          onDragEnter={this.onDragEnter}
          onDragOver={this.onDragOver}
        />
      </div>
    );
  }
}

export default DocumentView;
