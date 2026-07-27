import './style/ConfirmDialog.css'

export function ConfirmDialog({
                                  title = 'Xác nhận xóa',
                                  message,
                                  onCancel,
                                  onConfirm,
                              }) {
    return (
        <div
            className="modal-backdrop confirm-backdrop"
            onMouseDown={(event) => event.target === event.currentTarget && onCancel()}
        >
            <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
                <button className="confirm-close" type="button" onClick={onCancel} aria-label="Đóng">
                    {/*<Icon name="close" size={20}/>*/}
                </button>
                {/*<div className="confirm-icon"><Icon name="trash" size={27}/></div>*/}
                <h2 id="confirm-title">{title}</h2>
                <p>{message}</p>
                <div className="confirm-actions">
                    <button type="button" className="cancel-button" onClick={onCancel}>Hủy</button>
                    <button type="button" className="delete-button" onClick={onConfirm}>Xóa</button>
                </div>
            </section>
        </div>
    )
}
