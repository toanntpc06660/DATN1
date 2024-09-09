// ConfirmDialog.js
import React from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import default styles
import './ConfirmDialog.css'; // Import custom styles
const ConfirmDialog = (message, onConfirm) => {
    confirmAlert({
        customUI: ({ onClose }) => (
            <div className="confirm-dialog">
                <h2>Xác Nhận</h2>
                <p>{message}</p>
                <div className="confirm-dialog-buttons">
                    <button
                        className="confirm-button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Có
                    </button>
                    <button
                        className="cancel-button"
                        onClick={onClose}
                    >
                        Không
                    </button>
                </div>
            </div>
        )
    });
};

export default ConfirmDialog;
