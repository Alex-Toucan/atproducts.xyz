// ModalComponent.jsx
import React from 'react';

const Modal = ({ id, title, content }) => {
  return (
    <div className="modal fade" id={id} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`${id}-title`} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}-title`}>
              {title}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <i>To close this page, click the X or "Close" button to close. Clicking off the pop-up will not work.</i>
            <h2 className="modal-body-title">{title}</h2>
            {content}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
